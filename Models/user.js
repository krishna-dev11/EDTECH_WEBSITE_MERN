const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

    firstName:{
        type:String,
        required:true,
        trim:true
    },
    lastName:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        trim:true
    },
    password:{
        type:String,
        required:true,
        trim:true
    },
    accountType:{
        type:String,
        required:true,
        enum:["Admin" , "Instructor" , "Student"]
    },
    active:{
        type:Boolean
    },
    approved:{
        type:Boolean
    },
    courses:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"courses"
    }],
    additionalDetails:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"profile"
    },
    coursesProgress:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"courseprogress"
    }],
    imageUrl:{
        type:String,
        required:true
    }

});

module.exports = mongoose.model("user" , userSchema);