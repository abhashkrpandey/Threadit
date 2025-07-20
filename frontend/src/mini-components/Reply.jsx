/* eslint-disable no-unused-vars */
import axios from "axios";
import { useState } from "react";
import socket from "../socket";
export default function Reply({ haveToReply, parentid, postid }) {
  const [replyText, setreplyText] = useState("");
  function inputter(event) {
    if (event.target.id === "replyArea") {
      setreplyText(event.target.value);
    }
  }
  function clearText() {
    setreplyText("");
    document.getElementById("replyArea").value = "";
  }
  async function addReply() {
    const response = await axios.post(
      import.meta.env.VITE_BACKEND_URL + "/addcomment",
      {
        comment: replyText,
        parentid: parentid,
        postid: postid,
      }
    );
    if (response.data.isCommentAdded) {
      clearText();
    }
  }
  function addReplySocket() {
    socket.emit("addComment", {
      comment: replyText,
      parentid: parentid,
      postid: postid,
      room: parentid,
    });
    clearText();
  }
  return (
    <>
      <div>
        {haveToReply && (
          <div className="bg-gray-500 flex flex-col w-[100%]">
            <textarea
              id="replyArea"
              className="bg-gray-500 focus:outline-none"
              placeholder="Reply"
              onChange={inputter}
            ></textarea>
            <div className="flex flex-row-reverse gap-0.5">
              <button className="bg-blue-600" onClick={addReplySocket}>
                Comment
              </button>
              <button className="bg-blue-600" onClick={clearText}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
