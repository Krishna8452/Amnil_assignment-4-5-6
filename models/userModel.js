const mongoose = require('mongoose')
const schema = mongoose.Schema;

const userSchema = new schema({
name: String,
username:{
        type:String,
        required:[true, "username required"]
        }, 
password:{
        type:String,
        required:[true, "password required"]
        },
address: String,
phone:Number,
},{
timestamps: true
}
)      
module.exports = mongoose.model('users', userSchema);