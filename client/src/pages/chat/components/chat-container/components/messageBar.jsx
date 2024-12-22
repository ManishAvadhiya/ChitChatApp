import React, { useEffect, useRef, useState } from "react";
import { GrAttachment } from "react-icons/gr";
import { RiEmojiStickerLine } from "react-icons/ri";
import { IoAlbumsOutline, IoSend } from "react-icons/io5";
import EmojiPicker from "emoji-picker-react";
import { useAppStore } from "@/store";
import { useSocket } from "@/context/SocketContext.jsx";
import { apiClient } from "@/lib/api-client";
import { UPLOAD_FILE_ROUTE } from "@/utils/constants";
const MessageBar = () => {
  const { selectedChatType, selectedChatData, userInfo ,setIsUploading,setFileUploadProgress} = useAppStore();
  const socket = useSocket();
  const emojiRef = useRef();
  const fileinputRef = useRef();
  const [emojipickeropen, setEmojipickeropen] = useState(false);
  const [message, setmessage] = useState("");
  useEffect(() => {
    function handleclickOutside(e) {
      if (emojiRef.current && !emojiRef.current.contains(e.target)) {
        setEmojipickeropen(false);
      }
    }
    document.addEventListener("mousedown", handleclickOutside);
    return () => {
      document.removeEventListener("mousedown", handleclickOutside);
    };
  });
  const handlemessage = () => {
    if (selectedChatType === "User" && message !== "") {
      socket.emit("sendMessage", {
        sender: userInfo.id,
        content: message,
        receiver: selectedChatData._id,
        messageType: "text",
        fileUrl: undefined,
      });
    }else if(selectedChatType === "Channel" && message !== ""){
      socket.emit("send-channel-Message", {
        sender: userInfo.id,
        content: message,
        messageType: "text",
        fileUrl: undefined,
        channelId: selectedChatData._id,
      });
    }
    setmessage("");
  };
  const handleAddEmoji = (emoji) => {
    setmessage((msg) => msg + emoji.emoji);
  };
  const handleAddFile = () => {
    if (fileinputRef.current) {
      fileinputRef.current.click();
    }
  };
  const handleAddFileToChat = async () => {
    try {
      const file = event.target.files[0];
      if(file){
        const formData = new FormData();
        formData.append("file", file);
        setIsUploading(true)
        const res = await apiClient.post(UPLOAD_FILE_ROUTE, formData,{withCredentials:true,
          onUploadProgress: (progressEvent) => {
            setFileUploadProgress(
              Math.round((progressEvent.loaded / progressEvent.total) * 100)
            );
          }
        })
        
        
        if(res.status == 200 && res.data){
          setIsUploading(false)
          if(selectedChatType === "User"){
            socket.emit("sendMessage", {
              sender: userInfo.id,
              content: undefined,
              receiver: selectedChatData._id,
              messageType: "file",
              fileUrl: res.data.filePath,
            });
            console.log({file})
          }else if(selectedChatType === "Channel"){
            socket.emit("send-channel-Message", {
              sender: userInfo.id,
              content: undefined,
              
              messageType: "file",
              fileUrl: res.data.filePath,
              channelId: selectedChatData._id,
            });
          } 
        }
      }
    } catch (e) {
      setIsUploading(false)
      console.error("Error adding file to chat", e);
    }
  };
  return (
    <div className="h-[6vh]   flex justify-center items-center gap-6 px-8 mb-5">
      <div className="flex-1 flex  rounded-md gap-5 items-center pr-5 ">
        <input
          type="text"
          className="flex-1 p-5 bg-transparent rounded-md focus:border-none focus:outline-none text-blue-800 "
          placeholder="Type your message here..."
          value={message}
          onChange={(e) => setmessage(e.target.value)}
        />

        <button
          className="text-neutral-500 focus:border-none focus:outline-none focus:text-blue-950 duration-300 transition-all"
          onClick={handleAddFile}
        >
          <GrAttachment className="text-xl" />
        </button>
        <input
          type="file"
          onChange={handleAddFileToChat}
          style={{ display: "none" }}
          ref={fileinputRef}
        />
        <div className="relative">
          <button
            className="text-neutral-500 focus:border-none focus:outline-none focus:text-blue-950 duration-300 transition-all"
            onClick={() => setEmojipickeropen(!emojipickeropen)}
          >
            <RiEmojiStickerLine className="text-2xl" />
          </button>
          <div className="absolute bottom-16 right-[-70px] " ref={emojiRef}>
            <EmojiPicker
              open={emojipickeropen}
              onEmojiClick={handleAddEmoji}
              autoFocusSearch={false}
            />
          </div>
        </div>
      </div>
      <button
        className="text-white focus:border-none focus:outline-none focus:text-white duration-300 transition-all bg-blue-950 p-4 rounded-full"
        onClick={handlemessage}
      >
        <IoSend className="text-lg" />
      </button>
    </div>
  );
};

export default MessageBar;
