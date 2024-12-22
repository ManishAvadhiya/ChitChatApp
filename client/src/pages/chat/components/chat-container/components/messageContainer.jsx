import { apiClient } from "@/lib/api-client";
import { useAppStore } from "@/store";
import { GET_CHANNEL_MESSAGES, GET_MESSAGES_ROUTE, HOST } from "@/utils/constants";
import { Divide } from "lucide-react";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { MdFolderZip } from "react-icons/md";
import { IoMdArrowRoundDown } from "react-icons/io";
import { IoCloseSharp } from "react-icons/io5";
const MessageContainer = () => {
  const scrollRef = useRef();
  const {
    selectedChatType,
    selectedChatData,
    userInfo,
    selectedChatMessages,
    setSelectedChatMessages,
    setIsDownloading,
    setFileDownloadProgress,
  } = useAppStore();
  const [showImage, setshowImage] = useState(false);
  const [imageURL, setImageURL] = useState(null);
  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await apiClient.post(
          GET_MESSAGES_ROUTE,
          { id: selectedChatData._id },
          { withCredentials: true }
        );
        if (res.data.messages) {
          setSelectedChatMessages(res.data.messages);
        }
      } catch (e) {
        console.error("Error getting messages", e);
      }
    };
    const getChannelMessages = async () => {
      try {
        
        const res = await apiClient.get(
          `${GET_CHANNEL_MESSAGES}/${selectedChatData._id}`,

          { withCredentials: true }
        );
        if (res.data.messages) {
          setSelectedChatMessages(res.data.messages);
        }
      } catch (e) {
        console.error("Error getting channel messages", e);
      }
    };
    if (selectedChatData._id) {
      if (selectedChatType === "User") getMessages();
      else if (selectedChatType === "Channel") getChannelMessages();
    }
  }, [selectedChatData, selectedChatType, setSelectedChatMessages]);
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedChatMessages]);
  const renderMessage = () => {
    let lastdate = null;
    return selectedChatMessages.map((message, idx) => {
      const messageDate = moment(message.timestamp).format("YYYY-MM-DD");
      const showDate = messageDate !== lastdate;
      lastdate = messageDate;
      return (
        <div key={idx}>
          {showDate && (
            <div className="text-center text-gray-700 my-2">
              {moment(message.timestamp).format("LL")}
            </div>
          )}
          {selectedChatType === "User" && renderDmmessage(message)}
          {selectedChatType === "Channel" && renderChannelMessage(message)}
        </div>
      );
    });
  };
  const checkIfImage = (filePath) => {
    const imageRegex =
      /\.(jpg|jpeg|png|gif|bmp|tiff|tif|webp|svg|ico|heic|heif)$/i;
    return imageRegex.test(filePath);
  };
  const downloadFile = async (file) => {
    setIsDownloading(true);
    setFileDownloadProgress(0);
    const res = await apiClient.get(`${HOST}/${file}`, {
      responseType: "blob",
      onDownloadProgress: (progressEvent) => {
        setFileDownloadProgress(
          Math.round((progressEvent.loaded / progressEvent.total) * 100)
        );
      },
    });
    const urlBlob = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");
    link.href = urlBlob;
    link.setAttribute("download", file.split("/").pop());
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(urlBlob);
    setIsDownloading(false);
    setFileDownloadProgress(0);
  };
  const renderDmmessage = (message) => (
    <div
      className={`${
        message.sender === selectedChatData._id ? "text-left" : "text-right"
      }`}
    >
      {message.messageType === "text" && (
        <div
          className={`${
            message.sender !== selectedChatData._id
              ? "bg-blue-900 text-white border-blue-950/50  rounded-br-md"
              : "bg-gray-200 text-black border-gray-800/50 rounded-tl-md"
          } border inline-block p-2 px-3 rounded-full my-1 max-w-[70%] break-words`}
        >
          {message.content}
        </div>
      )}
      {message.messageType === "file" && (
        <div
          className={`${
            message.sender !== selectedChatData._id
              ? "bg-blue-900 text-white border-blue-950/50  "
              : "bg-gray-200 text-black border-gray-800/50 "
          } border inline-block p-2 px-3 rounded-lg my-1 max-w-[70%] break-words`}
        >
          {checkIfImage(message.fileUrl) ? (
            <div
              className="cursor-pointer"
              onClick={() => {
                setshowImage(true);
                setImageURL(message.fileUrl);
              }}
            >
              <img
                src={`${HOST}/${message.fileUrl}`}
                alt=""
                height={300}
                width={300}
              />
            </div>
          ) : (
            <div className="flex items-center justify-center gap-4">
              <span className="text-white/80 text-3xl bg-black/20 rounded-full p-3">
                <MdFolderZip />
              </span>
              <span>{message.fileUrl.split("/").pop()}</span>
              <span
                className="bg-black/20 text-2xl p-3 rounded-full hover:bg-black/50"
                onClick={() => downloadFile(message.fileUrl)}
              >
                <IoMdArrowRoundDown />
              </span>
            </div>
          )}
        </div>
      )}

      <div className="text-xs text-gray-600 mx-2">
        {moment(message.timestamp).format("LT")}
      </div>
    </div>
  );
  const renderChannelMessage = (message) => {
    return (
      <div
        className={`mt-5 ${
          message.sender._id !== userInfo.id ? "text-left" : "text-right"
        }`}
      >
        {message.sender._id !== userInfo.id && (
          <div className="flex gap-5 items-center">
            <div className="flex gap-3 items-center justify-center">
              <div className="realtive h-8 w-8">
                <div
                  className={`bg-blue-700  h-8 w-8 rounded-full flex items-center justify-center text-5xl  relative`}
                >
                  {message.sender.image ? (
                    <img
                      src={`${HOST}/${message.sender.image}`}
                      alt=""
                      className="object-cover w-full h-full bg-black rounded-full"
                    />
                  ) : (
                    <div className="uppercase  rounded-full h-12 w-12 text-center py-2 text-xl">
                      {message.sender.firstname
                        ? message.sender.firstname.split("").shift()
                        : message.sender.email.split("").shift()}
                    </div>
                  )}
                </div>
              </div>
              <div className="text-black font-serif ">
                {`${message.sender.firstname} ${message.sender.lastname}`}
              </div>
            </div>
          </div>
        )}
        {message.messageType === "text" && (
          <div
            className={`${
              message.sender._id === userInfo.id
                ? "bg-blue-900 text-white border-blue-950/50  rounded-br-md"
                : "bg-gray-200 text-black border-gray-800/50 rounded-tl-md"
            } border inline-block p-2 px-3 rounded-full my-1 max-w-[70%] break-words ml-2`}
          >
            {message.content}
          </div>
        )}
        {message.messageType === "file" && (
          <div
            className={`${
              message.sender._id === userInfo.id
                ? "bg-blue-900 text-white border-blue-950/50  "
                : "bg-gray-200 text-black border-gray-800/50 "
            } border inline-block p-2 px-3 rounded-lg my-1 max-w-[70%] break-words`}
          >
            {checkIfImage(message.fileUrl) ? (
              <div
                className="cursor-pointer"
                onClick={() => {
                  setshowImage(true);
                  setImageURL(message.fileUrl);
                }}
              >
                <img
                  src={`${HOST}/${message.fileUrl}`}
                  alt=""
                  height={300}
                  width={300}
                />
              </div>
            ) : (
              <div className="flex items-center justify-center gap-4">
                <span className="text-white/80 text-3xl bg-black/20 rounded-full p-3">
                  <MdFolderZip />
                </span>
                <span>{message.fileUrl.split("/").pop()}</span>
                <span
                  className="bg-black/20 text-2xl p-3 rounded-full hover:bg-black/50"
                  onClick={() => downloadFile(message.fileUrl)}
                >
                  <IoMdArrowRoundDown />
                </span>
              </div>
            )}
          </div>
        )}
        {
          <div className="text-xs text-gray-600 mx-2">
            {moment(message.timestamp).format("LT")}
          </div>
        }
      </div>
    );
  };
  return (
    <div className="flex-1 overflow-y-auto scrollbar-hidden p-4 px-8 md:w-[65vw] lg:w-[70vw] xl:w-[80vw] w-full ">
      {renderMessage()}
      <div ref={scrollRef} />
      {showImage && (
        <div className="fixed top-0 left-0 w-full h-full z-50 bg-black/50 backdrop-blur-lg flex flex-col justify-center items-center">
          <div>
            <img
              src={`${HOST}/${imageURL}`}
              alt=""
              className="w-full h-[80vh] object-cover "
              onClick={() => setshowImage(false)}
            />
          </div>
          <div className="flex gap-5 fixed top-0 mt-5">
            <button
              className="bg-black/20 text-2xl p-3 rounded-full hover:bg-black/50"
              onClick={() => downloadFile(imageURL)}
            >
              <IoMdArrowRoundDown />
            </button>
            <button
              className="bg-black/20 text-2xl p-3 rounded-full hover:bg-black/50"
              onClick={() => {
                setImageURL(null);
                setshowImage(false);
              }}
            >
              <IoCloseSharp />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageContainer;
