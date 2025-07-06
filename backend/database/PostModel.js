const mongoose =require("mongoose");
const {ObjectId} =mongoose;

const PostSchema=new mongoose.Schema(
    {
        posttitle:{type:String,required:true},
        userid:{ type:ObjectId ,ref:"users", required: true },
        postbody:{type:String},
        upvote:{type:Number,default:0},
        upvoterId:{type:[ObjectId],ref:"users",required:true},
        downvoterId:{type:[ObjectId],ref:"users",required:true},
        bookmarkerId:{type:[ObjectId],ref:"users",required:true},
        downvote:{type:Number,default:0},
        bookmarked:{type:Number,default:0},
        reported:{type:Number,default:0},
        communityId:{type:ObjectId,ref:"subreddits",required:true}
    },
    {
        timestamps:true
    }
)
const PostModel =mongoose.model("post",PostSchema);

module.exports=PostModel;