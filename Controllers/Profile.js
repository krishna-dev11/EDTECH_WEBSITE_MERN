const user = require("../Models/user");

exports.updateProfile = async(req , res)=>{
    try{
      
        const {gender, dateOfBirth="" , about="" , contactNumber} =req.body;

        const userId = req.user.id

        if(!gender || !dateOfBirth || !about || !contactNumber ){
            return res.status(400).json({
                success:false,
                message:"please fills all details carefully"
            })
        }

        const existingUser = await user.findById({_id : userId});
        const additionalDetails = existingUser.additionalDetails
        additionalDetails.gender = gender;
        additionalDetails.dateOfBirth = dateOfBirth;
        additionalDetails.about = about;
        additionalDetails.contactNumber = contactNumber
        await additionalDetails.save();

        return res.status(200).json({
            success:true,
            message:"additional details submitted successfully"
        })   

    }catch(error){
        return res.status(500).json({
            success:false,
            message:"some errors occurs in updating the additional details"
        })
    }
}


exports.getAllUserDetails = async(req , res)=>{
    try{
      
        const userId = req.user.id;

        const getalldetails = await user.findById({_id : userId}).populate("additionalDetails").exec();
 
        if(!getalldetails){
            return res.status(400).json({
                success:false,
                message:"user with these ID is not exist in our databases"
            })  
        }


        return res.status(200).json({
            success:true,
            message:"All Details of user fetched successfully from the databse"
        })   

    }catch(error){
        return res.status(500).json({
            success:false,
            message:"some errors occurs on fetching the All Details of user from the Databases"
        })
    }
}