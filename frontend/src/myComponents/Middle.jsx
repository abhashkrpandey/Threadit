/* eslint-disable no-unused-vars */
import axios from "axios";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useSelector } from "react-redux";
import PostComponent from "./PostComponent";
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
import { Skeleton } from "@/components/ui/skeleton";
export default function Middle() {
  const [postsArray, setPostsArray] = useState([]);
  const [sortType, setsortType] = useState("recent");
  const [currentPage, setCurrentPage] = useState(parseInt(1));
  const [totalPages, settotalPages] = useState(parseInt(1));
  const isLoggedIn = useSelector((state) => state.login.userinfo.isLoggedIn);
  const [isLoading, setisLoading] = useState(false);
  const [skeletonArray,setskeletonArray] = useState([]);
  useEffect(() => {
    if (isLoading) {
      let array=[];
      for (let i = 0; i < 5; i++) {
        array.push(
          <Skeleton key={i}
            className={"w-[913.91px] h-[147.6px] rounded-md mb-4 bg-gray-300"}
          ></Skeleton>
        );
      }
      setskeletonArray(array);
    }
  }, [isLoading]);

  // console.log(currentPage);
  function sortTypeFunc(event) {
    // console.log(event);
    setsortType(event);
  }
  useEffect(() => {
    async function feedPostFetcher() {
      setisLoading(true);
      const response = await axios.get(
        import.meta.env.VITE_BACKEND_URL + "/feed",
        {
          params: {
            sortType: sortType,
            pageNumber: currentPage,
          },
           headers: {
            Authorization: `Bearer ${localStorage.getItem("jwttoken")}`,
          }
        }
      );
      setisLoading(false);
      if (response.data.isAbleToLoad === true) {
        setPostsArray(response.data.postsArray);
        settotalPages(parseInt(response.data.totalPages));
      }
    }
    async function feedPostFetcherAuthenticated() {
      setisLoading(true);
      const response = await axios.get(
        import.meta.env.VITE_BACKEND_URL + "/feedauthenticated",
        {
          params: {
            sortType: sortType,
            pageNumber: currentPage,
          },
           headers: {
            Authorization: `Bearer ${localStorage.getItem("jwttoken")}`,
          }
        },
      );
      setisLoading(false);
      if (response.data.isAbleToLoad === true) {
        setPostsArray(response.data.postsArray);
        settotalPages(parseInt(response.data.totalPages));
      }
    }
    // console.log(Cookies.get("jwttoken"));
    if (isLoggedIn === false) {
      feedPostFetcher();
    } else {
      feedPostFetcherAuthenticated();
    }
  }, [sortType, currentPage]);
  return (
    <div className="flex flex-col w-[70%] min-h-screen">
      {isLoading ? (
        <>
          <Skeleton className="w-[140px] h-10 rounded-md mb-4 bg-gray-300"></Skeleton>

          <div className="w-[100%]">
            {skeletonArray.map((ele) => {
              return ele;
            })}
          </div>
        </>
      ) : (
        <>
          {postsArray.length > 0 ? (
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
              <div className="w-[100%]">
                {postsArray.map((post) => {
                  return (
                    <PostComponent
                      key={post._id.toString()}
                      props={post}
                      isInsideSubreddit={false}
                    ></PostComponent>
                  );
                })}
              </div>
              <div className="mt-auto">
                <>
                  <Pagination>
                    <PaginationContent>
                      {currentPage != 1 ? (
                        <>
                          {" "}
                          <PaginationPrevious
                            onClick={(event) => {
                              setCurrentPage(currentPage - 1);
                              setPostsArray([]);
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
                            onClick={(event) => {
                              setCurrentPage(event.target.id);
                            }}
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
                              setPostsArray([]);
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
              </div>
            </>
          ) : (
            <></>
          )}
        </>
      )}
    </div>
  );
}
