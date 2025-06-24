import { useNavigate } from "react-router";
import MyJoinedCommunityList from "./MyJoinedCommunity";
export default function Community() {
    const navigate = useNavigate();
    return (
        <div className="flex flex-col">
            <div className="text-xl">Communities</div>
            <div className="hover:bg-gray-300" onClick={() => (navigate("/createsub"))}>+Create Community</div>
            <MyJoinedCommunityList></MyJoinedCommunityList>
        </div>
    )
}