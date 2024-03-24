const fs = require("fs");       // for file system and handling file
const productModel = require("../models/productModel");
const categoryModel = require("../models/categoryModel");
const orderModel = require("../models/orderModel");
const { default: slugify } = require("slugify");
const dotenv = require("dotenv");

dotenv.config();    // for getting acces to env file

/** PAYMENT GATEWAY */
var braintree = require("braintree");

var gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});


// controller to create a product (Admin)
const createProductController = async (req, res) => {
    try {
        
        const{ name, slug , description , price, category , quantity , shipping} = req.fields;      //since we have used the formidable() middleware hence we need to destructure these datas from fields  
        const {photo} = req.files;      // photo cannot be destructured like normal values , if we do so then only string format of data is retrieved to get entrie photo we have used the formidable() middelware

        //validating the entry
        switch (true) {
            case !name:
              return res.status(500).send({ error: "Name is Required" });
            case !description:
              return res.status(500).send({ error: "Description is Required" });
            case !price:
              return res.status(500).send({ error: "Price is Required" });
            case !category:
              return res.status(500).send({ error: "Category is Required" });
            case !quantity:
              return res.status(500).send({ error: "Quantity is Required" });
            case photo && photo.size > 1000000:     // size in kB
              return res
                .status(500)
                .send({ error: "photo is Required and should be less then 1mb" });
        }

        // if all entries are correct then create a new product with those entries
        const products = await new productModel({ ...req.fields , slug:slugify(name)});

        // if photo is present
        if (photo) {
            products.photo.data = fs.readFileSync(photo.path);
            products.photo.contentType = photo.type;
        }

        await products.save();

        
        res.status(201).send({
            success: true,
            message: "Product Created Successfully",
            products,
        });

    } 
    catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            error,
            message:"Error in creating product",
        })    
    }
}

// controller to get products (Any user)
const getProductController = async (req,res) => {
  try{

    const products = await productModel.find({}).populate("category").select("-photo").limit(12).sort({createdAt: -1});    // so retrieving all the products but except the photos(or it would tak huge time to load), hence -photo is written. And also we would limit to display only 12 products at a time, and sort it in descending order or created time. This populate("category") simply fetches details related to that catgeory too
    
    res.status(200).send({
      success:true,
      countTotal: products.length,
      message: "All products displayed",
      products,
    })
  
  }
  catch(error){
    console.log(error);

    res.status(500).send({
      success:false,
      message:"Error in getting products",
      error,
    })
  }
}

//controller to get a single product
const getSingleProductController = async (req, res) => {
  try{

    const product = await productModel.findOne({slug:req.params.slug}).select("-photo").populate("category");   // fetching the product withour photo and also displaying details about the category
    res.status(200).send({
      success:true,
      message:"Single product fetched",
      product,
    }) 

  }
  catch(error){
    console.log(error);
    res.status(500).send({
      success:false,
      error,
      message:"Error in getting single product",
    })
  }
} 

// controller to get product photo
const productPhotoController = async (req,res) => {
  try{

    const product = await productModel.findById(req.params.pid).select("photo");    // fetching the photo on the basis pid sent in the URL
    
    if( product.photo.data ){   // if product photo data is recieved
      res.set("Content-type" , product.photo.contentType);    // setting the content type value in response
      return res.status(200).send(product.photo.data);
    }
    

  }
  catch(error){
    console.log(error);
    res.status(500).send({
      success:false,
      message:"Error in getting photo of product",
      error,
    })
  }
}

// delete product
const deleteProductController = async (req,res) => {
  try{

    await productModel.findByIdAndDelete(req.params.pid).select("-photo");    // deleting product
    res.status(200).send({
      success:true,
      message:"Product deleted successfully",
    })

  }
  catch(error){
    console.log(error);
    res.status(500).send({
      success:false,
      message:"Error in deleting the product",
      error,
    })
  }
}

// updating product(Admin)
const updateProductController = async (req,res) => {
  try{

    const{ name, slug , description , price, category , quantity , shipping} = req.fields;      //since we have used the formidable() middleware hence we need to destructure these datas from fields  
        const {photo} = req.files;      // photo cannot be destructured like normal values , if we do so then only string format of data is retrieved to get entrie photo we have used the formidable() middelware

        //validating the entry
        switch (true) {
            case !name:
              return res.status(500).send({ error: "Name is Required" });
            case !description:
              return res.status(500).send({ error: "Description is Required" });
            case !price:
              return res.status(500).send({ error: "Price is Required" });
            case !category:
              return res.status(500).send({ error: "Category is Required" });
            case !quantity:
              return res.status(500).send({ error: "Quantity is Required" });
            case photo && photo.size > 1000000:     // size in kB
              return res
                .status(500)
                .send({ error: "photo is Required and should be less then 1mb" });
        }

        // if all entries are correct then create a new product with those entries
        const products = await productModel.findByIdAndUpdate(req.params.pid , {...req.fields , slug:slugify(name)} , {new:true});

        // if photo is present
        if (photo) {
            products.photo.data = fs.readFileSync(photo.path);
            products.photo.contentType = photo.type;
        }

        await products.save();

        
        res.status(201).send({
            success: true,
            message: "Product Updated Successfully",
            products,
        });


  }
  catch(error){
    console.log(error)
    res.status(500).send({
      success:false,
      message: "Error in updating product",
      error,
    })
  }
}

