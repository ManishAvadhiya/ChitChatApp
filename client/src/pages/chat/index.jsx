import { useAppStore } from "@/store";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Contact from "./components/contact-container";
import EmptyChatContainer from "./components/empty-container";
import Chatcontainer from "./components/chat-container";
const Chat = () => {
  const {
    userInfo,
    selectedChatType,
    isUploading,
    isDownloading,
    fileUploadProgress,
    fileDownloadProgress,
  } = useAppStore();
  const navigate = useNavigate();
  useEffect(() => {
    if (!userInfo.profileSetup) {
      toast("Please setup your profile to continue..");
      navigate("/profile");
    }
  }, [userInfo, navigate]);

  return (
    <div className="flex h-[100vh] text-white overflow-hidden">
      {
        isUploading && (
          <div className="fixed top-0 left-0 w-full h-full bg-black opacity-50 z-50 flex items-center justify-center">
            <div className="text-white text-xl animate-pulse">Uploading...</div>
            {fileUploadProgress}%
          </div>
        )
      }
      {
        isDownloading && (
          <div className="fixed top-0 left-0 w-full h-full bg-black opacity-50 z-50 flex items-center justify-center">
            <div className="text-white text-xl animate-pulse">Downloading...</div>
            {fileDownloadProgress}%
          </div>
        )
      }
      <Contact />
      {selectedChatType === undefined ? (
        <EmptyChatContainer />
      ) : (
        <Chatcontainer />
      )}
    </div>
  );
};

export default Chat;
