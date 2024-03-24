const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        trime: true
    },
    email:{
        type:String,
        required:true,
        unique:true,        // means with one email address multiple users cant login, every user must have unique email address
    },
    password:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:true
    },
    address:{
        type:{},
        required:true
    },
    answer:{              // for forgot password facility. Incase a user forgets the password then we use a question to verify its identity
        type:String,    
        required: true,
    },
    role:{
        type:Number,
        default:0
    }

},{timestamps:true});       // this timestamps property adds the time corresponding to when a new user is being added

const userModel = mongoose.model("users" , userSchema);

module.exports = userModel;