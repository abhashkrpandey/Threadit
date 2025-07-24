import { useState } from "react";
import hamburger from "../assets/hamburger.svg";
import cross from "../assets/cross.svg";
import Community from "./Community";
import { useNavigate } from "react-router";
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
    <div className={`border-gray-300 border-r-2 h-dvh ${width}`}>
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
          <div className="flex flex-col  gap-2">
            <div className="hover:bg-gray-300" onClick={() => navigate("/")}>
              Home
            </div>
            {Cookies.get("jwttoken") !== undefined ? (
              <div
                className="hover:bg-gray-300"
                onClick={() => navigate("/explore")}
              >
                Explore
              </div>
            ) : (
              <></>
            )}
            {/* <div className="hover:bg-gray-300" onClick={() => (navigate("/"))}>All</div> */}
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
