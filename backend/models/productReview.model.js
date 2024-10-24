const mongoose = require('mongoose');

const productReviewsSchema = mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Products',
        required: true
    },
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Clients',
        required: true
    },
    customerName: {
        type: String,
        required: true,
    },
    review: {
        type: String,
        required: true,
        default: "",
    },
    customerRating: {
        type: Number,
        required: true,
        default: 0,
    }
}, { timestamps: true });

productReviewsSchema.virtual('id').get(function() {
    return this._id.toHexString();
});

productReviewsSchema.set('toJSON', {
    virtuals: true,
});

const Reviews = mongoose.model('Reviews', productReviewsSchema);

module.exports = Reviews;