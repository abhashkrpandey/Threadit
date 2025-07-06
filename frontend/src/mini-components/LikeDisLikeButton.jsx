import emptylike from "../assets/emptylike.svg";
import filledlike from "../assets/filledlike.svg";
import emptydislike from "../assets/emptydislike.svg";
import filleddislike from "../assets/filleddislike.svg";
import axios from "axios";
import Swal from "sweetalert2";
import { useState } from "react";
export default function LikeDisLikeButton(props) {
  const [hasLiked, sethasLiked] = useState(props.hasLiked);
  const [upvoteLive, setupvoteLive] = useState(Number(props.upvote));
  const [downvoteLive, setdownvoteLive] = useState(Number(props.downvote));
  const [hasdisLiked, sethasdisLiked] = useState(props.hasdisLiked);
  async function likeFunc(event) {
    event.stopPropagation();
    const response = await axios.post(
      import.meta.env.VITE_BACKEND_URL + "/likepost",
      {
        postid: props.postid,
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
    } else {
      Swal.fire({
        title: "already like counted",
        icon: "error",
      });
    }
  }
  async function dislikeFunc(event) {
    event.stopPropagation();
    const response = await axios.post(
      import.meta.env.VITE_BACKEND_URL + "/dislikepost",
      {
        postid: props.postid,
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
    } else {
      Swal.fire({
        title: "already disliked",
        icon: "error",
      });
    }
  }
  return (
    <div className="flex flex-row">
      <button className="flex flex-row hover:bg-gray-600" onClick={likeFunc}>
        <img
          src={hasLiked ? filledlike : emptylike}
          width={16}
          height={16}
        ></img>
        {upvoteLive}
      </button>
      <button className="flex flex-row hover:bg-gray-600" onClick={dislikeFunc}>
        <img
          src={hasdisLiked ? filleddislike : emptydislike}
          width={16}
          height={16}
        ></img>
        {downvoteLive}
      </button>
    </div>
  );
}
