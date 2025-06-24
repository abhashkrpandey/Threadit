const mongoose = require("mongoose");
const DraftSchema = new mongoose.Schema(
    {
        posttitle: { type: String, required: true },
        userid: { type: String, require: true },
        postbody: { type: String },
        isPublished: { type: String, default: false }
    },
    {
        timestamps: true
    }
)
const DraftModel = mongoose.model("draft", DraftSchema);

module.exports = DraftModel;