import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router";
import LikeDisLikeButton from "../mini-components/LikeDisLikeButton";
import BookMark from "../mini-components/BookMark";
import DateTime from "../mini-components/DateTime";
import Cookies from "js-cookie";
import { Dot } from "lucide-react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Swal from "sweetalert2";
export default function PostComponent({ props, isInsideSubreddit }) {
  // console.log(props);
  const navigate = useNavigate();
  function postPageOpenFunc() {
    if (Cookies.get("jwttoken") === undefined) {
      Swal.fire({
        title: "You are either not logged/registered",
        icon:"warning"
      });
    } else {
      navigate(`/post/${props._id.toString()}`);
    }
  }
  return (
    <>
      {props._id.toString() !== undefined ? (
        <Card
          onClick={postPageOpenFunc}
          className={"gap-4 hover:bg-gray-200 py-3"}
        >
          <CardHeader>
            {isInsideSubreddit === false ? (
              <CardTitle className={"flex text-muted-foreground text-sm"}>
                r/{props.communityId.subname}
                <Dot />
                <DateTime date={props.createdAt} />
              </CardTitle>
            ) : (
              <CardTitle className={"flex text-muted-foreground text-sm"}>
                {`u/${props.userid.username}`}
                <Dot />
                <DateTime date={props.createdAt} />
              </CardTitle>
            )}
          </CardHeader>
          <CardContent>
            <p className="font-bold">{props.posttitle}</p>
          </CardContent>
          <CardFooter>
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
          </CardFooter>
        </Card>
      ) : (
        <div></div>
      )}
    </>
  );
}
