import React from "react";
import NavBar from "@/app/components/server/NavBar";
import { AuthProvider } from "@/app/context/AuthContext";
import CreateProject from "@/app/components/client/CreateProject";

const Projects = () => {
  return (
    <div>
      <AuthProvider>
        <NavBar />
        <CreateProject />
      </AuthProvider>
    </div>
  );
};

export default Projects;
