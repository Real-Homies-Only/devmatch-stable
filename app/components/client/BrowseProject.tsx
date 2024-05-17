"use client";
import React, { useState, useEffect, useRef } from "react";

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
        console.log(data);
        if (Array.isArray(data)) {
          setProjects(data);
        } else {
          console.error("Expected an array of projects, but got:", data);
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
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

  return (
    <div className="flex flex-col items-center min-h-screen relative pt-6">
      <div
        ref={projectsContainerRef}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6"
      >
        {Array.isArray(currentProjects) &&
          currentProjects.map((project) => (
            <div
              key={project.id}
              className="w-64 h-64 bg-white shadow-md rounded p-4"
              onClick={() => handleProjectClick(project)}
            >
              <img
                src={project.projectPicture}
                alt={project.projectName}
                className="w-full h-32 object-cover mb-2"
              />
              <h2 className="text-lg font-bold">{project.projectName}</h2>
              <p className="text-sm">{project.client.displayName}</p>
              <p className="text-sm ">{project.category}</p>
              <p className="text-sm">{project.language}</p>
            </div>
          ))}
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
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
          <dialog
            id="my_modal_3"
            className="modal"
            open={selectedProject !== null}
          >
            <div className="modal-box">
              <img
                src={selectedProject.projectPicture}
                alt={selectedProject.projectName}
                className="w-full h-64 object-cover mb-4"
              />
              <h3 className="font-bold text-lg text-center">
                {selectedProject.projectName}
              </h3>
              <div className="px-4 pt-4">
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
                <p className="break-words">{selectedProject.description}</p>
                <button className="btn btn-sm" onClick={handleModalClose}>
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
