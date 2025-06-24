import { useSelector } from "react-redux";
export default function SubThreaditContentHeader() {
  const SubThreaditDetails = useSelector(
    (state) => state.activity.currentActivity.SubThreaditDetails
  );
  return (
    <>
      <div className="flex flex-col justify-between bg-amber-300  sticky">
        <div>Welcome to {SubThreaditDetails.subname}</div>
        <div className="flex flex-row justify-between">
          <div className="flex flex-col bg-amber-900">
            <div>r/{SubThreaditDetails.subname}</div>
            <div>Active Members:{SubThreaditDetails.membersCount}</div>
          </div>
          <div className="flex flex-col bg-amber-700">
            <div>{SubThreaditDetails.subdescription}</div>
            <div>createdAt:{SubThreaditDetails.createdAt}</div>
            <div>{SubThreaditDetails.accessiblity}</div>
          </div>
        </div>
      </div>
    </>
  );
}
