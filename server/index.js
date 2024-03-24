/*
    npm init            --> to initialize package.json
    npm i express       --> to instal express
    npm i colors        --> makes our console colorfull ( just for fun )
    npm i nodemon       --> installs nodemon
    npm i dotenv        --> in order to use .env file
    npm i morgan        --> installs morgan . Morgan npm gives you tokens like the client's user agent, the requested url, and the response time, among other things. 
    npm i bcrypt        --> used to hash the password so that it is secure
    npm i jsonwebtoken  --> used to securely transfer information over the web(between two parties) 
    npm i cors          --> used to prevent Cross Origin errors when the frontend and backedn connects with each other
    npm i slugify       --> converts white space or "/" in the url to "-" so   "/package/orders"  converts to  "/package-orders"  or  "package orders"   converts to "package-order"
    npm i express-formidable    --> used for easy uploading and accessing of photos of products
    npm i braintre              --> for integrating the payment gateway
*/
/*
    Username --> krishnangshusinha15
    Password --> l5wPAlfJySo8aCrR

    mongodb+srv://krishnangshusinha15:l5wPAlfJySo8aCrR@ecommerce.wvwoyx2.mongodb.net/?retryWrites=true&w=majority&appName=ecommerce

*/


const express = require("express");
const app = express();
const colors = require("colors");
const dotenv = require("dotenv");
const morgan = require("morgan");
const authRoutes = require("./routes/authRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoutes");
const cors = require("cors");

// configuring dotenv package
dotenv.config();


// database connecting
require("./config/connect");

// configuring morgan and mounting middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'))

//routes
app.use("/api/v1/auth" , authRoutes);                       // route for authentication. This is a naming convention for url (must follow)
app.use("/api/v1/category" , categoryRoutes);               // route for category.
app.use("/api/v1/product" , productRoutes);                 // route for products


app.get('/', (req,res)=>{

} )

const port = process.env.PORT || 3001;
app.listen((port) , ()=> {
    console.log(`Server listening at port ${port}`.bgCyan.white)    // makes our this console state having background color as cyan and text as white 
})