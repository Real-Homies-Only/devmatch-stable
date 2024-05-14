import React from "react";
import NavBar from "../components/server/NavBar";
import { AuthProvider } from "../context/AuthContext";
import CreateProject from "../components/client/CreateProject";

const page = () => {
  return (
    <div>
      <AuthProvider>
        <NavBar />
        <CreateProject />
      </AuthProvider>
    </div>
  );
};

export default page;
