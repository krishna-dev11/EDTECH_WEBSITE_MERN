const section = require("../Models/section");
const subsection = require("../Models/subsection");
const { uploadImageToCloudinary , deleteVideoTOCloudinary , updateVideoTOCloudinary } = require("../Utilities/uploadImageToCloudinary");


exports.createSubSection = async(req , res)=>{
    try{

        const {subSectionName , description , sectionId} = req.body;
        
        const lecturevideo = req.files.lectureVideo; 

        if(!subSectionName || !description || !lecturevideo){
            return res.status(404).json({
                success:false,
                message:"please provide all details carefully and completely"
            })
        }

        const uploadcloudinary = await uploadImageToCloudinary(lecturevideo , process.env.CLOUDINARY_FOLDER)

        const createsubsection = await subsection.create({
            title :subSectionName,
            timeDuration : uploadcloudinary.duration,
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
            message:"subsection created successfully",
            data : updatedsection
        })


    }catch(error){
        return res.status(500).json({
            success:false,
            message:"some error occurs on creating a subsection"
        })
    }
}



// ye mene likha hai


// exports.updateSubSection = async(req , res)=>{
//     try{

//         const {subSectionId , subSectionName , description , timeDuration} = req.body;

//         const lecturevideo = req.files.lectureVideo;

//         if(!subSectionName || !timeDuration || !description || !lecturevideo ){
//             return res.status(400).json({
//                 success:false,
//                 message:"please provide all details carefully and completely"
//             })
//         }

//         const existingSubSection = await subsection.findById(subSectionId);
//         if (!existingSubSection) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Subsection not found with the given ID",
//             });
//         }


//         if(subSectionName !== undefined){
//             existingSubSection.title = subSectionName
//         }

//         if(description !== undefined){
//             existingSubSection.description = description
//         }

//         // ye mene likha hai so check it
//         let public_id = "";
//         if (existingSubSection.videoUrl) {
//             const urlParts = existingSubSection.videoUrl.split("/");
//             public_id = urlParts[urlParts.length - 1].split(".")[0]; // `.mp4` हटाने के लिए
//         }

//         const updatecloudinaryvideo = await updateVideoTOCloudinary(lecturevideo.tempFilePath  ,process.env.CLOUDINARY_FOLDER , public_id , 720 , "auto")


//         const updatedsubsection = await subsection.findByIdAndUpdate({_id : subSectionId},
//             {
//                 title:subSectionName,
//                 timeDuration:timeDuration,
//                 description:description,
//                 videoUrl : updatecloudinaryvideo.secure_url
//             }
//         )

//         if(!updatedsubsection){
//             return res.status(400).json({
//                 success:false,
//                 message:"subsection is not present with these subsectionId"
//             })
//         }

//         return res.status(200).json({
//             success:true,
//             message:"subsection updated successfully"
//         })


//     }catch(error){
//         return res.status(500).json({
//             success:false,
//             message:"some error occurs on updating a subsection"
//         })
//     }
// }


exports.updateSubSection = async (req, res) => {
    try {
      const { sectionId, title, description } = req.body
      const subSection = await subsection.findById(sectionId)
  
      if (!subSection) {
        return res.status(404).json({
          success: false,
          message: "SubSection not found",
        })
      }
  
      if (title !== undefined) {
        subSection.title = title
      }
  
      if (description !== undefined) {
        subSection.description = description
      }

      if (req.files && req.files.lectureVideo !== undefined) {
        const lecturevideo = req.files.lectureVideo
        const uploadDetails = await uploadImageToCloudinary(
            lecturevideo,
          process.env.CLOUDINARY_FOLDER
        )
        subSection.videoUrl = uploadDetails.secure_url
        subSection.timeDuration = `${uploadDetails.duration}`
      }
  
      await subSection.save()
  
      return res.json({
        success: true,
        message: "Section updated successfully",
      })
    } catch (error) {
      console.error(error)
      return res.status(500).json({
        success: false,
        message: "An error occurred while updating the section",
      })
    }
  }


// ye mene likha hai
// exports.deleteSubSection = async(req , res)=>{
//     try{

//         const { subSectionId  ,  sectionId} = req.body;

//         if( !subSectionId ){
//             return res.status(400).json({
//                 success:false,
//                 message:"please provide all details carefully and completely"
//             })
//         }

//         const existingSubSection = await subsection.findById(subSectionId);
//         if (!existingSubSection) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Subsection not found with the given ID",
//             });
//         }


//         let public_id = ""
//         if(existingSubSection.videoUrl){
//             const urlParts = existingSubSection.videoUrl.split("/");
//             public_id = urlParts[urlParts.length - 1].split(".")[0];
//         }
//         const deletecloudinaryvideo = await deleteVideoTOCloudinary(public_id);

//         const deletesubsectioninDatabase = await subsection.findByIdAndDelete({_id:subSectionId})

        
//         await section.findByIdAndDelete({_id : sectionId},
//             {
//                 $pull : {
//                     subSections : subSectionId
//                 }
//             },
//             {new : true}
//         )

//         return res.status(200).json({
//             success:true,
//             message:"subsection updated successfully"
//         })


//     }catch(error){
//         return res.status(500).json({
//             success:false,
//             message:"some error occurs on updating a subsection"
//         })
//     }
// }

exports.deleteSubSection = async (req, res) => {
    try {
      const { subSectionId, sectionId } = req.body
      await section.findByIdAndUpdate(
        { _id: sectionId },
        {
          $pull: {
            subSections : subSectionId,
          },
        }
      )
      const subSection = await subsection.findByIdAndDelete({ _id: subSectionId })
  
      if (!subSection) {
        return res
          .status(404)
          .json({ success: false, message: "SubSection not found" })
      }
  
      return res.json({
        success: true,
        message: "SubSection deleted successfully",
      })
    } catch (error) {
      console.error(error)
      return res.status(500).json({
        success: false,
        message: "An error occurred while deleting the SubSection",
      })
    }
  }


  