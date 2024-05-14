import React from "react";
import NavBar from "@/app/components/server/NavBar";
import { AuthProvider } from "@/app/context/AuthContext";
import BrowseProject from "@/app/components/client/BrowseProject";
const Browse = () => {
  return (
    <div>
      <AuthProvider>
        <NavBar />
        <BrowseProject />
      </AuthProvider>
    </div>
  );
};

export default Browse;
