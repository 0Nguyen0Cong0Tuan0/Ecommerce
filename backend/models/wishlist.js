const mongoose = require('mongoose');

const wishListSchema = mongoose.Schema({
    productTitle: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true
    },
    price: {
        type: mongoose.Schema.Types.Decimal128,
        default: 0
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Product'
    },
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Client'
    }
}, { timestamps: true });

wishListSchema.virtual('id').get(function () {
    return this._id.toHexString();
})

wishListSchema.set('toJSON', {
    virtuals: true,
})

const WishList = mongoose.model('WishList', wishListSchema);

module.exports = WishList;