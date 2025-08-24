/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import axios from "axios";
import PostComponent from "./PostComponent";
import { Button } from "@/components/ui/button";
import { Plus, CakeSlice, Globe, Users } from "lucide-react";
import {
  addCommunityInArray,
  removeCommunityInArray,
} from "../reducers/loginSlice";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";

export default function SubThreaditContentBody() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [sortType, setsortType] = useState("recent");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, settotalPages] = useState(1);
  const [hasJoined, sethasJoined] = useState(false);
  const [isLoading, setisLoading] = useState(true);
  const [postArray, setPostArray] = useState([]);

  const SubThreaditDetails = useSelector(
    (state) => state.activity.currentActivity.SubThreaditDetails
  );

  const date = new Date(SubThreaditDetails.createdAt);
  const formattedDate = `${date.toLocaleString("default", {
    month: "long",
  })} ${date.getDate()}, ${date.getFullYear()}`;

  useEffect(() => {
    async function postCollector() {
      setisLoading(true);
      const response = await axios.get(
        import.meta.env.VITE_BACKEND_URL + "/posts",
        {
          params: {
            communityId: SubThreaditDetails._id,
            sortType,
            pageNumber: currentPage,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwttoken")}`,
          },
        }
      );
      setisLoading(false);
      if (response.data.isThereAnyPost) {
        setPostArray(response.data.posts);
        settotalPages(parseInt(response.data.totalPages));
        sethasJoined(response.data.hasJoined);
      }
    }
    postCollector();
  }, [sortType, currentPage, SubThreaditDetails.subname]);

  async function joinGroup(event) {
    event.stopPropagation();
    const response = await axios.post(
      import.meta.env.VITE_BACKEND_URL + "/joingroup",
      { communityid: SubThreaditDetails._id },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwttoken")}`,
        },
      }
    );
    sethasJoined(response.data.joined || false);
  }

  useEffect(() => {
    if (hasJoined) {
      dispatch(addCommunityInArray({ value: SubThreaditDetails._id }));
    } else {
      dispatch(removeCommunityInArray({ value: SubThreaditDetails._id }));
    }
  }, [hasJoined]);

  return (
    <div className="flex flex-col h-full">
      {/* Top Buttons */}
      <div className="flex justify-end gap-2 mb-4">
        <Button onClick={() => navigate("/create")} variant="ghost">
          <Plus className="mr-1" /> Create Post
        </Button>
        <Button
          onClick={joinGroup}
          variant="ghost"
          className={hasJoined ? "border text-black" : "bg-blue-500 text-white"}
        >
          {hasJoined ? "Joined" : "Join"}
        </Button>
      </div>

      <div className="flex flex-row gap-4">
        <div className="flex flex-col flex-1">
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-10 w-36" />
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-36 w-full" />
              ))}
            </div>
          ) : postArray.length === 0 ? (
            <div>No Posts Yet</div>
          ) : (
            <>
              <Select defaultValue="recent" onValueChange={setsortType}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Recent</SelectItem>
                  <SelectItem value="likes">Most Liked</SelectItem>
                  <SelectItem value="dislike">Most Disliked</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex-1 overflow-y-auto">
                {postArray.map((ele) => (
                  <PostComponent
                    key={ele._id.toString()}
                    props={ele}
                    isInsideSubreddit
                  />
                ))}
              </div>

              {postArray.length > 0 && (
                <Pagination>
                  <PaginationContent>
                    {currentPage > 1 && (
                      <PaginationPrevious
                        onClick={() => setCurrentPage(currentPage - 1)}
                      />
                    )}
                    {currentPage > 1 && <PaginationEllipsis />}
                    <PaginationItem>
                      <PaginationLink className="bg-gray-200">
                        {currentPage}
                      </PaginationLink>
                    </PaginationItem>
                    {totalPages - currentPage >= 1 && <PaginationEllipsis />}
                    {currentPage !== totalPages && (
                      <PaginationNext
                        onClick={() => setCurrentPage(currentPage + 1)}
                      />
                    )}
                  </PaginationContent>
                </Pagination>
              )}
            </>
          )}
        </div>

        
        <ScrollArea className="w-64 shrink-0 rounded border p-4 text-gray-600">
          <div className="font-bold text-black mb-2">
            This is {SubThreaditDetails.subname} community
          </div>
          <div className="mb-2">{SubThreaditDetails.subdescription}</div>
          <div className="flex items-center gap-1">
            <CakeSlice className="w-4" /> Created {formattedDate}
          </div>
          <div className="flex items-center gap-1">
            <Globe className="w-4" /> {SubThreaditDetails.accessiblity}
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4" /> {SubThreaditDetails.membersCount}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
