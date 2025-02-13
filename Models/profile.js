const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({

    gender:{   
        type:String,   
        required:true
    },
    dateOfBirth:{
        type:String,
        required:true
    },
    about:{
        type:String,
        required:true
    },
    contactNumber:{
        type:Number,
        required:true
    }

});

module.exports = mongoose.model("profile" , profileSchema);