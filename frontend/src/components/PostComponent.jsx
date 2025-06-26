import bookmark from "../assets/bookmark.svg";
import downward from "../assets/downward.svg";
import upward from "../assets/upward.svg";
export default function PostComponent({title,userid,postbody,upvote,downvote,bookmarked,username}) {
  return <>
    <div className="flex flex-col">
        <div>Title:{title}</div>
        <div>Post by :{`/u/${username}`}</div>
        <div>Content:{postbody}</div>
        <div className="flex flex-row">
            <div className="flex flex-row"><img src={upward} width={16} height={16}></img>{upvote}</div>
            <div className="flex flex-row"><img src={downward} width={16} height={16}></img>{downvote}</div>
            <div className="flex flex-row"><img src={bookmark} width={16} height={16}></img>{bookmarked}</div>
        </div>
    </div>
  </>;
}
