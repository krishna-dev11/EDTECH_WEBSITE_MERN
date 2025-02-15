const user = require("../Models/user");
const Tag = require("../Models/tags");
const courses = require("../Models/courses");
const uploadImageToCloudinary = require("../Utilities/uploadImageToCloudinary")

exports.createCourse = async(req , res)=>{
    try{

        const {courseName , courseDescription ,  whatYouWillLearn , price  , tag} = req.body ;

        const thumbnail = req.files.thumbnailImage;

        if(!courseName || !courseDescription || !whatYouWillLearn || !price || !tag  || !thumbnail){
            return res.status(400).json({
                success: false,
                message:"fill add details completely and carefully",
              });
        }

        const userId = req.user.id
        const checkInstructor = await user.findById({_id : userId})
        if(!checkInstructor){
            return res.status(400).json({
                success: false,
                message:"you are not asigned with us as an instructor so the instructor has only rights of creating the course ",
              });
        }

        const checkTag = await  Tag.findOne({tag:tag})
        if(!checkTag){
            return res.status(400).json({
                success: false,
                message:"tag can't find in tags schema",
              });
        }

        const uploadthumbnail = await uploadImageToCloudinary(thumbnail , process.env.CLOUDINARY_FOLDER);

        const newCourse = await courses.create({
            courseName : courseName,
            courseDescription : courseDescription,
            price : price,
            whatYouWillLearn : whatYouWillLearn,
            instructor : checkInstructor._id,
            thumbnail:uploadthumbnail.secure_url,
            tag: checkTag._id
        });

        const updateUserCourseArray = await user.findByIdAndUpdate({_id : checkInstructor._id}, 
            {
                $push:{
                    courses:newCourse._id
                }
            },
            {new:true}
        )

        return res.status(200).json({
            success: true,
            message:"course created successfully",
          });

    }catch(error){
        return res.status(500).json({
            success: false,
            message:"",
          });
    }
}


exports.showAllCourse = async(req , res)=>{
    try{
  
        const allcourses = await courses.find({});

        if(!allcourses){
            return res.status(400).json({
                success: false,
                message:"neither any of the course is present ",
              });
        }

        return res.status(200).json({
            success: true,
            message:"all courses fetched successfully",
          });

    }catch(error){
        return res.status(500).json({
            success: false,
            message:"some error occurs in fetching the all courses",
          }); 
    }
}


exports.getAllDetailsOfOneCourse  = async(req , res)=>{
    try{

        const courseId = req.id

        const allDetails = await courses.findOne({_id:courseId})
                            .populate({
                                path:"instructor"
                                .populate({
                                     path : "additionalDetails"
                                })
                            })
                            .populate({
                                path:"courseContent"
                                .populate({
                                    path:"subSections"
                                })
                            })
                            .populate("ratingAndReviews")
                            .populate("category");

       if(!allDetails){
        return res.status(400).json({
            success:false,
            message:'Course Not Found'
        })
       }                     

       return res.status(400).json({
        success:true,
        message:'all datas of courseId is fethed succcessfully',
        data:allDetails
       })

    }catch(error){
        return res.status(500).json({
            success:false,
            message:'some error occurs in fetching the all related data from the data associated with the  courseId'
        })
    }
}