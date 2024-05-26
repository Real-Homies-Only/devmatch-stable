import React, { useEffect, useState } from "react";
import Column from "./Column";
import DeleteBox from "./DeleteBox";
import { TaskType } from "@/app/utils/KanbanProps";
import { supabase } from "@/app/utils/supabase";

interface BoardProps {
  projectId: string;
  userType: string;
}

const Board: React.FC<BoardProps> = ({ projectId, userType }) => {
  const [tasks, setTasks] = useState<TaskType[]>([]);

  useEffect(() => {
    const channel = supabase
      .channel(`tasks-room`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "Task" },
        (payload) => {
          if (userType === "Client") {
            const newTask = payload.new as TaskType;
            setTasks((pv) => [...pv, newTask]);
          }
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "Task" },
        (payload) => {
          const updatedTask = payload.new as TaskType;
          setTasks((prevTasks) =>
            prevTasks.map((task) =>
              task.id === updatedTask.id ? updatedTask : task
            )
          );
        }
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "Task"
        },
        (payload) => {
          const deletedTaskId = payload.old.id;
          setTasks((prevTasks) =>
            prevTasks.filter((task) => task.id !== deletedTaskId)
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [projectId, userType]);

  return (
    <div
      data-testid="board-test"
      className="flex flex-col h-full w-full gap-3 overflow-scroll p-4 md:p-6 lg:p-12 relative max-h-70 lg:max-h-full"
    >
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
          headingColor="text-red-700"
          tasks={tasks}
          userType={userType}
          projectId={projectId}
          setTasks={setTasks}
        />
        <Column
          title="In progress"
          column="IN_PROGRESS"
          headingColor="text-blue-700"
          tasks={tasks}
          userType={userType}
          projectId={projectId}
          setTasks={setTasks}
        />
        <Column
          title="Complete"
          column="DONE"
          headingColor="text-green-700"
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
