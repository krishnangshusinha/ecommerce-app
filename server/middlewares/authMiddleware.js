const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");


// this function verifies the token(when a user logs in), and if the token is verified then it allows successfull login of that user
const requireSignIn = (req,res,next) => {
    try{
        const decode = jwt.verify(req.headers.authorization , process.env.JWT_SECRET);      // we verified the token obtained from the requests headers authorization, by using the secret key (JWT_SECRET) that we used to encode the token 
        req.user = decode;   // passing the decode to user(i.e storing the decoded version)

        next();     // calls the next middlewares
    }
    catch(error){
        console.log(error);
    }
}

// this function checks whether your current user is admin or not
const isAdmin = async (req , res , next) => {
    try {
        
        const user = await userModel.findById(req.user._id);


        if( user.role !== 1 ){      // user is not admin
            return res.status(401).send({
                success: false,
                message:"Unauthorized user"
            })
        }
        else{   // user is admin
            next();     // call next middle ware to continue normal execution
        }
        

    } catch (error) {
        console.log(error);
        res.status(401).send({
            success:false,
            error,
            message:"Error in admin middleware"
        })
    }
}

module.exports = {
    requireSignIn,
    isAdmin
}