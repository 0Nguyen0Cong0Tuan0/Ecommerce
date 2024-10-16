const cloudinary = require('../utils/cloudinary');

// Helper function to upload a single image to Cloudinary
const deleteImageFromCloudinary = (publicId) => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.destroy(publicId, (error, result) => {
            if (error) reject(error);
            else resolve(result);
        });
    });
};

module.exports = deleteImageFromCloudinary;
