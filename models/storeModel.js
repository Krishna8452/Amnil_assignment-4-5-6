const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema({
    store_name: {
        type: String,
        required: true,
        unique: true
    },
    logo: {
        type: String,
        required: true
    },
    product_type: {
        type: String,
        enum: ['Grocery', 'Electronics', 'Stationary', 'Clothing']
    },
    location: {
        type: {
            type: String,
            default: 'Point',
        },
        coordinates: {
            type: [Number],
            required: true,
            index: '2dsphere'
        }
    },
    productId: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'products'
    }],

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'users'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('stores', storeSchema);
