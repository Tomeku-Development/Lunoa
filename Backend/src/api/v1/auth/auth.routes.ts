import { Router } from 'express';
import { register, login, getProfile, updateProfile, deleteProfile, connectWallet, verifyToken, refreshToken, logout } from './auth.controller';
import { protect } from '../../../middleware/auth.middleware';
import { verifyWalletSignature } from '../../../middleware/verifyWalletSignature';

const router = Router();

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address.
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 description: User's password (at least 8 characters).
 *     responses:
 *       201:
 *         description: User registered successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   format: uuid
 *                 email:
 *                   type: string
 *                   format: email
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Invalid input data.
 *       409:
 *         description: User with this email already exists.
 *       500:
 *         description: Internal server error.
 */
router.post('/register', register);

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Log in a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful, returns JWT.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JSON Web Token for authentication.
 *       400:
 *         description: Invalid input data.
 *       401:
 *         description: Invalid email or password.
 *       500:
 *         description: Internal server error.
 */
router.post('/login', login);

/**
 * @swagger
 * /api/v1/auth/connect:
 *   post:
 *     summary: Connect a wallet and verify signature
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - walletAddress
 *               - signature
 *               - message
 *             properties:
 *               walletAddress:
 *                 type: string
 *                 description: The user's Aptos wallet address.
 *               signature:
 *                 type: string
 *                 description: The signature of the message, signed by the user's wallet.
 *               message:
 *                 type: string
 *                 description: The message that was signed.
 *     responses:
 *       200:
 *         description: Wallet connected successfully, returns JWT.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JSON Web Token for authentication.
 *       400:
 *         description: Invalid input data.
 *       401:
 *         description: Invalid signature or wallet address.
 *       500:
 *         description: Internal server error.
 */
router.post('/connect', verifyWalletSignature, connectWallet);

/**
 * @swagger
 * /api/v1/auth/verify:
 *   post:
 *     summary: Verify a JWT token
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Token is valid.
 *       401:
 *         description: Unauthorized, token is invalid or expired.
 */
router.post('/verify', protect, verifyToken);

/**
 * @swagger
 * /api/v1/auth/refresh:
 *   post:
 *     summary: Refresh an access token
 *     tags: [Auth]
 *     description: Obtains a new access token using a refresh token stored in an HTTP-only cookie.
 *     responses:
 *       200:
 *         description: New access token generated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *       401:
 *         description: Refresh token not found or invalid.
 */
router.post('/refresh', refreshToken);

/**
 * @swagger
 * /api/v1/auth/profile:
 *   get:
 *     summary: Get the current user's profile
 *     description: Retrieves the profile information for the currently authenticated user.
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile data.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Not authorized, token failed or not provided.
 *       404:
 *         description: User not found.
 *   put:
 *     summary: Update the current user's profile
 *     description: Allows the authenticated user to update their email or password.
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *     responses:
 *       200:
 *         description: Profile updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid input data.
 *       401:
 *         description: Not authorized.
 *       409:
 *         description: Email is already in use.
 *   delete:
 *     summary: Delete the current user's account
 *     description: Permanently deletes the account of the currently authenticated user.
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Account deleted successfully.
 *       401:
 *         description: Not authorized.
 *       404:
 *         description: User not found.

 */
router.route('/profile')
  .get(protect, getProfile)
  .put(protect, updateProfile)
  .delete(protect, deleteProfile);









/**
 * @swagger
 * /api/v1/auth/logout:
 *   post:
 *     summary: Log out a user
 *     tags: [Auth]
 *     description: Clears the refresh token cookie to log the user out.
 *     responses:
 *       200:
 *         description: Logged out successfully.
 *       500:
 *         description: Internal server error.
 */
router.post('/logout', logout);

export default router;
