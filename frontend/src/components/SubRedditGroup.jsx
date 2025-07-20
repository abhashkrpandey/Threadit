import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
export default function SubRedditGroup({ prop }) {
  const [hasjoined,sethasjoined]=useState(false);
  const navigate =useNavigate();
  async function communityPageOpener()
  {
    navigate(`/t/${prop.subname}`);
  }
 async function joinGroup(event)
  {
        event.stopPropagation();
        const response =await axios.post(import.meta.env.VITE_BACKEND_URL+"/joingroup",{
          communityid:prop._id
        })
        if(response.data.joined)
        {
          sethasjoined(true);
        }
        else if(response.data.joined===false)
        {
          sethasjoined(false);
        }
        else if(response.data.message)
        {
          Swal.fire({
            title:response.data.message,
            icon:"error"
          })
        }
  }
  return (
    <div className="w-80 flex flex-col border-gray-500 border-1 rounded-xl hover:bg-gray-300" onClick={communityPageOpener}>
      <div className="flex flex-row justify-between">
        <div className="flex flex-col">
          <div className="font-bold">{prop.subname}</div>
          <div className="font-light text-gray-500 text-[14px]">
            {prop.membersCount}member
          </div>
          <div className="flex flex-row gap-1">
              {prop.topics.map((topic)=>
              {
                 return <span key={topic} className=" border-gray-500 border-1 rounded-xl text-[14px] text-gray-500  hover:bg-gray-400">{topic}</span>
              })}
          </div>
        </div>
        <button className="bg-blue-600 rounded-xl w-10 m-2" onClick={joinGroup}>{hasjoined?"Joined":"Join"}</button>
      </div>
      <div className="font-normal text-gray-500">{prop.subdescription}</div>
    </div>
  );
}
