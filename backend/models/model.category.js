const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
    name: {
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
    color: {
        type: String,
        required: true,
    },
}, { timestamps: true });

categorySchema.virtual('id').get(function () {
    return this._id.toHexString();
})

categorySchema.set('toJSON', {
    virtuals: true,
})

const Category = mongoose.model('Categories', categorySchema);

module.exports = Category;