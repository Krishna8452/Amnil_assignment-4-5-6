const mongoose = require('mongoose')
const schema = mongoose.Schema;

const productSchema = new schema({
        id: Number,
        name: String,
        price: String,
        description: String,
        quantity: Number,
        product_type: String
})      

module.exports = mongoose.model('products', productSchema);