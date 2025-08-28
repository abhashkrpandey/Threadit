import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Bookmark } from "lucide-react";
import axios from "axios";
export default function BookMark({ bookmarkCount, hasbookmarked, postid }) {
  const [bookmarkLive, setbookmarkLive] = useState(Number(bookmarkCount));
  const [hasBookmarked, sethasBookmarked] = useState(hasbookmarked);
  async function bookmarkFunc(event) {
    event.stopPropagation();
    const response = await axios.post(
      import.meta.env.VITE_BACKEND_URL + "/bookmarkpost",
      {
        postid: postid,
      },
      {
         headers: {
            Authorization: `Bearer ${localStorage.getItem("jwttoken")}`,
          }
      }
    );
    if (response.data.isbookmarked) {
      setbookmarkLive(bookmarkLive + 1);
      sethasBookmarked(true);
    } else if (response.data.isbookmarked === false) {
      setbookmarkLive(bookmarkLive - 1);
      sethasBookmarked(false);
    }
  }
  return (
    <>
      <Button
        variant={"outline"}
        onClick={bookmarkFunc}
        className={"hover:bg-gray-300 dark:border-gray-500"}
      >
        {hasBookmarked ? (
          <Bookmark className="fill-orange-500" />
        ) : (
          <Bookmark />
        )}
        {bookmarkLive}
      </Button>
    </>
  );
}
