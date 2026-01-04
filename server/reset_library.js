const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const Video = require('./models/Video');

// Load env vars
dotenv.config();

const resetLibrary = async () => {
    try {
        // 1. Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        // 2. Clear Videos Collection
        const result = await Video.deleteMany({});
        console.log(`Deleted ${result.deletedCount} videos from database.`);

        // 3. Clear Uploads Directory
        const uploadsDir = path.join(__dirname, 'uploads');
        if (fs.existsSync(uploadsDir)) {
            const files = fs.readdirSync(uploadsDir);
            let deletedFiles = 0;
            for (const file of files) {
                // simple check to avoid deleting .gitkeep or similar if present, though likely not needed for this user request
                // but good practice to check if it is a directory or file
                const filePath = path.join(uploadsDir, file);
                if (fs.lstatSync(filePath).isFile()) {
                   fs.unlinkSync(filePath);
                   deletedFiles++;
                }
            }
            console.log(`Deleted ${deletedFiles} files from uploads directory.`);
        } else {
            console.log('Uploads directory does not exist.');
        }

        console.log('Library reset complete.');
        process.exit(0);
    } catch (error) {
        console.error('Error resetting library:', error);
        process.exit(1);
    }
};

resetLibrary();
