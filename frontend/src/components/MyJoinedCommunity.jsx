import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
export default function MyJoinedCommunityList() {
  const [communityList, setCommunityList] = useState([]);
  const navigate=useNavigate();
  useEffect(() => {
    async function listCollector() {
      const response = await axios.post(
        import.meta.env.VITE_BACKEND_URL + "/mycommunitylist"
      );
      if (response.data.isPresent) {
        setCommunityList(response.data.communityList);
      }
    }
    listCollector();
  }, []);
  return (
    <>
      <div className="flex flex-col">
        {communityList.map((ele) => (
          <button key={ele._id.toString()} onClick={()=>(navigate(`/t/${ele.subname}`))}  className="hover:bg-gray-300">{ele.subname}</button>
        ))}
      </div>
    </>
  );
}
