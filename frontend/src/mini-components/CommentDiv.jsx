/* eslint-disable no-unused-vars */
import { useState } from "react";
import socket from "../socket.js";
import axios from "axios";
import Swal from "sweetalert2";
import { useEffect } from "react";
import EachComment from "./EachComment";
export default function CommentDiv({ postid }) {
  const [commentText, setCommentText] = useState("");
  const [commentsArray, setcommentArray] = useState([]);
  const [sortType, setsortType] = useState("recent");
  function sortTypeFunc(event) {
    console.log(event.target.value);
    setsortType(event.target.value);
  }
  useEffect(() => {
    socket.connect();
    socket.on("connect", socketIdPrinter);
    socket.on("connect_error", socketError);
    socket.on(`commentAdded${postid}`, commentAdded);
    return () => {
      socket.off("connect", socketIdPrinter);
      socket.off("connect_error", socketError);
      socket.off(`commentAdded${postid}`, commentAdded);
      socket.disconnect();
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
        <div className="bg-gray-500 flex flex-col w-[100%]">
          <textarea
            id="commentArea"
            className="bg-gray-500 focus:outline-none"
            placeholder="Join Conversation"
            onChange={inputter}
          ></textarea>
          <div className="flex flex-row-reverse gap-0.5">
            <button className="bg-blue-600" onClick={addCommentSocket}>
              Comment
            </button>
            <button className="bg-blue-600" onClick={clearText}>
              Cancel
            </button>
          </div>
        </div>
      </div>
      <div className="flex flex-row">
        <div>
          <select defaultValue="recent" onChange={sortTypeFunc}>
            <option value="recent">Recent</option>
            <option value="likes">Most Liked</option>
            <option value="dislike">Most Disliked</option>
          </select>
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
