/* eslint-disable no-unused-vars */
import axios from "axios";
import { useState } from "react";
import socket from "../socket";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
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
      },{
           headers: {
            Authorization: `Bearer ${localStorage.getItem("jwttoken")}`,
          }
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
          <div className=" flex flex-col w-[100%]">
            <Textarea
              id="replyArea"
              placeholder="Reply"
              onChange={inputter}
            ></Textarea>
            <div className="flex flex-row-reverse gap-0.5">
              <Button className="bg-blue-600" onClick={addReplySocket}>
                Comment
              </Button>
              <Button className="bg-blue-600" onClick={clearText}>
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
