import { Request, Response } from 'express';
import Joi from 'joi';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { getPool } from '../../../config/database';
import logger from '../../../config/logger';

const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const register = async (req: Request, res: Response) => {
  // 1. Validate request body
  const { error, value } = registerSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const { email, password } = value;

  try {
    // 2. Check if user already exists
    const userExists = await getPool().query('SELECT * FROM users WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
      return res.status(409).json({ message: 'User with this email already exists.' });
    }

    // 3. Hash the password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // 4. Insert the new user into the database
    const newUser = await getPool().query(
      'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email, created_at',
      [email, passwordHash]
    );

    // 5. Send a success response
    logger.info(`New user registered: ${email}`);
    res.status(201).json(newUser.rows[0]);

  } catch (err) {
    logger.error('Error during user registration:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const login = async (req: Request, res: Response) => {
  // 1. Validate request body
  const { error, value } = loginSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const { email, password } = value;

  try {
    // 2. Find the user by email
    const result = await getPool().query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // 3. Compare the provided password with the stored hash
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // 4. Issue Tokens
    const accessToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET as string, {
      expiresIn: '15m',
    });
    const refreshToken = jwt.sign({ userId: user.id }, process.env.JWT_REFRESH_SECRET as string, {
        expiresIn: '7d',
    });

    // 5. Send refresh token in secure cookie
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    // 6. Send the access token to the client
    res.json({ accessToken });

  } catch (err) {
    logger.error('Error during user login:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Database schema requirement: 
// The 'users' table must have a nullable, unique 'wallet_address' TEXT column.
// The 'email' and 'password_hash' columns should also be nullable.



const connectWalletSchema = Joi.object({
  walletAddress: Joi.string().required(),
  walletProvider: Joi.string().valid('petra', 'martian', 'other').required(),
});

export const connectWallet = async (req: Request, res: Response) => {
  // 1. Validate request body
  const { error, value } = connectWalletSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  const { walletAddress, walletProvider } = value;

  try {
    // 3. Find or create user
    // DB Schema Change Required: ALTER TABLE users ADD COLUMN wallet_provider VARCHAR(255);
    let userResult = await getPool().query('SELECT * FROM users WHERE wallet_address = $1', [walletAddress]);
    let user = userResult.rows[0];

    if (!user) {
      // Create new user if wallet address not found
      const newUserResult = await getPool().query(
        'INSERT INTO users (wallet_address, wallet_provider) VALUES ($1, $2) RETURNING *',
        [walletAddress, walletProvider]
      );
      user = newUserResult.rows[0];
      logger.info(`New user created with wallet: ${walletAddress} via ${walletProvider}`);
    } else {
      // Optionally, update the wallet_provider for existing users
      if (user.wallet_provider !== walletProvider) {
        await getPool().query('UPDATE users SET wallet_provider = $1 WHERE id = $2', [walletProvider, user.id]);
        logger.info(`User ${user.id} updated wallet provider to ${walletProvider}`);
      }
    }

    // Issue Tokens
    const accessToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET as string, {
      expiresIn: '15m',
    });
    const refreshToken = jwt.sign({ userId: user.id }, process.env.JWT_REFRESH_SECRET as string, {
      expiresIn: '7d',
    });

    // Send refresh token in secure cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.status(200).json({ 
      message: 'Wallet connected successfully', 
      accessToken 
    });

  } catch (error) {
    logger.error('Error connecting wallet:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const verifyToken = (req: Request, res: Response) => {
  // If the protect middleware passes, the token is valid.
  res.status(200).json({ message: 'Token is valid' });
};

export const refreshToken = async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    return res.status(401).json({ message: 'Refresh token not found.' });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET as string) as { userId: string };

    // Optional: Check if user still exists in the database
    const userResult = await getPool().query('SELECT * FROM users WHERE id = $1', [decoded.userId]);
    if (userResult.rows.length === 0) {
        return res.status(401).json({ message: 'User not found.' });
    }

    const accessToken = jwt.sign({ userId: decoded.userId }, process.env.JWT_SECRET as string, {
      expiresIn: '15m',
    });

    res.json({ accessToken });
  } catch (error) {
    logger.error('Error refreshing token:', error);
    return res.status(403).json({ message: 'Invalid refresh token.' });
  }
};

