import { Dispatch, SetStateAction, DragEvent } from "react";

export type ColumnType = "BACKLOG" | "TODO" | "IN_PROGRESS" | "DONE";
export type TaskType = {
  title: string;
  id: string;
  projectId: string;
  column: ColumnType;
};

export type NewTaskType = {
  title: string;
  projectId: string;
  column: ColumnType;
};

export type ColumnProps = {
  title: string;
  userType: string;
  headingColor: string;
  tasks: TaskType[];
  projectId: string;
  column: ColumnType;
  setTasks: Dispatch<SetStateAction<TaskType[]>>;
};

export type TaskProps = TaskType & {
  handleDragStart: (e: DragEvent<HTMLDivElement>, task: TaskType) => void;
};

export type DropIndicatorProps = {
  beforeId: string | null;
  column: string;
};

export type DeleteBoxProps = {
  setTasks: Dispatch<SetStateAction<TaskType[]>>;
  className?: string;
  userType: string;
  projectId: string;
};

export type AddTaskProps = {
  column: ColumnType;
  setTasks: Dispatch<SetStateAction<TaskType[]>>;
  userType: string;
  projectId: string;
};
