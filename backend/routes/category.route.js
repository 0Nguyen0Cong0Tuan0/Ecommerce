// EXPRESS
const express = require('express');
const router = express.Router();
const multer = require('multer');

// HELPER
const uploadImageToCloudinary = require('../helper/imageUpload');
const deleteImageFromCloudinary = require('../helper/imageDelete');

// MODELS
const Category = require('../models/model.category');


// Configure multer for in-memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

const allowedFormats = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

const folderName = 'categories';

router.post('/create', upload.array('images', 10), async (req, res) => {
    try {
        const { name, color } = req.body;
        const imagesArr = [];

        // Upload each image to Cloudinary
        for (const file of req.files) {
            if (!allowedFormats.includes(file.mimetype)) {
                return res.status(400).json({ message: 'Invalid file format' });
            }
            const imageUrl = await uploadImageToCloudinary(file, folderName); // Await Cloudinary upload
            imagesArr.push(imageUrl); // Collect the uploaded image URL
        }

        // Create a new category
        const newCategory = new Category({
            name,
            images: imagesArr,
            color,
        });

        // Save the category to the database
        const category = await newCategory.save();
        res.status(201).json(category);
    } catch (error) {
        console.error('Error uploading images or creating category:', error);
        res.status(400).json({ message: error.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const perPage = parseInt(req.query.limit) || 500;
        const searchQuery = req.query.search || "";
        const sortBy = req.query.sortBy || 'date-asc';  // Default sorting by date ascending

        let sortQuery = {};

        if (sortBy === 'name-asc') sortQuery = { name: 1 };
        else if (sortBy === 'name-desc') sortQuery = { name: -1 };
        else if (sortBy === 'date-asc') sortQuery = { createdAt: 1 };
        else if (sortBy === 'date-desc') sortQuery = { createdAt: -1 };

        // If there's a search query, use a regex for case-insensitive partial matching
        const query = searchQuery
            ? { name: { $regex: searchQuery, $options: 'i' } }
            : {};

        const totalPosts = await Category.countDocuments(query); // Count with search filter
        const totalPages = Math.ceil(totalPosts / perPage);

        if (page > totalPages) {
            return res.status(404).json({ message: 'Page not found!' });
        }

        const categoryList = await Category.find(query)
            .sort(sortQuery)  // Apply the dynamic sort
            .skip((page - 1) * perPage)
            .limit(perPage)
            .exec();

        if (!categoryList) {
            return res.status(500).json({ success: false });
        }

        return res.status(200).json({
            categoryList: categoryList,
            totalPages: totalPages,
            page: page,
        });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);

        if (!category) {
            res.status(500).json({ message: 'The category with the given ID was not found. ' });
        }

        return res.status(200).send(category);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

router.put('/:id', upload.array('images', 10), async (req, res) => {
    const categoryId = req.params.id;

    if (!categoryId) {
        return res.status(400).json({ message: 'Category ID is required' });
    }

    try {
        const category = await Category.findById(categoryId);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        let imagesArr = [];

        // If new images are uploaded, delete old ones and upload new ones
        if (req.files && req.files.length > 0) {
            // Delete old images
            if (category.images && category.images.length > 0) {
                for (let image of category.images) {
                    try {
                        // Delete from Cloudinary
                        await deleteImageFromCloudinary(image.public_id);
                    } catch (err) {
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
                imagesArr.push(imageUrl); // Collect new image URLs
            }
        }

        // Update the category in the database
        const updatedCategory = await Category.findByIdAndUpdate(
            categoryId,
            {
                name: req.body.name,
                images: imagesArr.length > 0 ? imagesArr : category.images, // New or old images
                color: req.body.color,
            },
            { new: true } // Return the updated document
        );

        if (!updatedCategory) {
            return res.status(500).json({ message: 'Category update failed!' });
        }

        res.status(200).json(updatedCategory);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found!', success: false });
        }

        const images = category.images; // Assuming `category.images` contains an array of objects with `public_id`

        // Log images to be deleted
        console.log('Images to be deleted:', images);

        // Now delete the images from Cloudinary
        for (let image of images) {
            try {
                const result = await deleteImageFromCloudinary(image.public_id);
                console.log(`Deleted image from Cloudinary: ${image.public_id}`, result);
            } catch (err) {
                console.error(`Failed to delete image ${image.public_id} from Cloudinary:`, err);
                return res.status(500).json({ success: false, message: `Failed to delete image ${image.public_id} from Cloudinary` });
            }
        }

        // After all images are deleted, proceed to delete the category
        await Category.findByIdAndDelete(req.params.id);
        console.log(`Deleted category: ${req.params.id}`);

        res.status(200).json({ success: true, message: 'Category and associated images deleted successfully' });
    } catch (error) {
        console.error('Error while deleting category:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

module.exports = router;