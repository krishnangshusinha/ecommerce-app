const express = require("express");
const router = express.Router();

const {registerController, loginController ,forgotPasswordController, updateProfileController, getOrdersController, getAllOrdersController, updateOrderStatusController} = require("../controllers/authControllers");
const {isAdmin , requireSignIn} = require("../middlewares/authMiddleware");

// routing

//Register
router.post("/register" , registerController);

//Login
router.post("/login", loginController);

// forgot-password
router.post("/forgot-password" , forgotPasswordController);


// User - Dashboard (private route only for logged in user)
router.get("/user-auth" , requireSignIn , (req,res) => {        // verifies if the token for user logged in
    res.status(200).send({
        ok:true,
    })
})

// Admin - Dashboard (private route only for logged in Admin)
router.get("/admin-auth" , requireSignIn , isAdmin , (req,res) => {        // verifies if current user is Admin or not ,  and also verifies token for Admin  logged in 
    res.status(200).send({
        ok:true,
    })
})


// update profile for user
router.put("/profile" , requireSignIn , updateProfileController);       // user must be logges in to update the profile

// orders of user
router.get("/orders" , requireSignIn , getOrdersController);

// get all orders
router.get("/all-orders" , requireSignIn , isAdmin, getAllOrdersController);        // only it is is admin and it is logged in then only allow

// update orders status
router.put("/order-status/:orderId" , requireSignIn , isAdmin, updateOrderStatusController);        // only it is is admin and it is logged in then only allow


module.exports = router;