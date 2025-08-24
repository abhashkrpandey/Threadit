import { useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
export default function SubThreaditContentHeader() {
  const SubThreaditDetails = useSelector(
    (state) => state.activity.currentActivity.SubThreaditDetails
  );
  return (
    <div className="sticky top-0 z-10 bg-gray-50 border-b border-gray-300 p-4 flex items-center space-x-4">
      <Avatar className="size-20">
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <div className="text-lg font-semibold">
        r/{SubThreaditDetails?.subname || "unknown"}
      </div>
    </div>
  );
}
