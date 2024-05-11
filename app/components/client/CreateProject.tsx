"use client";
import React, { Fragment, useState, useContext } from "react";
import Icon from "@mdi/react";
import { mdiContentSave, mdiClose } from "@mdi/js";
import { AuthContext } from "@/app/context/AuthContext";

const CreateProject: React.FC = () => {
  const [projectName, setProjectName] = useState("");
  const [category, setCategory] = useState("");
  const [projectManagement, setProjectManagement] = useState("");
  const [position, setPosition] = useState("");
  const [language, setLanguage] = useState("");
  const [description, setDescription] = useState("");

  const { user } = useContext(AuthContext);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user) {
      console.error("Please Register First!");
      return;
    }
    const categoryValue = getCategoryName(category);

    try {
      const response = await fetch("/api/projectTable", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          projectName,
          category: categoryValue,
          projectManagement,
          position,
          language,
          description,
          clientId: user.id
        })
      });

      if (response.ok) {
        // Handle successful project creation
        console.log("Project created successfully");
      } else {
        // Handle error
        console.error("Failed to create project");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const getCategoryName = (value: string) => {
    switch (value) {
      case "game":
        return "Game Development";
      case "mobile":
        return "Mobile Application";
      case "web":
        return "Web Development";
      default:
        return "";
    }
  };

  return (
    <Fragment>
      <div className="flex justify-center">
        <div className="artboard rounded-xl gap-2 border-letter border flex flex-col flex-1 py-12 w-full lg:mx-12 mx-4 mt-4 shadow-md">
          <form onSubmit={handleSubmit}>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Project Name</span>
              </label>
              <input
                type="text"
                placeholder="Enter project name"
                className="input input-bordered"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Category</span>
              </label>
              <select
                className="select select-bordered"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">Select a category</option>
                <option value="game">Game Development</option>
                <option value="mobile">Mobile Application</option>
                <option value="web">Web Development</option>
              </select>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Project Management</span>
              </label>
              <input
                type="text"
                placeholder="Enter project management type"
                className="input input-bordered"
                value={projectManagement}
                onChange={(e) => setProjectManagement(e.target.value)}
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Position</span>
              </label>
              <input
                type="text"
                placeholder="Enter your position"
                className="input input-bordered"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Language</span>
              </label>
              <input
                type="text"
                placeholder="Enter programming language"
                className="input input-bordered"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Description</span>
              </label>
              <textarea
                className="textarea textarea-bordered"
                placeholder="Enter project description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>

            <div className="flex justify-end mt-4">
              <button type="submit" className="btn btn-primary gap-2">
                <Icon path={mdiContentSave} size={0.8} />
                Submit
              </button>
              <button type="button" className="btn btn-ghost ml-2">
                <Icon path={mdiClose} size={0.8} />
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </Fragment>
  );
};

export default CreateProject;
