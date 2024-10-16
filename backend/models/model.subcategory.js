const mongoose = require('mongoose');

const subCatSchema = mongoose.Schema({
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Categories', // Reference the 'Categories' model
        required: true,
    },
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

subCatSchema.virtual('id').get(function() {
    return this._id.toHexString();
});

subCatSchema.set('toJSON', {
    virtuals: true,
});

const SubCategory = mongoose.model('SubCategories', subCatSchema);

module.exports = SubCategory;
