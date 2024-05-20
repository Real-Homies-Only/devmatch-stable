"use client";
import { AuthContext } from "@/app/context/AuthContext";
import { Headings } from "@/app/fonts/roboto";
import React, { Fragment, useContext } from "react";
import Modal from "react-modal";
import useFetchProject from "@/app/utils/useFetchProject";
import { useParams, useRouter } from "next/navigation";
import Dashboard from "./Dashboard";

const ProjectPage = () => {
  const params = useParams();
  const { user, loading } = useContext(AuthContext);
  const { project, loadingProject } = useFetchProject(
    params?.id as string,
    user?.id as string
  );
  const router = useRouter();

  if (loading || loadingProject) {
    return (
      <Modal
        isOpen={loading}
        contentLabel="Loading..."
        className="fixed inset-0 z-50 flex items-center justify-center"
        overlayClassName="fixed inset-0 z-40 bg-gray-500 bg-opacity-75"
      >
        <div
          className={`flex flex-col gap-4 items-center ${Headings.className}`}
        >
          <span className="text-xl text-white">Loading project...</span>
          <span className="loading loading-spinner text-primary loading-lg" />
        </div>
      </Modal>
    );
  }

  if (!user || !project) {
    router.push("/");
  }

  return (
    <Fragment>
      <div>
        {user &&
          project &&
          (user.id === project.clientId || user.id === project.developerId) && (
            <Dashboard project={project} />
          )}
      </div>
    </Fragment>
  );
};

export default ProjectPage;
