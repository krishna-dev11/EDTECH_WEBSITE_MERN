const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({

    name:{
        type:String,
    },
    description:{
        type:string
    },
    course:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"courses"
    }
     
});

module.exports = mongoose.model("category" , categorySchema);