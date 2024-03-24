const express = require("express");
const { requireSignIn, isAdmin } = require("../middlewares/authMiddleware");
const { createProductController, getProductController, getSingleProductController, productPhotoController, deleteProductController, updateProductController, productFiltersController, productCountController, productsListController, searchProductController, relatedProductController, productCategoryController, braintreeTokenController, braintreePaymentController } = require("../controllers/productController");
const router = express.Router();
const formidable = require("express-formidable");

//routes

// route to create a product
router.post("/create-product" , requireSignIn , isAdmin ,formidable(), createProductController);         // authentication for being Admin is required to create a product. formidable() is used for accessing and uploading the photos of products since photos cant be accessed normally.

// route to get all products
router.get("/get-product" , getProductController);         // route to get all products(any user to get products)

// route to get single product
router.get("/get-product/:slug" , getSingleProductController);     // same url as last but here we are passing a slug since it is unique for each product and we would return the product on basis of this slug

// for getting the photo of product
router.get("/product-photo/:pid" , productPhotoController);     // gets the product photo

// for deleting the product
router.delete("/delete-product/:pid" , deleteProductController);        // for deleting product

// updating product
router.put("/update-product/:pid" , requireSignIn , isAdmin ,formidable(), updateProductController);         // authentication for being Admin is required to create a product. formidable() is used for accessing and uploading the photos of products since photos cant be accessed normally.

// filterting products
router.post("/product-filters" , productFiltersController);

// count products
router.get("/product-count" , productCountController);

// product list per page
router.get("/product-list/:page" , productsListController);

// searching products
router.get("/search/:keyword" , searchProductController);

// getting the related products
router.get("/related-product/:pid/:cid" , relatedProductController)

// category wise prodcut
router.get("/product-category/:slug" , productCategoryController);

// payment routes
// Braintree gives a token to validate the user so route for that
router.get("/braintree/token" , braintreeTokenController);

// for payments
router.post("/braintree/payments" ,requireSignIn, braintreePaymentController);  // user needs to be signed in inorder to make payment

module.exports = router;