import { useEffect } from "react";
import { useParams } from "react-router";
import Swal from "sweetalert2";
import Navbar from "../myComponents/Navbar";
import Left from "../myComponents/Left";
import Right from "../myComponents/Right";
import axios from "axios";
import { useState } from "react";
export default function UserProfile() {
  const params = useParams();
  const username = params.username;
  const [userinfo, setuserInfo] = useState({});
  useEffect(() => {
    async function checker() {
      const response = await axios.post(
        import.meta.env.VITE_BACKEND_URL + "/uservalid",
        {
          username: username,
        }
      );
      if (response.data.isValidUser) {
        console.log(response.data.userinfo);
        setuserInfo(response.data.userinfo);
      } else if (response.data.isValidUser == false) {
        Swal.fire({
          title: "Not a  valid user",
          icon: "error",
        });
      } else if (response.data.message) {
        Swal.fire({
          title: response.data.message,
          icon: "error",
        });
      }
    }
    checker();
  }, []);
  return (
    <>
      <div>
        <Navbar></Navbar>
      </div>
      <div className="flex flex-row">
        <Left />
        <div className="flex flex-col">
          <div>
            {userinfo.username !== undefined ? (
              <div>
                <div>{userinfo.username}</div>
                <div>u/{userinfo.username}</div>
              </div>
            ) : (
              <div></div>
            )}
          </div>
          <div className="flex flex-row">
            <div>Like</div>
            <div>Dislike</div>
            <div>BookMark</div>
            <div>Post</div>
          </div>
        </div>
        <Right />
      </div>
    </>
  );
}
