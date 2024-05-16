"use client";
import {
  mdiChatProcessingOutline,
  mdiHomeOutline,
  mdiListBoxOutline
} from "@mdi/js";
import Icon from "@mdi/react";
import React, { Fragment } from "react";

interface ProjectMenuProps {
  selected: number;
  setSelected: (selected: number) => void;
}

const ProjectMenu: React.FC<ProjectMenuProps> = ({ selected, setSelected }) => {
  return (
    <Fragment>
      <li
        onClick={() => setSelected(1)}
        className={`hover:bg-gray-400 rounded-box ${selected === 1 && "bg-gray-300"}`}
      >
        <a>
          <Icon className="h-5 w-5" path={mdiHomeOutline} size={1} />
        </a>
      </li>
      <li
        onClick={() => setSelected(2)}
        className={`hover:bg-gray-300 rounded-box ${selected === 2 && "bg-gray-300"}`}
      >
        <a>
          <Icon className="h-5 w-5" path={mdiChatProcessingOutline} size={1} />
        </a>
      </li>
      <li
        onClick={() => setSelected(3)}
        className={`hover:bg-gray-300 rounded-box ${selected === 3 && "bg-gray-300"}`}
      >
        <a>
          <Icon className="h-5 w-5" path={mdiListBoxOutline} size={1} />
        </a>
      </li>
    </Fragment>
  );
};

export default ProjectMenu;
