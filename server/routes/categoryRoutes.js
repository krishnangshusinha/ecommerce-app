const express = require("express");
const { requireSignIn, isAdmin } = require("../middlewares/authMiddleware");
const { createCategoryController, updateCategoryController, categoryController, singleCategoryController,deleteCategoryController } = require("../controllers/categoryControllers");
const categoryModel = require("../models/categoryModel");
const router = express.Router();

// routes


// create category route
router.post("/create-category", requireSignIn , isAdmin , createCategoryController);      // allows to create catgeory to only Admin


// update category route ( passing id of the category in the url itself  since we need to update by id)
router.put("/update-category/:id" ,requireSignIn , isAdmin , updateCategoryController);     // The HTTP PUT method is used to create a new resource or replace a resource.( POSt request sends data in reponse but PUT request only updates or replaces resources no data is sent)


// route for displaying list of all categories
router.get("/get-category" , categoryController);   // any user can get list of all categories


// route for getting single category ( passing "slug" of the category in the url itself, since we need to update the category )
router.get("/single-category/:slug" , singleCategoryController);  // here also no authentication required since any user can get a single category


// route to delete a category( passing id of the category in the url itself  since we need to delete by id)
router.delete("/delete-category/:id" , requireSignIn , isAdmin , deleteCategoryController);     // here authentication is required, since only admin must be allowed to delete a category




module.exports = router;