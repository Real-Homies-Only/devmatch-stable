import React from "react";
import KanbanBoard from "../client/KanbanBoard";
import { ProjectType } from "@/app/utils/ProjectProps";
import { UserType } from "@/app/utils/UserProps";

interface ProjectKanbanProps {
  project: ProjectType;
  user: UserType;
}

const ProjectKanban: React.FC<ProjectKanbanProps> = ({ project, user }) => {
  return <KanbanBoard project={project} user={user} />;
};

export default ProjectKanban;
