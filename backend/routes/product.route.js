// EXPRESS
const express = require('express');
const router = express.Router();
const multer = require('multer');

// HELPER FUNCTIONS
const uploadImageToCloudinary = require('../helper/imageUpload');
const deleteImageFromCloudinary = require('../helper/imageDelete');

// MODELS
const Product = require('../models/model.product'); // Ensure the correct path to the product model
const Category = require('../models/model.category');
const SubCategory = require('../models/model.subcategory');


// Configure multer for in-memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

const allowedFormats = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

const preFolderName = 'products';

// Create a new product
router.post('/create', upload.array('images', 10), async (req, res) => {
    try {
        const imagesArr = [];

        const categoryDoc = await Category.findById(req.body.category);
        const subCategoryDoc = await SubCategory.findById(req.body.subCategory);

        // Upload each image to Cloudinary
        for (const file of req.files) {
            if (!allowedFormats.includes(file.mimetype)) {
                return res.status(400).json({ message: 'Invalid file format' });
            }
            const imageUrl = await uploadImageToCloudinary(file, `${preFolderName} - ${categoryDoc.name} - ${subCategoryDoc.name}`); // Await Cloudinary upload
            imagesArr.push(imageUrl); // Collect the uploaded image URL
        }

        const newProduct = new Product({
            name: req.body.name,
            description: req.body.description,
            images: imagesArr,
            brand: req.body.brand,
            price: isNaN(Number(req.body.price)) ? 0 : Number(req.body.price),  // Prevent NaN
            oldPrice: isNaN(Number(req.body.oldPrice)) ? 0 : Number(req.body.oldPrice),
            category: req.body.category,
            subCategory: req.body.subCategory,
            countInStock: isNaN(Number(req.body.countInStock)) ? 0 : Number(req.body.countInStock),
            isFeatured: req.body.isFeatured === "true",
        });

        const product = await newProduct.save();
        res.status(201).json(product);
    } catch (error) {
        console.error('Error uploading images or creating product:', error);
        res.status(400).json({ message: error.message });
    }
});

// Get all products with optional filtering for featured products
router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page);
        const perPage = parseInt(req.query.limit);
        const searchQuery = req.query.search || "";
        const sortBy = req.query.sortBy || 'date-asc';
        const isFeatured = req.query.f === 'true';
        const { category, minPrice, maxPrice, status, brands } = req.query; // Added 'brand' to the query params

        // Set sorting criteria
        let sortQuery = {};

        if (sortBy === 'name-asc') sortQuery = { name: 1 };
        else if (sortBy === 'name-desc') sortQuery = { name: -1 };
        else if (sortBy === 'date-asc') sortQuery = { createdAt: 1 };
        else if (sortBy === 'date-desc') sortQuery = { createdAt: -1 };

        // Create the base query object
        let query = {};

        // If a search query is provided, add regex search for name (case-insensitive)
        if (searchQuery) {
            query.name = { $regex: searchQuery, $options: 'i' };
        }

        // If 'isFeatured' filter is true, add it to the query
        if (isFeatured) {
            query.isFeatured = true;
        }

        // If category filter is provided, split it into an array and add to the query
        if (category) {
            const categoryIds = category.split(',');
            query.category = { $in: categoryIds };
        }

        // If minPrice and maxPrice are provided, add them to the query
        if (minPrice && maxPrice) {
            query.price = { $gte: parseFloat(minPrice), $lte: parseFloat(maxPrice) };
        }

        // Stock status filtering based on status query parameter
        // Stock status filtering based on status query parameter
        if (status) {
            const statusArray = status.split(','); // Allow multiple statuses (e.g., "1,2,3")

            if (statusArray.includes('1')) {
                query.countInStock = { $gt: 0 }; // In Stock (countInStock > 0)
            }
            if (statusArray.includes('2')) {
                query.countInStock = { $lte: 0 }; // Out of Stock (countInStock <= 0)
            }
            if (statusArray.includes('3')) {
                query.$and = [
                    { oldPrice: { $exists: true, $gt: 0 } }, // oldPrice exists and is greater than 0
                    { $expr: { $lt: ["$price", "$oldPrice"] } } // price is less than oldPrice
                ];
            }
        }

        // If brand filter is provided, split it into an array and decode brand names to handle spaces
        if (brands) {
            const brandList = brands.split(',').map(b => decodeURIComponent(b.trim()));
            query.brand = { $in: brandList }; // Assuming the product has a 'brand' field
        }


        // Fetch total number of documents matching the query
        const totalPosts = await Product.countDocuments(query);
        const totalPages = Math.ceil(totalPosts / perPage);

        // If the requested page exceeds the total number of pages, return 404
        if (page > totalPages) {
            return res.status(404).json({ message: 'Page not found' });
        }

        // Fetch the products based on the constructed query, applying pagination and sorting
        const productList = await Product.find(query)
            .populate('category', 'name')
            .populate('subCategory', 'name')
            .sort(sortQuery)
            .skip((page - 1) * perPage)
            .limit(perPage)
            .exec();

        if (!productList || productList.length === 0) {
            return res.status(404).json({ message: 'Products not found' });
        }

        // Return the fetched products and pagination info
        return res.status(200).json({
            'productList': productList,
            totalPages,
            page
        });

    } catch (error) {
        console.error('Error fetching products:', error);
        return res.status(500).json({ success: false, error: error.message });
    }
});

