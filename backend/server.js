const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const authenticator = require("./middlewares/Authentication");
const cookieparser = require("cookie-parser");
const UserModel = require("./database/UserModel");
const PostModel = require("./database/PostModel");
const DraftModel = require("./database/DraftModel");
const SubRedditModel = require("./database/SubRedditModel");
const { default: mongoose } = require("mongoose");

const app = express();
dotenv.config();
const allowedOrigins = [
  "http://localhost:5173",
  "https://github.com/login/oauth/authorize",
];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
  })
);
app.use(cookieparser());
app.use(express.json());
mongoose.connect(process.env.MONGOURL);
app.post("/authenticator", authenticator, (req, res) => {
  res.json({
    isLoggedIn: true,
    username: req.decoded.username,
    userid: req.decoded.userid,
  });
});
app.post("/createsub", authenticator, async function (req, res) {
  const subname = req.body.subname;
  const subdescription = req.body.subdescription;
  const accessiblity = req.body.accessiblity;
  const topics = req.body.topics;
  const userid = new mongoose.Types.ObjectId(req.body.userid);

  const isThere = await SubRedditModel.findOne({ subname: subname });
  if (isThere) {
    res.json({
      created: false,
    });
  } else {
    const subreddit = new SubRedditModel({
      subname: subname,
      subdescription: subdescription,
      accessiblity: accessiblity,
      topics: topics,
      creatorId: userid,
    });
    await subreddit.save();
    res.json({
      created: true,
    });
  }
});
app.post("/register", async function (req, res) {
  const username = req.body.username;
  const userpassword = req.body.userpassword;
  const isThere = await UserModel.findOne({ username: username });
  if (isThere === null) {
    const user = new UserModel({
      username: username,
      userpassword: userpassword,
    });
    await user.save();
    const userid = user._id.toString();
    const token = jwt.sign({ username, userid }, process.env.SECRET_KEY);
    if (token) {
      res.cookie("jwttoken", token, {
        maxAge: 86400000,
        sameSite: "None",
        secure: true,
      });
      res.json({
        isLoggedIn: true,
        username: username,
        userid: userid,
      });
    } else {
      console.log("Internal Error");
      res.status(500).json({
        isLoggedIn: false,
      });
    }
  } else {
    res.json({
      isLoggedIn: false,
    });
  }
  console.log(username, userpassword);
});
app.post("/login", async function (req, res) {
  const username = req.body.username;
  const userpassword = req.body.userpassword;
  const isThere = await UserModel.findOne({
    username: username,
    userpassword: userpassword,
  });
  if (isThere === null) {
    res.json({
      isLoggedIn: false,
    });
  } else {
    const userid = isThere._id.toString();
    const token = jwt.sign(
      { username: isThere.username, userid: userid },
      process.env.SECRET_KEY
    );
    if (token) {
      res.cookie("jwttoken", token, {
        maxAge: 86400000,
        sameSite: "None",
        secure: true,
      });
      res.json({
        isLoggedIn: true,
        username: isThere.username,
        userid: userid,
      });
    } else {
      res.status(500).json({
        isLoggedIn: false,
      });
    }
  }
});
app.post("/createpost", authenticator, async function (req, res) {
  const userid = new mongoose.Types.ObjectId(req.body.userid);
  const posttitle = req.body.posttitle;
  const postbody = req.body.postbody;
  const communityId = req.body.communityId;
  try {
    const post = new PostModel({
      userid: userid,
      posttitle: posttitle,
      postbody: postbody,
      communityId: communityId,
    });
    await post.save();
    res.json({
      created: true,
    });
  } catch (err) {
    res.json({
      created: false,
    });
  }
});
app.post("/searchcommunity", authenticator, async function (req, res) {
  const subRedditName = req.body.subRedditName;
  try {
    const subReddits = await SubRedditModel.find(
      {
        subname: { $regex: subRedditName, $options: "i" },
      },
      {
        _id: 1,
        subname: 1,
        accessiblity: 1,
        membersCount: 1,
      }
    );
    res.json({
      found: true,
      subReddits: subReddits,
    });
  } catch (err) {
    res.json({
      found: false,
    });
  }
});
app.post("/mycommunitylist", authenticator, async function (req, res) {
  const userid = new mongoose.Types.ObjectId(req.decoded.userid);
  const communityList = await SubRedditModel.find(
    { creatorId: userid },
    {
      subname: 1,
      _id: 1,
    }
  );
  if (communityList) {
    res.json({ communityList, isPresent: true });
  } else {
    res.json({
      isPresent: false,
    });
  }
});
app.post("/validpathchecker", authenticator, async function (req, res) {
  const subname = req.body.subname;
  const community = await SubRedditModel.findOne({ subname: subname });
  if (community) {
    res.json({ isValid: true, community: community });
  } else {
    res.json({
      isValid: false,
    });
  }
});
app.post("/posts", authenticator, async function (req, res) {
  const communityId = req.body.communityId;
  const userid = req.decoded.userid;
  const posts = await PostModel.find(
    { communityId: communityId },
    { postbody: 0 }
  ).populate("userid", "username");
  if (posts) {
    const modifiedposts = posts.map((ele) => {
      let obj = ele.toObject();
      const hasLiked = obj.upvoterId.some((id) => id.equals(userid));
      const hasdisLiked = obj.downvoterId.some((id) => id.equals(userid));
      const hasbookmarked = obj.bookmarkerId.some((id) => id.equals(userid));

      delete obj.upvoterId;
      delete obj.downvoterId;
      delete obj.bookmarkerId;

      obj.hasLiked = hasLiked;
      obj.hasdisLiked = hasdisLiked;
      obj.hasbookmarked = hasbookmarked;
      return obj;
    });
    res.json({
      isThereAnyPost: true,
      posts: modifiedposts,
    });
  } else {
    res.json({
      isThereAnyPost: false,
    });
  }
});
app.post("/likepost", authenticator, async function (req, res) {
  const userid = new mongoose.Types.ObjectId(req.decoded.userid);
  const postid = new mongoose.Types.ObjectId(req.body.postid);
  let toggle = false;
  const post = await PostModel.findOne(
    { _id: postid },
    { _id: 0, upvoterId: 1, downvoterId: 1 }
  );
  if (post.downvoterId.some((id) => id.equals(userid))) {
    await PostModel.updateOne(
      { _id: postid },
      { $inc: { downvote: -1 }, $pull: { downvoterId: userid } }
    );
    toggle = true;
  }
  if (post.upvoterId.some((id) => id.equals(userid))) {
    res.json({
      likeCounted: false,
      message: "Already liked",
    });
  } else {
    try {
      await PostModel.updateOne(
        { _id: postid },
        { $inc: { upvote: 1 }, $push: { upvoterId: userid } }
      );
      res.json({
        likeCounted: true,
        message: "like counted",
        toggle: toggle,
      });
    } catch (err) {
      res.json({
        likeCounted: false,
        message: "some error",
      });
    }
  }
});
app.post("/dislikepost", authenticator, async function (req, res) {
  const userid = new mongoose.Types.ObjectId(req.decoded.userid);
  const postid = new mongoose.Types.ObjectId(req.body.postid);
  let toggle = false;
  const post = await PostModel.findOne(
    { _id: postid },
    { _id: 0, upvoterId: 1, downvoterId: 1 }
  );
  if (post.upvoterId.some((id) => id.equals(userid))) {
    await PostModel.updateOne(
      { _id: postid },
      { $inc: { upvote: -1 }, $pull: { upvoterId: userid } }
    );
    toggle = true;
  }
  console.log(post);
  if (post.downvoterId.some((id) => id.equals(userid))) {
    res.json({
      dislikeCounted: false,
      message: "Already disliked",
    });
  } else {
    try {
      const update = await PostModel.updateOne(
        { _id: postid },
        { $inc: { downvote: 1 }, $push: { downvoterId: userid } }
      );
      res.json({
        dislikeCounted: true,
        message: "dislike counted",
        toggle: toggle,
      });
    } catch (err) {
      res.json({
        dislikeCounted: false,
        message: "some error",
      });
    }
  }
});
app.post("/bookmarkpost", authenticator, async function (req, res) {
  const userid = new mongoose.Types.ObjectId(req.decoded.userid);
  const postid = new mongoose.Types.ObjectId(req.body.postid);
  const post = await PostModel.findOne(
    { _id: postid },
    { _id: 0, bookmarkerId: 1 }
  );
  console.log(post);
  if (post.bookmarkerId.some((id) => id.equals(userid))) {
    const update = await PostModel.updateOne(
      { _id: postid },
      { $inc: { bookmarked: -1 }, $pull: { bookmarkerId: userid } }
    );
    res.json({
      isbookmarked: false,
      message: "bookmarked removed",
    });
  } else {
    try {
      const update = await PostModel.updateOne(
        { _id: postid },
        { $inc: { bookmarked: 1 }, $push: { bookmarkerId: userid } }
      );
      res.json({
        isbookmarked: true,
        message: "bookmarked counted",
      });
    } catch (err) {
      res.json({
        bookmarkCounted: false,
        message: "some error",
      });
    }
  }
});

