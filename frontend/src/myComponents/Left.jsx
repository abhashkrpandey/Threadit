import { useState } from "react";
import hamburger from "../assets/hamburger.svg";
import cross from "../assets/cross.svg";
import Community from "./Community";
import { Button } from "@/components/ui/button.jsx";
import { House } from 'lucide-react';
import { useNavigate } from "react-router";
import { Telescope } from 'lucide-react';
import Cookies from "js-cookie";
export default function Left() {
  const [isOpen, setisOpen] = useState(true);
  const [width, setwidth] = useState("w-[15%]");
  const navigate = useNavigate();
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
    <div className={`border-gray-300 border-r-2 h-screen ${width}`}>
      <div className="flex flex-row justify-end">
        <button onClick={hamburgerfunc}>
          <img
            src={isOpen ? cross : hamburger}
            width={35}
            height={35}
            className=" hover:border-black rounded-full border-1 border-gray-500 p-2"
          ></img>
        </button>
      </div>
      {isOpen ? (
        <div>
          <div className="flex flex-col  gap-2 ">
            <Button variant="ghost" size="sm" onClick={() => navigate("/")} className={"not-even:hover:bg-gray-300"}>
             <House/> Home
            </Button>
            {Cookies.get("jwttoken") !== undefined ? (
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
      )}
    </div>
  );
}
