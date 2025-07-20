import Navbar from "../components/Navbar";
import Left from "../components/Left";
import Right from "../components/Right";
import SubRedditGroup from "../components/SubRedditGroup";
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
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
        <div className="flex flex-col">
          <div className="text-3xl font-bold">Explore Communities</div>
          <div>
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
                      <button className="hover:bg-amber-400" onClick={()=>{navigate("/createsub")}}>Create a Community of your choice</button>
                  </div>
              </div>
            )
            }
          </div>
        </div>
        <Right />
      </div>
    </>
  );
}
