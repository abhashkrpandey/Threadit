import { useParams } from "react-router";
import Navbar from "../myComponents/Navbar";
import Left from "../myComponents/Left";
import Right from "../myComponents/Right";
import { useState, useEffect } from "react";
import axios from "axios";
import SubThreaditContent from "../myComponents/SubThreaditContent";
import { useDispatch } from "react-redux";
import { updateCurrentActivity } from "../reducers/loginSlice";

export default function SubThreadit() {
  const dispatch = useDispatch();
  const { subname } = useParams();
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    async function validPathOrNot() {
      const response = await axios.post(
        import.meta.env.VITE_BACKEND_URL + "/validpathchecker",
        { subname },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwttoken")}`,
          },
        }
      );
      if (response.data.isValid) {
        dispatch(updateCurrentActivity(response.data.community));
        setIsValid(true);
      }
    }
    validPathOrNot();
  }, [subname]);

  return (
    <div className="h-screen flex flex-col overflow-y-hidden">
      <div >
        <Navbar />
      </div>

      <div className="flex flex-1 overflow-y-hidden">
          <Left />
        <div className="flex-1 overflow-y-auto ">
          {isValid ? (
            <SubThreaditContent />
          ) : (
            <div className="p-4">Not a valid page</div>
          )}
        </div>
          <Right />
      </div>
    </div>
  );
}
