const cloudinary = require('cloudinary').v2;

exports.uploadImageToCloudinary = async(file , folder , height , quality)=>
{
    try{

        const options = {folder};

        if(quality){
            options.quality = quality;
        }

        if(height){
            options.height = height;
        }

        options.resource_type = "auto";

        await cloudinary.uploader.upload(file.tempFilePath , options);

    }catch(error){
       console.error = error;
    }
}