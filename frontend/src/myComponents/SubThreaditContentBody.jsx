/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router";
import PostComponent from "./PostComponent";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useDispatch } from "react-redux";
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
import { CakeSlice, User } from "lucide-react";
import { Globe } from "lucide-react";
import { Users } from "lucide-react";
export default function SubThreaditContentBody() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [sortType, setsortType] = useState("recent");
  const [currentPage, setCurrentPage] = useState(parseInt(1));
  const [totalPages, settotalPages] = useState(parseInt(1));
  const [hasJoined, sethasJoined] = useState(false);
  const SubThreaditDetails = useSelector(
    (state) => state.activity.currentActivity.SubThreaditDetails
  );
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const date = new Date(SubThreaditDetails.createdAt);
  const month = monthNames[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();

  // console.log(`${month} ${day},${year}`);
  const [postArray, setPostArray] = useState([]);
  function sortTypeFunc(event) {
    // console.log(event);
    setsortType(event);
  }
  function createfunc() {
    navigate("/create");
  }
  useEffect(() => {
    async function postCollector() {
      const response = await axios.get(
        import.meta.env.VITE_BACKEND_URL + "/posts",
        {
          params: {
            communityId: SubThreaditDetails._id,
            sortType: sortType,
            pageNumber: currentPage,
          },
          withCredentials:true
        }
      );
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
      {
        communityid: SubThreaditDetails._id,
      },
      {withCredentials:true}
    );
    if (response.data.joined) {
      sethasJoined(true);
    } else if (response.data.joined === false) {
      sethasJoined(false);
    } else if (response.data.message) {
      Swal.fire({
        title: response.data.message,
        icon: "error",
      });
    }
  }
  useEffect(() => {
    if (hasJoined) {
      // console.log(SubThreaditDetails._id);
      dispatch(addCommunityInArray({ value: SubThreaditDetails._id }));
    } else {
      // console.log(SubThreaditDetails._id);
      dispatch(removeCommunityInArray({ value: SubThreaditDetails._id }));
    }
  }, [hasJoined]);
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-row justify-end">
        <Button
          onClick={createfunc}
          variant={"ghost"}
          className={"border-1 border-black "}
        >
          <Plus />
          Create Post
        </Button>
        <Button
          variant={"ghost"}
          onClick={joinGroup}
          className={
            hasJoined
              ? `bg-white text-black border-1 border-black `
              : `bg-blue-500`
          }
        >
          {hasJoined ? <>Joined</> : <>Join</>}
        </Button>
      </div>
      <div className="grid grid-cols-5">
        {postArray.length == 0 ? (
          <div>No Posts Yet</div>
        ) : (
          <div className=" col-span-4 flex flex-col">
            <>
              <Select defaultValue="recent" onValueChange={sortTypeFunc}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Recent</SelectItem>
                  <SelectItem value="likes">Most Liked</SelectItem>
                  <SelectItem value="dislike">Most Disliked</SelectItem>
                </SelectContent>
              </Select>
            </>
            <div className="flex flex-col w-[100%]">
              {postArray.map((ele) => (
                <PostComponent
                  key={ele._id.toString()}
                  props={ele}
                  isInsideSubreddit={true}
                ></PostComponent>
              ))}
            </div>
            <div className="mt-auto">
              {postArray.length > 0 ? (
                <>
                  <Pagination>
                    <PaginationContent>
                      {currentPage != 1 ? (
                        <>
                          {" "}
                          <PaginationPrevious
                            onClick={(event) => {
                              setCurrentPage(currentPage - 1);
                            }}
                            className={"cursor-default hover:bg-gray-500"}
                          />
                        </>
                      ) : (
                        <></>
                      )}
                      {currentPage > 1 ? (
                        <>
                          <PaginationEllipsis />
                        </>
                      ) : (
                        <></>
                      )}
                      {
                        <PaginationItem>
                          <PaginationLink
                            id={currentPage + 1}
                            className={`cursor-default bg-gray-500 `}
                          >
                            {currentPage}
                          </PaginationLink>
                        </PaginationItem>
                      }
                      {totalPages - currentPage >= 1 ? (
                        <>
                          <PaginationEllipsis />
                        </>
                      ) : (
                        <></>
                      )}
                      {currentPage != totalPages ? (
                        <>
                          {" "}
                          <PaginationNext
                            onClick={(event) => {
                              setCurrentPage(currentPage + 1);
                            }}
                            className={"cursor-default hover:bg-gray-500"}
                          />
                        </>
                      ) : (
                        <></>
                      )}
                    </PaginationContent>
                  </Pagination>
                </>
              ) : (
                <></>
              )}
            </div>
          </div>
        )}
        <div>
          <ScrollArea className="fixed  top-20   rounded-md border p-4 text-gray-600">
            <div className="font-bold text-black">
              This is {SubThreaditDetails.subname} community
            </div>
            <div>{SubThreaditDetails.subdescription}</div>
            <div className="flex flex-row">
              <CakeSlice className="w-5" />
              Created {`${month} ${day},${year}`}
            </div>
            <div className="flex flex-row">
              <Globe className="w-5" />
              {SubThreaditDetails.accessiblity}
            </div>
            <div className="flex flex-row">
              <Users className="w-5" />
              {SubThreaditDetails.membersCount}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
