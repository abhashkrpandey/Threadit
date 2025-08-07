import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DemoUser from "./pages/DemoUser";
import Inside from "./pages/Inside";
import "react-tooltip/dist/react-tooltip.css";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./App.css";
import axios from "axios";
import CreatePost from "./pages/CreatePost";
import { updateUserInfo } from "./reducers/loginSlice";
import CreateSubThreadit from "./pages/CreateSubThreadit";
import SubThreadit from "./pages/SubThreadit";
import PostPage from "./myComponents/PostPage";
import Explore from "./pages/Explore";
import UserProfile from "./pages/UserProfile";
import Cookies from "js-cookie";
import socket from "./socket";
import Swal from "sweetalert2";

export default function App() {
  axios.defaults.withCredentials = true;
  axios.defaults.baseURL = "https://threadit-155p.onrender.com";
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.login.userinfo.isLoggedIn);
  useEffect(() => {
    async function authenticator() {
      const response = await axios.post(
        import.meta.env.VITE_BACKEND_URL + "/authenticator"
      );
      if (response.data.isLoggedIn) {
        dispatch(
          updateUserInfo({
            isLoggedIn: response.data.isLoggedIn,
            username: response.data.username,
            userid: response.data.userid,
            useravatar: response.data.useravatar,
          })
        );
      }
    }
    if (navigator.onLine) {
      authenticator();
    } else {
      Swal.fire({
        title: "you are offline",
        timer: 2000,
      });
    }
  }, [navigator.onLine]);
  useEffect(() => {
    const token = Cookies.get("jwttoken");
    console.log(token);

    if (token) {
      if (!socket.connected) {
        socket.auth = { token: token };
        socket.connect();
      }

      socket.on("connect", () => {});

      socket.on("connect_error", (err) => {});
    } else {
      if (socket.connected) {
        socket.disconnect();
      }
    }

    return () => {
      if (socket.connected) {
        socket.disconnect();
      }
    };
  }, [isLoggedIn]);
  return (
    <Routes>
      <Route path="/" element={<Home></Home>}></Route>
      <Route path="/login" element={<Login></Login>}></Route>
      <Route path="/register" element={<Register></Register>}></Route>
      <Route path="/demouser" element={<DemoUser></DemoUser>}></Route>
      <Route path="/create" element={<CreatePost></CreatePost>}></Route>
      <Route path="/inside" element={<Inside></Inside>}></Route>
      <Route path="/explore" element={<Explore></Explore>}></Route>
      <Route
        path="/createsub"
        element={<CreateSubThreadit></CreateSubThreadit>}
      ></Route>
      <Route path="/t/:subname" element={<SubThreadit></SubThreadit>}></Route>
      <Route path="/post/:postid" element={<PostPage></PostPage>}></Route>
      <Route path="/u/:username" element={<UserProfile></UserProfile>}></Route>
    </Routes>
  );
}
