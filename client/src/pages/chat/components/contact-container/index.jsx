import { Tabs, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
// import image from "client/public/logo.png";
import ProfileInfo from "./components/Profile";
import NewDm from "./components/NewDm";
import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api-client";
import { GET_USER_CHANNEL_ROUTE, GET_USERS_DM } from "@/utils/constants";
import { useAppStore } from "@/store";
import ContactList from "@/components/ContactList";
import CreateChannel from "./components/CreateChannel";
const Contact = () => {
  const {directMessageUser,setDirectMessageUser,channels,setChannels} = useAppStore()
  useEffect(()=>{
      const getusers = async ()=>{
        const res = await apiClient.get(GET_USERS_DM,{withCredentials:true})
        if(res.data.user){

          setDirectMessageUser(res.data.user);
        }
      }
      const getchannels = async ()=>{
        const res = await apiClient.get(GET_USER_CHANNEL_ROUTE,{withCredentials:true})
        console.log("first")
        if(res.data.channels){

          setChannels(res.data.channels);
        }
      }
      getusers();
      getchannels();
  },[])
  return (
    <div className="relative md:w-[35vw] lg:w-[30vw] xl:w-[20vw] bg-blue-950 border-r-2 border-blue-500 w-full">
      <div className="pt-3 flex justify-between ml-4">
        <Logo />
      </div>
      
        <div className="my-5 ">
          <div className="flex items-center justify-between pr-10">
            <h6 className="tracking-widest pl-10 font-light text-gray-400">
              Direct Messages
            </h6>
            <NewDm/>
          </div>
          <div className="max-h-[38vh] overflow-y-auto  scrollbar-hidden">
            <ContactList users={directMessageUser} className="bg-black"/>

          </div>

        </div>
        <div className="my-5 ">
          <div className="flex items-center justify-between pr-10">
            <h6 className="tracking-widest pl-10 font-light text-gray-400">
              Channels
            </h6>
            <CreateChannel/>
           
          </div>
          <div className="max-h-[38vh] overflow-y-auto  scrollbar-hidden">
            <ContactList users={channels} isChannel={true} className="bg-black"/>

          </div>
        </div>

      <ProfileInfo />
    </div>
  );
};

export default Contact;

const Logo = () => {
  return (
    <div className=" mt-2   flex items-center justify-center  ">
      {/* <img src={image} alt="Logo" className="h-[50px] mr-1" /> */}
      <span className="text-3xl text-white font-bold font-mono">ChitChat</span>
    </div>
  );
};
