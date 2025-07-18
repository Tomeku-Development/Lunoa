import { Request, Response } from 'express';
import { Readable } from 'stream';
import { uploadStreamToIpfs } from '../../../services/ipfs.service';

export const uploadMedia = async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded.' });
  }

  try {
    const stream = Readable.from(req.file.buffer);
    const ipfsHash = await uploadStreamToIpfs(stream, req.file.originalname);

    res.status(201).json({ 
      message: 'File uploaded successfully to IPFS.',
      ipfsHash: ipfsHash,
      // You can also include a public gateway URL
      ipfsUrl: `https://gateway.pinata.cloud/ipfs/${ipfsHash}`
    });
  } catch (error) {
    console.error('Error in media upload controller:', error);
    res.status(500).json({ message: 'Failed to upload file.' });
  }
};
