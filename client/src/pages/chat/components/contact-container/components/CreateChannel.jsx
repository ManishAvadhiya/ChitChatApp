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

import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { apiClient } from "@/lib/api-client";
import {
  CREATE_CHANNEL_ROUTE,
  GET_ALL_USERS,
  HOST,
  SEARCH_USERS_ROUTE,
} from "@/utils/constants";

import { useAppStore } from "@/store";
import MultipleSelector from "@/components/ui/multiselect";
import { toast } from "sonner";

const CreateChannel = () => {
  const { setSelectedChatType, setSelectedChatData,addChannel } = useAppStore();
  const [newChannelModel, setnewChannelModel] = useState(false);
  const [searchuser, setsearchuser] = useState([]);
  const { userInfo, setuserInfo } = useAppStore();
  const [allUser, setAllUser] = useState([]);
  const [selectedUser, setselectedUser] = useState([]);
  const [channelName, setChannelName] = useState("");
  useEffect(() => {
    const getData = async () => {
      const res = await apiClient.get(GET_ALL_USERS, { withCredentials: true });
      setAllUser(res.data.contacts);

    };
    getData();
  }, []);
  const createChannel = async () => {
    try {
      if (channelName.length > 0 && selectedUser.length > 0) {
        const res = await apiClient.post(CREATE_CHANNEL_ROUTE, {
          name: channelName,
          members: selectedUser.map((user) => (user.value)),
         
        },{ withCredentials:true});
        if(res.status === 201){
            setChannelName("")
            setselectedUser([])
            setnewChannelModel(false)
            addChannel(res.data.channel)
            toast.success("Channel created successfully");
            
        }
      }
      
    } catch (e) {
      console.error("Error creating channel", e);
    }
  };
  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <FaPlus
              className="text-white  "
              onClick={() => setnewChannelModel(true)}
            />
          </TooltipTrigger>
          <TooltipContent className="bg-white rounded-lg text-black text-sm p-1 px-2 mb-1">
            Create new Channel
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <Dialog open={newChannelModel} onOpenChange={setnewChannelModel}>
        <DialogContent className="bg-blue-100 border-none rounded-lg  w-[400px] h-[400px] flex flex-col text-black">
          <DialogHeader>
            <DialogTitle>Select Channel</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div>
            <Input
              placeholder="Channel Name"
              value={channelName}
              onChange={(e) => setChannelName(e.target.value)}
            />
          </div>
          <div>
            <MultipleSelector
              className="rounded-lg bg-white border-none py-2 text-black "
              defaultOptions={allUser}
              placeholder="Search User"
              value={selectedUser}
              onChange={setselectedUser}
              emptyIndicator={
                <p className="text-center text-gray-500 text-lg leading-10 bg-white">
                  No results found..
                </p>
              }
            />
          </div>
          <div>
            <button
              className="w-full bg-blue-400 hover:bg-blue-600 p-2 rounded-md  transition-all duration-300"
              onClick={createChannel}
            >
              Create Channel
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateChannel;
