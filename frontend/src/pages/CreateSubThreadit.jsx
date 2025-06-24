import Navbar from "../components/Navbar";
import Left from "../components/Left";
import Right from "../components/Right";
import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

export default function CreateSubThreadit() {
    const userid = useSelector((state) => (state.login.userinfo.userid));
    const [subname, setsubname] = useState("");
    const [subdescription, setsubdescription] = useState("");
    const [accessiblity, setaccessiblity] = useState("public");
    const [topics, settopics] = useState([]);
    const [warning, setwarning] = useState("");
    const navigate = useNavigate();

    function inputter(e) {
        if (e.target.id === "subname") {
            setsubname(e.target.value);
        }
        else if (e.target.id === "subdescription") {
            setsubdescription(e.target.value);
        }
        else if (e.target.name === "accessiblity") {
            setaccessiblity(e.target.value);
        }
        else {
            if (topics.length < 3) {
                if (e.target.checked && !topics.includes(e.target.value)) {
                    settopics([...topics, e.target.value]);
                }
                else if (!e.target.checked && topics.includes(e.target.value)) {
                    let newtopics = topics.filter((ele) => (ele !== e.target.value));
                    settopics(newtopics);
                    setwarning("");

                }
            }
            else {
                if (e.target.checked && !topics.includes(e.target.value)) {
                    e.target.checked = false;
                    setwarning("Can't add more than three tags");
                }
                else if (!e.target.checked && topics.includes(e.target.value)) {
                    let newtopics = topics.filter((ele) => (ele !== e.target.value));
                    settopics(newtopics);
                    if (topics.length == 3) {
                        setwarning("");
                    }
                }
            }

        }
    }
    async function createCommFunc(e) {
        e.preventDefault();
        if (subname.length < 3 || subdescription.length < 10 || topics.length === 0) {
            Swal.fire({
                title: "Invalid Input",
                text: "Properly fill  the details",
                icon: "error"
            })
        }
        else {
            const response = await axios.post(import.meta.env.VITE_BACKEND_URL + "/createsub",
                {
                    subname: subname,
                    subdescription: subdescription,
                    accessiblity: accessiblity,
                    topics: topics,
                    userid: userid
                }
            )
            if (response.data.created) {
                Swal.fire({
                    title: "Congratulations",
                    text: "Subreddit created",
                    icon: "success"
                })
                navigate(`/t/${subname}`);
            }
            else {
                Swal.fire({
                    title: "Error Occured",
                    text: "Properly fill  the details",
                    icon: "error"
                })
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
                        <input required id="subname" maxLength={10} className="bg-gray-300 rounded-sm w-[50vw] h-[5vh]" placeholder="Unique Subreddit Name" onChange={inputter}></input>
                        <input required id="subdescription" maxLength={150} className="bg-gray-300 rounded-sm w-[50vw] h-[5vh]" placeholder="Description" onChange={inputter}></input>
                        <div className="flex flex-col">
                            <div className="text-xl">what kind of community is this?</div>
                            <label className="hover:bg-gray-300 flex flex-row justify-between">
                                Public
                                <input type="radio" name="accessiblity" id="public" value="public" defaultChecked onChange={inputter}></input>
                            </label>
                            <label className="hover:bg-gray-300 flex flex-row justify-between">Restricted
                                <input type="radio" name="accessiblity" id="restricted" value="restricted" onChange={inputter}></input>
                            </label>
                            <label className="hover:bg-gray-300 flex flex-row justify-between">Private
                                <input type="radio" name="accessiblity" id="private" value="private" onChange={inputter}></input>
                            </label>
                        </div>
                        <div className="flex flex-col">
                            <div className="text-xl">Topics Related To this community</div>
                            <label className="hover:bg-gray-300 flex flex-row justify-between">
                                Gaming
                                <input name="topics" type="checkbox" value="gaming" onChange={inputter} ></input>
                            </label>
                            <label className="hover:bg-gray-300 flex flex-row justify-between">
                                Technology
                                <input type="checkbox" value="technology" name="topics" onChange={inputter}></input>
                            </label>
                            <label className="hover:bg-gray-300 flex flex-row justify-between">
                                Politics
                                <input type="checkbox" value="politics" name="topics" onChange={inputter}></input>
                            </label>
                            <label className="hover:bg-gray-300 flex flex-row justify-between">
                                Anime
                                <input type="checkbox" value="anime" name="topics" onChange={inputter}></input>
                            </label>
                            <label className="hover:bg-gray-300 flex flex-row justify-between">
                                Engineering
                                <input type="checkbox" value="engineering" name="topics" onChange={inputter}></input>
                            </label>
                            <div className="text-red-600 text-sm">{warning}</div>
                        </div>
                    <div className="flex flex-row justify-end">
                        <button className="bg-blue-600" onClick={createCommFunc}>Create Community</button>
                    </div>
                    </div>
                {/* <div><Right /></div> */}
            </div>
        </>
    )
}