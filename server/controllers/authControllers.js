const { hashPassword, comparePassword } = require("../helpers/authHelpers");
const orderModel = require("../models/orderModel");
const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");

const registerController = async (req, res) => {
    try{
        
        // destructuring the data
        const {name , email, password , phone, address,answer} = req.body;

        // validating the data
        if( !name ){
            return res.send({message:"Name is required"});
        }  
        if( !email ){
            return res.send({message:"Email is required"});
        }
        if( !password ){
            return res.send({message:"Password is required"});
        }
        if( !phone ){
            return res.send({message:"Phone number is required"});
        }
        if( !address ){
            return res.send({message:"Address is required"});
        }
        if( !answer ){
            return res.send({message:"Answer is required"});
        }

        // check for existing user
        const existingUser = await userModel.findOne({email});  // finding on basis of email since email of each use is unique
        if( existingUser ){     // if user exists means user is already registered
            return res.status(200).send({
                success:false,
                message:"Already Registered please Login",
            })
        }

        // if control comes here means the user is not yet registered i.e it is a new user
        // so first hash the password and then make entry for the new user
        const hashedPassword = await hashPassword(password);

        const user = await new userModel({name , password:hashedPassword , email , phone , address,answer }).save();     // create a new entry in the database

        res.status(201).send({
            success:true,
            message:"User Registered Successfully",
            user
        })

    }
    catch(error){

        console.log(error);
        res.status(500).send({
            success: false,
            message:"Error in Registration",
            error
        })

    }
}

const loginController = async (req, res) => {

    try {
        
        // destructuring the email and password from request body
        const{email , password} = req.body;
        
        // validating the entry
        if( !email || !password ){
            return res.status(404).send({
                success:false,
                message:"Invalid Username or Password"
            })
        }
        // find user on the basis of entered email
        const user = await userModel.findOne({email});
        if( !user ){        // if no user exist
            return res.status(404).send({
                success:false,
                message:"Email not Registered",
            })
        }

        //if control comes here means email is registered , now we need to validate the password entered by the user (whether the entered password is correct or not)
        const match = await comparePassword(password , user.password);
        if( !match ){       // if enetered password does not match
            return res.status(200).send({
                success: false,
                message:"Invalid Password"
            })

        }

        // if controll comes here means the password matches
        // so create a token using json web token(jwt) ( for secure exchange of info )
        const token = await jwt.sign({_id: user._id},  process.env.JWT_SECRET, {
            expiresIn: '7d',
        } );

        res.status(200).send({
            success: true,
            message:"Login Successfull",
            user:{
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                answer: user.answer,
                role: user.role,
            },
            token,
        });

    } 
    catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message:"Error in Login",
            error,
        })
  
    }
}

const forgotPasswordController = async (req, res) => {
    
    try{
        // destructuring the email,question and password
        const {email , answer , newPassword} = req.body;

        // validating the entry
        if( !email ){
            res.status(400).send({
                message:"Email is required",
            })
        }

        if( !answer ){
            res.status(400).send({
                message:"Answer is required",
            })
        }

        if( !newPassword ){
            res.status(400).send({
                message:"New Password is required",
            })
        }

        // control comes here means all entry are non empty.
        // we now try to find a user with the provided email and answer
        const user = await userModel.findOne({email,answer});
        if( !user ){        // incase no user if found correspoding to the entry
            return res.status(404).send({
                success:false,
                message:"Wrong Email or Answer"
            })
        }

        // if control comes here means a valid user has been found with that user and password entry
        // so now we update our old password of that user by the new password
        const hashed = await hashPassword(newPassword);         // hash the new password to secure it
        await userModel.findByIdAndUpdate(user._id, {password:hashed});   // find the user by id and update the password feild by this new value

        res.status(200).send({
            success:true,
            message: "Password updated Successfully"
        });

    }
    catch(error){
        console.log(error);
        res.status(500).send({
            success:false,
            message:"Something went wrong",
            error,
        })
    }
}

const updateProfileController = async (req,res) => {
    try {
        
        const {name, email ,phone, password , address } = req.body;
        const user = await userModel.findById(req.user._id);        // find the user by id

        // check if valid password is entered or not
        if(password && password.length < 6){
            return res.json({error:"Password must be more than 6 charector long"});
        }

        // control comes here means password is valid
        // so hash the password
        const hashedPassword = password ? await hashPassword(password) : undefined;

        const updatedUser = await userModel.findByIdAndUpdate(req.user._id , {
            name: name || user.name,
            phone: phone || user.phone,
            address: address || user.address,
            password: hashedPassword || user.password,

        } , {new:true});

        res.status(200).send({
            success:true,
            message:"Profile Updated Successfully",
            updatedUser,
        })


    } 
    catch (error) {
        console.log(error);
        res.status(400).send({
            success:false,
            message:"Error in updating profile",
            error,
        })    
    }
}

// gets all for a user
const getOrdersController = async (req,res) => {
    try{
        const orders = await orderModel.find({buyer:req.user._id}).populate("products","-photo").populate("buyer","name");
        res.json(orders);
    }
    catch(error){
        console.log(error);
        res.status(500).send({
            success:false,
            message:"Error in getting orders",
            error,
        })
    }
}

// gets all order for all users
const getAllOrdersController = async (req,res) => {
    try{

        const orders = await orderModel.find({}).populate("products","-photo").populate("buyer","name").sort({createdAt: -1});
        res.json(orders);

    }
    catch(error){
        console.log(error);
        res.status(500).send({
            success:false,
            message:"Error in getting all orders",
            error,
        })
    }
}

const updateOrderStatusController = async (req,res) => {
    try {
        const {orderId} = req.params;
        const {status} = req.body;

        const orders = await orderModel.findByIdAndUpdate(orderId , {status} , {new:true});
        res.json(orders);
    } 
    catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:"Error in updating order status",
            error,
        })
    }
}

module.exports = {
    registerController,
    loginController,
    forgotPasswordController,
    updateProfileController,
    getOrdersController,
    getAllOrdersController,
    updateOrderStatusController,
}