// Get related products by category and subcategory
router.get('/related', async (req, res) => {
    try {
        const { category, subcategory } = req.query;


        if (!category || !subcategory) {
            return res.status(400).json({ message: 'Category and subcategory are required.' });
        }

        const query = {
            'category': category,
            'subCategory': subcategory,  // Filter by subCategory ID
        };

        // Find related products by category and subcategory
        const relatedProducts = await Product.find(query)
            .populate('category', 'name')  // Populate category name
            .populate('subCategory', 'name')  // Populate subcategory name
            .limit(10)  // Limit the number of related products (optional)
            .exec();

        if (!relatedProducts || relatedProducts.length === 0) {
            return res.status(404).json({ message: 'No related products found.' });
        }

        res.status(200).json({ relatedProducts });
    } catch (error) {
        console.error('Error fetching related products:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

// Get a single product by ID
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
            .populate('category', 'name')  // Get only the category name
            .populate('subCategory', 'name')
            .exec();  // Get only the subcategory name

        if (!product) {
            return res.status(404).json({ message: 'Product not found.' });
        }

        return res.status(200).json({
            ...product._doc,
            categoryName: product.category.name,
            subCategoryName: product.subCategory.name,
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});

// Get the products by Category ID
router.get('/category/:id', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const perPage = parseInt(req.query.limit) || 500;
        const searchQuery = req.query.search || "";
        const sortBy = req.query.sortBy || 'date-asc';
        const isFeatured = req.query.f === 'true';  // Check if 'f=true' is passed in the query

        // Set sorting criteria
        let sortQuery = {};

        if (sortBy === 'name-asc') sortQuery = { name: 1 };
        else if (sortBy === 'name-desc') sortQuery = { name: -1 };
        else if (sortBy === 'date-asc') sortQuery = { createdAt: 1 };
        else if (sortBy === 'date-desc') sortQuery = { createdAt: -1 };

        // Combined query for category, search, and isFeatured
        const query = {
            'category': req.params.id,  // Filter by category ID
            ...(searchQuery && { name: { $regex: searchQuery, $options: 'i' } }), // Search by product name if search query exists
            ...(isFeatured && { isFeatured: true }) // Filter by featured if requested
        };

        const totalPosts = await Product.countDocuments(query);
        const totalPages = Math.ceil(totalPosts / perPage);

        if (page > totalPages) {
            return res.status(404).json({ message: 'Page not found' });
        }

        const productCat = await Product.find(query)
            .populate('category', 'name')
            .populate('subCategory', 'name')
            .sort(sortQuery)
            .skip((page - 1) * perPage)
            .limit(perPage)
            .exec();

        if (!productCat || productCat.length === 0) {
            return res.status(404).json({ message: 'Products not found' });
        }

        return res.status(200).json({
            'productList': productCat,
            totalPages,
            page
        });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});


// Get the products by SubCategory ID
router.get('/subcategory/:id', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const perPage = parseInt(req.query.limit) || 500;
        const searchQuery = req.query.search || "";
        const sortBy = req.query.sortBy || 'date-asc';
        const isFeatured = req.query.f === 'true';  // Check if 'f=true' is passed in the query

        let sortQuery = {};

        if (sortBy === 'name-asc') sortQuery = { name: 1 };
        else if (sortBy === 'name-desc') sortQuery = { name: -1 };
        else if (sortBy === 'date-asc') sortQuery = { createdAt: 1 };
        else if (sortBy === 'date-desc') sortQuery = { createdAt: -1 };

        const query = {
            'subCategory': req.params.id,  // Filter by subCategory ID
            ...(searchQuery && { name: { $regex: searchQuery, $options: 'i' } }), // Search by product name if search query exists
            ...(isFeatured && { isFeatured: true }) // Filter by featured if requested
        };

        const totalPosts = await Product.countDocuments(query);
        const totalPages = Math.ceil(totalPosts / perPage);

        if (page > totalPages) {
            return res.status(404).json({ message: 'Page not found' });
        }

        const productSubCat = await Product.find(query)
            .populate('category', 'name')
            .populate('subCategory', 'name')
            .sort(sortQuery)
            .skip((page - 1) * perPage)
            .limit(perPage)
            .exec();

        if (!productSubCat || productSubCat.length === 0) {
            return res.status(404).json({ message: 'Products not found' })
        }

        return res.status(200).json({
            "productList": productSubCat,
            totalPages,
            page
        });


    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});





// Update a product by ID
router.put('/:id', upload.array('images', 10), async (req, res) => {
    const productId = req.params.id;

    const categoryDoc = await Category.findById(req.body.category);
    const subCategoryDoc = await SubCategory.findById(req.body.subCategory);


    if (!productId) {
        return res.status(400).json({ message: 'Product ID is required' });
    }

    try {
        // Fetch the product from the database to get the existing images
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Prepare to hold new image data
        let imagesArr = [];

        // Check if new files are uploaded and process them
        if (req.files && req.files.length > 0) {
            // Delete the old images from Cloudinary if new ones are uploaded
            if (product.images && product.images.length > 0) {
                for (let image of product.images) {
                    try {
                        await deleteImageFromCloudinary(image.public_id); // Delete image from Cloudinary
                    } catch (err) {
                        console.error(`Failed to delete image ${image.public_id}:`, err);
                        return res.status(500).json({ success: false, message: `Failed to delete image ${image.public_id}` });
                    }
                }
            }

            // Upload new images to Cloudinary
            for (const file of req.files) {
                if (!allowedFormats.includes(file.mimetype)) {
                    return res.status(400).json({ message: 'Invalid file format' });
                }
                const imageUrl = await uploadImageToCloudinary(file, `${preFolderName} - ${categoryDoc.name} - ${subCategoryDoc.name}`); // Upload to Cloudinary
                imagesArr.push(imageUrl); // Collect uploaded image details
            }
        } else {
            // If no new images uploaded, keep the existing images from the product
            imagesArr = product.images || [];
        }

        // Update the product details in the database
        const updatedProduct = await Product.findByIdAndUpdate(
            productId,
            {
                name: req.body.name,
                description: req.body.description,
                brand: req.body.brand,
                price: isNaN(Number(req.body.price)) ? 0 : Number(req.body.price),  // Prevent NaN
                oldPrice: isNaN(Number(req.body.oldPrice)) ? 0 : Number(req.body.oldPrice),
                category: req.body.category,
                subCategory: req.body.subCategory,
                countInStock: isNaN(Number(req.body.countInStock)) ? 0 : Number(req.body.countInStock),
                isFeatured: req.body.isFeatured === "true",
                images: imagesArr.length > 0 ? imagesArr : product.images, // Use new images if uploaded
            },
            { new: true } // Return the updated product
        );

        if (!updatedProduct) {
            return res.status(500).json({ message: 'Product cannot be updated', success: false });
        }

        res.status(200).json(updatedProduct);
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// Delete a product by ID
router.delete('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found!', success: false });
        }

        const images = product.images;

        // Log images to be deleted
        console.log('Images to be deleted:', images);

        // Delete images from Cloudinary
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

        // After all images are deleted, proceed to delete the product
        await Product.findByIdAndDelete(req.params.id);
        console.log(`Deleted subcategory: ${req.params.id}`);

        res.status(200).json({ success: true, message: 'Product and associated images deleted successfully' });
    } catch (error) {
        console.error('Error while deleting product:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

module.exports = router;
