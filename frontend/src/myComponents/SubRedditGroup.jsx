import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useDispatch } from "react-redux";
import {addCommunityInArray,removeCommunityInArray } from "../reducers/loginSlice";
export default function SubRedditGroup({ prop }) {
  const [hasjoined,sethasjoined]=useState(false);
  const dispatch= useDispatch();
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
  useEffect(()=>
  {
    if(hasjoined)
    {
      console.log(prop._id);
      dispatch(addCommunityInArray({ value: prop._id }));
    }
    else{
      console.log(prop._id);
      dispatch(removeCommunityInArray({ value: prop._id }));
    }
  },[hasjoined]);
  return (
    <>
  <Card className={"hover:bg-gray-300"} onClick={communityPageOpener}>
  <CardHeader>
    <CardTitle>{prop.subname}</CardTitle>
    <CardDescription>{prop.membersCount}member</CardDescription>
    <CardAction>
      <Button className="bg-blue-600" onClick={joinGroup}>{hasjoined?"Joined":"Join"}</Button>
    </CardAction>
  </CardHeader>
  <CardContent>
    <div className="flex flex-row gap-1">
              {prop.topics.map((topic)=>
              {
                 return <Badge key={topic} variant={"destructive"}>{topic}</Badge>
              })}
          </div>
  </CardContent>
  <CardFooter>
    {prop.subdescription}
  </CardFooter>
</Card>
    </>
  );
}
