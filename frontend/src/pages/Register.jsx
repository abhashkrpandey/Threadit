import { useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import Swal from "sweetalert2";
import {useDispatch} from "react-redux";
import { updateUserInfo } from "../reducers/loginSlice";
export default function Register() {
    const [UserName, setUserName] = useState("");
    const dispatch=useDispatch();
    const [UserPassword, setUserPassword] = useState("");
    const navigate = useNavigate();
    function inputter(e) {
        if (e.target.id === "username") {
            setUserName(e.target.value);
        }
        else {
            setUserPassword(e.target.value);
        }
    }
    async function register(e) {
        e.preventDefault();
        if ((UserName.length === 0 || UserName.length >= 21)) {
            Swal.fire({
                title: "Error!",
                text: "Name's length should between 1 to 20",
                icon: "error",
                confirmButtonText: "OK"
            })
        }
        else if (UserPassword.length <= 6 || UserPassword.length >= 21) {
            Swal.fire({
                title: "Error!",
                text: "Password's length should between 7 to 20",
                icon: "error",
                confirmButtonText: "OK"
            })
        }
        else {
            const response = await axios.post("http://localhost:3000/register", {
                username: UserName,
                userpassword: UserPassword,
            })
            if (response.data.isLoggedIn) {
                dispatch(updateUserInfo(response.data));
                // Cookies.set("username",response.data.username);
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
            setUserName("");
            setUserPassword("");
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
                    <button type="submit" className="bg-gray-300" onClick={register}>Register</button>
                </form>
            </div>
        </>
    )
}