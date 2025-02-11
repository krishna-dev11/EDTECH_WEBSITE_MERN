const mongoose = require("mongoose");

const tagSchema = new mongoose.Schema({

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

module.exports = mongoose.model("tags" , tagSchema);