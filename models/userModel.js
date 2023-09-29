const mongoose = require('mongoose')
const schema = mongoose.Schema;

const userSchema = new schema({

        id: Number,
        name: String,
        address: String
})      

module.exports = mongoose.model('users', userSchema);