"use client";
import { ProjectType } from "@/app/utils/ProjectProps";
import { UserType } from "@/app/utils/UserProps";

import React, { Fragment, useContext, useEffect, useState } from "react";
import ProjectMenu from "./ProjectMenu";
import ProjectHome from "../project/ProjectHome";
import ProjectChat from "../project/ProjectChat";
import ProjectKanban from "../project/ProjectKanban";
import Bids from "./Bids";
import { AuthContext } from "@/app/context/AuthContext";

interface DashboardProps {
  project: ProjectType;
}

const Dashboard: React.FC<DashboardProps> = ({ project }) => {
  const [otherUser, setOtherUser] = useState<UserType | null>(null);
  const [selected, setSelected] = useState(1);
  const { user, loading } = useContext(AuthContext);

  const handleSelect = (selected: number) => {
    setSelected(selected);
  };

  useEffect(() => {
    if (user) {
      let otherUserId;

      if (user?.id === project.clientId) {
        otherUserId = project.developerId;
      } else {
        otherUserId = project.clientId;
      }

      const getOtherUserId = async () => {
        const response = await fetch(`/api/user/${otherUserId}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" }
        });
        const { user } = await response.json();

        setOtherUser(user);
      };

      getOtherUserId();
    }
  }, []);

  if (loading) {
    return (
      <span className="loading loading-spinner loading-lg self-center justify-center"></span>
    );
  }

  return (
    <Fragment>
      {project.developerId ? (
        project && user && otherUser ? (
          <div className="flex flex-col self-center">
            <div className="flex">
              {selected === 1 ? (
                <ProjectHome
                  project={project}
                  client={user.userType === "Client" ? user : otherUser}
                />
              ) : selected === 2 ? (
                <ProjectChat
                  project={project}
                  user={user}
                  otherUser={otherUser}
                />
              ) : selected === 3 ? (
                <ProjectKanban project={project} user={user} />
              ) : (
                <div></div>
              )}
            </div>
            <ul className="menu menu-horizontal border gap-1 border-gray-400 lg:mx-12 mx-4 items-center justify-center">
              <ProjectMenu selected={selected} setSelected={handleSelect} />
            </ul>
          </div>
        ) : (
          <div></div>
        )
      ) : (
        <div className="flex flex-col">
          <Bids project={project} client={user} />
        </div>
      )}
    </Fragment>
  );
};

export default Dashboard;
