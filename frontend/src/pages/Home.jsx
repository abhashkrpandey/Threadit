import Navbar from "../components/Navbar"
import Left from "../components/Left"
import Right from "../components/Right"
import Middle from "../components/Middle"

export default function Home() {
    
    return (
        <>
            <div>
                <Navbar></Navbar>
            </div>
            <div className="flex flex-row">
                <Left />
                <Middle />
                <Right />
            </div>
        </>
    )
}