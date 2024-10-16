const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    images: [
        {
            url: { 
                type: String, 
                required: true },
            public_id: { 
                type: String, 
                required: true }
        }
    ],
    brand: {
        type: String,
        required: true,
    }, 
    price: {
        type: mongoose.Schema.Types.Decimal128,
        default: 0
    },
    oldPrice: {
        type: mongoose.Schema.Types.Decimal128,
        default: 0
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Categories',
        required: true,
    },
    subCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SubCategories',
        required: true,
    },
    countInStock: {
        type: Number,
        default: 0,
    },
    isFeatured: {
        type: Boolean,
        default: false,
    },
}, {timestamps: true})

productSchema.virtual('id').get(function() {
    return this._id.toHexString();
})

productSchema.set('toJSON', {
    virtuals: true,
})

const Product = mongoose.model('Products', productSchema);

module.exports = Product;