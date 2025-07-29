import { useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
export default function SubThreaditContentHeader() {
  const SubThreaditDetails = useSelector(
    (state) => state.activity.currentActivity.SubThreaditDetails
  );
  return (
    <>
      <div className="relative border-1 border-gray-300 rounded-xl h-[15%]">
          <Avatar className=" absolute bottom-0 left-0 size-20" >
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className=" absolute bottom-0 left-30 size-20 flex flex-row content-center flex-wrap">
            <div>r/{SubThreaditDetails.subname}</div>
            </div>
      </div>
    </>
  );
}
