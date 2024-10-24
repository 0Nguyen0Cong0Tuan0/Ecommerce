const mongoose = require('mongoose');

const cartSchema = mongoose.Schema({
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
    quantity: {
        type: Number,
        required: true,
    },
    subTotal: {
        type: mongoose.Schema.Types.Decimal128,
        required: true,
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

cartSchema.virtual('id').get(function () {
    return this._id.toHexString();
})

cartSchema.set('toJSON', {
    virtuals: true,
})

const Cart = mongoose.model('Carts', cartSchema);

module.exports = Cart;