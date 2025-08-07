import { useParams } from "react-router"
import Navbar from "../myComponents/Navbar";
import Left from "../myComponents/Left";
import Right from "../myComponents/Right";
import { useState, useEffect } from "react";
import axios from "axios";
import SubThreaditContent from "../myComponents/SubThreaditContent";
import { useDispatch } from "react-redux";
import { updateCurrentActivity } from "../reducers/loginSlice";
export default function SubThreadit() {
    const dispatch=useDispatch();
    const { subname } = useParams();
    const [isValid, setIsValid] = useState(false);
    useEffect(() => {
        async function validPathOrNot() {
            const response = await axios.post(import.meta.env.VITE_BACKEND_URL + "/validpathchecker",
                {
                    subname: subname
                },{
                     headers: {
            Authorization: `Bearer ${localStorage.getItem("jwttoken")}`,
          }
                }
            );
            if(response.data.isValid)
            {
                dispatch(updateCurrentActivity(response.data.community));
                setIsValid(response.data.isValid);
            }
        }
        validPathOrNot();
    }, [subname]);
    return (
        <>
            <div>
                <Navbar></Navbar>
            </div>
            <div className="flex flex-row ">
                <Left />
                {isValid ? (
                    <div className="w-[90%] ">
                    <SubThreaditContent></SubThreaditContent>
                    </div>
                ) : (
                    <div>Not a valid page</div>
                )}
                <div><Right /></div>
            </div>
        </>
    )
}