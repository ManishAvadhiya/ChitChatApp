import React, { useState } from "react";
import Victory from "../../assets/victory.svg";
import Background from "../../assets/login2.png";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { LOGIN_ROUTES, SIGNUP_ROUTES } from "@/utils/constants";
import { apiClient } from "@/lib/api-client";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/store";
const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpass, setConfirmpass] = useState("");
  const navigate = useNavigate();
  const { userInfo,setuserInfo } = useAppStore();
  const validatelogin = () => {
    if (!email.length) {
      toast.error("Email is required");
      return false;
    }
    if (!password.length) {
      toast.error("Password is required");
      return false;
    }
    return true;
  };
  const validateSignup = () => {
    if (!email.length) {
      toast.error("Email is required");
      return false;
    }
    if (!password.length) {
      toast.error("Password is required");
      return false;
    }
    if (password !== confirmpass) {
      toast.error("Password and confirm password must be same");
      return false;
    }
    return true;
  };
  async function handlelogin() {
    if (validatelogin()) {
      const res = await apiClient.post(
        LOGIN_ROUTES,
        { email, password },
        { withCredentials: true }
      );
      if (res.data.user.id) {
        setuserInfo(res.data.user);
        if (res.data.user.profileSetup) {
          navigate("/chat");
        } else navigate("/profile");
      }
      console.log("welcome ");
    }
  }
  async function handlesignup() {
    if (validateSignup()) {
      try {
        const res = await apiClient.post(
          SIGNUP_ROUTES,
          { email, password },
          { withCredentials: true }
        );
        if (res.status === 201) {
          setuserInfo(res.data.user);
          navigate("/profile");
          toast.success("Signup successful!");
        } else {
          toast.error("Signup failed.");
        }
      } catch (error) {
        console.error("Signup error:", error);
        toast.error("Error signing up. Please try again.");
      }
    }
  }

  return (
    <div className="h-[100vh] w-[100vw] flex items-center justify-center bg-violet-400">
      <div className="h-[80vh] w-[80vw] bg-white border-white border-2 shadow-2xl text-opacity-90 lg:w-[60vw] xl:w-[70vw] rounded-2xl grid xl:grid-cols-2 ">
        <div className="flex flex-col items-center justify-center gap-10">
          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center justify-center">
              <h1 className="text-4xl font-bold md:text-5xl">
                Welcome to ChitChat!
              </h1>
              {/* <img src={Victory} alt="Victory" className="h-16" /> */}
            </div>
            <p className="text-center ">Login to Start Chatting</p>
          </div>
          <div className="flex items-center justify-center w-full">
            <Tabs defaultValue="login" className=" w-3/4 ">
              <TabsList className="bg-transparent rounded-none  w-full">
                <TabsTrigger
                  value="login"
                  className="data-[state=active]:bg-slate-600 data-[state=active]:text-white w-full"
                >
                  Login
                </TabsTrigger>
                <TabsTrigger
                  value="signup"
                  className="data-[state=active]:bg-slate-600 data-[state=active]:text-white w-full"
                >
                  SignUp
                </TabsTrigger>
              </TabsList>
              <TabsContent value="login">
                <Input
                  placeholder="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-4"
                />
                <Input
                  placeholder="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-4"
                />
                <Button className="w-full mt-4" onClick={handlelogin}>
                  Login
                </Button>
              </TabsContent>
              <TabsContent value="signup">
                <Input
                  placeholder="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-4"
                />
                <Input
                  placeholder="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-4"
                />
                <Input
                  placeholder="Confirm Password"
                  type="password"
                  value={confirmpass}
                  onChange={(e) => setConfirmpass(e.target.value)}
                  className="mt-4"
                />
                <Button className="w-full mt-4" onClick={handlesignup}>
                  SignUp
                </Button>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        <div className="hidden xl:flex justify-center items-center ">
          <img src={Background} alt="" />
        </div>
       
      </div>
    </div>
  );
};

export default Auth;
