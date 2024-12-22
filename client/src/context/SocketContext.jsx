import { useAppStore } from "@/store";
import { HOST } from "@/utils/constants";
import { createContext, useContext, useEffect, useRef } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext(null);

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const socket = useRef(null);
  const { userInfo } = useAppStore();

  useEffect(() => {
    if (userInfo) {
      socket.current = io(HOST, {
        withCredentials: true,
        query: { userId: userInfo.id },
      });

      socket.current.on("connect", () => {
        // console.log("Connected to socket server");
      });
      const handleReceievedMessage = (message) => {
        const { selectedChatData, selectedChatType, addMessage ,addUsersInDMList} =
          useAppStore.getState();

        if (
          selectedChatType !== undefined &&
          (selectedChatData._id === message.sender._id ||
            selectedChatData._id === message.receiver._id)
        ) {
          addMessage(message);
        }
        addUsersInDMList(message)
      };
      const handleReceieveChannelMessage = (message) => {
        const { selectedChatData, selectedChatType, addMessage,addChannelInChannelList } =
          useAppStore.getState();

        if (
          selectedChatType !== undefined &&
          selectedChatData._id === message.channelId
        ) {
          console.log({ message });
          addMessage(message);
        }
        addChannelInChannelList(message)
      };
      // Simple listener for message reception
      socket.current.on("receivedMessage", handleReceievedMessage);
      socket.current.on(
        "recieve-channel-message",
        handleReceieveChannelMessage
      );
    }

    // Cleanup function
    return () => {
      if (socket.current) {
        // socket.current.off("receivedMessage"); // remove the listener
        socket.current.disconnect(); // disconnect socket
        socket.current = null; // clear reference
      }
    };
  }, [userInfo]);

  return (
    <SocketContext.Provider value={socket.current}>
      {children}
    </SocketContext.Provider>
  );
};
