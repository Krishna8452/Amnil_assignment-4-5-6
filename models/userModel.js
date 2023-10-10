const mongoose = require('mongoose')
const schema = mongoose.Schema;

const userSchema = new schema({
        name: String,
        address: String,
        image: {
        type: String,
        required: true
        }
},{
        timestamps: true
}
)      
module.exports = mongoose.model('users', userSchema);