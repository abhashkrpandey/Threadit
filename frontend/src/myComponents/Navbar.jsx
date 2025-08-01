import { useNavigate } from "react-router";
import Cookies from "js-cookie";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button.jsx";
import { Plus } from "lucide-react";
import { Ellipsis } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Spool } from "lucide-react";
import { useDispatch } from "react-redux";
import { updateUserInfo } from "../reducers/loginSlice";
export default function Navbar() {
  const dispatch = useDispatch();
  const userinfo = useSelector((state) => state.login.userinfo);
  const [isLoggedIn, setisLoggedIn] = useState(false);
  const [username, setusername] = useState("");
  useEffect(() => {
    setisLoggedIn(userinfo.isLoggedIn);
    setusername(userinfo.username);
  }, [userinfo]);
  const navigate = useNavigate();
  function loginfunc() {
    navigate("/login");
  }
  function createfunc() {
    navigate("/create");
  }
  function userProfileOpen() {
    navigate(`/u/${username}`);
  }
  function logoutFunc() {
    Cookies.remove("jwttoken");
    dispatch(
      updateUserInfo({
        username: null,
        isLoggedIn: false,
        userid: null,
        userJoinedCommunities: [],
      })
    );
    window.location.reload();
  }
  return (
    <>
      <div className="flex flex-row justify-between gap-2  border-gray-300 border-b-2 ">
        <Tooltip>
          <TooltipTrigger>
            {" "}
            <Button
              onClick={() => {
                navigate("/");
              }}
              className="pt-2 border-0 shadow-none hover:bg-gray-300"
              variant={"outline"}
            >
              <Spool />
              Threadit
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Home Page</p>
          </TooltipContent>
        </Tooltip>
        <div className="flex flex-row pt-2">
          <div className="p-2">
            {isLoggedIn ? (
              <div>
                 <Tooltip>
                    <TooltipTrigger> 
                        <Button onClick={createfunc} variant="default">
                  <Plus />
                  Create
                </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Create post</p>
                    </TooltipContent>
                  </Tooltip>
              
              </div>
            ) : (
              <div></div>
            )}
          </div>
          {isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={userProfileOpen}>
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Tooltip>
                    <TooltipTrigger> Dark Mode</TooltipTrigger>
                    <TooltipContent>
                      <p>Not functional yet</p>
                    </TooltipContent>
                  </Tooltip>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Tooltip>
                    <TooltipTrigger> Edit Avatar</TooltipTrigger>
                    <TooltipContent>
                      <p>Not functional yet</p>
                    </TooltipContent>
                  </Tooltip>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={logoutFunc}>LogOut</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex flex-row">
              <Button
                className="bg-orange-600 rounded-3xl text-white p-2"
                onClick={loginfunc}
              >
                Login
              </Button>
              <div className="p-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Ellipsis />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>Options</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => {
                        navigate("/register");
                      }}
                    >
                      Register
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
