import React from "react";
import { motion } from "framer-motion";
import DropIndicator from "./DropIndicator";
import { TaskProps } from "@/app/utils/KanbanProps";

const Task: React.FC<TaskProps> = ({
  title,
  id,
  column,
  projectId,
  handleDragStart
}) => {
  return (
    <>
      <DropIndicator beforeId={id} column={column} />
      <motion.div
        id={`task-${title.split(" ")[0]}`}
        data-testid="task-card"
        layout
        layoutId={id}
        draggable="true"
        onDragStart={(e: any) =>
          handleDragStart(e, { title, projectId, id, column })
        }
        className="cursor-grab rounded border border-neutral-700 bg-neutral-800 p-3 active:cursor-grabbing break-words"
      >
        <p className="text-sm text-neutral-100">{title}</p>
      </motion.div>
    </>
  );
};

export default Task;
