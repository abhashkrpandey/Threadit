const mongoose=require("mongoose");
const { ObjectId } = mongoose;
const UserSchema =new mongoose.Schema({
    username:{type:String,required:true,unique:true},
    userpassword:{type:String,requires:true},
    communitiesjoined:[{type:ObjectId,ref: "subreddits"}],
    useravatar:{type:String}
},{timestamps:true});

const UserModel=mongoose.model("users",UserSchema);

module.exports=UserModel;