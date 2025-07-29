import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2Icon } from "lucide-react";
export default function CreatePostContent() {
  const userid = useSelector((state) => state.login.userinfo.userid);
  const [title, settitle] = useState("");
  const [validSubRedditId, setValidSubRedditId] = useState(null);
  const [validSubRedditName, setValidSubRedditName] = useState(null);
  const [subRedditName, setsubreddit] = useState("");
  const [arraySubRedditName, setArrayValidSubRedditName] = useState([]);
  const [postbody, setpostbody] = useState("");
  const [isLoading, setisLoading] = useState(false);
  function communityNameSetter(id, name) {
    setValidSubRedditId(id);
    setValidSubRedditName(name);
    document.getElementById("community_name").value = name;
    setArrayValidSubRedditName([]);
  }
  function postcontent(e) {
    if (e.target.id === "title") {
      settitle(e.target.value);
    } else if (e.target.id === "community_name") {
      setsubreddit(e.target.value);
    } else {
      setpostbody(e.target.value);
    }
  }
  async function postfunc() {
    if (title.length < 4) {
      Swal.fire({
        title: "Title too short",
        icon: "error",
      });
    } else if (validSubRedditName === null) {
      Swal.fire({
        title: "Invalid community name",
        text: "Select a valid community name",
        icon: "warning",
      });
    } else {
      const response = await axios.post(
        import.meta.env.VITE_BACKEND_URL + "/createpost",
        {
          posttitle: title,
          postbody: postbody,
          userid: userid,
          communityId: validSubRedditId,
        }
      );
      if (response.data.created) {
        Swal.fire({
          title: "Post created",
          icon: "success",
          // confirmButtonText: "OK"
        });
        settitle("");
        setpostbody("");
        setValidSubRedditId("");
        setValidSubRedditName("");
        setsubreddit("");
        document.getElementById("community_name").value = "";
        document.getElementById("title").value = "";
        document.getElementById("body").value = "";
      } else {
        Swal.fire({
          title: "Some Error occured",
          icon: "error",
        });
      }
    }
  }
  async function searchCommunityFunc() {
    setisLoading(true);
    const response = await axios.post(
      import.meta.env.VITE_BACKEND_URL + "/searchcommunity",
      {
        subRedditName: subRedditName,
      }
    );
    setisLoading(false);
    if (response.data.found) {
      setArrayValidSubRedditName(response.data.subReddits);
    } else {
      Swal.fire({
        title: "no search found",
        icon: "Error",
      });
    }
  }
  return (
    <>
      <div className=" flex flex-col gap-2">
        <div className="text-2xl">Create Post</div>
        <Button variant={"outline"}>
          Select a Community
          <Button variant={"ghost"}>
            <ChevronDown />
          </Button>
        </Button>
        <div>
          <div className="flex flex-row ">
            <Input
              id="community_name"
              placeholder="select a  community"
              className="bg-gray-300 rounded-sm w-[20vw] h-[5vh] focus:outline-none "
              onChange={postcontent}
              required
            ></Input>
            {arraySubRedditName.length === 0 ? (
              <div></div>
            ) : (
              <ul>
                {arraySubRedditName.map((ele) => {
                  return (
                    <li
                      key={ele._id.toString()}
                      onClick={() =>
                        communityNameSetter(ele._id.toString(), ele.subname)
                      }
                      className="hover:bg-gray-300"
                    >
                      {ele.subname}
                    </li>
                  );
                })}
              </ul>
            )}
            {/* <Button className="bg-amber-600" onClick={searchCommunityFunc}>
              search
            </Button> */}
            {isLoading ? (
              <Button size="sm" disabled>
                <Loader2Icon className="animate-spin" />
                Please wait
              </Button>
            ) : (
              <Button className="bg-amber-600" onClick={searchCommunityFunc}>
                search
              </Button>
            )}
          </div>
        </div>
        
        <div>
          <input
            id="title"
            maxLength={300}
            type="text"
            placeholder="Title"
            className="bg-gray-300 rounded-sm w-[50vw] h-[5vh]"
            onChange={postcontent}
          ></input>
          <div>{title.length}/300</div>
        </div>
        <div>
          <textarea
            id="body"
            placeholder="Body Text(optional)"
            className="bg-gray-300 rounded-sm  w-[50vw]"
            onChange={postcontent}
          ></textarea>
        </div>
        <div className="flex flex-row justify-end gap-2">
          <button className="bg-blue-600">SaveDraft</button>
          <button className="bg-blue-600" onClick={postfunc}>
            Post
          </button>
        </div>
      </div>
    </>
  );
}
