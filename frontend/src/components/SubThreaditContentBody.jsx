import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import PostComponent from "./PostComponent";
export default function SubThreaditContentBody() {
  const SubThreaditDetails = useSelector(
    (state) => state.activity.currentActivity.SubThreaditDetails
  );
  const [postArray,setPostArray]=useState([]);
  useEffect(()=>
  {
   async function postCollector()
    {
      const response = await axios.post(import.meta.env.VITE_BACKEND_URL+"/posts",
        {
          communityId:SubThreaditDetails._id
        }
      )
      if(response.data.isThereAnyPost)
      {
        setPostArray(response.data.posts);
      }
    }
    postCollector();
  },[SubThreaditDetails.subname])
  return <>
  <div>
    {postArray.length==0?(
      <div>No Posts Yet</div>
    ):(
          postArray.map((ele)=>(
            // <div key={ele._id.toString()}>
            //   <div className="text-xl">
            // Title:{ele.posttitle}
            //   </div>
            // {ele.postbody}
            // </div>
            <PostComponent key={ele._id.toString()} title={ele.posttitle} 
             postbody={ele.postbody} upvote={ele.upvote} downvote={ele.downvote} 
             bookmarked={ele.bookmarked} username={ele.userid.username}></PostComponent>
          ))

    )}
  </div>
  </>;
}
