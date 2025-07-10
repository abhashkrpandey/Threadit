const mongoose = require("mongoose");
const { ObjectId } = mongoose;

const CommentSchema = new mongoose.Schema(
  {
    postId: { type: ObjectId, ref: "post", required: true },
    userid: { type: ObjectId, ref: "users", required: true },
    commentText: { type: String, required: true },
    parentId: { type: ObjectId, ref: "comment", default: null },
    depth: { type: Number, default: 0 },
    upvote: { type: Number, default: 0 },
    downvote: { type: Number, default: 0 },
    upvoterId: { type: [ObjectId], ref: "users", required: true },
    downvoterId: { type: [ObjectId], ref: "users", required: true },
  },
  { timestamps: true }
);
CommentSchema.virtual("replies", {
  ref: "comment",
  localField: "_id",
  foreignField: "parentId", //“For this comment, find all other comments where their parentId equals my _id.”
  justOne: false,
});

CommentSchema.set("toObject", { virtuals: true });
CommentSchema.set("toJSON", { virtuals: true });

const CommentModel = mongoose.model("comment", CommentSchema);
module.exports = CommentModel;
