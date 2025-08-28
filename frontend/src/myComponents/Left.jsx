import { useState } from "react";
import Community from "./Community";
import { Button } from "@/components/ui/button.jsx";
import { House } from 'lucide-react';
import { useNavigate } from "react-router";
import { Telescope } from 'lucide-react';
import Cookies from "js-cookie";
import { X } from 'lucide-react';
import { Menu } from 'lucide-react';
import { useSelector } from "react-redux";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
export default function Left() {
  const [isOpen, setisOpen] = useState(false);
  const [width, setwidth] = useState("0");
  const navigate = useNavigate();
  const isLoggedIn = useSelector((state) => state.login.userinfo.isLoggedIn);
  function hamburgerfunc() {
    if (width) {
      setisOpen(false);
      setwidth("");
    } else {
      setisOpen(true);
      setwidth("w-[15%]");
    }
  }
  return (
    <>
    <div className={`border-gray-300 border-r-2 h-screen ${width}`}>
      {/* <div className="flex flex-row justify-end">
        <Button onClick={hamburgerfunc} className={"rounded-full border-black"} variant={"outline"}>
          {isOpen ? <X/> : <Menu/>}
        </Button>
      </div>
      {isOpen ? (
        <div>
          <div className="flex flex-col  gap-2 ">
            <Button variant="ghost" size="sm" onClick={() => navigate("/")} className={"not-even:hover:bg-gray-300"}>
             <House/> Home
            </Button>
            {isLoggedIn ? (
              <Button
                variant="ghost" size="sm"
                onClick={() => navigate("/explore")} className={"hover:bg-gray-300"}
              >
               <Telescope/> Explore
              </Button>
            ) : (
              <></>
            )}
          </div>
          <div className="flex flex-col">
            <Community></Community>
          </div>
          <div></div>
        </div>
      ) : (
        <div></div>
      )} */}
          <Sheet>
  <SheetTrigger><Button className="outline rounded-full">
     <Menu/>
    </Button></SheetTrigger>
  <SheetContent side="left" className=" w-[200px] sm:w-[348px]">
    <SheetHeader>
      <SheetTitle></SheetTitle>
      {/* <SheetDescription>
        This action cannot be undone. This will permanently delete your account
        and remove your data from our servers.
      </SheetDescription> */}
    </SheetHeader>
    <div>
          <div className="flex flex-col  gap-2 ">
            <Button variant="ghost" size="sm" onClick={() => navigate("/")} className={"not-even:hover:bg-gray-300"}>
             <House/> Home
            </Button>
            {isLoggedIn ? (
              <Button
                variant="ghost" size="sm"
                onClick={() => navigate("/explore")} className={"hover:bg-gray-300"}
              >
               <Telescope/> Explore
              </Button>
            ) : (
              <></>
            )}
          </div>
          <div className="flex flex-col">
            <Community></Community>
          </div>
          <div></div>
        </div>
  </SheetContent>
</Sheet>
    </div>
    </>
  );
}
