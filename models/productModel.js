const mongoose = require('mongoose')
const schema = mongoose.Schema;

const productSchema = new schema({
        name: String,
        price: Number,
        description: String,
        quantity: Number,
        product_type: String
})      

module.exports = mongoose.model('products', productSchema);