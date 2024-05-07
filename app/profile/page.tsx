import React from "react";
import NavBar from "../components/server/NavBar";
import { AuthProvider } from "../context/AuthContext";
import ProfileCard from "../components/client/ProfileCard";

const page = () => {
  return (
    <div>
      <AuthProvider>
        <NavBar />
        <div className="flex flex-1 h-screen justify-center">
          <ProfileCard />
        </div>
      </AuthProvider>
    </div>
  );
};

export default page;
