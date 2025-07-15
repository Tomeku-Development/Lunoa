import { Router } from 'express';
import { register, login, getProfile, updateProfile, deleteProfile, connectWallet, verifyToken, refreshToken, logout } from './auth.controller';
import { protect } from '../../../middleware/auth.middleware';

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
 * /api/v1/auth/connect:
 *   post:
 *     summary: Connect wallet and get JWT
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - publicKey
 *               - signature
 *               - message
 *             properties:
 *               publicKey:
 *                 type: string
 *                 description: The user's Aptos public key.
 *               signature:
 *                 type: string
 *                 description: The signature of the message.
 *               message:
 *                 type: string
 *                 description: The message that was signed.
 *     responses:
 *       200:
 *         description: Wallet connected successfully, returns JWT token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 token:
 *                   type: string
 *       400:
 *         description: Missing required fields.
 *       401:
 *         description: Invalid signature.
 *       500:
 *         description: Internal server error.
 */
router.post('/connect', connectWallet);

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
 *         description: Not authorized, token failed or not provided.
 */
router.post('/verify', protect, verifyToken);

/**
 * @swagger
 * /api/v1/auth/refresh:
 *   post:
 *     summary: Refresh the JWT access token
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: A new access token is returned.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *       401:
 *         description: Refresh token not found.
 *       403:
 *         description: Invalid refresh token.
 */
router.post('/refresh', refreshToken);

/**
 * @swagger
 * /api/v1/auth/logout:
 *   post:
 *     summary: Logout the user
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Logout successful.
 */
router.post('/logout', logout);

export default router;
