/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router";
import PostComponent from "./PostComponent";
export default function SubThreaditContentBody() {
    const navigate = useNavigate();
  const [sortType, setsortType] = useState("recent");
  const SubThreaditDetails = useSelector(
    (state) => state.activity.currentActivity.SubThreaditDetails
  );
  const [postArray, setPostArray] = useState([]);
  function sortTypeFunc(event) {
    console.log(event.target.value);
    setsortType(event.target.value);
  }
  function createfunc() {
    navigate("/create");
  }
  useEffect(() => {
    async function postCollector() {
      const response = await axios.post(
        import.meta.env.VITE_BACKEND_URL + "/posts",
        {
          communityId: SubThreaditDetails._id,
          sortType: sortType,
        }
      );
      if (response.data.isThereAnyPost) {
        setPostArray(response.data.posts);
      }
    }
    postCollector();
  }, [SubThreaditDetails.subname, sortType]);
  return (
    <div className="flex flex-col">
      <div className="flex flex-row justify-end">
        <button onClick={createfunc}>Create Post</button>
      </div>
      <div>
        {postArray.length == 0 ? (
          <div>No Posts Yet</div>
        ) : (
          <div className="flex flex-row">
            <div>
              <select defaultValue="recent" onChange={sortTypeFunc}>
                <option value="recent">Recent</option>
                <option value="likes">Most Liked</option>
                <option value="dislike">Most Disliked</option>
              </select>
            </div>
            <div className="flex flex-col w-[100%]">
              {postArray.map((ele) => (
                <PostComponent
                  key={ele._id.toString()}
                  props={ele}
                ></PostComponent>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
