const mongoose = require("mongoose")
require("dotenv").config();

exports.dbconnect = ()=>{
    mongoose.connect(process.env.MONGODB_URL, {
        useNewUrlParser : true,
        useUnifiedTopology : true
    })
    .then(()=>{console.log("Database connetion held successfully")})
    .catch((error)=>{
        console.log("some error occurs in Database Connection");
        console.error(error)
        process.exit(1)
    }
    );
}