import { Request, Response } from 'express';
import { uploadJsonToIpfs } from '../../../services/ipfs.service';
import { mintVibeNft } from '../../../services/aptos.service';
// import { mintVibeNft } from '../../../services/aptos.service'; // To be implemented

interface MintRequestBody {
  name: string;
  description: string;
  imageIpfsHash: string;
  collectionName: string; // e.g., "Lunoa Vibes"
  recipientAddress: string; // The address to receive the NFT
}

export const createAndMintVibe = async (req: Request, res: Response) => {
  const { name, description, imageIpfsHash, collectionName, recipientAddress } = req.body as MintRequestBody;

  if (!name || !description || !imageIpfsHash || !collectionName || !recipientAddress) {
    return res.status(400).json({ message: 'Name, description, imageIpfsHash, collectionName, and recipientAddress are required.' });
  }

  try {
    // 1. Create the NFT metadata JSON object
    const nftMetadata = {
      name,
      description,
      image: `ipfs://${imageIpfsHash}`,
      attributes: [
        { trait_type: 'Vibe', value: 'Positive' },
        { trait_type: 'MintedAt', value: new Date().toISOString() },
      ],
    };

    // 2. Upload the metadata JSON to IPFS
    const metadataIpfsHash = await uploadJsonToIpfs(nftMetadata, `${name}-metadata.json`);
    const tokenUri = `ipfs://${metadataIpfsHash}`;

        // 3. Call the smart contract to mint the NFT
    const transaction = await mintVibeNft({
      collectionName,
      description,
      name,
      uri: tokenUri,
      recipient: recipientAddress,
    });

        res.status(201).json({
      message: 'Vibe NFT minted successfully!',
      metadataIpfsHash,
      tokenUri,
      transactionHash: transaction.hash,
    });
  } catch (error) {
    console.error('Error creating and minting Vibe NFT:', error);
    res.status(500).json({ message: 'Failed to create and mint Vibe NFT.' });
  }
};
