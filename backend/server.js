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
  const posts = await PostModel.find({ communityId: communityId }).populate("userid","username");
  if (posts) {
    res.json({
        isThereAnyPost:true,
        posts:posts
    })
  } else {
    res.json({
        isThereAnyPost:false
    })
  }
});
app.listen(process.env.BACKEND_PORT, () => {
  console.log(`server running at ${process.env.BACKEND_PORT}`);
});
