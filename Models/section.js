const mongoose = require("mongoose");

const sectionSchema = new mongoose.Schema({

    sectionName:{
        type:String,
        required:true,
        trim:true
    },
    subSections:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"subsection"
    }]

});

module.exports = mongoose.model("section" , sectionSchema);