import React from "react";
import Board from "../client/Board";
import { ProjectType } from "@/app/utils/ProjectProps";
import { UserType } from "@/app/utils/UserProps";
import { Body } from "@/app/fonts/roboto";

interface ProjectKanbanProps {
  project: ProjectType;
  user: UserType;
}

const ProjectKanban: React.FC<ProjectKanbanProps> = ({ project, user }) => {
  return (
    <div
      className={`${Body.className} artboard h-full border-gray-400 border flex flex-col flex-1 py-12 w-full lg:mx-12 mx-4 mt-4 shadow-md`}
    >
      <Board projectId={project.id} userType={user.userType} />
    </div>
  );
};

export default ProjectKanban;
