import React from "react";
import NavBar from "../components/server/NavBar";
import { AuthProvider } from "../context/AuthContext";
import ProfileCard from "../components/client/ProfileCard";

const page = () => {
  return (
    <div>
      <AuthProvider>
        <NavBar />
        <ProfileCard />
      </AuthProvider>
    </div>
  );
};

export default page;
