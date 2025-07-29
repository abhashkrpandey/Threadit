import Navbar from "../myComponents/Navbar";
import Left from "../myComponents/Left";
import Right from "../myComponents/Right";
import Middle from "../myComponents/Middle";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Home() {
  return (
    <div className="h-dvh flex flex-col overflow-hidden">
      <div>
        <Navbar></Navbar>
      </div>
      <div className="flex h-screen">
        <Left />
        <div className="flex-1 ">
          <ScrollArea className="h-full">
            <div className="pb-[60px]">
            <Middle />
            </div>
          </ScrollArea>
        </div>
        <Right />
      </div>
    </div>
  );
}
