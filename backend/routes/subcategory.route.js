const express = require('express');
const router = express.Router();
const multer = require('multer');

// HELPER
const uploadImageToCloudinary = require('../helper/imageUpload');
const deleteImageFromCloudinary = require('../helper/imageDelete');

// MODELS
const SubCategory = require('../models/model.subcategory');

// Configure multer for in-memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

const allowedFormats = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

const folderName = 'subcategories';

// Create a new subcategory
router.post('/create', upload.array('images', 10), async (req, res) => {
    try {
        const { category, name, color } = req.body;
        const imagesArr = [];

        // Upload each image to Cloudinary
        for (const file of req.files) {
            if (!allowedFormats.includes(file.mimetype)) {
                return res.status(400).json({ message: 'Invalid file format' });
            }
            const imageUrl = await uploadImageToCloudinary(file, folderName);
            imagesArr.push(imageUrl);
        }

        // Create a new subcategory
        const newSubCategory = new SubCategory({
            category,
            name,
            images: imagesArr,
            color,
        });

        // Save the subcategory to the database
        const subCategory = await newSubCategory.save();
        res.status(201).json(subCategory);
    } catch (error) {
        console.error('Error uploading images or creating subcategory:', error);
        res.status(400).json({ message: error.message });
    }
});

// Get the list of subcategories with pagination, sorting, and filtering
router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const perPage = parseInt(req.query.limit) || 500;
        const searchQuery = req.query.search || "";
        const sortBy = req.query.sortBy || 'date-asc';

        let sortQuery = {};

        if (sortBy === 'name-asc') sortQuery = { name: 1 };
        else if (sortBy === 'name-desc') sortQuery = { name: -1 };
        else if (sortBy === 'date-asc') sortQuery = { createdAt: 1 };
        else if (sortBy === 'date-desc') sortQuery = { createdAt: -1 };

        // If there's a search query, use a regex for case-insensitive partial matching
        const query = searchQuery
            ? { name: { $regex: searchQuery, $options: 'i' } }
            : {};

        const totalPosts = await SubCategory.countDocuments(query);
        const totalPages = Math.ceil(totalPosts / perPage);

        if (page > totalPages) {
            return res.status(404).json({ message: 'Page not found!' });
        }

        const subCategoryList = await SubCategory.find(query)
            .populate('category', 'name') // Populate the category field with only the 'name' field
            .sort(sortQuery)
            .skip((page - 1) * perPage)
            .limit(perPage)
            .exec();

        if (!subCategoryList) {
            return res.status(500).json({ success: false });
        }

        return res.status(200).json({
            subCategoryList,
            totalPages,
            page,
        });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
});

// Get a subcategory by ID
router.get('/:id', async (req, res) => {
    try {
        const subCategory = await SubCategory.findById(req.params.id);

        if (!subCategory) {
            return res.status(500).json({ message: 'The subcategory with the given ID was not found.' });
        }

        return res.status(200).send(subCategory);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

// Update a subcategory by ID
router.put('/:id', upload.array('images', 10), async (req, res) => {
    const subCategoryId = req.params.id;

    if (!subCategoryId) {
        return res.status(400).json({ message: 'Subcategory ID is required' });
    }

    try {
        const subcategory = await SubCategory.findById(subCategoryId);
        if (!subcategory) {
            return res.status(404).json({ message: 'Sub Category not found' });
        }

        let imagesArr = [];

        if (req.files && req.files.length > 0) {
            // Delete old images
            if (subcategory.images && subcategory.images.length > 0) {
                for (let image of subcategory.images) {
                    try {
                        await deleteImageFromCloudinary(image.public_id);
                    } catch (err) {
                        console.error(`Failed to delete image ${image.public_id}:`, err);
                        return res.status(500).json({ message: `Error deleting image ${image.public_id}` });
                    }
                }
            }

            // Upload new images to Cloudinary
            for (const file of req.files) {
                if (!allowedFormats.includes(file.mimetype)) {
                    return res.status(400).json({ message: 'Invalid file format' });
                }
                const imageUrl = await uploadImageToCloudinary(file, folderName);
                imagesArr.push(imageUrl);
            }
        } else {
            // If no new images uploaded, keep the existing images from the product
            imagesArr = subcategory.images || [];
        }

        const updatedSubCategory = await SubCategory.findByIdAndUpdate(
            subCategoryId,
            {
                category: req.body.category,
                name: req.body.name,
                images: imagesArr.length > 0 ? imagesArr : subcategory.images, // If no new images, keep old ones
                color: req.body.color,
            },
            { new: true }
        );


        if (!updatedSubCategory) {
            return res.status(500).json({ message: 'Subcategory cannot be updated!', success: false });
        }

        res.status(200).json(updatedSubCategory);
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ message: error.message });
    }
});

// Delete a subcategory by ID
router.delete('/:id', async (req, res) => {
    try {
        const subCategory = await SubCategory.findById(req.params.id);
        if (!subCategory) {
            return res.status(404).json({ message: 'Subcategory not found!', success: false });
        }

        const images = subCategory.images;

        // Log images to be deleted
        console.log('Images to be deleted:', images);

        for (let image of images) {
            try {
                // Call the Cloudinary delete function using the `public_id` of each image
                const result = await deleteImageFromCloudinary(image.public_id);
                console.log(`Deleted image: ${image.public_id}`, result);
            } catch (err) {
                console.error(`Failed to delete image ${image.public_id}:`, err);
                return res.status(500).json({ success: false, message: `Failed to delete image ${image.public_id}` });
            }
        }

        // After all images are deleted, proceed to delete the subcategory
        await SubCategory.findByIdAndDelete(req.params.id);
        console.log(`Deleted subcategory: ${req.params.id}`);

        res.status(200).json({ success: true, message: 'Subcategory and associated images deleted successfully' });
    } catch (error) {
        console.error('Error while deleting subcategory:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

module.exports = router;