// filterting product
const productFiltersController = async ( req, res) => {

  try{

    const {checked , radio} = req.body;   // getting the selected categories and selected price range

    let args = {};

    if( checked.length > 0 ){     // if categories are selected in the filter section
      args.category = checked;
    }
    if( radio.length > 0 ){       // if price range is selected in the filter section
      args.price = { $gte: radio[0], $lte:radio[1]};        // gte-> greater than equal to     lte -> less than equal to
    }

    const products = await productModel.find(args);     // apply the above filters on this 

    res.status(200).send({
      success: true,
      products,
    })

  }
  catch(error){
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error in filtering products",
      error,
    })
  }
}

// count products
const productCountController = async (req, res) => {
  try {

    // get the total count of the products
    const total = await productModel.find({}).estimatedDocumentCount();
  
    res.status(200).send({
      success:true,
      total,
    })
  } 
  catch (error) {
    console.log(error);
    res.status(400).send({
      success:false,
      message:"Error in message count",
      error,
    })  
  }
}

// product list per page
const productsListController = async ( req, res) => {
  try {
    const perPage = 6;      // count of products to be displayed per page
    const page = req.params.page ? req.params.page : 1;

    const products = await productModel.find({}).select("-photo").skip((page-1)*perPage).limit(perPage).sort({createdAt: -1});    // getting the products except photo and skipping the previous number of pages already displayed and sorting the result in descending order

    res.status(200).send({
      success:true,
      products,
    })
  } 
  catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      error,
      message:"Error in getting product list per page",
    })  
  }
}

// search products
const searchProductController = async ( req, res) => {
  try{

    const {keyword} = req.params;

    const result = await productModel.find({
      $or: [
        {name: {$regex: keyword , $options: "i"}},              // Now this gives result on the basis of the keyword entered in the search bar. Checks if the keyword is present in the "name" or "description" and also "$options: "i" " means should not be case sensetive
        {description: {$regex: keyword , $options: "i"}}
      ],
    })
    .select("-photo")

    res.json(result);

  }
  catch(error){
    console.log(error);
    res.status(400).send({
      success:false,
      message:"Error in searching products",
      error,
    })
  }
}

// get similar products
const relatedProductController = async (req,res) => {
  try{

    const {pid , cid} = req.params;   // getting product id and category id from the URL

    const products = await productModel.find({
      category:cid ,      // finding products having same category
      _id: {$ne:pid},     // not including the current product
    })
    .select("-photo").limit(3).populate("category");

    res.status(200).send({
      success:true,
      products,
    })

  }
  catch(error){
    console.log(error);
    res.status(400).send({
      success:false,
      message: "Error in getting related products",
      error,
    })
  }
}

// catgory wise product
const productCategoryController = async (req,res) => {
  try {
    
    const category = await categoryModel.findOne({slug: req.params.slug});      // finding the category on the basis of slug
    const products = await productModel.find({category}).populate("category");    // then finding the products belonging to that category
    res.status(200).send({
      success:true,
      category,
      products,
    })
  } 
  catch (error) {
    console.log(error);
    res.status(400).send({
      success:false,
      message:"Error in getting category wise product",
      error,
    })  
  }
}


// payment braintree token controller (creates a token for the client)
const braintreeTokenController = async (req, res) => {
  try {
    gateway.clientToken.generate({} , function(error , response){
      if(error){
        res.status(500).send(error);
      }
      else{
        res.send(response);
      }
    })
  } 
  catch (error) {
    console.log(error)  
  }
}


// payments controller
const braintreePaymentController = async (req,res) => {
  try {
    
    const { nonce, cart } = req.body;
    let total = 0;
    cart.map((i) => {
      total += i.price;
    });
    
    let newTransaction = gateway.transaction.sale(
      {
        amount: total,
        paymentMethodNonce: nonce,
        options: {
          submitForSettlement: true,
        },
      },
      function (error, result) {
        if (result) {
          const order = new orderModel({
            products: cart,
            payment: result,
            buyer: req.user._id,
          }).save();
          res.json({ ok: true });
        } else {
          res.status(500).send(error);
        }
      }
    );

  } 
  catch (error) {
    console.log(error);  
  }
}

module.exports = {
    createProductController,
    getProductController,
    getSingleProductController,
    productPhotoController,
    deleteProductController,
    updateProductController,
    productFiltersController,
    productCountController,
    productsListController,
    searchProductController,
    relatedProductController,
    productCategoryController,
    braintreeTokenController,
    braintreePaymentController,
}