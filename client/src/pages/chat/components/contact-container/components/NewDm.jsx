import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Lottie from "react-lottie";
import animationData from "../../../../../assets/lottie-json.json";

import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { apiClient } from "@/lib/api-client";
import { HOST, SEARCH_USERS_ROUTE } from "@/utils/constants";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAppStore } from "@/store";

const NewDm = () => {
    const {setSelectedChatType,setSelectedChatData} = useAppStore()
  const [openNewContact, setOpenNewContact] = useState(false);
  const [searchuser, setsearchuser] = useState([]);
  const { userInfo, setuserInfo } = useAppStore();
  
  const searchUser = async (search) => {
    try {
      if (search.length > 0) {
        const res = await apiClient.post(
          SEARCH_USERS_ROUTE,
          { search },
          { withCredentials: true }
        );
        if (res.status === 200 && res.data.users) {
          setsearchuser(res.data.users);
        }
      } else {
        setsearchuser([]);
      }
    } catch (e) {
      console.log(e);
    }
  };
  const selectNewUser = (user)=>{
    setOpenNewContact(false)
    setSelectedChatType("User")
    setSelectedChatData(user)
    setsearchuser([])
  }
  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <FaPlus
              className="text-white  "
              onClick={() => setOpenNewContact(true)}
            />
          </TooltipTrigger>
          <TooltipContent className="bg-white rounded-lg text-black text-sm p-1 px-2 mb-1">
            New Chat
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <Dialog open={openNewContact} onOpenChange={setOpenNewContact}>
        <DialogContent className="bg-blue-100 border-none rounded-lg  w-[400px] h-[400px] flex flex-col text-black">
          <DialogHeader>
            <DialogTitle>Select User</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div>
            <Input
              placeholder="Search User...."
              onChange={(e) => searchUser(e.target.value)}
            />
          </div>
          <ScrollArea className="h-[250px] ">
            <div className="flex flex-col gap-5">
              {searchuser.map((user) => (
                <div
                  key={user._id}
                  className="flex gap-3 items-center cursor-pointer"
                  onClick={()=>selectNewUser(user)}
                >
                  <div className="flex gap-3 items-center justify-center">
                    <div className="realtive h-12 w-12">
                      <div
                        className={`bg-blue-700  h-12 w-12 rounded-full flex items-center justify-center text-5xl  relative`}
                      >
                        {user.image ? (
                          <img
                            src={`${HOST}/${user.image}`}
                            alt=""
                            className="object-cover w-full h-full bg-black rounded-full"
                          />
                        ) : (
                          <div className="uppercase  rounded-full h-12 w-12 text-center py-2 text-xl">
                            {user.firstname
                              ? user.firstname.split("").shift()
                              : user.email.split("").shift()}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-black ">
                      <div >
                        {user.firstname} {user.lastname}
                      </div>
                      <div className="text-sm italic text-gray-700">
                      {user.email}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
          {searchuser.length <= 0 && (
            <div className="mt-5 flex-1 md:flex flex-col justify-center items-center  duration-1000 transition-all ">
              <Lottie
                isClickToPauseDisabled={true}
                height={150}
                width={150}
                options={{ loop: true, autoplay: true, animationData }}
              />
              <div className="text-opacity-80 text-black flex flex-col items-center mt-5 gap-5  transition-all duration-300">
                <p className="text-2xl">Search User to start chatting</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NewDm;
