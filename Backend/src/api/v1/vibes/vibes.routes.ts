import { Router } from 'express';
import { createAndMintVibe } from './vibes.controller';
import { protect } from '../../../middleware/auth.middleware';


const router = Router();

// Define the route for creating and minting a new Vibe NFT
// This endpoint is protected and requires user authentication.
router.post('/', protect, createAndMintVibe);

export default router;
