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
import { Camera } from "lucide-react";
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
import { useDispatch, useSelector } from "react-redux";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { updateUserInfo } from "../reducers/loginSlice";
import NotLoggedIn from "./NotLoggedIn";

export default function UserProfile() {
  const params = useParams();
  const username = params.username;
  const [userinfo, setuserInfo] = useState({});
  const [currentValue, setcurrentValue] = useState("likes");
  const [currentDivs, setcurrentDivs] = useState([]);
  const navigate = useNavigate();
  const [avatar, setavatar] = useState([]);
  const isLoggedIn = useSelector((state) => state.login.userinfo.isLoggedIn);
  const [isLoading, setisLoading] = useState(false);
  const dispatch = useDispatch();
  const useravatar = useSelector((state) => state.login.userinfo.useravatar);

  const [errorMessage, seterrorMessage] = useState("");

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
  // useEffect(()=>
  //   {
  //     window.location.reload();
  //   },[]);
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
            <CardContent >
              <p className="font-bold dark:text-gray-500">{ele.posttitle}</p>
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
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwttoken")}`,
          },
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
  async function avatarChanger() {
    if (avatar.length == 0) {
      seterrorMessage("No file uploaded");
    }
    if (!avatar.type.startsWith("image/")) {
      seterrorMessage("only images are allowed");
      document.getElementById("avatar").value = "";
    }

    const maxSize = 1 * 1024 * 1024;
    if (avatar.size > maxSize) {
      seterrorMessage("Avatar size exceeds 1MB!");
      document.getElementById("avatar").value = "";
    } else {
      const formData = new FormData();
      formData.append("avatar", avatar);
      try {
        setisLoading(true);
        const response = await axios.post(
          import.meta.env.VITE_BACKEND_URL + "/uploadavatar",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${localStorage.getItem("jwttoken")}`,
            },
          }
        );
        setisLoading(false);
        document.getElementById("avatar").value = "";
        setavatar([]);
        if (response.data.isSaved) {
          dispatch(updateUserInfo({ useravatar: response.data.useravatar }));
          Swal.fire({
            title: "avatar changed",
            timer: 2000,
          });
        } else if (response.data.isSaved === false) {
          Swal.fire({
            title: "avatar not changed",
            timer: 2000,
          });
        } else if (response.data.message) {
          Swal.fire({
            title: response.data.message,
            timer: 2000,
          });
        }
      } catch (err) {
        Swal.fire({
          title: err.message,
          icon: "error",
        });
      }
    }
  }
  async function inputer(event) {
    setavatar(event.target.files[0]);
  }
  return (
    <>
      <div className="min-h-screen bg-muted">
        <Navbar />

        <div className="flex flex-row  gap-6">
          <Left />
          {isLoggedIn === true ? (
            <>
              <div className="flex flex-col  shadow-none w-full">
                {userinfo.username && (
                  <div className="flex items-center gap-4  rounded-xl  shadow-none p-4">
                    <Dialog>
                      <form>
                        <DialogTrigger asChild>
                          <Avatar className={"w-[50px] h-[50px]"}>
                            <AvatarImage
                              alt="profile image"
                              src={
                                userinfo.useravatar === null
                                  ? "https://github.com/shadcn.png"
                                  : useravatar
                              }
                            />
                            <AvatarFallback>
                              {userinfo.username.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle>Change Avatar</DialogTitle>
                            <DialogDescription>
                              Make sure image is less or equal to 1MB
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4">
                            <div className="grid gap-3">
                              <Label htmlFor="name-1">Image</Label>
                              {errorMessage.length < 1 ? (
                                <></>
                              ) : (
                                <div className="text-red-600 text-sm">
                                  {errorMessage}
                                </div>
                              )}
                              <Input
                                id="avatar"
                                type="file"
                                onChange={inputer}
                                onClick={() => {
                                  seterrorMessage("");
                                }}
                              ></Input>
                            </div>
                          </div>
                          <DialogFooter>
                            <DialogClose asChild>
                              <Button
                                variant="outline"
                                onClick={() => {
                                  seterrorMessage("");
                                  setavatar([]);
                                }}
                              >
                                Cancel
                              </Button>
                            </DialogClose>
                            <div>
                              <Button onClick={avatarChanger}>
                                {isLoading ? <>Saving...</> : <>Save</>}
                              </Button>
                            </div>
                          </DialogFooter>
                        </DialogContent>
                      </form>
                    </Dialog>

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
                <div className="flex flex-row  w-[70%] h-16 whitespace-nowrap gap-3 overflow-x-auto">
                  <Tooltip>
                    <TooltipTrigger>
                      <Button 
                      className="shrink-0 "
                        variant={
                          currentValue !== "likes" ? "default" : "outline"
                        }
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
                      <Button
                      className="shrink-0"
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
                      <Button 
                      className="shrink-0 "
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
                       className="shrink-0 "
                        variant={
                          currentValue !== "posts" ? "default" : "outline"
                        }
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
                <div className="h-dvh overflow-y-auto">
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
            </>
          ) : (
            <NotLoggedIn></NotLoggedIn>
          )}
        </div>
      </div>
    </>
  );
}
