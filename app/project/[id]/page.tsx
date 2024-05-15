import React from "react";
import { AuthProvider } from "@/app/context/AuthContext";
import ProjectPage from "@/app/components/client/ProjectPage";
import NavBar from "@/app/components/server/NavBar";

const Project = () => {
  return (
    <AuthProvider>
      <NavBar />
      <ProjectPage />
    </AuthProvider>
  );
};

export default Project;
