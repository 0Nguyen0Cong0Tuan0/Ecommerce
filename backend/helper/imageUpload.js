const cloudinary = require('../utils/cloudinary');

// Helper function to upload a single image to Cloudinary
const uploadImageToCloudinary = (file, folderName) => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream({ folder: folderName }, (error, result) => {
            if (error) reject(error);
            else resolve({ url: result.secure_url, public_id: result.public_id });
        }).end(file.buffer);
    });
};

module.exports = uploadImageToCloudinary;
