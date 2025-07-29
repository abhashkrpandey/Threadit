// import emptylike from "../assets/emptylike.svg";
// import filledlike from "../assets/filledlike.svg";
// import emptydislike from "../assets/emptydislike.svg";
// import filleddislike from "../assets/filleddislike.svg";
import axios from "axios";
// import Swal from "sweetalert2";
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
      // Swal.fire({
      //   title: "already like counted",
      //   icon: "error",
      // });
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
      // Swal.fire({
      //   title: "already disliked",
      //   icon: "error",
      // });
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
        {/* <img
          src={hasLiked ? filledlike : emptylike}
          width={16}
          height={16}
        ></img> */}
        {hasLiked ? <ThumbsUp className="fill-orange-500" /> : <ThumbsUp />}
        {upvoteLive}
      </Button>
      <Button variant={"outline"} onClick={dislikeFunc} className={"hover:bg-gray-300"}>
        {/* <img
          src={hasdisLiked ? filleddislike : emptydislike}
          width={16}
          height={16}
        ></img> */}
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
