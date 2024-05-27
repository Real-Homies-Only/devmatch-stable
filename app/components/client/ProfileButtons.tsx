"use client";
import React, { Fragment, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { AuthContext } from "@/app/context/AuthContext";
import Icon from "@mdi/react";
import {
  mdiAccount,
  mdiDoorOpen,
  mdiInbox,
  mdiMagnify,
  mdiPencil
} from "@mdi/js";
import { Body, Headings } from "@/app/fonts/roboto";
import { ProjectType } from "@/app/utils/ProjectProps";

interface ProfileButtonsProps {
  profilePhotoURL: string;
  id: string;
  userType: string;
}

const ProfileButtons: React.FC<ProfileButtonsProps> = ({
  profilePhotoURL,
  id,
  userType
}) => {
  const { logout } = useContext(AuthContext);
  const [projects, setProjects] = useState<ProjectType[] | null>(null);
  const [loadingProjects, setProjectsLoading] = useState(true);

  useEffect(() => {
    const getProjects = async () => {
      const response = await fetch(`/api/user/${id}/projects`, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
      });
      const { projects } = await response.json();
      if (response.ok) {
        setProjects(projects);
        setProjectsLoading(false);
      } else {
        setProjectsLoading(false);
      }
    };
    getProjects();
  }, [id]);

  const router = useRouter();
  return (
    <Fragment>
      <div className="flex flex-row">
        {userType === "Client" ? (
          <div
            onClick={() => router.push("/projects/create")}
            className="btn btn-ghost btn-circle lg:w-36 hover:bg-gray-100"
          >
            <div
              id="create-project-button"
              className="flex flex-row justify-center items-center gap-2"
            >
              <Icon path={mdiPencil} size={0.8} />
              <span className="lg:block hidden">Create Project</span>
            </div>
          </div>
        ) : (
          <div
            onClick={() => router.push("/projects")}
            className="btn btn-ghost btn-circle lg:w-36 hover:bg-gray-100"
          >
            <div
              id="browse-project-button"
              className="flex flex-row justify-center items-center gap-2"
            >
              <Icon path={mdiMagnify} size={0.8} />
              <span className="lg:block hidden">Browse Projects</span>
            </div>
          </div>
        )}

        <div
          id="projects-button"
          tabIndex={0}
          role="button"
          className="btn btn-ghost btn-circle mr-2 dropdown dropdown-bottom dropdown-end z-10 flex hover:bg-gray-100"
        >
          <div className={`${Body.className} z-10 rounded-full `}>
            <Icon path={mdiInbox} size={0.8} />
          </div>
          <ul
            tabIndex={0}
            className={`${Body.className} dropdown-content justify-center z-10 menu p-2 shadow-lg border border-primary bg-base-100 rounded-box w-80 py-6 gap-4 `}
          >
            {loadingProjects ? (
              <span className=" loading loading-spinner loading-md self-center"></span>
            ) : !projects ? (
              "You have no existing projects"
            ) : (
              projects.map((project, index) => (
                <li key={index}>
                  <div
                    id={`project-${index}`}
                    onClick={() => router.push(`/project/${project.id}`)}
                    className="hover:bg-gray-100 border-y border-secondary justify-start flex"
                  >
                    <span className="flex flex-row gap-3 items-center">
                      <span
                        className={`${Headings.className} text-lg text-bold`}
                      >
                        {index + 1}
                      </span>
                      <span className={`${Body.className}`}>
                        {project.projectName.length >= 30
                          ? project.projectName.slice(0, 30) + "..."
                          : project.projectName}
                      </span>
                    </span>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
        <div
          tabIndex={0}
          role="button"
          className="btn btn-ghost btn-circle avatar dropdown dropdown-end z-10"
        >
          <div
            id="account-button"
            className={`${Body.className} w-10 border-primary border z-10 rounded-full mt-1 shadow-md hover:border-secondary hover:border-2`}
          >
            <Image
              className=""
              src={profilePhotoURL}
              alt="Profile Picture"
              width={480}
              height={480}
            />
          </div>

          <ul
            tabIndex={0}
            className={`${Body.className} dropdown-content justify-center z-10 menu p-2 shadow-lg mt-1 border border-primary bg-base-100 rounded-box w-52 py-6 gap-4 `}
          >
            <li>
              <div
                id="profile-button"
                onClick={() => router.push("/profile")}
                className="hover:bg-gray-100"
              >
                <a className="flex flex-row">
                  <Icon path={mdiAccount} size={1} className="mr-2" />
                  <span>Profile</span>
                </a>
              </div>
            </li>

            <li>
              <div
                id="logout-button"
                onClick={logout}
                className="hover:bg-gray-100"
              >
                <a className="flex flex-row">
                  <Icon path={mdiDoorOpen} size={1} className="mr-2" />
                  <span>Sign Out</span>
                </a>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </Fragment>
  );
};

export default ProfileButtons;