app.post("/validpost", authenticator, async function (req, res) {
  const postid = new mongoose.Types.ObjectId(req.body.postid);
  const userid = req.decoded.userid;
  try {
    const post = await PostModel.findOne({ _id: postid })
      .populate("userid", "username")
      .populate("communityId", "subname");

    const modifiedPostObject = post.toObject();
    const hasLiked = modifiedPostObject.upvoterId.some((id) =>
      id.equals(userid)
    );
    const hasdisLiked = modifiedPostObject.downvoterId.some((id) =>
      id.equals(userid)
    );
    const hasbookmarked = modifiedPostObject.bookmarkerId.some((id) =>
      id.equals(userid)
    );

    delete modifiedPostObject.upvoterId;
    delete modifiedPostObject.downvoterId;
    delete modifiedPostObject.bookmarkerId;

    modifiedPostObject.hasLiked = hasLiked;
    modifiedPostObject.hasdisLiked = hasdisLiked;
    modifiedPostObject.hasbookmarked = hasbookmarked;

    res.json({ post: modifiedPostObject, isValidPost: true });
  } catch (err) {
    res.json({ isValidPost: false });
  }
});
app.listen(process.env.BACKEND_PORT, () => {
  console.log(`server running at ${process.env.BACKEND_PORT}`);
});
