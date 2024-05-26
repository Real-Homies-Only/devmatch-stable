"use client";
import { AuthContext } from "@/app/context/AuthContext";
import { Body, Headings } from "@/app/fonts/roboto";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState, useEffect, useRef, useContext } from "react";

interface Project {
  id: string;
  projectName: string;
  category: string;
  language: string;
  description: string;
  projectPicture: string;
  client: { displayName: string };
}

const BrowseProject = () => {
  const { user, loading } = useContext(AuthContext);
  const router = useRouter();

  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 12;
  const projectsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("api/browse/${id}");
        const data = await response.json();

        if (response.ok) {
          if (Array.isArray(data)) {
            setProjects(data);
          } else {
            console.error("Expected an array of projects, but got:", data);
            setProjects([]);
          }
        } else {
          console.error("Error fetching projects:", response.status);
          setProjects([]);
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
        setProjects([]);
      }
    };
    fetchProjects();
  }, []);

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
  };

  const handleModalClose = () => {
    setSelectedProject(null);
  };

  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = projects.slice(
    indexOfFirstProject,
    indexOfLastProject
  );

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  if (loading) {
    return (
      <span
        data-testid="loading-spinner"
        className="loading loading-spinner loading-lg self-center justify-center"
      ></span>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-screen relative pt-6">
      <div
        id="project-cards-container"
        ref={projectsContainerRef}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6"
      >
        {currentProjects.length === 0 ? (
          <div data-testid="no-projects-message">
            {Body.className}Woops, there are no current projects!
          </div>
        ) : (
          Array.isArray(currentProjects) &&
          currentProjects.map((project, index) => (
            <div
              key={project.id}
              id={`project-card-${index + 1}`}
              data-testid={`project-card-${project.id}`}
              className="w-64 h-64 bg-white shadow-md rounded border border-primary p-4"
              onClick={() => handleProjectClick(project)}
            >
              <Image
                width={1280}
                height={720}
                src={project.projectPicture}
                alt={project.projectName}
                className="w-full rounded-md h-32 object-cover mb-2"
              />
              <h2 className={`${Headings.className} text-lg font-bold`}>
                {project.projectName}
              </h2>
              <p className={`${Body.className} text-sm`}>
                by {project.client.displayName}
              </p>
              <p className={`${Body.className} text-sm`}>
                Category: {project.category}
              </p>
              <p className={`${Body.className} text-sm`}>
                Language: {project.language}
              </p>
            </div>
          ))
        )}
      </div>
      <div className="btn-group mt-auto mb-6">
        <button
          className="btn mr-2"
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
        >
          &laquo; Previous
        </button>
        <button className="btn">Page {currentPage}</button>
        <button
          className="btn ml-2"
          onClick={() => paginate(currentPage + 1)}
          disabled={indexOfLastProject >= projects.length}
        >
          Next &raquo;
        </button>
      </div>
      {selectedProject && user && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
          <dialog
            data-testid="project-modal"
            id="my_modal_3"
            className="modal"
            open={selectedProject !== null}
          >
            <div className="modal-box border border-primary">
              <Image
                width={1280}
                height={720}
                src={selectedProject.projectPicture}
                alt={selectedProject.projectName}
                className="w-full h-64 object-cover mb-4"
              />
              <h3
                className={`${Headings.className} font-bold text-lg text-center`}
              >
                {selectedProject.projectName}
              </h3>
              <div className={`${Body.className} px-4 pt-4`}>
                <div className="flex justify-between">
                  <div>
                    <p className="text-sm font-bold">Category:</p>
                    <p>{selectedProject.category}</p>
                  </div>
                  <div>
                    <p className="text-sm font-bold ">Client:</p>
                    <p>{selectedProject.client.displayName}</p>
                  </div>
                </div>
                <p className="text-sm font-bold">Language Used:</p>
                <p>{selectedProject.language}</p>
                <p className="pt-2 font-bold">Description:</p>
                <p className="break-words mb-4">
                  {selectedProject.description}
                </p>
                <button
                  id="bid-button"
                  data-testid="bid-button"
                  className="btn btn-sm float-right border-primary"
                  onClick={() =>
                    router.push(
                      `/projects/bid?projectId=${selectedProject.id}&developerId=${user.id}`
                    )
                  }
                >
                  Bid
                </button>
                <button
                  className="btn btn-sm border-primary"
                  onClick={handleModalClose}
                >
                  Close
                </button>
              </div>
            </div>
          </dialog>
        </div>
      )}
    </div>
  );
};

export default BrowseProject;
