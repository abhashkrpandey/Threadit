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
const { createServer } = require("http");
const { Server } = require("socket.io");
const { default: mongoose } = require("mongoose");
const CommentModel = require("./database/CommentModel");

const app = express();
dotenv.config();
const allowedOrigins = [
  "http://localhost:5173",
  "https://github.com/login/oauth/authorize",
];

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
  },
});
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
app.post("/validname", async function (req, res) {
  const username = req.body.username;
  try {

    const user = await UserModel.findOne({ username: username });
    if (user === null) {
      res.json({
        isValid: true
      })
    }
    else {
      res.json(
        {
          isValid: false
        }
      )
    }
  }
  catch (err) {
    console.log(err.message);
    res.json(
      {
        message: "Backend Error happened"
      }
    )
  }
})
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
    const subreddit = await SubRedditModel.create({
      subname: subname,
      subdescription: subdescription,
      accessiblity: accessiblity,
      topics: topics,
      creatorId: userid,
    });
    // await subreddit.save();
    await UserModel.updateOne({ _id: userid }, { $push: { communitiesjoined: subreddit._id } });
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
        userJoinedCommunities: user.communitiesjoined
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
        userJoinedCommunities: isThere.communitiesjoined
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
    const userJoined = await UserModel.findOne({ _id: userid }, { communitiesjoined: 1 });
    const hasJoined = userJoined.communitiesjoined.some((id) => id.equals(communityId));
    if (hasJoined === true) {
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
    }
    else {
      res.json({
        message: "you have not joined the community"
      })
    }
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
  const communityList = await UserModel.findOne(
    { _id: userid },
    {
      communitiesjoined: 1,
      _id: 0,
    }
  ).populate("communitiesjoined", "_id subname");
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
app.get("/posts", authenticator, async function (req, res) {
  const pageSize = 5;
  try {
    const communityId = req.query.communityId;
    const userid = req.decoded.userid;
    const pageNumber = parseInt(req.query.pageNumber) || 1;
    const sortType = req.query.sortType;
    let sortObject;
    if (sortType == "recent") {
      sortObject = { createdAt: -1 };
    } else if (sortType == "likes") {
      sortObject = { upvote: -1 };
    } else if (sortType == "dislike") {
      sortObject = { downvote: -1 };
    }
    const userJoinedCommunities = await UserModel.findOne({ _id: userid }, { _id: 0, communitiesjoined: 1 });
    const joinedCommunity = userJoinedCommunities.communitiesjoined.some((id) => id.equals(new mongoose.Types.ObjectId(communityId)));
    console.log(userJoinedCommunities.communitiesjoined);
    console.log(communityId);
    console.log(joinedCommunity);
    const total = await PostModel.countDocuments({ communityId: communityId });
    const totalPages = Math.ceil(total / pageSize);
    const skip = (pageNumber - 1) * pageSize;
    const posts = await PostModel.find(
      { communityId: communityId },
      { postbody: 0 }
    )
      .populate("userid", "username")
      .sort({ ...sortObject, _id: 1 }).skip(skip).limit(pageSize);
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
        totalPages: totalPages,
        posts: modifiedposts,
        hasJoined: joinedCommunity
      });
    } else {
      res.json({
        isThereAnyPost: false,
      });
    }
  }
  catch (err) {
    console.log(err.message);
    res.json({ isThereAnyPost: false });
  }
});
app.post("/like", authenticator, async function (req, res) {
  const userid = new mongoose.Types.ObjectId(req.decoded.userid);
  const postid = new mongoose.Types.ObjectId(req.body.postid);
  const commentID = req.body.commentid;
  if (commentID != null) {
    const commentid = new mongoose.Types.ObjectId(commentID);
    let toggle = false;
    const post = await CommentModel.findOne(
      { _id: commentid },
      { _id: 0, upvoterId: 1, downvoterId: 1 }
    );
    if (post.downvoterId.some((id) => id.equals(userid))) {
      await CommentModel.updateOne(
        { _id: commentid },
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
        await CommentModel.updateOne(
          { _id: commentid },
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
  } else {
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
      await PostModel.updateOne({ _id: postid }, { $inc: { upvote: -1 }, $pull: { upvoterId: userid } });
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
  }
});
app.post("/dislike", authenticator, async function (req, res) {
  const userid = new mongoose.Types.ObjectId(req.decoded.userid);
  const postid = new mongoose.Types.ObjectId(req.body.postid);
  const commentID = req.body.commentid;
  if (commentID != null) {
    const commentid = new mongoose.Types.ObjectId(commentID);
    let toggle = false;
    const post = await CommentModel.findOne(
      { _id: commentid },
      { _id: 0, upvoterId: 1, downvoterId: 1 }
    );
    if (post.upvoterId.some((id) => id.equals(userid))) {
      await CommentModel.updateOne(
        { _id: commentid },
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
        const update = await CommentModel.updateOne(
          { _id: commentid },
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
  } else {
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
      await PostModel.updateOne({ _id: postid }, { $inc: { downvote: -1 }, $pull: { downvoterId: userid } });
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

app.post("/addcomment", authenticator, async function (req, res) {
  const userid = new mongoose.Types.ObjectId(req.decoded.userid);
  const postid = new mongoose.Types.ObjectId(req.body.postid);
  const parentID = req.body.parentid;
  const comment = req.body.comment;
  let depth = 0;
  let parentid;
  // console.log(userid, postid, parentID);
  if (parentID != null) {
    parentid = new mongoose.Types.ObjectId(parentID);
    const depthObject = await CommentModel.findOne(
      { postId: postid, _id: parentid },
      { _id: 0, depth: 1 }
    );
    // console.log(depthObject);
    depth = depthObject.depth + 1;
  }
  const commentAdded = await CommentModel.create({
    userid: userid,
    postId: postid,
    parentId: parentid,
    commentText: comment,
    depth: depth,
  });
  console.log(commentAdded);
  res.json({
    isCommentAdded: true,
    commentText: commentAdded.commentText,
    createdAt: commentAdded.createdAt,
    updatedAt: commentAdded.updatedAt,
  });
});

app.post("/fetchcomments", authenticator, async function (req, res) {
  const postid = req.body.postid;
  const userid = req.decoded.userid;
  const sortType = req.body.sortType;
  let sortObject;
  if (sortType == "recent") {
    sortObject = { createdAt: -1 };
  } else if (sortType == "likes") {
    sortObject = { upvote: -1 };
  } else if (sortType == "dislike") {
    sortObject = { downvote: -1 };
  }
  try {
    const commentsArray = await CommentModel.find({
      postId: postid,
      parentId: null,
    })
      .populate("userid", "username")
      .sort(sortObject)
      .limit(10);
    let modifiedcommentsArray = commentsArray.map((ele) => {
      let obj = ele.toObject();
      const hasLiked = obj.upvoterId.some((id) => id.equals(userid));
      const hasdisLiked = obj.downvoterId.some((id) => id.equals(userid));

      delete obj.downvoterId;
      delete obj.upvoterId;

      obj.hasLiked = hasLiked;
      obj.hasdisLiked = hasdisLiked;
      return obj;
    });
    res.json({
      hasFetched: true,
      commentsArray: modifiedcommentsArray,
    });
  } catch (err) {
    res.json({
      hasFetched: false,
    });
  }
});

app.get("/feed", async function (req, res) {
  const pageSize = 5;
  const pageNumber = parseInt(req.query.pageNumber) || 1;
  console.log(pageNumber);
  try {
    const communityIds = await SubRedditModel.find()
      .sort({ postCount: -1 })
      .limit(10);
    const sortType = req.query.sortType;
    let sortObject;
    if (sortType == "recent") {
      sortObject = { createdAt: -1 };
    } else if (sortType == "likes") {
      sortObject = { upvote: -1 };
    } else if (sortType == "dislike") {
      sortObject = { downvote: -1 };
    }
    const total = await PostModel.countDocuments({ communityId: { $in: communityIds } });
    const totalPages = Math.ceil(total / pageSize);
    const skip = (pageNumber - 1) * pageSize;
    const postsArray = await PostModel.find({ communityId: { $in: communityIds } }).populate("userid", "username").populate("communityId", "subname").sort({ ...sortObject, _id: 1 }).skip(skip).limit(pageSize);
    const modifiedposts = postsArray.map((ele) => {
      let obj = ele.toObject();
      delete obj.upvoterId;
      delete obj.downvoterId;
      delete obj.bookmarkerId;
      return obj;
    })
    if (sortType === "recent") {
      modifiedposts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    else if (sortType == "likes") {
      modifiedposts.sort((a, b) => b.upvote - a.upvote);
    }
    else if (sortType == "dislike") {
      modifiedposts.sort((a, b) => b.downvote - a.downvote);

    }
    res.json({
      isAbleToLoad: true,
      postsArray: modifiedposts,
      totalPages: totalPages
    });
  } catch (err) {
    console.log(err.message);
    res.json({ isAbleToLoad: false });
  }
});
app.get("/feedauthenticated", authenticator, async function (req, res) {
  const pageSize = 5;
  const pageNumber = parseInt(req.query.pageNumber) || 1;
  try {
    const userid = req.decoded.userid;
    const sortType = req.query.sortType;
    console.log(sortType);
    let sortObject;
    if (sortType == "recent") {
      sortObject = { createdAt: -1 };
    } else if (sortType == "likes") {
      sortObject = { upvote: -1 };
    } else if (sortType == "dislike") {
      sortObject = { downvote: -1 };
    }
    let mergedCommunity = new Set();
    const followedCommunity = await UserModel.findOne({ _id: userid }, { communitiesjoined: 1, _id: 0 });
    const communityIds = await SubRedditModel.find({}, { _id: 1 })
      .sort({ postCount: -1 })
      .limit(10);
    // console.log(followedCommunity + "follow");
    // console.log(communityIds + " trending");
    followedCommunity.communitiesjoined.map((ele) => {
      mergedCommunity.add(ele.toString());
    })
    communityIds.map((ele) => {
      if (!mergedCommunity.has(ele._id.toString())) {
        mergedCommunity.add(ele);
      }
    })
    let mergedCommunityArray = [];
    for (const item of mergedCommunity) {
      // console.log(item);
      mergedCommunityArray.push(new mongoose.Types.ObjectId(item));
    }

    const total = await PostModel.countDocuments({ communityId: { $in: mergedCommunityArray } });
    const totalPages = Math.ceil(total / pageSize);
    const skip = (pageNumber - 1) * pageSize;
    const postsArray = await PostModel.find({ communityId: { $in: mergedCommunityArray } }).populate("userid", "username").populate("communityId", "subname").sort({ ...sortObject, _id: 1 }).skip(skip).limit(pageSize);
    const modifiedposts = postsArray.map((ele) => {
      let obj = ele.toObject();

      const hasLiked = obj.upvoterId.some((id) => id.equals(userid));
      const hasdisLiked = obj.downvoterId.some((id) => id.equals(userid));
      const hasbookmarked = obj.bookmarkerId.some((id) => id.equals(userid));

      obj.hasLiked = hasLiked;
      obj.hasdisLiked = hasdisLiked;
      obj.hasbookmarked = hasbookmarked;

      delete obj.upvoterId;
      delete obj.downvoterId;
      delete obj.bookmarkerId;

      return obj;
    })
    res.json(
      {
        isAbleToLoad: true,
        totalPages: totalPages,
        postsArray: modifiedposts,
      }
    )
  } catch (err) {
    console.log(err.message);
    res.json({ isAbleToLoad: false });
  }
});

app.get("/subredditsgroups", authenticator, async function (req, res) {
  const userid = req.decoded.userid;
  // try {
  const subredditsArray = await SubRedditModel.find(
    {},
    { subname: 1, subdescription: 1, membersCount: 1, topics: 1 }
  );
  const alreadyjoined = await UserModel.findOne({ _id: userid }, { communitiesjoined: 1, _id: 0 });
  let joinedSet;
  if (alreadyjoined.communitiesjoined.length != 0) {
    joinedSet = new Set(alreadyjoined.communitiesjoined.map(id => id.toString()));
  }

  modifiedsubredditsArray = subredditsArray.filter((sub) => {
    if (joinedSet === undefined || !joinedSet.has(sub._id.toString()))
      return true;
  })

  res.json({
    subredditsArray: modifiedsubredditsArray
  })
  // }
  // catch (err) {
  //   res.json({
  //     message: "Error occured"
  //   })
  // }
})

app.post("/fetchreply", authenticator, async function (req, res) {
  const postid = req.body.postid;
  const parentid = req.body.parentid;
  const userid = req.decoded.userid;
  try {
    const commentsArray = await CommentModel.find({
      postId: postid,
      parentId: parentid,
    }).populate("userid", "username");
    let modifiedcommentsArray = commentsArray.map((ele) => {
      let obj = ele.toObject();
      const hasLiked = obj.upvoterId.some((id) => id.equals(userid));
      const hasdisLiked = obj.downvoterId.some((id) => id.equals(userid));

      delete obj.downvoterId;
      delete obj.upvoterId;

      obj.hasLiked = hasLiked;
      obj.hasdisLiked = hasdisLiked;
      return obj;
    });
    res.json({
      hasFetched: true,
      commentsArray: modifiedcommentsArray,
    });
  } catch (err) {
    res.json({
      hasFetched: false,
      commentsArray: modifiedcommentsArray,
    });
  }
});

app.post("/joingroup", authenticator, async function (req, res) {
  try {
    const userid = req.decoded.userid;
    const communityid = req.body.communityid;
    const community = await UserModel.findOne({ _id: userid }, { communitiesjoined: 1, _id: 0 });
    let found = community.communitiesjoined.some((community) => community.equals(communityid));

    if (found) {
      await UserModel.updateOne({ _id: userid }, { $pull: { communitiesjoined: communityid } });
      res.json({
        joined: false
      })
    }
    else {
      await UserModel.updateOne({ _id: userid }, { $push: { communitiesjoined: communityid } });
      res.json({
        joined: true
      })
    }
  }
  catch (err) {
    res.json({
      message: "Error occured"
    })
  }
})

app.post("/uservalid", authenticator, async function (req, res) {
  const username = req.body.username;
  try {
    const usernameInDB = await UserModel.findOne({ username: username }, { username: 1, _id: 1 });
    let userinfo = {};
    if (usernameInDB.username) {
      const likes = await PostModel.find({ upvoterId: { $in: [usernameInDB._id] } },
        {
          communityId: 1, createdAt: 1, updatedAt: 1, posttitle: 1, _id: 1
        }
      ).populate("communityId", "subname _id");
      if (likes.length > 0) {
        userinfo.likes = likes;
      }
      const dislikes = await PostModel.find({ downvoterId: { $in: [usernameInDB._id] } },
        {
          communityId: 1, createdAt: 1, updatedAt: 1, posttitle: 1, _id: 1
        }
      ).populate("communityId", "subname _id");
      if (dislikes.length > 0) {
        userinfo.dislikes = dislikes;
      }
      const bookmarks = await PostModel.find({ bookmarkerId: { $in: [usernameInDB._id] } },
        {
          communityId: 1, createdAt: 1, updatedAt: 1, posttitle: 1, _id: 1
        }
      ).populate("communityId", "subname _id");
      if (bookmarks.length > 0) {
        userinfo.bookmarks = bookmarks;
      }
      const posts = await PostModel.find({ userid: usernameInDB._id },
        {
          communityId: 1, createdAt: 1, updatedAt: 1, posttitle: 1, _id: 1
        }
      ).populate("communityId", "subname _id");
      if (posts.length > 0) {
        userinfo.posts = posts;
      }
      userinfo.userid = usernameInDB._id;
      userinfo.username = usernameInDB.username;
      res.json({
        isValidUser: true,
        userinfo: userinfo
      })
    }
    else {
      res.json({
        isValidUser: false
      })
    }
  }
  catch (err) {
    res.json(
      {
        message: "some error occured"
      }
    )
  }
})
io.use((socket, next) => {
  const token = socket.handshake.auth.token;

  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      return next(new Error("Authentication error"));
    }
    socket.user = decoded;
    next();
  });
});

io.on("connection", (socket) => {
  console.log(socket.id);
  socket.on("addComment", async function (commentArgs) {
    const userid = new mongoose.Types.ObjectId(socket.user.userid);
    const postid = new mongoose.Types.ObjectId(commentArgs.postid);
    const parentID = commentArgs.parentid;
    const comment = commentArgs.comment;
    let depth = 0;
    let parentid;
    if (parentID != null) {
      parentid = new mongoose.Types.ObjectId(parentID);
      const depthObject = await CommentModel.findOne(
        { postId: postid, _id: parentid },
        { _id: 0, depth: 1 }
      );
      // console.log(depthObject);
      depth = depthObject.depth + 1;
    }
    const commentAdded = await CommentModel.create({
      userid: userid,
      postId: postid,
      parentId: parentid,
      commentText: comment,
      depth: depth,
    });
    console.log(commentAdded);
    io.to(commentArgs.room).emit(
      `commentAdded${commentArgs.room}`,
      commentAdded
    );
  });
  socket.on("joinRoomOfComment", (args) => {
    socket.join(args.room);
    // console.log(socket.id+"joined"+args.room);
  });
  socket.on("leaveRoomOfComment", (args) => {
    socket.leave(args.room);
    // console.log(socket.id+"left"+args.room);
  });
});
httpServer.listen(process.env.BACKEND_PORT, () => {
  console.log(`server running at ${process.env.BACKEND_PORT}`);
});
