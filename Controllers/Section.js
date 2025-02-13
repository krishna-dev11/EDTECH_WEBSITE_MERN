const courses = require("../Models/courses");
const section = require("../Models/section");
// const user = require("../Models/user");

exports.createSection = async(req , res)=>{
    try{

        const{sectionName , courseId} = req.body;

        if(!sectionName ){
            return res.status(400).json({
                success:false,
                message : "plaease enter section name carefully"
            })
        }

        const newsection = await section.create({sectionName : sectionName})

        const updateCourse = await courses.findByIdAndUpdate({_id : courseId},
            {
                $push : {
                   courseContent : newsection._id
                }
            }
        ).populate("courseContent").exec();

        if(updateCourse){
            return res.status(400).json({
                success:false,
                message:"course with these course Id is not present"
            }) 
        }

        return res.status(200).json({
            success:true,
            message:"section created successfully"
        })

    }catch(error){
        return res.status(500).json({
            success:false,
            message:"some error occurs on creating the section"
        })
    }
}


exports.updateSection = async(req , res)=>{
    try{

        const {sectionName , sectionId} = req.body;

        if(!section){
            return res.status(400).json({
                success:false,
                message:"please enter a section name carefully"
            })
        }

        const updatedSection = await section.findByIdAndUpdate({_id : sectionId},
            {
                sectionName:sectionName
            },
            {new:true}
        )

        if(!updatedSection){
            return res.status(400).json({
                success:false,
                message:"section with these section Id is not present in section schema"
            }) 
        }

        return res.status(200).json({
            success:true,
            message:"section Updated successfully"
        })


    }catch(error){
        return res.status(200).json({
            success:false,
            message:"some error occurs on updating a section"
        })
    }
}


exports.deleteSection = async(req , res)=>{
    try{

        const {sectionId , courseId} = req.body;

        const deletedSection = await section.findByIdAndDelete({_id : sectionId});

        // ye bhi mene hi likh hai so check it 
        await courses.findByIdAndUpdate({_id : courseId},
            {
                $pull:{
                    courseContent : sectionId
                }
            },
            {new:true}
        )

        if(!deletedSection){
            return res.status(400).json({
                success:false,
                message:"section with these section Id is not present in section schema"
            }) 
        }
        
        return res.status(200).json({
            success:true,
            message:"section deleted successfully"
        })


    }catch(error){
        return res.status(500).json({
            success:false,
            message:"some error occurs on deleting a section"
        })
    }
}