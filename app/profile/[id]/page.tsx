import React from "react";
import NavBar from "@/app/components/server/NavBar";
import { AuthProvider } from "@/app/context/AuthContext";
import UserProfileCard from "@/app/components/client/UserProfileCard";

const UserProfile = () => {
  return (
    <div>
      <AuthProvider>
        <NavBar />
        <UserProfileCard />
      </AuthProvider>
    </div>
  );
};

export default UserProfile;
