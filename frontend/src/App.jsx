import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DemoUser from "./pages/DemoUser";
import Inside from "./pages/Inside";
import "react-tooltip/dist/react-tooltip.css";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import "./App.css";
import axios from "axios";
import CreatePost from "./pages/CreatePost";
import { updateUserInfo } from "./reducers/loginSlice";
import CreateSubThreadit from "./pages/CreateSubThreadit";
import SubThreadit from "./pages/SubThreadit";
import PostPage from "./myComponents/PostPage";
import Explore from "./pages/Explore";
import UserProfile from "./pages/UserProfile";

export default function App() {
  axios.defaults.withCredentials = true;
  const dispatch = useDispatch();
  useEffect(() => {
    async function authenticator() {
      const response = await axios.post(
        import.meta.env.VITE_BACKEND_URL + "/authenticator"
      );
      if (response.data.isLoggedIn) {
        dispatch(updateUserInfo(response.data));
      }
    }
    authenticator();
  }, []);
  return (
    <Routes>
      <Route path="/" element={<Home></Home>}></Route>
      <Route path="/login" element={<Login></Login>}></Route>
      <Route path="/register" element={<Register></Register>}></Route>
      <Route path="/demouser" element={<DemoUser></DemoUser>}></Route>
      <Route path="/create" element={<CreatePost></CreatePost>}></Route>
      <Route path="/inside" element={<Inside></Inside>}></Route>
      <Route path="/explore" element={<Explore></Explore>}></Route>
      <Route path="/createsub" element={<CreateSubThreadit></CreateSubThreadit>}></Route>
      <Route path="/t/:subname" element={<SubThreadit></SubThreadit>}></Route>
      <Route path="/post/:postid" element={<PostPage></PostPage>}></Route>
      <Route path="/u/:username" element={<UserProfile></UserProfile>}></Route>
    </Routes>
  );
}
