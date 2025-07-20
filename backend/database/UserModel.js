const mongoose=require("mongoose");
const { ObjectId } = mongoose;
const UserSchema =new mongoose.Schema({
    username:{type:String,required:true,unique:true},
    userpassword:{type:String,requires:true},
    communitiesjoined:[{type:ObjectId,ref: "subreddits"}],
},{timestamps:true});

const UserModel=mongoose.model("users",UserSchema);

module.exports=UserModel;