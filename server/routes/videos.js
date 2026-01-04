const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { protect } = require('../middleware/authMiddleware');
const { uploadVideo, streamVideo, getVideos, getVideoById } = require('../controllers/videoController');



// Multer Storage Config
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Ensure this directory exists in server/server.js or manually
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        // Add timestamp to filename to avoid duplicates
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 100000000 }, // 100MB limit for now
    fileFilter: (req, file, cb) => {
        checkFileType(file, cb);
    },
});

// Check File Type
function checkFileType(file, cb) {
    const filetypes = /mp4|mov|avi|mkv/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb('Error: Videos Only!');
    }
}

// Routes
// Routes
router.post('/upload', protect, upload.single('video'), uploadVideo);
router.get('/stream/:id', streamVideo);
router.get('/', protect, getVideos);
router.get('/:id', getVideoById);

module.exports = router;
