const Video = require('../models/Video');
const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { GoogleAIFileManager } = require("@google/generative-ai/server");

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const fileManager = new GoogleAIFileManager(process.env.GEMINI_API_KEY);

const uploadVideo = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'Please upload a video file' });
    }

    const { title } = req.body;

    try {
        const video = await Video.create({
            title: title || req.file.originalname,
            filename: req.file.filename,
            filepath: req.file.path,
            size: req.file.size,
            uploader: req.user._id,
            status: 'Processing', // Immediately processing
        });

        res.status(201).json(video);

        (async () => {
            try {
                console.log(`Analyzing: ${video.filename}...`);

                const uploadResult = await fileManager.uploadFile(req.file.path, {
                    mimeType: req.file.mimetype,
                    displayName: video.title,
                });
                const fileUri = uploadResult.file.uri;
                console.log(`Gemini Upload URI: ${fileUri}`);

                let file = await fileManager.getFile(uploadResult.file.name);
                while (file.state === "PROCESSING") {
                    await new Promise((resolve) => setTimeout(resolve, 2000)); // Check every 2s
                    file = await fileManager.getFile(uploadResult.file.name);
                }

                if (file.state === "FAILED") {
                    throw new Error("Video processing failed.");
                }

                const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
                const prompt = "Analyze this video for NSFW, violence, or sensitive content. Determine if it is 'Safe' or 'Flagged'. Provide JSON output: { \"sensitivity\": \"Safe\" | \"Flagged\", \"reason\": \"brief explanation\" }";

                const result = await model.generateContent([
                    { fileData: { mimeType: file.mimeType, fileUri: file.uri } },
                    { text: prompt },
                ]);

                const responseText = result.response.text();
                const jsonStr = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
                const analysis = JSON.parse(jsonStr);

                // Update DB
                const updatedVideo = await Video.findByIdAndUpdate(
                    video._id,
                    {
                        status: 'Completed',
                        sensitivity: analysis.sensitivity,
                    },
                    { new: true }
                );

                if (req.io) {
                    req.io.emit('video_processed', updatedVideo);
                }

            } catch (err) {
                console.error('Analysis error:', err);
                const errorVideo = await Video.findByIdAndUpdate(
                    video._id, 
                    { status: 'Error' },
                    { new: true }
                );
                
                if (req.io) {
                    req.io.emit('video_processed', errorVideo);
                }
            }
        })();

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error during upload' });
    }
};

// @desc    Stream video
// @route   GET /api/videos/stream/:id
// @access  Public (for now)
const streamVideo = async (req, res) => {
    try {
        const video = await Video.findById(req.params.id);

        if (!video) {
            return res.status(404).json({ message: 'Video not found' });
        }

        const videoPath = video.filepath;
        const stat = fs.statSync(videoPath);
        const fileSize = stat.size;
        const range = req.headers.range;

        if (range) {
            const parts = range.replace(/bytes=/, "").split("-");
            const start = parseInt(parts[0], 10);
            const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
            const chunksize = (end - start) + 1;
            const file = fs.createReadStream(videoPath, { start, end });
            const head = {
                'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                'Accept-Ranges': 'bytes',
                'Content-Length': chunksize,
                'Content-Type': 'video/mp4',
            };
            res.writeHead(206, head);
            file.pipe(res);
        } else {
            const head = {
                'Content-Length': fileSize,
                'Content-Type': 'video/mp4',
            };
            res.writeHead(200, head);
            fs.createReadStream(videoPath).pipe(res);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error streaming video' });
    }
};

// @desc    Get all videos
// @route   GET /api/videos
// @access  Private
const getVideos = async (req, res) => {
    try {
        // User Isolation: Only return videos uploaded by the logged-in user
        const videos = await Video.find({ uploader: req.user.id }).sort({ createdAt: -1 });
        res.json(videos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error fetching videos' });
    }
};

// @desc    Get single video by ID
// @route   GET /api/videos/:id
// @access  Public
const getVideoById = async (req, res) => {
    try {
        const video = await Video.findById(req.params.id).populate('uploader', 'username');
        if (!video) {
            return res.status(404).json({ message: 'Video not found' });
        }
        res.json(video);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error fetching video' });
    }
};

module.exports = {
    uploadVideo,
    streamVideo,
    getVideos,
    getVideoById,
};
