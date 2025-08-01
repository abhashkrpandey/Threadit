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
export default function Middle() {
  const [postsArray, setPostsArray] = useState([]);
  const [sortType, setsortType] = useState("recent");
  const [currentPage, setCurrentPage] = useState(parseInt(1));
  const [totalPages, settotalPages] = useState(parseInt(1));
    const isLoggedIn = useSelector((state) => state.login.userinfo.isLoggedIn);
  console.log(currentPage);
  function sortTypeFunc(event) {
    // console.log(event);
    setsortType(event);
  }
  useEffect(() => {
    async function feedPostFetcher() {
      const response = await axios.get(
        import.meta.env.VITE_BACKEND_URL + "/feed",
        {
          params: {
            sortType: sortType,
            pageNumber: currentPage,
          },
        }
      );
      if (response.data.isAbleToLoad === true) {
        setPostsArray(response.data.postsArray);
        settotalPages(parseInt(response.data.totalPages));
      }
    }
    async function feedPostFetcherAuthenticated() {
      const response = await axios.get(
        import.meta.env.VITE_BACKEND_URL + "/feedauthenticated",
        {
          params: {
            sortType: sortType,
            pageNumber: currentPage,
          },
        }
      );
      if (response.data.isAbleToLoad === true) {
        setPostsArray(response.data.postsArray);
        settotalPages(parseInt(response.data.totalPages));
      }
    }
    // console.log(Cookies.get("jwttoken"));
    if (isLoggedIn=== false) {
      feedPostFetcher();
    } else {
      feedPostFetcherAuthenticated();
    }
  }, [sortType, currentPage]);
  return (
    <div className="flex flex-col w-[70%] min-h-screen">
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
        </>
      ) : (
        <></>
      )}

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
        {postsArray.length > 0 ? (
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
  );
}
