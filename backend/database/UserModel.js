const mongoose=require("mongoose");

const UserSchema =new mongoose.Schema({
    username:{type:String,required:true,unique:true},
    userpassword:{type:String,requires:true},
},{timestamps:true});

const UserModel=mongoose.model("users",UserSchema);

module.exports=UserModel;