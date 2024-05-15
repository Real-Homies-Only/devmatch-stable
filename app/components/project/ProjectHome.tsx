import { Body } from "@/app/fonts/roboto";
import { ProjectType } from "@/app/utils/ProjectProps";
import { UserType } from "@/app/utils/UserProps";
import React, { Fragment } from "react";

interface ProjectHomeProps {
  project: ProjectType;
  client: UserType | null;
}

const ProjectHome: React.FC<ProjectHomeProps> = ({ project, client }) => {
  return (
    <Fragment>
      {client ? (
        <div
          className={`${Body.className} artboard gap- border-gray-400 border flex flex-col flex-1 py-12 w-full lg:mx-12 mx-4 mt-4 shadow-md`}
        >
          <div className="self-center text-letter text-center">
            <div className="flex flex-col mb-2">
              <div className="text-2xl ">{project.projectName}</div>
              <div className="text-gray-400 text-sm">
                This is a project by @{client.username}
              </div>
            </div>
          </div>
        </div>
      ) : (
        "Error!"
      )}
    </Fragment>
  );
};

export default ProjectHome;
