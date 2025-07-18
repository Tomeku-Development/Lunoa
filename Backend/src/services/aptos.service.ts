import { Aptos, AptosConfig, Network, Account, U64, AccountAddress, MoveValue, Ed25519PrivateKey } from "@aptos-labs/ts-sdk";
import config from '../config/index';
import logger from '../config/logger';

// Ensure necessary environment variables are set
if (!config.aptosNetwork || !config.aptosContractAddress || !config.aptosServiceAccountPrivateKey) {
  throw new Error('APTOS_NETWORK, APTOS_CONTRACT_ADDRESS, and APTOS_SERVICE_ACCOUNT_PRIVATE_KEY must be provided in the .env file.');
}

// 1. Set up the Aptos client and service account
const aptosConfig = new AptosConfig({ network: config.aptosNetwork as Network });
const aptos = new Aptos(aptosConfig);
// The private key from .env might have a prefix. The SDK expects a pure hex string.
let privateKey = config.aptosServiceAccountPrivateKey!;
if (privateKey.startsWith('ed25519-priv-')) {
  privateKey = privateKey.substring('ed25519-priv-'.length);
}

const serviceAccount = Account.fromPrivateKey({ privateKey: new Ed25519PrivateKey(privateKey) });
logger.info(`Aptos Service Account Address: ${serviceAccount.accountAddress.toString()}`);

interface MintVibeNftPayload {
  collectionName: string;
  description: string;
  name: string;
  uri: string;
  recipient: string;
}

/**
 * Mints a new Vibe NFT by calling the smart contract.
 * @param payload The data required for minting the NFT.
 * @returns The transaction object after submission.
 */
const mintVibeNft = async (payload: MintVibeNftPayload) => {
  const { collectionName, description, name, uri, recipient } = payload;

  const transaction = await aptos.transaction.build.simple({
    sender: serviceAccount.accountAddress,
    data: {
      function: `0x1538d7aa9bca6e560cdbcb1da9c6a9b31bf16e1fd2f485733603df9386367e52::vibe_nft::mint_vibe_nft`,
      functionArguments: [
        collectionName,
        description,
        name,
        uri,
        AccountAddress.from(recipient),
      ],
    },
  });

  try {
    const committedTxn = await aptos.signAndSubmitTransaction({ 
      signer: serviceAccount, 
      transaction 
    });
    return await aptos.waitForTransaction({ transactionHash: committedTxn.hash });
  } catch (error) {
    console.error('Error minting Vibe NFT on-chain:', error);
    throw new Error('Failed to submit minting transaction.');
  }
};

/**
 * Distributes quest rewards by calling the smart contract.
 * @param recipientAddress The Aptos address of the user receiving the reward.
 * @param amount The amount of the reward.
 * @returns The transaction object after submission.
 */
const distributeQuestRewards = async (recipientAddress: string, amount: number) => {
  const transaction = await aptos.transaction.build.simple({
    sender: serviceAccount.accountAddress,
    data: {
      function: `${config.aptosContractAddress}::quests::distribute_reward`,
      functionArguments: [AccountAddress.from(recipientAddress), new U64(amount)],
    },
  });

  try {
    const committedTxn = await aptos.signAndSubmitTransaction({ 
      signer: serviceAccount, 
      transaction 
    });
    return await aptos.waitForTransaction({ transactionHash: committedTxn.hash });
  } catch (error) {
    logger.error('Error distributing quest rewards on-chain:', error);
    throw new Error('Failed to submit reward distribution transaction.');
  }
};

export const AptosService = {
  mintVibeNft,
  distributeQuestRewards,
};
