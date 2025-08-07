import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
export default function MyJoinedCommunityList() {
  const [communityList, setCommunityList] = useState([]);
  const userJoinedCommunities = useSelector(
    (state) => state.login.userinfo.userJoinedCommunities
  );
  const navigate = useNavigate();
  useEffect(() => {
    async function listCollector() {
      const response = await axios.post(
        import.meta.env.VITE_BACKEND_URL + "/mycommunitylist",
        {
          withCredentials:true
        }
      );
      if (response.data.isPresent) {
        setCommunityList(response.data.communityList.communitiesjoined);
      }
    }
    listCollector();
  }, [userJoinedCommunities]);
  return (
    <>
      <div className="flex flex-col">
        {communityList.map((ele) => (
          <Button
            variant="ghost"
            size="sm"
            key={ele._id.toString()}
            onClick={() => navigate(`/t/${ele.subname}`)}
            className="hover:bg-gray-300"
          >
            {ele.subname}
          </Button>
        ))}
      </div>
    </>
  );
}
