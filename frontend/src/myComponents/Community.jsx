import { useNavigate } from "react-router";
import MyJoinedCommunityList from "./MyJoinedCommunity";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
export default function Community() {
    const navigate = useNavigate();
    return (
        <div className="flex flex-col">
            <div className="text-xl">Communities</div>
            <Button variant={"ghost"} size={"sm"} className="hover:bg-gray-300 cursor-default" onClick={() => (navigate("/createsub"))}> <Plus />Create Community</Button>
            <MyJoinedCommunityList></MyJoinedCommunityList>
        </div>
    )
}