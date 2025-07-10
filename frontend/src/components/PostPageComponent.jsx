import BookMark from "../mini-components/BookMark";
import DateTime from "../mini-components/DateTime";
import LikeDisLikeButton from "../mini-components/LikeDisLikeButton";
import comment from "../assets/comment.svg";
import CommentDiv from "../mini-components/CommentDiv";
import { useState } from "react";
export default function PostPageComponent(props) {
  const [isOpen, setisOpen] = useState(false);
  function openComment() {
    if (isOpen === false) setisOpen(true);
    else setisOpen(false);
  }
  return (
    <div className="flex flex-col">
      <div className="flex flex-row">
        <div className="font-semibold">r/{props.post.communityId.subname}</div>
        <div className="font-thin">-</div>
        <div className="font-thin">
          <DateTime date={props.post.createdAt}></DateTime>
        </div>
      </div>
      <div className="font-bold text-3xl">{props.post.posttitle}</div>
      <div className="font-normal mt-3">{props.post.postbody}</div>
      <div className="flex flex-row gap-2">
        <LikeDisLikeButton
          postid={props.post._id}
          hasLiked={props.post.hasLiked}
          hasdisLiked={props.post.hasdisLiked}
          downvote={props.post.downvote}
          upvote={props.post.upvote}
        ></LikeDisLikeButton>
        <BookMark
          postid={props.post._id}
          bookmarkCount={props.post.bookmarked}
          hasbookmarked={props.post.hasbookmarked}
        ></BookMark>
        <div className="flex flex-row">
          <button onClick={openComment} className="hover:bg-gray-600">
            <img src={comment} width={16} height={16}></img>
          </button>
        </div>
        </div>
        {isOpen ? (
            <div>
              <CommentDiv postid={props.post._id} />
            </div>
          ) : (
            <div></div>
          )}
    </div>
  );
}
