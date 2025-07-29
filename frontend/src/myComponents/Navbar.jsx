import search from "../assets/search.svg";
import threedot from "../assets/threedot.svg";
import { useNavigate } from "react-router";
import Cookies from "js-cookie";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button.jsx";
import { Plus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
export default function Navbar() {
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
  return (
    <>
      <div className="flex flex-row justify-between gap-2  border-gray-300 border-b-2 ">
        <div className="pt-2">Threadit</div>
        <div className="pt-2 flex flex-row">
          {/* <div>
                        <img src={search} height={50} width={50}></img>
                    </div> */}
          <input
            type="search"
            placeholder="Search Threadit"
            className=" focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-200 p-2 rounded-2xl w-130"
          ></input>
          <div></div>
        </div>

        <div className="flex flex-row pt-2">
          <div className="p-2">
            {isLoggedIn ? (
              <div>
                <Button onClick={createfunc} variant="default">
                  <Plus />
                  Create
                </Button>
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
                <DropdownMenuItem onClick={userProfileOpen}>Profile</DropdownMenuItem>
                <DropdownMenuItem>Dark Mode</DropdownMenuItem>
                <DropdownMenuItem>Edit Avatar</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            // <Button onClick={userProfileOpen} variant="default">{username}</Button>
            <div className="flex flex-row">
              <div className="bg-orange-600 rounded-3xl text-white p-2">
                <div>
                  <button onClick={loginfunc}>Login</button>
                </div>
              </div>
              <div className="p-2">
                <img src={threedot} height={20} width={20}></img>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
