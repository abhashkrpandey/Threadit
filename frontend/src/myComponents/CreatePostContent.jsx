import { useState, useEffect } from "react";
import * as React from "react";
import {
  CheckIcon,
  ChevronsUpDownIcon,
  Delete,
  Loader2Icon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { toast } from "sonner";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Textarea } from "@/components/ui/textarea";
import { ImageUp } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useSelector } from "react-redux";
import axios from "axios";
import Swal from "sweetalert2";
import { Label } from "@/components/ui/label";

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
  const [validImage, setValidImage] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [api, setApi] = useState(null);
  const [isSaving, setisSaving] = useState(false);
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
        setisSaving(true);
        const formData = new FormData();
        validImage.map((ele) => {
          formData.append("postImages", ele);
        });
        formData.append("posttitle", title);
        formData.append("postbody", postbody);
        formData.append("userid", userid);
        formData.append("communityId", validSubRedditId);
        const response = await axios.post(
          import.meta.env.VITE_BACKEND_URL + "/createpost",
          // {
          // posttitle: title,
          // postbody: postbody,
          // userid: userid,
          // communityId: validSubRedditId,
          formData,
          // }
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${localStorage.getItem("jwttoken")}`,
            },
          }
        );
        setisSaving(false);
        if (response.data.created) {
          Swal.fire({ title: "Post created", icon: "success" });
          settitle("");
          setpostbody("");
          setValidSubRedditId(null);
          setValidSubRedditName(null);
          setsubreddit("");
          setValue("");
          setValidImage("");
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
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwttoken")}`,
          },
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
  function triggerToast() {
    Swal.fire({
      title: "Error",
      text: errorMessage,
    });
    setErrorMessage("");
  }
  useEffect(() => {
    if (errorMessage.length > 0) {
      triggerToast();
    }
  }, [errorMessage]);
  function handleImage(event) {
    //verify that legal image is uploaded only
    setErrorMessage("");
    const file = event.target.files[0];
    const maxSize = 5 * 1024 * 1024;
    if (file != null) {
      if (!file.type.startsWith("image/")) {
        setErrorMessage("Only images are allowed");
      } else if (file.size > maxSize) {
        setErrorMessage("Some image exceeds 5MB limit");
      } else {
        setValidImage((prev) => [...prev, file]);
      }
    } else {
      setErrorMessage("No images uploaded");
    }
  }
  function triggerfunc() {
    // triggers the file upload window
    document.querySelector("#imagefileupload").click();
  }
  console.log(validImage);
  function removeImage() {
    // remove a particular image
    const index = api.selectedScrollSnap();
    setValidImage((prev) => prev.filter((_, i) => i !== index));
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

      <Input
        type="file"
        hidden
        id="imagefileupload"
        onChange={handleImage}
      ></Input>
      <div>
        {validImage == 0 ? (
          <>
            <Button className="bg-gray-300 rounded-sm w-[50vw] h-[20vh] text-gray-400 hover:bg-gray-300">
              <Label className="flex flex-row flex-wrap">
                Upload a image here under 5 MB
                <Button onClick={triggerfunc} className="rounded-full outline">
                  <ImageUp></ImageUp>
                </Button>
              </Label>
            </Button>
          </>
        ) : (
          <div className="w-[30vw] flex flex-col">
            <div className="flex flex-row justify-between">
              {validImage.length >= 5 ? (
                <></>
              ) : (
                <>
                  <Button
                    onClick={triggerfunc}
                    className="rounded-full outline"
                  >
                    <ImageUp></ImageUp>
                  </Button>
                </>
              )}
              {/* <Button onClick={triggerfunc} className="rounded-full outline">
                <ImageUp></ImageUp>
              </Button> */}
              <Button onClick={removeImage}>
                <Trash />
              </Button>
            </div>
            <div className={"flex flex-row justify-center"}>
              <Carousel className="w-[15vw] h-[15vw]" setApi={setApi}>
                <CarouselContent className="w-[15vw] h-[15vw]">
                  {validImage.map((ele) => {
                    return (
                      <CarouselItem>
                        <img
                          src={URL.createObjectURL(ele)}
                          className="relative"
                          width={"100%"}
                          height={"100%"}
                        ></img>
                      </CarouselItem>
                    );
                  })}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </div>
          </div>
        )}
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
          {isSaving ? (
            <>
              <Loader2Icon className="animate-spin" />
              Posting...
            </>
          ) : (
            <>Post</>
          )}
        </Button>
      </div>
    </div>
  );
}
