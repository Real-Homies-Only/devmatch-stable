import React, { useState } from "react";
import Column from "./Column";
import DeleteBox from "./DeleteBox";
import { TaskType } from "@/app/utils/KanbanProps";

interface BoardProps {
  projectId: string;
  userType: string;
}

const Board: React.FC<BoardProps> = ({ projectId, userType }) => {
  const [tasks, setTasks] = useState<TaskType[]>([]);

  return (
    <div className="flex flex-col h-full w-full gap-3 overflow-scroll p-4 md:p-6 lg:p-12 relative">
      <div className="flex flex-wrap gap-3">
        <Column
          title="Backlog"
          column="BACKLOG"
          headingColor="text-neutral-500"
          tasks={tasks}
          userType={userType}
          projectId={projectId}
          setTasks={setTasks}
        />
        <Column
          title="TODO"
          column="TODO"
          headingColor="text-yellow-200"
          tasks={tasks}
          userType={userType}
          projectId={projectId}
          setTasks={setTasks}
        />
        <Column
          title="In progress"
          column="IN_PROGRESS"
          headingColor="text-blue-200"
          tasks={tasks}
          userType={userType}
          projectId={projectId}
          setTasks={setTasks}
        />
        <Column
          title="Complete"
          column="DONE"
          headingColor="text-emerald-200"
          tasks={tasks}
          userType={userType}
          projectId={projectId}
          setTasks={setTasks}
        />
      </div>
      <DeleteBox
        setTasks={setTasks}
        userType={userType}
        projectId={projectId}
        className="absolute bottom-4 right-4 w-40 h-40"
      />
    </div>
  );
};

export default Board;
