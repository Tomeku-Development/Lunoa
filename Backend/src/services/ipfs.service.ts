import pinataSDK from '@pinata/sdk';
import { Readable } from 'stream';
import config from '../config/index';

if (!config.pinataApiKey || !config.pinataApiSecret) {
  throw new Error('Pinata API Key and Secret must be provided in the environment variables.');
}

const pinata = new pinataSDK(config.pinataApiKey, config.pinataApiSecret);

/**
 * Uploads a file stream to IPFS using Pinata.
 * @param stream The readable stream of the file to upload.
 * @param filename The name for the file on IPFS.
 * @returns The IPFS hash (CID) of the uploaded file.
 */
export const uploadJsonToIpfs = async (json: object, name: string) => {
  try {
    const result = await pinata.pinJSONToIPFS(json, {
      pinataMetadata: {
        name: name,
      },
      pinataOptions: {
        cidVersion: 0,
      },
    });
    return result.IpfsHash;
  } catch (error) {
    console.error('Error uploading JSON to Pinata:', error);
    throw new Error('Failed to upload JSON to IPFS.');
  }
};

export const uploadStreamToIpfs = async (stream: Readable, filename: string) => {
  try {
    const result = await pinata.pinFileToIPFS(stream, {
      pinataMetadata: {
        name: filename,
      },
      pinataOptions: {
        cidVersion: 0,
      },
    });
    return result.IpfsHash;
  } catch (error) {
    console.error('Error uploading file to Pinata:', error);
    throw new Error('Failed to upload file to IPFS.');
  }
};
