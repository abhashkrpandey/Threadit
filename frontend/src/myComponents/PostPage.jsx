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
        <>
          <PostPageComponent post={postInfo}></PostPageComponent>
        </>
      ) : (
        <>Not a Valid Post</>
      )}
      </div>
    </>
  );
}
