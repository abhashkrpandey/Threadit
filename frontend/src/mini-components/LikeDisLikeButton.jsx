
import axios from "axios";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown, LucideThumbsUp } from "lucide-react";
export default function LikeDisLikeButton(props) {
  const [hasLiked, sethasLiked] = useState(props.hasLiked);
  const [upvoteLive, setupvoteLive] = useState(Number(props.upvote));
  const [downvoteLive, setdownvoteLive] = useState(Number(props.downvote));
  const [hasdisLiked, sethasdisLiked] = useState(props.hasdisLiked);
  async function likeFunc(event) {
    event.stopPropagation();
    const response = await axios.post(
      import.meta.env.VITE_BACKEND_URL + "/like",
      {
        postid: props.postid,
        commentid: props.commentid,
      },
      {
          withCredentials:true
        }
    );
    console.log(response.data.toogle);
    if (response.data.likeCounted && response.data.toggle == false) {
      setupvoteLive(upvoteLive + 1);
      sethasLiked(true);
    } else if (response.data.likeCounted && response.data.toggle) {
      setupvoteLive(upvoteLive + 1);
      setdownvoteLive(downvoteLive - 1);
      sethasLiked(true);
      sethasdisLiked(false);
    } else if(response.data.likeCounted==false && response.data.message=="Already liked") {
      sethasLiked(false);
      setupvoteLive(upvoteLive-1);
    }
  }
  async function dislikeFunc(event) {
    event.stopPropagation();
    const response = await axios.post(
      import.meta.env.VITE_BACKEND_URL + "/dislike",
      {
        postid: props.postid,
        commentid: props.commentid,
      },{
          withCredentials:true
        }
    );
    if (response.data.dislikeCounted && response.data.toggle == false) {
      setdownvoteLive(downvoteLive + 1);
      sethasdisLiked(true);
    } else if (response.data.dislikeCounted && response.data.toggle == true) {
      setdownvoteLive(downvoteLive + 1);
      setupvoteLive(upvoteLive - 1);
      sethasdisLiked(true);
      sethasLiked(false);
    } else if(response.data.dislikeCounted==false && response.data.message=="Already disliked"){
      sethasdisLiked(false);
      setdownvoteLive(downvoteLive-1);
    }
  }
  return (
    <div className="flex flex-row">
      <Button
        variant={"outline"}
        onClick={likeFunc}
        className={"hover:bg-gray-300"}
      >
        {hasLiked ? <ThumbsUp className="fill-orange-500" /> : <ThumbsUp />}
        {upvoteLive}
      </Button>
      <Button variant={"outline"} onClick={dislikeFunc} className={"hover:bg-gray-300"}>
        {hasdisLiked ? (
          <ThumbsDown className="fill-orange-500" />
        ) : (
          <ThumbsDown />
        )}
        {downvoteLive}
      </Button>
    </div>
  );
}
