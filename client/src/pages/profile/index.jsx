import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiClient } from "@/lib/api-client";
import { useAppStore } from "@/store";
import { IoArrowBackCircle, IoArrowBackOutline } from "react-icons/io5";
import { MdDelete } from "react-icons/md";
import { ADD_PROFILE_IMAGE_ROUTE, HOST, REMOVE_PROFILE_IMAGE_ROUTE, UPDATE_PROFILE_ROUTE } from "@/utils/constants";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Profile = () => {
  const { userInfo, setuserInfo } = useAppStore();
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  useEffect(()=>{
      if(userInfo.profileSetup){
        setFirstname(userInfo.firstname);
        setLastname(userInfo.lastname)
      }
      if(userInfo.image){
        setImage(`${HOST}/${userInfo.image}`)
      }
  },[userInfo])
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [hovered, setHovered] = useState(false);
  const inputfileRef = useRef(null)
  const validateProfile = () =>{
    if(!firstname || !lastname){
      toast.error("Firstname and Lastname are required")
      return false;
    }
    return true;
  }
  const useremail = userInfo.email;
  const savechanges = async () =>{
    if(validateProfile()){
        try{
            const res = await apiClient.patch(UPDATE_PROFILE_ROUTE,{useremail, firstname,lastname},{withCredentials:true})
            if(res.status === 200 && res.data){
              setuserInfo({...res.data.user})
              toast.success("Profile updated successfully")
              navigate("/chat")
            }
        }catch(err){
          console.log({err})
        }
    }
  }
  const handleNavigate = () =>{
    if(userInfo.profileSetup){
      navigate("/chat")
    }else{
      toast.error("Please set you profile first");
    }
  }
  const handlefile = () =>{

    inputfileRef.current.click()
  }
  const handleimagechange = async (event) =>{
    const file = event.target.files[0]
    console.log({file})
    if(file){
      const formData = new FormData()
      formData.append("profileimage",file)
      formData.append("useremail", useremail); 
      console.log(formData.entries())
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }
      const res = await apiClient.post(ADD_PROFILE_IMAGE_ROUTE, formData,{withCredentials:true});
      if(res.status === 200 && res.data.image){
        setuserInfo({...userInfo,image:res.data.image})
        toast.success("Profile image updated successfully")
      }
    }
  }
  const handledeleteimage = async ()=>{
    try{

      const res = await apiClient.delete(REMOVE_PROFILE_IMAGE_ROUTE, {
        data: { useremail },
        withCredentials: true,
      });
      if(res.status === 200 ){
        setuserInfo({...userInfo,image:null})
        setImage(null)
        toast.success("Profile image removed successfully")
      }
    }catch(e){
      console.log(e)
    }
  }

  return (
    <div className="h-[100vh] w-100vw] flex items-center justify-center">
      <div className="h-[80vh] w-[80vw] bg-slate-500 flex flex-col justify-evenly items-center rounded-md shadow-black border-black border-[2px]">
        <div className="text-2xl cursor-pointer w-full pl-2" onClick={handleNavigate}><IoArrowBackOutline className="text-4xl"/></div>
        <div className="flex  flex-col sm:flex-row justify-center items-center gap-[60px] sm:gap-[150px]">
          <div
            className={`bg-white text-teal-900 h-24 w-24 sm:h-36 sm:w-36 rounded-full flex items-center justify-center text-5xl border-white border-[2px] relative`}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}

          >
            {image ? (
              <img
                src={image}
                alt=""
                className="object-cover w-full h-full bg-black rounded-full"
              />
            ) : (
              <div className="uppercase">
                {firstname
                  ? firstname.split("").shift()
                  : userInfo.email.split("").shift()}
              </div>
            )}

            {hovered && <div className="absolute inset-0 flex items-center justify-center bg-black/50 ring-slate-400 rounded-full text-white text-4xl cursor-pointer "
            onClick={image ? handledeleteimage : handlefile}>
              {image ? (<span><MdDelete /></span>) : (<span>+</span>)} 
              </div>}
                <input type="file" ref={inputfileRef} className="hidden" onChange={handleimagechange} name="profileimage" accept=".png , .jpeg , .svg , .webp , .jpg"/>
          </div>
          <div className="flex flex-col justify-evenly items-center gap-[20px]">
            <Input

              value={userInfo.email}
              disables
              className="border-black border-[2px] italic text-gray-500"
            />

            <Input
              placeholder="First Name "
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
              className="border-black border-[2px]"
            />

            <Input
              placeholder="Last Name "
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              className="border-black border-[2px]"
            />
          </div>
        </div>
        <div className="">
          <Button className="bg-teal-900 w-[150px]" type="submit" onClick={savechanges}>Save changes</Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
