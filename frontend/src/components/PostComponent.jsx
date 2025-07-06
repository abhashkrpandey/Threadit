import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router";
import LikeDisLikeButton from "../mini-components/LikeDisLikeButton";
import BookMark from "../mini-components/BookMark";
export default function PostComponent({ props }) {
  const navigate = useNavigate();
  function postPageOpenFunc() {
    navigate(`/post/${props._id.toString()}`);
  }
  return (
    <>
      <div
        className="flex flex-col hover:bg-gray-400"
        onClick={postPageOpenFunc}
      >
        <div>Title:{props.posttitle}</div>
        <div>Post by :{`/u/${props.userid.username}`}</div>
        <div className="flex flex-row">
          <LikeDisLikeButton
            postid={props._id}
            hasLiked={props.hasLiked}
            hasdisLiked={props.hasdisLiked}
            downvote={props.downvote}
            upvote={props.upvote}
          ></LikeDisLikeButton>
          <BookMark
            postid={props._id}
            bookmarkCount={props.bookmarked}
            hasbookmarked={props.hasbookmarked}
          ></BookMark>
        </div>
      </div>
    </>
  );
}
