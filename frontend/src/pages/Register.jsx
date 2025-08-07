import { useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import { updateUserInfo } from "../reducers/loginSlice";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { BadgeCheckIcon, BadgeX } from "lucide-react";
import { Loader2Icon } from "lucide-react";
function useDebounce(username, delay = 300) {
  const [name, setName] = useState("");
  useEffect(() => {
    const timer = setTimeout(() => {
      setName(username);
    }, delay);
    return () => {
      clearTimeout(timer);
    };
  }, [username, delay]);
  return name;
}
export default function Register() {
  const [UserName, setUserName] = useState("");
  const [ValidUserName, setValidUserName] = useState("");
   const [Loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const [UserPassword, setUserPassword] = useState("");
  const finalTypedName = useDebounce(UserName);
  const navigate = useNavigate();
  const [isNameValid, setisNameValid] = useState(false);
  function inputter(e) {
    if (e.target.id === "username") {
      setUserName(e.target.value);
    } else {
      setUserPassword(e.target.value);
    }
  }
  async function register(e) {
    e.preventDefault();
    if (UserPassword.length <= 6 || UserPassword.length >= 21) {
      Swal.fire({
        title: "Error!",
        text: "Password's length should between 7 and 20",
        icon: "error",
        confirmButtonText: "OK",
      });
    } else if (isNameValid === true) {
      setLoading(true);
      const response = await axios.post(
        import.meta.env.VITE_BACKEND_URL + "/register",
        {
          username: ValidUserName,
          userpassword: UserPassword,
        },{
          withCredentials:true
        }
      );
      setLoading(false);
      if (response.data.isLoggedIn) {
        dispatch(updateUserInfo(response.data));
        navigate("/");
      } else {
        Swal.fire({
          title: "Error!",
          text: "Error occured",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
      setUserName("");
      setUserPassword("");
      setisNameValid(false);
      document.getElementById("username").value = "";
      document.getElementById("password").value = "";
    } else {
      Swal.fire({
        title: "Set a valid name",
        timer: 2000,
      });
    }
  }
  function checkUsername(finalTypedName) {
    if (finalTypedName != undefined && finalTypedName.length > 0) {
      let firstFive = finalTypedName.substring(0, 5);
      for (let i = 0; i < firstFive.length; i++) {
        let char = firstFive[i];
        if ((char >= "a" && char <= "z") || (char >= "A" && char <= "Z")) {
          continue;
        } else {
          return false;
        }
      }
      return true;
    }
    return false;
  }
  useEffect(() => {
    setisNameValid(false);
    async function checkValidName() {
      // console.log(checkUsername(finalTypedName));
      if (
        finalTypedName.length >= 5 &&
        finalTypedName.length <= 20 &&
        checkUsername(finalTypedName)
      ) {
        const response = await axios.post(
          import.meta.env.VITE_BACKEND_URL + "/validname",
          {
            username: finalTypedName,
          },{
            withCredentials:true
          }
        );
        if (response.data.isValid === true) {
          setValidUserName(finalTypedName);
          setisNameValid(true);
        } else if (response.data.isValid === false) {
          Swal.fire({
            title: "Name already taken",
            timer: 2000,
          });
          setisNameValid(false);
        } else {
          Swal.fire({
            title: response.data.message,
            timer: 2000,
          });
          setisNameValid(false);
        }
      }
    }
    checkValidName();
  }, [finalTypedName]);
  return (
    <>
      <div className="h-dvh flex justify-center items-center bg-gray-100">
        <div className="bg-white shadow-lg rounded-xl p-6 w-[350px]">
          <form className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <div className="flex flex-row items-center gap-2">
                <Input
                  type="text"
                  id="username"
                  placeholder="Username"
                  onChange={inputter}
                  maxLength={20}
                />
                <Badge
                  className={
                    isNameValid
                      ? "bg-green-500 text-white dark:bg-green-600"
                      : "bg-blue-500 text-white dark:bg-blue-600"
                  }
                >
                  {isNameValid ? (
                    <>
                      <BadgeCheckIcon />
                      valid
                    </>
                  ) : (
                    <>
                      <BadgeX />
                      not valid
                    </>
                  )}
                </Badge>
              </div>
              <span className="text-[12px] pl-1 text-gray-500">
                First 5 letters should be A-Z or a-z with no space
              </span>
            </div>
            <Input
              type="password"
              id="password"
              placeholder="Password"
              onChange={inputter}
            />
            <Button type="submit" onClick={register} disabled={Loading ? true : false}>
              {Loading ? (
                <>
                  <Loader2Icon className="animate-spin" />
                  Please wait...
                </>
              ) : (
                <>Register</>
              )}
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}
