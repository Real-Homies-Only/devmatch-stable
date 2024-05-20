"use client";
import { Body, Headings } from "@/app/fonts/roboto";
import { ProjectType } from "@/app/utils/ProjectProps";
import { UserType } from "@/app/utils/UserProps";
import {
  mdiAlertCircleOutline,
  mdiArrowLeftBoldOutline,
  mdiCheck
} from "@mdi/js";
import Icon from "@mdi/react";
import { useRouter } from "next/navigation";
import React, { Fragment, useState } from "react";
import Modal from "react-modal";

interface ProjectHomeProps {
  project: ProjectType;
  client: UserType | null;
  user: UserType | null;
}

const ProjectHome: React.FC<ProjectHomeProps> = ({ project, client, user }) => {
  const [progress, setProgress] = useState(project.progress);
  const [errorVisible, setErrorVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const progressBar = {
    "--value": project.progress
  } as React.CSSProperties;

  const handleChangeProgress = async (progress: number) => {
    const response = await fetch(`/api/project/${project.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ progress })
    });
    if (response.ok) {
      window.location.reload();
    } else {
      setErrorMessage("Error updating progress!");
      setErrorVisible(true);
      setTimeout(() => {
        setErrorVisible(false);
      }, 5000);
    }
  };

  const handleFinishProject = async (finished: boolean) => {
    const response = await fetch(`/api/project/${project.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ finished })
    });
    if (response.ok) {
      router.push("/");
    } else {
      setErrorMessage("Error finishing project!");
      setErrorVisible(true);
      setTimeout(() => {
        setErrorVisible(false);
      }, 5000);
    }
  };

  return (
    <Fragment>
      {client ? (
        <div
          className={`${Body.className} artboard gap- lg:border-primary lg:border flex flex-col flex-1 py-12 w-full lg:mx-12 mx-4 mt-4 lg:shadow-md`}
        >
          {errorVisible && (
            <div
              role="alert"
              className="self-center alert alert-error flex items-center justify-center mb-4 w-72"
            >
              <Icon path={mdiAlertCircleOutline} size={1} className="mr-2" />
              <span>{errorMessage}</span>
            </div>
          )}
          <div
            className={`${Body.className} flex flex-col self-center text-letter text-center`}
          >
            <div className="flex flex-col mb-10">
              <div className={`${Headings.className} text-xl`}>
                {project.projectName}
              </div>
              <div className="text-gray-400 text-sm">
                This is a project by @{client.username}
              </div>
            </div>
            <div className="flex flex-col gap-5 items-center">
              <div
                className={`radial-progress border ${project.progress <= 25 ? "text-red-500" : project.progress <= 75 ? "text-yellow-500" : "text-green-500"}`}
                style={progressBar}
                role="progressbar"
              >
                {String(project.progress)}%
              </div>
              {user && user.id !== client.id ? (
                <div className="flex flex-col mt-5">
                  <input
                    type="range"
                    min={0}
                    max="100"
                    onChange={(e) => setProgress(Number(e.target.value))}
                    value={progress}
                    className="range range-primary"
                  />
                  <span className={`${Body.className} mb-4`}>{progress}%</span>
                  <button
                    onClick={() => handleChangeProgress(progress)}
                    className="btn btn-primary text-white"
                  >
                    Update Progress
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="btn btn-primary text-white"
                >
                  Finish Project
                </button>
              )}
              <Modal
                isOpen={isModalOpen}
                contentLabel="Project Creation Result"
                className="fixed inset-0 z-50 flex items-center justify-center mx-4"
                overlayClassName="fixed inset-0 z-40 bg-gray-500 bg-opacity-75"
                appElement={document.getElementById("root") || undefined}
              >
                <div className="bg-white p-6 rounded-md shadow-md z-50">
                  <h2 className="text-xl mb-4">
                    Are you sure the project is finished?
                  </h2>
                  <div className="flex justify-end gap-2">
                    <button
                      className="btn btn-primary flex items-center"
                      onClick={() => setIsModalOpen(false)}
                    >
                      <Icon
                        path={mdiArrowLeftBoldOutline}
                        size={0.8}
                        className="inline-block mr-2"
                      />
                      Not Yet!
                    </button>
                    <button
                      className="btn btn-primary flex items-center"
                      onClick={() => handleFinishProject(true)}
                    >
                      <Icon
                        path={mdiCheck}
                        size={0.8}
                        className="inline-block mr-2"
                      />
                      Accept
                    </button>
                  </div>
                </div>
              </Modal>
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
