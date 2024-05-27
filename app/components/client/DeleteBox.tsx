import React, { useState } from "react";
import Icon from "@mdi/react";
import { mdiFire } from "@mdi/js";
import { mdiTrashCanOutline } from "@mdi/js";
import { DeleteBoxProps } from "@/app/utils/KanbanProps";

const DeleteBox: React.FC<DeleteBoxProps> = ({
  setTasks,
  projectId,
  userType,
  className
}) => {
  const [active, setActive] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    if (userType === "Client") return;
    e.preventDefault();
    setActive(true);
  };

  const handleDragLeave = () => {
    setActive(false);
  };

  const handleDragEnd = async (e: React.DragEvent) => {
    const taskId = e.dataTransfer.getData("taskId");

    const response = await fetch(`/api/project/${projectId}/kanban`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ id: taskId })
    });
    const data = await response.json();
    setTasks((pv) => pv.filter((c) => c.id !== data.id));

    setActive(false);
  };

  if (userType === "Client") return null;

  return (
    <div
      id="delete-box"
      data-testid="delete-box"
      onDrop={handleDragEnd}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={`grid place-content-center rounded border text-3xl ${
        active
          ? "border-red-800 bg-red-800/20 text-red-500"
          : "border-neutral-500 bg-neutral-500/20 text-neutral-500"
      } ${className}`}
    >
      {active ? (
        <Icon path={mdiFire} size={1.5} className="animate-bounce" />
      ) : (
        <Icon path={mdiTrashCanOutline} size={1.5} />
      )}
    </div>
  );
};

export default DeleteBox;
