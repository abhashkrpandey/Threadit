import LikeDislikeButton from "./LikeDisLikeButton.jsx";
import comment from "../assets/comment.svg";
import circleplus from "../assets/circleplus.svg";
import minus from "../assets/minus.svg";
import DateTime from "./DateTime.jsx";
import Reply from "./Reply.jsx";
import { useState } from "react";
import axios from "axios"
export default function EachComment({ props, postid}) {
  const [hasLiked, sethasLiked] = useState(false);
  const [hasDisLiked, sethasDisLiked] = useState(false);
  const [haveToReply, sethavetoReply] = useState(false);
  const [openReply, setopenReply] = useState(true);
  const [replyArray, setreplyArray] = useState([]);
  function replyBox() {
    if (haveToReply) sethavetoReply(false);
    else sethavetoReply(true);
  }
  async function fetchReply() {
    if (openReply === true) {
      setopenReply(false);
      const response = await axios.post(import.meta.env.VITE_BACKEND_URL + "/fetchreply",
        {
          postid: postid,
          parentid: props._id
        }
      );
      if (response.data.hasFetched) {
        setreplyArray(response.data.commentsArray);
      }
    }
    else {
      setopenReply(true);
      setreplyArray([]);
    }
  }
  return (
    <div className="flex flex-col">
      <div className="flex flex-row" style={{marginLeft:`${props.depth*20}px`}}>  
        <div onClick={fetchReply}>
          <img src={openReply ? circleplus : minus} width={16} height={16}></img>
        </div>
        <div>
          <div className="flex flex-col bg-amber-600">
            <div> r/{props.userid.username}-<DateTime date={props.updatedAt}></DateTime></div>
            <div className="flex flex-col">
              <div>{props.commentText}</div>
            </div>
            <div className="flex flex-row">
              <LikeDislikeButton downvote={props.downvote}
          upvote={props.upvote}  postid={postid}
          hasLiked={props.hasLiked}
          hasdisLiked={props.hasdisLiked}  commentid={props._id}></LikeDislikeButton>
              <div
                className="flex flex-row hover:bg-gray-400 cursor-default "
                onClick={replyBox}
              >
                <button>
                  <img src={comment} width={16} height={16}></img>
                </button>
                Reply
              </div>
            </div>
          </div>
          <div>
            <Reply haveToReply={haveToReply} parentid={props._id} postid={postid}></Reply>
          </div>
        </div>
      </div>
      <div>
        {replyArray.map((reply) => {
          return <EachComment key={reply._id} props={reply} postid={postid} ></EachComment>
        })}
      </div>
    </div>
  );
}
