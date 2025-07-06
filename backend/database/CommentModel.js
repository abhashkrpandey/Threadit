const mongoose = require("mongoose");
const { ObjectId } = mongoose;

const CommentSchema = new mongoose.Schema(
  {
    postId: { type: ObjectId, ref: "post", required: true },
    userid: { type: ObjectId, ref: "users", required: true },
    commentText: { type: String, required: true },
    parentId: { type: ObjectId, ref: "comment", default: null },
    depth: { type: Number, default: 0 },
  },
  { timestamps: true }
);
CommentSchema.virtual("replies", {
  ref: "Comment",
  localField: "_id",
  foreignField: "parentId",
  justOne: false,
});

CommentSchema.set("toObject", { virtuals: true });
CommentSchema.set("toJSON", { virtuals: true });

const CommentModel =mongoose.model("comment",CommentSchema);
module.exports=CommentModel;
