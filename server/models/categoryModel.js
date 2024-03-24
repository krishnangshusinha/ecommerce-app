const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true,
    },

    slug:{                  // slug is added to make the site SEO friendly
        type:String,
        lowercase:true,
    }

},{timestamps:true});       

const categoryModel = mongoose.model("category" , categorySchema);

module.exports = categoryModel;