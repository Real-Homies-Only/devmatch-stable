"use client";
import React, { useState, useEffect } from "react";

interface Project {
  id: string;
  projectName: string;
  category: string;
  language: string;
  description: string;
  client: {
    username: string;
  };
}

const BrowseProject = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("/api/browse");
        const data = await response.json();
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

  return (
    <div className="flex flex-wrap justify-center">
      {Array.isArray(projects) &&
        projects.map((project) => (
          <div
            key={project.id}
            className="w-64 h-64 bg-white shadow-md rounded p-4 m-4"
            onClick={() => handleProjectClick(project)}
          >
            <h2 className="text-lg font-bold">{project.projectName}</h2>
            <p className="text-sm">{project.category}</p>
            <p className="text-sm">{project.language}</p>
          </div>
        ))}
      {selectedProject && (
        <dialog
          id="my_modal_3"
          className="modal"
          open={selectedProject !== null}
        >
          <div className="modal-box">
            <h3 className="font-bold text-lg">{selectedProject.projectName}</h3>
            <p className="py-4">{selectedProject.description}</p>
            <p className="text-sm">Category: {selectedProject.category}</p>
            <p className="text-sm">Language: {selectedProject.language}</p>
            <p className="text-sm">Client: {selectedProject.client.username}</p>
            <button className="btn btn-sm" onClick={handleModalClose}>
              Close
            </button>
          </div>
        </dialog>
      )}
    </div>
  );
};

export default BrowseProject;
