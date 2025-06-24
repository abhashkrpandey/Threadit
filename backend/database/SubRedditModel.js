const mongoose = require("mongoose");
const {ObjectId} =mongoose;

const SubRedditSchema = new mongoose.Schema({
    subname: { type: String, required: true },
    subdescription: { type: String, require: true },
    accessiblity: { type: String, required: true },
    topics: { type: [String], required: true },
    creatorId: { type:ObjectId ,ref:"users", required: true },
    membersCount: { type: Number, default: 1 }
}, { timestamps: true });

const SubRedditModel =  mongoose.model("subreddits", SubRedditSchema);

module.exports = SubRedditModel;