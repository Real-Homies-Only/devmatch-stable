import React from "react";
import { AuthProvider } from "@/app/context/AuthContext";
import ProjectPage from "@/app/components/client/ProjectPage";

const Project = () => {
  return (
    <AuthProvider>
      <ProjectPage />
    </AuthProvider>
  );
};

export default Project;
