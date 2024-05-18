"use client";
import React from "react";
import Board from "./Board";
import { ProjectType } from "@/app/utils/ProjectProps";
import { UserType } from "@/app/utils/UserProps";

interface KanbanBoardProps {
  project: ProjectType;
  user: UserType;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ project, user }) => {
  return (
    <div className="h-screen w-full bg-neutral-900 text-neutral-50 flex flex-col">
      <Board projectId={project.id} userType={user.userType} />
    </div>
  );
};

export default KanbanBoard;
