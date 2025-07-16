import { Request, Response, NextFunction } from 'express';
import { Ed25519PublicKey } from '@aptos-labs/ts-sdk';
import logger from '../config/logger';

export const verifyWalletSignature = async (req: Request, res: Response, next: NextFunction) => {
  const { walletAddress, signature, message } = req.body;

  if (!walletAddress || !signature || !message) {
    return res.status(400).json({ message: 'Missing walletAddress, signature, or message for verification.' });
  }

  try {
    const publicKey = new Ed25519PublicKey(walletAddress);
    const verified = publicKey.verifySignature({ message, signature });

    if (!verified) {
      logger.warn(`Invalid signature for wallet: ${walletAddress}`);
      return res.status(401).json({ message: 'Invalid signature.' });
    }

    logger.info(`Signature verified for wallet: ${walletAddress}`);
    next();
  } catch (err) {
    logger.error('Error verifying wallet signature:', err);
    res.status(500).json({ message: 'Internal server error during signature verification.' });
  }
};
