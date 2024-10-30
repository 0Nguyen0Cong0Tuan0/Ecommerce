const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Client'
    },
    clientInfo: {
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        address: {
            house: {
                type: String,
                required: true,
            },
            apartment: {
                type: String,
            },
            town_city: {
                type: String,
                required: true,
            },
            country: {
                type: String,
                required: true,
            }, 
            postcode_zip: {
                type: String,
                required: true,
            }
        },
        orderNotes: {
            type: String,
        },
    },
    cartItems: [{
        productTitle: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            required: true,
        },
        price: {
            type: mongoose.Schema.Types.Decimal128,
            required: true,
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
        }
    }],
    paymentMethod: {
        type: String,
        required: true,
        enum: ['visa', 'mastercard', 'paypal', 'bank'], // Other methods can be added if needed
    },
    shippingMethod: {
        type: String,
        required: true,
    },
    shippingFee: {
        type: mongoose.Schema.Types.Decimal128,
        required: true,
    },
    subtotal: {
        type: mongoose.Schema.Types.Decimal128,
        required: true,
    },
    vat: {
        type: mongoose.Schema.Types.Decimal128,
        required: true,
    },
    total: {
        type: mongoose.Schema.Types.Decimal128,
        required: true,
    },
    paymentInfo: {
        cardNumber: {
            type: String,
            required: function() {
                return this.paymentMethod === 'visa' || this.paymentMethod === 'mastercard';
            }
        },
        expiryDate: {
            type: String,
            required: function() {
                return this.paymentMethod === 'visa' || this.paymentMethod === 'mastercard';
            }
        },
        cvv: {
            type: String,
            required: function() {
                return this.paymentMethod === 'visa' || this.paymentMethod === 'mastercard';
            }
        },
        paypalEmail: {
            type: String,
            required: function() {
                return this.paymentMethod === 'paypal';
            }
        },
        bankAccountNumber: {
            type: String,
            required: function() {
                return this.paymentMethod === 'bank';
            }
        }
    }
}, { timestamps: true });

// Add virtual property for id
orderSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

// Ensure virtual fields are serialized
orderSchema.set('toJSON', {
    virtuals: true,
});

const Order = mongoose.model('Orders', orderSchema);

module.exports = Order;
