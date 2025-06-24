import { useNavigate } from "react-router";
import axios from "axios";
import { useState } from "react";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { updateUserInfo } from "../reducers/loginSlice";
export default function Login() {
    const [UserNameLogin, setUserNameLogin] = useState("");
    const [UserPasswordLogin, setUserPasswordLogin] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();
    function inputter(e) {
        if (e.target.id === "username") {
            setUserNameLogin(e.target.value);
        }
        else {
            setUserPasswordLogin(e.target.value);
        }
    }
    async function login(e) {
        e.preventDefault();
        if ((UserNameLogin.length === 0 || UserNameLogin.length >= 21)) {
            Swal.fire({
                title: "Error!",
                text: "Name's length should between 1 to 20",
                icon: "error",
                confirmButtonText: "OK"
            })
        }
        else if (UserPasswordLogin.length <= 6 || setUserPasswordLogin.length >= 21) {
            Swal.fire({
                title: "Error!",
                text: "Password's length should between 7 to 20",
                icon: "error",
                confirmButtonText: "OK"
            })
        }
        else {
            const response = await axios.post("http://localhost:3000/login", {
                username: UserNameLogin,
                userpassword: UserPasswordLogin
            })
            if (response.data.isLoggedIn) {
                dispatch(updateUserInfo(response.data));
                // Cookies.set("username", response.data.username);
                navigate("/");
            }
            else {
                Swal.fire({
                    title: 'Error!',
                    text: "Error occured",
                    icon: 'error',
                    confirmButtonText: 'OK'
                })
            }
            setUserNameLogin("");
            setUserPasswordLogin("");
            document.getElementById("username").value="";
            document.getElementById("password").value="";

        }
    }
    return (
        <>
            <div className="bg-amber-200 h-dvh flex flex-row justify-center">
                <form className="flex flex-col w-100 ">
                    <input type="text" id="username" placeholder="Username" className="bg-pink-400" onChange={inputter} />
                    <input type="password" id="password" placeholder="Password" className="bg-pink-400" onChange={inputter} />
                    <button type="submit" className="bg-gray-300" onClick={login}>Login</button>
                </form>
            </div>

        </>
    )
}