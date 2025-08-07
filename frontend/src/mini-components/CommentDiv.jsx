/* eslint-disable no-unused-vars */
import { useState } from "react";
import socket from "../socket.js";
import axios from "axios";
import Swal from "sweetalert2";
import { useEffect } from "react";
import EachComment from "./EachComment";
import { Textarea } from "@/components/ui/textarea.jsx";
import { Button } from "@/components/ui/button.jsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
export default function CommentDiv({ postid }) {
  const [commentText, setCommentText] = useState("");
  const [commentsArray, setcommentArray] = useState([]);
  const [sortType, setsortType] = useState("recent");
  function sortTypeFunc(event) {
    // console.log(event);
    setsortType(event);
  }
  useEffect(() => {
    socket.on("connect", socketIdPrinter);
    socket.on("connect_error", socketError);
    socket.on(`commentAdded${postid}`, commentAdded);
    return () => {
      socket.off("connect", socketIdPrinter);
      socket.off("connect_error", socketError);
      socket.off(`commentAdded${postid}`, commentAdded);
    };
  }, []);
  const commentAdded = (args) => {
    setcommentArray((prev) => [...prev, args]);
    clearText();
  };
  const socketError = (err) => {
    console.log(err.message);
  };
  function socketIdPrinter() {
    console.log(socket.id);
  }
  function inputter(event) {
    if (event.target.id === "commentArea") {
      setCommentText(event.target.value);
    }
  }
  function clearText() {
    setCommentText("");
    document.getElementById("commentArea").value = "";
  }
  async function commentFetcher() {
    const response = await axios.post(
      import.meta.env.VITE_BACKEND_URL + "/fetchcomments",
      {
        postid: postid,
        sortType:sortType
      },
      {
           headers: {
            Authorization: `Bearer ${localStorage.getItem("jwttoken")}`,
          }
        }
    );
    if (response.data.hasFetched) {
      setcommentArray(response.data.commentsArray);
    }
  }
  useEffect(() => {
    commentFetcher();
  }, [sortType]);
  async function addComment() {
    const response = await axios.post(
      import.meta.env.VITE_BACKEND_URL + "/addcomment",
      {
        comment: commentText,
        postid: postid,
        parentid: null,
      },
      {
           headers: {
            Authorization: `Bearer ${localStorage.getItem("jwttoken")}`,
          }
        }
    );
    if (response.data.isCommentAdded) {
      clearText();
    } else {
      Swal.fire({
        title: "Comment not added",
        icon: "error",
      });
    }
  }
  function addCommentSocket() {
    socket.emit("addComment", {
      comment: commentText,
      postid: postid,
      parentid: null,
      room: postid,
    });
  }
  return (
    <>
      <div className="flex flex-row">
        <div className=" flex flex-col w-[100%]">
          <Textarea
            id="commentArea"
            placeholder="Join Conversation"
            onChange={inputter}
          ></Textarea>
          <div className="flex flex-row-reverse gap-0.5">
            <Button className="bg-blue-600" onClick={addCommentSocket}>
              Comment
            </Button>
            <Button className="bg-blue-600" onClick={clearText}>
              Cancel
            </Button>
          </div>
        </div>
      </div>
      <div className="flex flex-row">
        <div>
         <Select defaultValue="recent" onValueChange={sortTypeFunc}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Recent</SelectItem>
              <SelectItem value="likes">Most Liked</SelectItem>
              <SelectItem value="dislike">Most Disliked</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col  gap-2">
          {commentsArray.map((comment) => {
            return (
              <EachComment
                key={comment._id}
                props={comment}
                postid={postid}
              ></EachComment>
            );
          })}
        </div>
      </div>
    </>
  );
}
