/* eslint-disable no-unused-vars */
import axios from "axios";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import PostComponent from "./PostComponent";
export default function Middle() {
  const [postsArray, setPostsArray] = useState([]);
  const [sortType, setsortType] = useState("recent");
  function sortTypeFunc(event) {
    console.log(event.target.value);
    setsortType(event.target.value);
  }
  useEffect(() => {
    async function feedPostFetcher() {
      const response = await axios.post(
        import.meta.env.VITE_BACKEND_URL + "/feed",
        {
          sortType: sortType,
        }
      );
      if (response.data.isAbleToLoad === true) {
        setPostsArray(response.data.postsArray);
      }
    }
    async function feedPostFetcherAuthenticated() {
      const response = await axios.post(
        import.meta.env.VITE_BACKEND_URL + "/feedauthenticated",
        {
          sortType: sortType,
        }
      );
      if (response.data.isAbleToLoad === true) {
        setPostsArray(response.data.postsArray);
      }
    }
    console.log(Cookies.get("jwttoken"));
    if (Cookies.get("jwttoken") === undefined) {
      feedPostFetcher();
    } else {
      feedPostFetcherAuthenticated();
    }
  }, [sortType]);
  return (
    <div className="flex flex-row">
      <div>
        <select defaultValue="recent" onChange={sortTypeFunc}>
          <option value="recent">Recent</option>
          <option value="likes">Most Liked</option>
          <option value="dislike">Most Disliked</option>
        </select>
      </div>
      <div className="w-[70%]">
        {postsArray.map((post) => {
          return (
            <PostComponent
              key={post._id.toString()}
              props={post}
            ></PostComponent>
          );
        })}
      </div>
    </div>
  );
}
