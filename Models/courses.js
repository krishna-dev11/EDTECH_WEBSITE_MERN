const mongoose = require("mongoose");

const coursesSchema = new mongoose.Schema({

    courseName:{      
        type:String,
        required:true
    },
    courseDescription:{
        type:String,
        required:true
    },
    instructor:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    },
    whatYouWillLearn:{
        type:String,
        required:true
    },
    courseContent:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"section"
    }],
    ratingAndReviews:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"ratingAndReviews"
    }],
    price:{
       type:String,
    },
    thumbnail:{
        type:String,
        required:true
    },
    tag:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"tags"
    },
    studentEnrolled:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    }]

});

module.exports = mongoose.model("courses" , coursesSchema);