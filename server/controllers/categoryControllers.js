const { default: slugify } = require("slugify");
const categoryModel = require("../models/categoryModel");

// creating a new category(Admin) 
const createCategoryController = async (req,res) => {
    try {
        
        const {name} = req.body;
        if( !name ){
            return res.status(401).send({
                message:"Name is required",
            })
        }

        // checking for any existing same category
        const existingCategory = await categoryModel.findOne({name});       // finding on basis of name since is unique
        if( existingCategory ){     // already a category with same name exists
            return res.status(200).send({
                success:true,
                message:"Category already exists",
            })
        }

        // control comes here means no category exists so create one
        const catgeory = await new categoryModel({name , slug:slugify(name)}).save();

        res.status(201).send({
            success:true,
            message:"New Category created",
            catgeory,
        })

    } 
    catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            error,
            message: "Error in Category",
        })    
    }
}

// updating a category(Admin) 
const updateCategoryController = async (req, res) => {
    try{

        const{name} = req.body;
        const {id} = req.params;        // the id that we have passed in the url

        const category = await categoryModel.findByIdAndUpdate(id, {name , slug:slugify(name)} , {new:true});   // updating the name of the category

        res.status(200).send({
            success: true,
            message: "Category updated successfully",
            category,
        })

    }
    catch(error){
        console.log(error);
        res.status(500).send({
            success:false,
            error,
            message:"Error in updating category"
        })
    }
}

// getting list of all categories
const categoryController = async (req, res) => {
    try{

        const category = await categoryModel.find({});  // retrieves all the categories
        res.status(200).send({
            success: true,
            message: "All Categories list",
            category,
        })

    }
    catch(error){
        console.log(error);
        res.status(500).send({
            success:false,
            error,
            message:"Error while getting all categories"
        })
    }
}  

// getting a single category
const singleCategoryController = async (req,res) => {
    try{

        const category = await categoryModel.findOne({slug: req.params.slug});  // finding on basis of slug
        res.status(200).send({
            success: true,
            message:"Single category retrieved successfully",
            category,
        })

    }
    catch(error){
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "Error in getting single category"
        })
    }
}

// deleting a category(Admin)
const deleteCategoryController = async (req,res) => {
    try {
        
        const {id} = req.params;        // retrieving the id from the url

        await categoryModel.findByIdAndDelete(id);

        res.status(200).send({
            success:true,
            message:"Category Deleted Successfully",
        })

    } 
    catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            error,
            message:"Error in deleting category",
        })    
    }
}


module.exports = {
    createCategoryController,
    updateCategoryController,
    categoryController,
    singleCategoryController,
    deleteCategoryController,
}