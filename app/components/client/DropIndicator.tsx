import React from "react";
import { DropIndicatorProps } from "@/app/utils/KanbanProps";

const DropIndicator: React.FC<DropIndicatorProps> = ({
  beforeId,
  column,
  opacity
}) => {
  return (
    <div
      data-testid="drop-indicator"
      data-before={beforeId || "-1"}
      data-column={column}
      style={{ opacity: opacity }}
      className="my-0.5 h-0.5 w-full bg-violet-400"
    />
  );
};

export default DropIndicator;
