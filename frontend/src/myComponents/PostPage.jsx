import { useEffect, useState } from "react";
import { useParams } from "react-router";
import Navbar from "./Navbar";
import PostPageComponent from "./PostPageComponent";
import axios from "axios";
import Left from "./Left";
export default function PostPage() {
  const { postid } = useParams();
  const [isValidPost, setisValidPost] = useState(false);
  const [postInfo, setPostInfo] = useState({});
  useEffect(() => {
    async function validPost() {
      const response = await axios.post(
        import.meta.env.VITE_BACKEND_URL + "/validpost",
        {
          postid: postid,
        },
        {
           headers: {
            Authorization: `Bearer ${localStorage.getItem("jwttoken")}`,
          }
        }
      );
      if (response.data.isValidPost) {
        setisValidPost(true);
        setPostInfo(response.data.post);
      }
    }
    validPost();
  }, []);
  return (
    <>
      <div>
        <Navbar></Navbar>
      </div>
      <div className="flex flex-row">
        <Left></Left>
      {isValidPost ? (
        <div className="ml-50 w-[60%]">
          <PostPageComponent post={postInfo}></PostPageComponent>
        </div>
      ) : (
        <>Not a Valid Post</>
      )}
      </div>
    </>
  );
}
