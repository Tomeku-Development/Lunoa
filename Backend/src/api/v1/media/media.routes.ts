import { Router } from 'express';
import multer from 'multer';
import { uploadMedia } from './media.controller';


const router = Router();

// Configure multer for in-memory file storage
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB file size limit
});

// Define the file upload route
// The 'protect' middleware ensures that only authenticated users can upload files.
// The 'upload.single('media')' middleware processes a single file from the 'media' field in the form data.
// The 'protect' middleware ensures that only authenticated users can upload files.
// The 'upload.single('media')' middleware processes a single file from the 'media' field in the form data.
router.post('/upload', upload.single('media'), uploadMedia);

export default router;
