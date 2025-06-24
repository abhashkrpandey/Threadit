import { useNavigate } from "react-router";
export default function NotLoggedIn() {
    const navigate = useNavigate();
    function loginfunc() {
        navigate("/login");
    }
    function registerfunc() {
        navigate("/register");
    }
        return (
            <div>
                Either you not LoggedIn/Registerd
                <div className="flex flex-row gap-2">
                    <button className="bg-blue-500" onClick={loginfunc}>Login</button>
                    <button className="bg-blue-500" onClick={registerfunc}>Register</button>
                </div>
            </div>
        )
    }
