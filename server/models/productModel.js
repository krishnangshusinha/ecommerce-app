const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required: true,
    },
    slug:{
        type:String,
        required: true,
    },
    description :{
        type:String,
        required:true,
    },
    price:{
        type:Number,
        required:true,
    },
    category:{      // this is the category type referenced from the category Model
        type: mongoose.ObjectId,
        ref:"category",
        required:true,
    },
    quantity:{
        type:Number,
        required:true,
    },
    photo:{
        data:Buffer,
        contentType: String,
    },
    shipping:{
        type:Boolean,
    }


},{timestamps:true});



const productModel = mongoose.model("products" , productSchema);


module.exports = productModel;