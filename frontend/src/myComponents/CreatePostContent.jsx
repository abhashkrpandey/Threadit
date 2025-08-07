import { useState, useEffect } from "react";
import * as React from "react";
import { CheckIcon, ChevronsUpDownIcon, Loader2Icon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSelector } from "react-redux";
import axios from "axios";
import Swal from "sweetalert2";

// Debounce hook
function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debounced;
}

export default function CreatePostContent() {
  const userid = useSelector((state) => state.login.userinfo.userid);

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  const [title, settitle] = useState("");
  const [postbody, setpostbody] = useState("");
  const [subRedditName, setsubreddit] = useState("");
  const [arraySubRedditName, setArrayValidSubRedditName] = useState([]);
  const [validSubRedditId, setValidSubRedditId] = useState(null);
  const [validSubRedditName, setValidSubRedditName] = useState(null);
  const [isLoading, setisLoading] = useState(false);

  const debouncedSubRedditName = useDebounce(subRedditName);

  useEffect(() => {
    if (debouncedSubRedditName.trim().length > 0) {
      searchCommunityFunc(debouncedSubRedditName);
    } else {
      setArrayValidSubRedditName([]);
    }
  }, [debouncedSubRedditName]);

  function postcontent(e) {
    if (e.target.id === "title") {
      settitle(e.target.value);
    } else {
      setpostbody(e.target.value);
    }
  }

  function communityNameSetter(id, name) {
    setValidSubRedditId(id);
    setValidSubRedditName(name);
    setValue(name);
    setOpen(false);
  }

  async function postfunc() {
    if (title.length < 4) {
      Swal.fire({ title: "Title too short", icon: "error" });
    } else if (!validSubRedditName) {
      Swal.fire({
        title: "Invalid community name",
        text: "Select a valid community name",
        icon: "warning",
      });
    } else {
      try {
        const response = await axios.post(
          import.meta.env.VITE_BACKEND_URL + "/createpost",
          {
            posttitle: title,
            postbody: postbody,
            userid: userid,
            communityId: validSubRedditId,
          },
          {
          withCredentials:true
        }
        );
        if (response.data.created) {
          Swal.fire({ title: "Post created", icon: "success" });
          settitle("");
          setpostbody("");
          setValidSubRedditId(null);
          setValidSubRedditName(null);
          setsubreddit("");
          setValue("");
          document.getElementById("title").value = "";
          document.getElementById("body").value = "";
        } else if (response.data.message) {
          Swal.fire({ title: response.data.message, icon: "error" });
          settitle("");
          setpostbody("");
          setValidSubRedditId(null);
          setValidSubRedditName(null);
          setsubreddit("");
          setValue("");
          document.getElementById("title").value = "";
          document.getElementById("body").value = "";
        } else {
          Swal.fire({ title: "Some error occurred", icon: "error" });
        }
      } catch (err) {
        Swal.fire({ title: "Server Error", icon: "error" });
      }
    }
  }

  async function searchCommunityFunc(query) {
    setisLoading(true);
    try {
      const response = await axios.post(
        import.meta.env.VITE_BACKEND_URL + "/searchcommunity",
        { subRedditName: query },
        {
          withCredentials:true
        }
      );
      if (response.data.found) {
        setArrayValidSubRedditName(response.data.subReddits);
      } else {
        setArrayValidSubRedditName([]);
      }
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setisLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="text-2xl">Create Post</div>

      <div>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-[300px] justify-between"
            >
              {value || "Search community..."}
              <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[300px] p-0">
            <Command>
              <CommandInput
                placeholder="Search community..."
                value={subRedditName}
                onValueChange={(val) => {
                  setsubreddit(val);
                }}
              />
              <CommandList>
                {isLoading && <div className="p-2">Loading...</div>}
                <CommandEmpty>No community found.</CommandEmpty>
                <CommandGroup>
                  {arraySubRedditName.map((community) => (
                    <CommandItem
                      key={community._id}
                      value={community.subname}
                      onSelect={() =>
                        communityNameSetter(
                          community._id.toString(),
                          community.subname
                        )
                      }
                    >
                      <CheckIcon
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === community.subname
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      {community.subname}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      <div>
        <Input
          id="title"
          maxLength={300}
          placeholder="Title"
          className="bg-gray-300 rounded-sm w-[50vw] h-[5vh]"
          onChange={postcontent}
        />
        <div>{title.length}/300</div>
      </div>

      <div>
        <Textarea
          id="body"
          placeholder="Body Text"
          className="bg-gray-300 rounded-sm w-[50vw] h-[20vh] p-2"
          onChange={postcontent}
        ></Textarea>
      </div>

      <div className="flex justify-end gap-2">
        <Button className="bg-blue-600 text-white px-4 py-2 rounded">
          Save Draft
        </Button>
        <Button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={postfunc}
        >
          Post
        </Button>
      </div>
    </div>
  );
}
