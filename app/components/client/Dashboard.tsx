"use client";
import { ProjectType } from "@/app/utils/ProjectProps";
import React from "react";

interface DashboardProps {
  project: ProjectType;
}

const Dashboard: React.FC<DashboardProps> = ({ project }) => {
  return <div>Dashboard: {project.projectName}</div>;
};

export default Dashboard;
