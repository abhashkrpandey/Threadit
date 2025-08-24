const mongoose =require("mongoose");
const {ObjectId} =mongoose;

const PostSchema=new mongoose.Schema(
    {
        posttitle:{type:String,required:true},
        userid:{ type:ObjectId ,ref:"users", required: true },
        postbody:{type:String},
        upvote:{type:Number,default:0},
        upvoterId:[{type:ObjectId,ref: "users"}],
        downvoterId:[{type:ObjectId,ref: "users"}],
        bookmarkerId:[{type:ObjectId,ref: "users"}],
        downvote:{type:Number,default:0},
        bookmarked:{type:Number,default:0},
        reported:{type:Number,default:0},
        postImages:{type:[String]},
        communityId:{type:ObjectId,ref:"subreddits",required:true}
    },
    {
        timestamps:true
    }
)
const PostModel =mongoose.model("post",PostSchema);

module.exports=PostModel;