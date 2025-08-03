import BookMark from "../mini-components/BookMark";
import DateTime from "../mini-components/DateTime";
import LikeDisLikeButton from "../mini-components/LikeDisLikeButton";
import comment from "../assets/comment.svg";
import CommentDiv from "../mini-components/CommentDiv";
import socket from "../socket.js";
import { useEffect, useState } from "react";
import { Dot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MessageCircle } from 'lucide-react';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
export default function PostPageComponent(props) {
  console.log(props.post._id);
  const [isOpen, setisOpen] = useState(false);
  function openComment() {
    if (isOpen === false) setisOpen(true);
    else setisOpen(false);
  }
  useEffect(() => {
    if (isOpen === true) {
      socket.emit("joinRoomOfComment", {
        room: props.post._id,
      });
      // console.log("mount");
    }
    return () => {
      socket.emit("leaveRoomOfComment", {
        room: props.post._id,
      });
      // console.log("unmount");
    };
  }, [isOpen, props.post._id]);
  return (
    <div className="flex flex-col">
    <Card className={"border-0 shadow-none"}>
  <CardHeader className={"gap-0"}>
    <CardTitle className={"flex text-muted-foreground text-sm"}>r/{props.post.communityId.subname}<Dot /><DateTime date={props.post.createdAt} />
    </CardTitle>
    <CardTitle className={"flex text-muted-foreground text-sm"}>u/{props.post.userid.username}</CardTitle>
  </CardHeader>
  <CardContent>
    <div className="flex flex-col gap-3">
    <CardTitle className={"text-2xl"}>{props.post.posttitle}</CardTitle>
    <div className="text-muted-foreground text-sm flex-wrap">{props.post.postbody}</div>
    </div>
  </CardContent>
  <CardFooter>
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
          <Button  variant={"outline"} onClick={openComment} className="hover:bg-gray-300">
            <MessageCircle/>
          </Button>
        </div>
      </div>
  </CardFooter>
</Card>
    {/* <div className="flex flex-col">
      <div className="flex flex-col">
      <div className="flex flex-row">
        <div className="font-semibold">r/{props.post.communityId.subname}</div>
        <div className="font-thin">-</div>
        <div className="font-thin">
          <DateTime date={props.post.createdAt}></DateTime>
        </div>
      </div>
        <div>u/{props.post.userid.username}</div>
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
      </div> */}
      {isOpen ? (
        <div className="mt-5">
          <CommentDiv postid={props.post._id} />
        </div>
      ) : (
        <div></div>
      )}
   </div>
  );
}
