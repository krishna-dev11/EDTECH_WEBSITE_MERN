const mongoose = require("mongoose")
require("dotenv").config();

exports.dbconnect = ()=>{
    mongoose.connect(process.env.DATABASE_URL , {
        useNewUrlParser : true,
        useUnifiedTopology : true
    })
    .then(()=>{console.log("Database connetion held successfully")})
    .catch(()=>{
        console.log("some error occurs in Database Connection"),
        process.exit(1)
    }
    );
}