import Navbar from "../myComponents/Navbar";
import Left from "../myComponents/Left";
import Right from "../myComponents/Right";
import SubRedditGroup from "../myComponents/SubRedditGroup";
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
export default function Explore() {
  const navigate =useNavigate();
  const [subredditgroupsArray, setsubredditgroupsArray] = useState([]);
  useEffect(() => {
    async function subredditFetcher() {
      const response = await axios.get(
        import.meta.env.VITE_BACKEND_URL + "/subredditsgroups"
      );
      if (response.data.subredditsArray) {
        setsubredditgroupsArray(response.data.subredditsArray);
      } else if (response.data.message === "Error occured") {
        setsubredditgroupsArray([]);
      }
    }
    subredditFetcher();
  }, []);
  return (
    <>
      <div>
        <Navbar></Navbar>
      </div>
      <div className="flex flex-row">
        <Left />
        <div className="flex flex-col ml-50 w-[70%]">
          <div className="text-3xl font-bold">Explore Communities</div>
          <div className="grid grid-cols-3 mt-10">
            {
              subredditgroupsArray.length>0?
             ( subredditgroupsArray.map((sub)=>
              {
                 return  <SubRedditGroup key={sub._id} prop={sub}></SubRedditGroup>
              })
            ):(
              <div>
                  No Communities available!!
                  <div>
                      <Button onClick={()=>{navigate("/createsub")}}>Create a Community of your choice</Button>
                  </div>
              </div>
            )
            }
          </div>
        </div>
      </div>
    </>
  );
}
