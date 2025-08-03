import { useEffect } from "react";
import { useParams } from "react-router";
import Swal from "sweetalert2";
import Navbar from "../myComponents/Navbar";
import Left from "../myComponents/Left";
import Right from "../myComponents/Right";
import axios from "axios";
import { useNavigate } from "react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import LikeDisLikeButton from "../mini-components/LikeDisLikeButton";
import BookMark from "../mini-components/BookMark";
import DateTime from "../mini-components/DateTime";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dot } from "lucide-react";
import Cookies from "js-cookie";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useSelector } from "react-redux";
export default function UserProfile() {
  const params = useParams();
  const username = params.username;
  const [userinfo, setuserInfo] = useState({});
  const [currentValue, setcurrentValue] = useState("likes");
  const [currentDivs, setcurrentDivs] = useState([]);
  const navigate = useNavigate();
  const isLoggedIn = useSelector((state) => state.login.userinfo.isLoggedIn);

  function postPageOpenFunc(id) {
    if (isLoggedIn === false) {
      Swal.fire({
        title: "You are either not logged/registered",
        icon: "warning",
      });
    } else {
      navigate(`/post/${id.toString()}`);
    }
  }
  useEffect(() => {
    setcurrentDivs([]);
    if (userinfo && userinfo[currentValue]) {
      const eles = userinfo[currentValue].map((ele) => {
        return (
          <Card
            onClick={() => {
              postPageOpenFunc(ele._id);
            }}
            className={"gap-4 hover:bg-gray-200 py-3"}
            key={ele._id}
          >
            <CardHeader>
              <CardTitle className={"flex text-muted-foreground text-sm"}>
                r/{ele.communityId.subname}
                <Dot />
                <DateTime date={ele.createdAt} />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-bold">{ele.posttitle}</p>
            </CardContent>
          </Card>
        );
      });
      setcurrentDivs(eles);
    }
  }, [currentValue, userinfo]);
  useEffect(() => {
    async function checker() {
      const response = await axios.post(
        import.meta.env.VITE_BACKEND_URL + "/uservalid",
        {
          username: username,
        }
      );
      if (response.data.isValidUser) {
        // console.log(response.data.userinfo);
        setuserInfo(response.data.userinfo);
      } else if (response.data.isValidUser == false) {
        Swal.fire({
          title: "Not a  valid user",
          icon: "error",
        });
      } else if (response.data.message) {
        Swal.fire({
          title: response.data.message,
          icon: "error",
        });
      }
    }
    checker();
  }, []);
  return (
    <>
      <div className="min-h-screen bg-muted">
        <Navbar />

        <div className="flex flex-row  gap-6">
          <Left />

          <div className="flex flex-col gap-6 w-full max-w-2xl">
            {userinfo.username && (
              <div className="flex items-center gap-4 bg-white rounded-xl shadow-sm p-4">
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>
                    {userinfo.username.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div>
                  <div className="text-lg font-semibold">
                    {userinfo.username}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    u/{userinfo.username}
                  </div>
                </div>
              </div>
            )}
            <div className="flex flex-wrap gap-4">
              <Tooltip>
                <TooltipTrigger>
                  {" "}
                  <Button
                    variant={currentValue !== "likes" ? "default" : "outline"}
                    onClick={() => {
                      setcurrentValue("likes");
                    }}
                    disabled={currentValue === "likes" ? true : false}
                  >
                    Upvoted
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Posts liked</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger>
                  {" "}
                  <Button
                    variant={
                      currentValue !== "dislikes" ? "default" : "outline"
                    }
                    disabled={currentValue === "dislikes" ? true : false}
                    onClick={() => {
                      setcurrentValue("dislikes");
                    }}
                  >
                    DownVoted
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Posts disliked</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger>
                  {" "}
                  <Button
                    variant={
                      currentValue !== "bookmark" ? "default" : "outline"
                    }
                    disabled={currentValue === "bookmark" ? true : false}
                    onClick={() => {
                      setcurrentValue("bookmark");
                    }}
                  >
                    BookMarked
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Posts bookmarked</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger>
                  <Button
                    variant={currentValue !== "posts" ? "default" : "outline"}
                    disabled={currentValue === "posts" ? true : false}
                    onClick={() => {
                      setcurrentValue("posts");
                    }}
                  >
                    Posts
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Posts created by you</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <div>
              {currentDivs.length !== 0 ? (
                currentDivs.map((ele) => {
                  return ele;
                })
              ) : (
                <div>
                  <Card>
                    <CardContent>No content available</CardContent>
                  </Card>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
