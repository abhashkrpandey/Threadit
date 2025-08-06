const cloudinary = require("cloudinary").v2;
const dotenv = require("dotenv");
const fs = require("fs");
dotenv.config();

cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_CLOUD_API_KEY, 
        api_secret: process.env.CLOUDINARY_CLOUD_API_SECRET
    });


async function  uploadOnCloudinary(localpath,foldername)
{
    try{
        if(!localpath)
        return null ;
  const response=  await cloudinary.uploader.upload(
           localpath, {
               resource_type:"auto",
               folder:foldername
           },
       )
       fs.unlinkSync(localpath);
       console.log("cloud-response"+response.url);
       return response.url;
    }catch(err)
    {
        console.log(err);
        fs.unlinkSync(localpath);
        return null;
    }
}

module.exports =uploadOnCloudinary;