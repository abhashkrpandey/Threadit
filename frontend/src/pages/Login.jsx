import { useNavigate } from "react-router";
import axios from "axios";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDispatch } from "react-redux";
import { updateUserInfo } from "../reducers/loginSlice";
import { Loader2Icon } from "lucide-react";
export default function Login() {
  const [UserNameLogin, setUserNameLogin] = useState("");
  const [UserPasswordLogin, setUserPasswordLogin] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [Loading, setLoading] = useState(false);

  function inputter(e) {
    if (e.target.id === "username") {
      setUserNameLogin(e.target.value);
    } else {
      setUserPasswordLogin(e.target.value);
    }
  }
  async function login(e) {
    e.preventDefault();
    if (UserNameLogin.length === 0 || UserNameLogin.length >= 21) {
      Swal.fire({
        title: "Error!",
        text: "Name's length should between 1 to 20",
        icon: "error",
        confirmButtonText: "OK",
      });
    } else if (
      UserPasswordLogin.length <= 6 ||
      setUserPasswordLogin.length >= 21
    ) {
      Swal.fire({
        title: "Error!",
        text: "Password's length should between 7 to 20",
        icon: "error",
        confirmButtonText: "OK",
      });
    } else {
      setLoading(true);
      const response = await axios.post(
        import.meta.env.VITE_BACKEND_URL + "/login",
        {
          username: UserNameLogin,
          userpassword: UserPasswordLogin,
        }
      );
      setLoading(false);
      if (response.data.isLoggedIn) {
        localStorage.setItem("jwttoken", response.data.jwttoken);
        dispatch(updateUserInfo(response.data));
        // Cookies.set("username", response.data.username);
        navigate("/");
      } else {
        Swal.fire({
          title: "Error!",
          text: "Error occured",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
      setUserNameLogin("");
      setUserPasswordLogin("");
      document.getElementById("username").value = "";
      document.getElementById("password").value = "";
    }
  }
  return (
    <>
      <div className="h-dvh flex justify-center items-center bg-gray-100">
        <div className="bg-white shadow-md rounded-xl p-6 w-[320px]">
          <form className="flex flex-col gap-4">
            <Input
              type="text"
              id="username"
              placeholder="Username"
              className="px-3 py-2 rounded text-black placeholder-gray-400"
              onChange={inputter}
            />
            <Input
              type="password"
              id="password"
              placeholder="Password"
              className="px-3 py-2 rounded text-black placeholder-gray-400"
              onChange={inputter}
            />
            <Button
              type="submit"
              onClick={login}
              disabled={Loading ? true : false}
            >
              {Loading ? (
                <>
                  <Loader2Icon className="animate-spin" />
                  Please wait...
                </>
              ) : (
                <>Login</>
              )}
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}