export const logout = (req: Request, res: Response) => {
  res.cookie('refreshToken', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: 'Logout successful' });
};

const updateProfileSchema = Joi.object({
  email: Joi.string().email().optional(),
  password: Joi.string().min(8).optional(),
  bio: Joi.string().allow('').optional(),
  avatarUrl: Joi.string().uri({ allowRelative: false }).allow('').optional(),
  website: Joi.string().uri({ allowRelative: false }).allow('').optional(),
  location: Joi.string().allow('').optional(),
  aptosAddress: Joi.string().length(66).pattern(/^0x[a-fA-F0-9]{64}$/).optional(),
}).min(1);

export const updateProfile = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) {
    return res.status(401).json({ message: 'Not authorized' });
  }

  const { error, value } = updateProfileSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const { email, password, bio, avatarUrl, website, location, aptosAddress } = value;

  try {
    if (email) {
      const userExists = await getPool().query('SELECT id FROM users WHERE email = $1 AND id != $2', [email, userId]);
      if (userExists.rows.length > 0) {
        return res.status(409).json({ message: 'Email is already in use.' });
      }
    }

    const updates: string[] = [];
    const values: any[] = [];
    let queryIndex = 1;

    if (email) {
      updates.push(`email = $${queryIndex++}`);
      values.push(email);
    }

    if (password) {
      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(password, saltRounds);
      updates.push(`password_hash = $${queryIndex++}`);
      values.push(passwordHash);
    }

    if (bio !== undefined) {
      updates.push(`bio = $${queryIndex++}`);
      values.push(bio);
    }

    if (avatarUrl !== undefined) {
      updates.push(`avatar_url = $${queryIndex++}`);
      values.push(avatarUrl);
    }

    if (website !== undefined) {
      updates.push(`website = $${queryIndex++}`);
      values.push(website);
    }

    if (location !== undefined) {
      updates.push(`location = $${queryIndex++}`);
      values.push(location);
    }

    if (aptosAddress) {
      updates.push(`aptos_address = $${queryIndex++}`);
      values.push(aptosAddress);
    }

    if (updates.length === 0) {
      return res.status(400).json({ message: 'No update fields provided.' });
    }

    values.push(userId);
    const updateQuery = `UPDATE users SET ${updates.join(', ')} WHERE id = $${queryIndex} RETURNING id, email, wallet_address, bio, avatar_url, website, location, created_at`;

    const result = await getPool().query(updateQuery, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }

        logger.info(`User profile updated for user ID: ${userId}`);
    return res.status(200).json({ message: 'Profile updated successfully.' });

  } catch (err) {
    logger.error(`Error updating profile for user ID ${userId}:`, err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteProfile = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) {
    return res.status(401).json({ message: 'Not authorized' });
  }

  try {
    const deleteResult = await getPool().query('DELETE FROM users WHERE id = $1', [userId]);

    if (deleteResult.rowCount === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.cookie('refreshToken', '', {
      httpOnly: true,
      expires: new Date(0),
    });

    logger.info(`User account deleted for user ID: ${userId}`);
    res.status(200).json({ message: 'Account deleted successfully.' });

  } catch (err) {
    logger.error(`Error deleting account for user ID ${userId}:`, err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Not authorized' });
  }

  try {
    const result = await getPool().query(
      `SELECT 
        id, 
        email, 
        wallet_address AS "walletAddress", 
        bio, 
        avatar_url AS "avatarUrl", 
        website, 
        location, 
        reputation_score AS "reputationScore",
        created_at AS "createdAt"
      FROM users WHERE id = $1`,
      [req.user.userId]
    );
    const user = result.rows[0];

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    logger.error('Error fetching user profile:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
