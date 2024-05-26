import React, { useState } from "react";
import Task from "./Task";
import DropIndicator from "./DropIndicator";
import AddTask from "./AddTask";
import { ColumnProps, TaskType } from "@/app/utils/KanbanProps";

const Column: React.FC<ColumnProps> = ({
  title,
  headingColor,
  tasks,
  projectId,
  userType,
  column,
  setTasks
}) => {
  const [active, setActive] = useState(false);
  const handleDragStart = (e: any, task: TaskType) => {
    if (e.dataTransfer) {
      e.dataTransfer.setData("taskId", task.id);
    }
  };

  const handleDragEnd = async (e: any) => {
    if (userType === "Client") {
      clearHighlights();
      return;
    }
    if (e.dataTransfer) {
      const taskId = e.dataTransfer.getData("taskId");

      setActive(false);
      clearHighlights();

      const indicators = getIndicators();
      const { element } = getNearestIndicator(e, indicators);

      const before = element.dataset.before || "-1";

      if (before !== taskId) {
        let copy = [...tasks];

        let taskToTransfer = copy.find((c) => c.id === taskId);
        if (!taskToTransfer) return;
        taskToTransfer = { ...taskToTransfer, column };

        copy = copy.filter((c) => c.id !== taskId);

        const moveToBack = before === "-1";

        if (moveToBack) {
          copy.push(taskToTransfer);
        } else {
          const insertAtIndex = copy.findIndex((el) => el.id === before);
          if (insertAtIndex === undefined) return;

          copy.splice(insertAtIndex, 0, taskToTransfer);
        }

        const response = await fetch(`/api/project/${projectId}/kanban`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            id: taskToTransfer.id,
            column: taskToTransfer.column,
            title: taskToTransfer.title
          })
        });
        const data = await response.json();
        setTasks(copy.map((c) => (c.id === data.id ? data : c)));
      }
    }
  };

  const handleDragOver = (e: any) => {
    if (userType === "Client") return;
    e.preventDefault();
    highlightIndicator(e);
    setActive(true);
  };

  const clearHighlights = (els?: HTMLElement[]) => {
    const indicators = els || getIndicators();

    indicators.forEach((i) => {
      i.style.opacity = "0";
    });
  };

  const highlightIndicator = (e: DragEvent) => {
    if (userType === "Client") return;
    const indicators = getIndicators();

    clearHighlights(indicators);

    const el = getNearestIndicator(e, indicators);

    el.element.style.opacity = "1";
  };

  const getNearestIndicator = (e: DragEvent, indicators: HTMLElement[]) => {
    const DISTANCE_OFFSET = 50;

    const el = indicators.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();

        const offset = e.clientY - (box.top + DISTANCE_OFFSET);

        if (offset < 0 && offset > closest.offset) {
          return { offset: offset, element: child };
        }
        return closest;
      },
      {
        offset: Number.NEGATIVE_INFINITY,
        element: indicators[indicators.length - 1]
      }
    );

    return el;
  };

  const getIndicators = () => {
    return Array.from(
      document.querySelectorAll(
        `[data-column="${column}"]`
      ) as unknown as HTMLElement[]
    );
  };

  const handleDragLeave = () => {
    clearHighlights();
    setActive(false);
  };

  const filteredTasks = tasks.filter((c) => c.column === column);

  return (
    <div
      data-testid={`${column.toLowerCase()}-column`}
      className="w-full sm:w-56 shrink-0 md:w-64 lg:w-72"
    >
      <div className="mb-3 flex items-center justify-between">
        <h3 className={`font-medium ${headingColor}`}>{title}</h3>
        <span className="rounded text-sm text-neutral-400">
          {filteredTasks.length}
        </span>
      </div>
      <div
        onDrop={handleDragEnd}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`h-full w-full transition-colors ${
          active ? "bg-neutral-800/50" : "bg-neutral-800/0"
        }`}
      >
        {filteredTasks.map((c) => {
          return <Task key={c.id} {...c} handleDragStart={handleDragStart} />;
        })}
        <DropIndicator beforeId={null} column={column} />
        <AddTask
          userType={userType}
          column={column}
          setTasks={setTasks}
          projectId={projectId}
        />
      </div>
    </div>
  );
};

export default Column;
