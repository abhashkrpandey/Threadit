import Navbar from "../myComponents/Navbar";
import Left from "../myComponents/Left";
import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import  Cookies from "js-cookie";

export default function CreateSubThreadit() {
  const userid = useSelector((state) => state.login.userinfo.userid);
  const [subname, setsubname] = useState("");
  const [subdescription, setsubdescription] = useState("");
  const [accessiblity, setaccessiblity] = useState("public");
  const [topics, settopics] = useState([]);
  const [warning, setwarning] = useState("");
  const navigate = useNavigate();
  const topicsArray = [
    { _id: "1", title: "Technology", value: "technology" },
    { _id: "2", title: "Gaming", value: "gaming" },
    { _id: "3", title: "News", value: "news" },
    { _id: "4", title: "Art", value: "art" },
    { _id: "5", title: "Music", value: "music" },
    { _id: "6", title: "Education", value: "education" },
    { _id: "7", title: "Programming", value: "programming" },
    { _id: "8", title: "Science", value: "science" },
    { _id: "9", title: "Fitness", value: "fitness" },
    { _id: "10", title: "Books", value: "books" },
    { _id: "11", title: "Movies", value: "movies" },
    { _id: "12", title: "Photography", value: "photography" },
    { _id: "13", title: "Business", value: "business" },
    { _id: "14", title: "Finance", value: "finance" },
    { _id: "15", title: "Fashion", value: "fashion" },
    { _id: "16", title: "Food", value: "food" },
    { _id: "17", title: "Travel", value: "travel" },
    { _id: "18", title: "History", value: "history" },
    { _id: "19", title: "Anime", value: "anime" },
    { _id: "20", title: "Memes", value: "memes" },
  ];

  function inputter(e) {
    let valueDerived = e.target.dataset.value;
    let idDerivred = e.target.id;
    console.log(idDerivred);
    if (e.target.id === "subname") {
      setsubname(e.target.value);
    } else if (e.target.id === "subdescription") {
      setsubdescription(e.target.value);
    } else if (e.target.name === "accessiblity") {
      setaccessiblity(e.target.value);
    } else {
      if (topics.length < 3) {
        if (!topics.includes(valueDerived)) {
          settopics([...topics, valueDerived]);
          console.log();
          document.getElementById(idDerivred).classList.add("bg-gray-400");
        } else if (topics.includes(valueDerived)) {
          let newtopics = topics.filter((ele) => ele !== valueDerived);
          document.getElementById(idDerivred).classList.remove("bg-gray-400");
          settopics(newtopics);
          setwarning("");
        }
      } else {
        if (!topics.includes(valueDerived)) {
          setwarning("Can't add more than three tags");
        } else if (topics.includes(valueDerived)) {
          let newtopics = topics.filter((ele) => ele !== valueDerived);
          settopics(newtopics);
          document.getElementById(idDerivred).classList.remove("bg-gray-400");
          if (topics.length == 3) {
            setwarning("");
          }
        }
      }
    }
  }
  async function createCommFunc(e) {
    e.preventDefault();
    if (
      subname.length < 3 ||
      subdescription.length < 10 ||
      topics.length === 0
    ) {
      Swal.fire({
        title: "Invalid Input",
        text: "Properly fill  the details",
        icon: "error",
      });
    }else if(Cookies.get("jwtToken")===undefined)
      {
        Swal.fire({
          title:"You are either not  logged/registered",
          icon:"error"
        })
      } 
    else {
      const response = await axios.post(
        import.meta.env.VITE_BACKEND_URL + "/createsub",
        {
          subname: subname,
          subdescription: subdescription,
          accessiblity: accessiblity,
          topics: topics,
          userid: userid,
        }
      );
      if (response.data.created) {
        Swal.fire({
          title: "Congratulations",
          text: "Subreddit created",
          icon: "success",
        });
        navigate(`/t/${subname}`);
      } else {
        Swal.fire({
          title: "Error Occured",
          text: "Properly fill  the details",
          icon: "error",
        });
      }
    }
  }
  return (
    <>
      <div>
        <Navbar></Navbar>
      </div>
      <div className="flex flex-row ">
        <Left />
        <div className="flex flex-col gap-2 w-[70%]">
          <div className="text-2xl">Create Community</div>
          <Input
            required
            id="subname"
            maxLength={20}
            className="bg-gray-300 rounded-sm w-[50vw] h-[5vh]"
            placeholder="Unique Subreddit Name"
            onChange={inputter}
          ></Input>
          <Input
            required
            id="subdescription"
            maxLength={150}
            className="bg-gray-300 rounded-sm w-[50vw] h-[5vh]"
            placeholder="Description"
            onChange={inputter}
          ></Input>
          <div className="flex flex-col">
            <div className="text-xl">what kind of community is this?</div>
            <label className="hover:bg-gray-300 flex flex-row justify-between">
              Public
              <input
                type="radio"
                name="accessiblity"
                id="public"
                value="public"
                defaultChecked
                onChange={inputter}
              ></input>
            </label>
            <label className="hover:bg-gray-300 flex flex-row justify-between">
              Restricted
              <input
                type="radio"
                name="accessiblity"
                id="restricted"
                value="restricted"
                onChange={inputter}
              ></input>
            </label>
            <label className="hover:bg-gray-300 flex flex-row justify-between">
              Private
              <input
                type="radio"
                name="accessiblity"
                id="private"
                value="private"
                onChange={inputter}
              ></input>
            </label>
          </div>
          <div className="flex flex-col">
            <div className="text-xl">
              Select topics Related To this community
            </div>
            <div className=" grid grid-cols-7 w-200">
              {topicsArray.map((topic) => {
                return (
                  <div
                    key={topic._id}
                    data-value={topic.value}
                    id={topic._id}
                    className="hover:bg-gray-400 rounded-xl pl-4 cursor-pointer"
                    onClick={inputter}
                  >
                    {topic.title}
                  </div>
                );
              })}
            </div>
            <div className="text-red-600 text-sm">{warning}</div>
          </div>
          <div className="flex flex-row justify-end">
            <Button className="bg-blue-600" onClick={createCommFunc}>
              Create Community
            </Button>
          </div>
        </div>
        {/* <div><Right /></div> */}
      </div>
    </>
  );
}
