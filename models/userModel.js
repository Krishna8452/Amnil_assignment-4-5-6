const mongoose = require('mongoose')
const schema = mongoose.Schema;

const userSchema = new schema({
name: String,
username:{
        type:String,
        }, 
password:{
        type:String,
        },
address: String,
email: String,
phone:Number,
},{
timestamps: true
}
)      
module.exports = mongoose.model('users', userSchema);