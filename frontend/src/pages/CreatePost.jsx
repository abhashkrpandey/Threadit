import Navbar from "../myComponents/Navbar"
import Left from "../myComponents/Left"
import CreatePostContent from "../myComponents/CreatePostContent";
import { useSelector } from "react-redux";
import NotLoggedIn from "./NotLoggedIn";
export default function CreatePost() {
    const userid = useSelector((state) => (state.login.userinfo.userid));
    console.log(userid);
    return (
        <>
            <div>
                <Navbar></Navbar>
            </div>
            <div className="flex flex-row">
                <Left />
                <div className="w-[70%]">
                    {(userid !== null) ?
                        (
                            <CreatePostContent></CreatePostContent>
                        ) : (
                            <NotLoggedIn></NotLoggedIn>
                        )}

                </div>
            </div>
        </>
    )
}
