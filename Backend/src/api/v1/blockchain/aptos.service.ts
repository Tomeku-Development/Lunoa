import { Aptos, AptosConfig, Network, Account, Ed25519PrivateKey, AccountAddress } from '@aptos-labs/ts-sdk';
import logger from '../../../config/logger';

// Initialize Aptos SDK
const config = new AptosConfig({ network: Network.DEVNET });
const aptos = new Aptos(config);

class AptosService {
  /**
   * Retrieves the application's wallet account.
   * In production, the private key must be securely stored as an environment variable.
   * For development, this will create and fund a new account if no private key is provided.
   */
  private async getAppWallet(): Promise<Account> {
    const privateKeyHex = process.env.APTOS_PRIVATE_KEY;
    if (privateKeyHex) {
      const privateKey = new Ed25519PrivateKey(privateKeyHex);
      return Account.fromPrivateKey({ privateKey });
    }

    logger.warn('APTOS_PRIVATE_KEY not found. Creating and funding a new devnet account.');
    const account = Account.generate();
    await aptos.fundAccount({ accountAddress: account.accountAddress, amount: 100_000_000 });
    logger.info(`Created new Aptos account: ${account.accountAddress.toString()}`);
    logger.info(`Please save this private key to your .env file: APTOS_PRIVATE_KEY=${account.privateKey.toString()}`);
    return account;
  }

  /**
   * Distributes quest rewards to a participant.
   * @param participantAddress The recipient's Aptos address.
   * @param amount The amount of tokens to send (in smallest units, e.g., octas).
   */
  public async distributeQuestRewards(participantAddress: string, amount: number): Promise<string> {
    try {
      const appWallet = await this.getAppWallet();
      const recipientAddress = AccountAddress.from(participantAddress);

      logger.info(`Attempting to send ${amount} tokens to ${participantAddress}...`);

      // TODO: Replace with our own Lunoa coin type
      const transaction = await aptos.transaction.build.simple({
        sender: appWallet.accountAddress,
        data: {
          function: "0x1::coin::transfer",
          typeArguments: ["0x1::aptos_coin::AptosCoin"],
          functionArguments: [recipientAddress, amount],
        },
      });

      const senderAuthenticator = aptos.transaction.sign({ signer: appWallet, transaction });
      const committedTransaction = await aptos.transaction.submit.simple({ transaction, senderAuthenticator });

      const response = await aptos.waitForTransaction({ transactionHash: committedTransaction.hash });

      logger.info(`Successfully sent ${amount} tokens to ${participantAddress}. Version: ${response.version}`);
      return response.hash;
    } catch (error) {
      logger.error('Error distributing quest rewards:', error);
      throw new Error('Failed to distribute quest rewards.');
    }
  }
}

export default new AptosService();

