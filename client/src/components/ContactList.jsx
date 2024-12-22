import { useAppStore } from "@/store";
import React from "react";
import { Avatar } from "./ui/avatar";
import { HOST } from "@/utils/constants";

const ContactList = ({ users, isChannel = false }) => {
  const {
    selectedChatData,
    selectedChatType,
    setSelectedChatType,
    setSelectedChatData,
    setSelectedChatMessages,
  } = useAppStore();

  const handleClick = (user) => {
    if (isChannel) {
      setSelectedChatType("Channel");
    } else {
      setSelectedChatType("User");
    }
    setSelectedChatData(user);

    // Clear messages if selecting a new user
    if (selectedChatData && selectedChatData._id !== user._id) {
      setSelectedChatMessages([]);
    }
  };

  return (
    <div className="mt-5">
      {users.map((user) => (
        <div
          key={user._id} // Adding a unique key for each user
          className={`pl-2   py-2 transition-all duration-300 cursor-pointer text-white ${
            selectedChatData && selectedChatData._id === user._id
              ? "bg-sky-950 scale-110"
              : "hover:bg-sky-900"
          }`}
          onClick={() => handleClick(user)}
        >
          <div className="flex gap-5 items-center justify-start text-neutral-300 ml-4">
            {!isChannel && (
              <div className="flex gap-5 items-center">
                <div className="flex gap-3 items-center justify-center">
                  <div className="realtive h-10 w-10">
                    <div
                      className={`bg-blue-700  h-10 w-10 rounded-full flex items-center justify-center text-5xl  relative`}
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
                  <div className="text-white font-serif ">
                    {
                        user.firstname
                         ? `${user.firstname} ${user.lastname}`
                          : user.email
  
                    }
                    
                  </div>
                </div>
              </div>
            )}
            {isChannel && (
              <div className="flex justify-center items-center gap-3 ml-4 ">
                <div className="h-10 w-10 rounded-full flex justify-center items-center bg-blue-700">
                #
              </div>
              <div className="text-white font-serif ">
                {user.name}
              </div>
              </div>

            )}

          </div>
        </div>
      ))}
    </div>
  );
};

export default ContactList;
