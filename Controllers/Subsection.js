const section = require("../Models/section");
const subsection = require("../Models/subsection");
const { uploadImageToCloudinary , deleteVideoTOCloudinary , updateVideoTOCloudinary } = require("../Utilities/uploadImageToCloudinary");


exports.createSubSection = async(req , res)=>{
    try{

        const {subSectionName , timeDuration , description , sectionId} = req.body;
        
        const lecturevideo = req.files.lectureVideo; 

        if(!subSectionName || !timeDuration || !description || !lecturevideo){
            return res.status(400).json({
                success:false,
                message:"please provide all details carefully and completely"
            })
        }

        const uploadcloudinary = await uploadImageToCloudinary(lecturevideo.tempFilePath , process.env.CLOUDINARY_FOLDER)

        const createsubsection = await subsection.create({
            title :subSectionName,
            timeDuration : timeDuration,
            description : description ,
            videoUrl : uploadcloudinary.secure_url
        })


        const updatedsection = await section.findByIdAndUpdate({_id : sectionId},
            {
                $push:{
                    subSections : createsubsection._id
                }
            },
            {new:true}
        ).populate("subSection").exec();
        
        if(!updatedsection){
            return res.status(400).json({
                success:false,
                message:"section is not available for update with these sectionId in section database"
            })
        }

        
        return res.status(200).json({
            success:true,
            message:"subsection created successfully"
        })


    }catch(error){
        return res.status(500).json({
            success:false,
            message:"some error occurs on creating a subsection"
        })
    }
}



// ye mene likha hai
exports.updateSubSection = async(req , res)=>{
    try{

        const {subSectionId , subSectionName , description , timeDuration} = req.body;

        const lecturevideo = req.files.lectureVideo;

        if(!subSectionName || !timeDuration || !description || !lecturevideo ){
            return res.status(400).json({
                success:false,
                message:"please provide all details carefully and completely"
            })
        }

        const existingSubSection = await subsection.findById(subSectionId);
        if (!existingSubSection) {
            return res.status(400).json({
                success: false,
                message: "Subsection not found with the given ID",
            });
        }

        // ye mene likha hai so check it
        let public_id = "";
        if (existingSubSection.videoUrl) {
            const urlParts = existingSubSection.videoUrl.split("/");
            public_id = urlParts[urlParts.length - 1].split(".")[0]; // `.mp4` हटाने के लिए
        }

        const updatecloudinaryvideo = await updateVideoTOCloudinary(lecturevideo.tempFilePath  ,process.env.CLOUDINARY_FOLDER , public_id , 720 , "auto")


        const updatedsubsection = await subsection.findByIdAndUpdate({_id : subSectionId},
            {
                title:subSectionName,
                timeDuration:timeDuration,
                description:description,
                videoUrl : updatecloudinaryvideo.secure_url
            }
        )

        if(!updatedsubsection){
            return res.status(400).json({
                success:false,
                message:"subsection is not present with these subsectionId"
            })
        }

        return res.status(200).json({
            success:true,
            message:"subsection updated successfully"
        })


    }catch(error){
        return res.status(500).json({
            success:false,
            message:"some error occurs on updating a subsection"
        })
    }
}


// ye mene likha hai
exports.deleteSubSection = async(req , res)=>{
    try{

        const { subSectionId  ,  sectionId} = req.body;

        if( !subSectionId ){
            return res.status(400).json({
                success:false,
                message:"please provide all details carefully and completely"
            })
        }

        const existingSubSection = await subsection.findById(subSectionId);
        if (!existingSubSection) {
            return res.status(400).json({
                success: false,
                message: "Subsection not found with the given ID",
            });
        }


        let public_id = ""
        if(existingSubSection.videoUrl){
            const urlParts = existingSubSection.videoUrl.split("/");
            public_id = urlParts[urlParts.length - 1].split(".")[0];
        }
        const deletecloudinaryvideo = await deleteVideoTOCloudinary(public_id);

        const deletesubsectioninDatabase = await subsection.findByIdAndDelete({_id:subSectionId})

        
        await section.findByIdAndDelete({_id : sectionId},
            {
                $pull : {
                    subSections : subSectionId
                }
            },
            {new : true}
        )

        return res.status(200).json({
            success:true,
            message:"subsection updated successfully"
        })


    }catch(error){
        return res.status(500).json({
            success:false,
            message:"some error occurs on updating a subsection"
        })
    }
}

