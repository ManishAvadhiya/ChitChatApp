import { useAppStore } from "@/store";
import { HOST, LOGOUT_USER_ROUTE } from "@/utils/constants";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";
import React from "react";
import { FiEdit2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { IoIosLogOut } from "react-icons/io";
import { apiClient } from "@/lib/api-client";
const ProfileInfo = () => {
  const navigate = useNavigate();
  const { userInfo, setuserInfo } = useAppStore();

  const logout = async () => {
    try {
      const res = await apiClient.post(
        LOGOUT_USER_ROUTE,
        {},
        { withCredentials: true }
      );
      if (res.status === 200) {
        navigate("/auth");
        setuserInfo(null);
      }
    } catch (e) {
      console.error("Error logging out", e);
    }
  };
  return (
    <div className="absolute bottom-0 h-20 flex items-center justify-between px-10 w-full bg-blue-900">
      <div className="flex gap-3 items-center justify-center">
        <div className="realtive h-12 w-12">
          <div
            className={`bg-blue-700  h-12 w-12 rounded-full flex items-center justify-center text-5xl  relative`}
          >
            {userInfo.image ? (
              <img
                src={`${HOST}/${userInfo.image}`}
                alt=""
                className="object-cover w-full h-full bg-black rounded-full"
              />
            ) : (
              <div className="uppercase  rounded-full h-12 w-12 text-center py-2 text-xl">
                {userInfo.firstname
                  ? userInfo.firstname.split("").shift()
                  : userInfo.email.split("").shift()}
              </div>
            )}
          </div>
        </div>
        <div className="text-white text-sm">
          <div>
            {userInfo.firstname} {userInfo.lastname}
          </div>
        </div>
      </div>
      <div className="flex gap-5">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <FiEdit2
                className="text-white text-xl font-bold"
                onClick={() => navigate("/profile")}
              />
            </TooltipTrigger>
            <TooltipContent className="bg-white rounded-lg text-black text-sm p-1 px-2 mb-2">
              Edit Profile
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <IoIosLogOut
                className="text-white text-xl font-bold"
                onClick={logout}
              />
            </TooltipTrigger>
            <TooltipContent className="bg-white rounded-lg text-black text-sm p-1 px-2 mb-2">
              Log Out
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default ProfileInfo;
