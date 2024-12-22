import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Auth from "./pages/auth";
import Chat from "./pages/chat";
import Profile from "./pages/profile";
import { useAppStore } from "./store";
import { useEffect, useState } from "react";
import { apiClient } from "./lib/api-client";
import { GET_USER_INFO } from "./utils/constants";
const PrivateRoute = ({ element }) => {
  const { userInfo } = useAppStore();
  const isAuthenticated = !!userInfo;
  return isAuthenticated ? element : <Navigate to="/auth" />;
};

const AuthRoute = ({ element }) => {
  const { userInfo } = useAppStore();
  const isAuthenticated = !!userInfo;
  return isAuthenticated ? <Navigate to="/chat" /> : element;
};
export default function App() {
  

  const { userInfo, setuserInfo } = useAppStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const res = await apiClient.get(GET_USER_INFO, { withCredentials: true });
        if (res.status === 202 && res.data.id) {
          setuserInfo(res.data);
        } 
        else {
       
          setuserInfo(undefined);
          console.log("User info not found.");
        }
      } catch (err) {
        setuserInfo(undefined);
        console.log("Error fetching user data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (!userInfo) {
      getUserData();
    } else {
      setLoading(false);
    }
  }, [userInfo, setuserInfo]);

  if (loading) {
    return <div>Loading....</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/auth"
          element={
            <AuthRoute element={<Auth />} /> 
          }
        />
        <Route
          path="/chat"
          element={
            <PrivateRoute element={<Chat />} />
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute element={<Profile />} />
          }
        />
        <Route path="*" element={<Navigate to="/auth" />} />
      </Routes>
    </BrowserRouter>
  );
}
