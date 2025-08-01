import LikeDislikeButton from "./LikeDisLikeButton.jsx";
import DateTime from "./DateTime.jsx";
import Reply from "./Reply.jsx";
import socket from "../socket";
import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import { Dot } from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import { MessageCircle } from 'lucide-react';
import { CirclePlus } from 'lucide-react';
import { CircleMinus } from 'lucide-react';
export default function EachComment({ props, postid }) {
  const [haveToReply, sethavetoReply] = useState(false);
  const [openReply, setopenReply] = useState(true);
  const [replyArray, setreplyArray] = useState([]);
  useEffect(() => {
    socket.on(`commentAdded${props._id}`, replyComment);
    return () => {
      socket.off(`commentAdded${props._id}`, replyComment);
    };
  }, []);
  useEffect(() => {
    if (openReply === false) {
      socket.emit("joinRoomOfComment", {
        room: props._id,
      });
      // console.log("mount");

    }
    return () => {
      socket.emit("leaveRoomOfComment", {
        room: props._id,
      });
      // console.log("unmount");
    };
  }, [openReply, props._id]);
  const replyComment = (args) => {
    setreplyArray((prev) => [...prev, args]);
  };
  function replyBox() {
    if (haveToReply) sethavetoReply(false);
    else sethavetoReply(true);
  }
  async function fetchReply() {
    if (openReply === true) {
      setopenReply(false);
      const response = await axios.post(
        import.meta.env.VITE_BACKEND_URL + "/fetchreply",
        {
          postid: postid,
          parentid: props._id,
        }
      );
      if (response.data.hasFetched) {
        setreplyArray(response.data.commentsArray);
      }
    } else {
      setopenReply(true);
      setreplyArray([]);
    }
  }
  return (
<div className="flex flex-col">
  <div
    className="flex gap-3 items-start"
    style={{ marginLeft: `${props.depth * 20}px` }}
  >
    <div onClick={fetchReply} className="cursor-pointer mt-2">
      <Button variant={"secondary"} className={"hover:bg-gray-500"}>{openReply ? <CirclePlus/> : <CircleMinus/>}</Button>
    </div>

    <div className="flex-1">
      <div className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 p-4 rounded-xl shadow transition hover:shadow-md">
        <div className="text-sm text-gray-700 dark:text-gray-300 font-semibold mb-2  flex flex-row">
          r/{props.userid.username}
          <div className="font-normal ml-1 text-xs text-gray-500 dark:text-gray-400 flex flex-row">
            <Dot/><DateTime date={props.updatedAt} />
          </div>
        </div>

        <div className="text-gray-800 dark:text-gray-100 mb-3 whitespace-pre-wrap">
          {props.commentText}
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
          <LikeDislikeButton
            downvote={props.downvote}
            upvote={props.upvote}
            postid={postid}
            hasLiked={props.hasLiked}
            hasdisLiked={props.hasdisLiked}
            commentid={props._id}
          />

          <Button
            onClick={replyBox} variant={"outline"}
            className="flex items-center gap-1 px-2 py-1 rounded-md hover:bg-gray-100 dark:hover:bg-neutral-700 transition"
          >
            <MessageCircle/>
            <span>Reply</span>
          </Button>
        </div>

        {haveToReply && (
          <div className="mt-3">
            <Reply
              haveToReply={haveToReply}
              parentid={props._id}
              postid={postid}
            />
          </div>
        )}
      </div>
    </div>
  </div>

  <div className="mt-3">
    {replyArray.map((reply) => (
      <EachComment key={reply._id} props={reply} postid={postid} />
    ))}
  </div>
</div>


  );
}
