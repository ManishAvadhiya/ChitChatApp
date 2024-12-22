import { useAppStore } from "@/store";
import { HOST } from "@/utils/constants";
import React from "react";
import { RiCloseFill } from "react-icons/ri";
const ChatHeader = () => {
  const { closeChat, selectedChatData,selectedChatType } = useAppStore();
  return (
    <div className="h-[8vh] border-b-2 border-blue-950 flex items-center justify-between px-10 ">
      <div className="flex gap-5 items-center">
        <div className="flex gap-3 items-center justify-center">
          {selectedChatType === "User" && <div className="realtive h-12 w-12">
            <div
              className={`bg-blue-700  h-12 w-12 rounded-full flex items-center justify-center text-5xl  relative`}
            >
              {selectedChatData.image ? (
                <img
                  src={`${HOST}/${selectedChatData.image}`}
                  alt=""
                  className="object-cover w-full h-full bg-black rounded-full"
                />
              ) : (
                <div className="uppercase  rounded-full h-12 w-12 text-center py-2 text-xl">
                  {selectedChatData.firstname
                    ? selectedChatData.firstname.split("").shift()
                    : selectedChatData.email.split("").shift()}
                </div>
              )}
            </div>
          </div>}
          <div className="text-black font-serif text-2xl">
            {selectedChatType === "User" && selectedChatData.firstname  ? (
              <div>
                {selectedChatData.firstname} {selectedChatData.lastname}
              </div>
            ) : (
              <div className="text-xl ">
                {selectedChatData.email}
              </div>
            )}
            {selectedChatType === "Channel" && (
              <div className="flex justify-center items-center gap-3 text-xl font-serif">
                <div className="h-10 w-10 rounded-full flex justify-center items-center bg-blue-800">
                #
              </div>
              <div className="text-black font-serif text-2xl">
                {selectedChatData.name}
              </div>
              </div>

            )}
          </div>
        </div>
      </div>
      <div className="flex gap-3 items-center justify-center">
        <div className="flex gap-5 items-center justify-center">
          <button
            className="text-neutral-500 focus:border-none focus:outline-none focus:text-blue-950 duration-300 transition-all"
            onClick={closeChat}
          >
            <RiCloseFill className="text-3xl" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
