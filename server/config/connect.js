const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://krishnangshusinha15:l5wPAlfJySo8aCrR@ecommerce.wvwoyx2.mongodb.net/?retryWrites=true&w=majority&appName=ecommerce")
.then(()=> console.log("MongoDB connected successfully".bgMagenta.white))
.catch(() => console.log("Error in connecting database..."))