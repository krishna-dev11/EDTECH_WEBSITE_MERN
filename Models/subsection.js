const mongoose = require("mongoose");

const subSectionSchema = new mongoose.Schema({

     tile:{
        type:String,
        required:true,
        trim:true
     },
     timeDuration:{
        type:String,
        required:true
     },
     description:{
        type:String,
        required:true,
        trim:true
     },
     videoUrl:{
        type:String
     },
     additionalUrl:{
        type:String,
     }

});

module.exports = mongoose.model("subSection" , subSectionSchema);