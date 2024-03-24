const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    products:[{
        type:mongoose.ObjectId,
        ref:"products",
    }],
    payment: {},
    buyer: {
        type:mongoose.ObjectId,
        ref:"users",
    },
    status:{
        type: String,
        default: "Not Proccessed",
        enum: ["Not Proccessed", "Processing", "Shipped", "Delivered", "Cancel"],
    },
},{timestamps:true});       

const orderModel = mongoose.model("order" , orderSchema);

module.exports = orderModel;