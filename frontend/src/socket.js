import {io} from "socket.io-client";
import Cookies from 'js-cookie';
const socket =io(import.meta.env.VITE_BACKEND_URL,
    {
        autoConnect:false,
        auth:{
          token:  Cookies.get("jwttoken")
        }
    }
);

export default socket;