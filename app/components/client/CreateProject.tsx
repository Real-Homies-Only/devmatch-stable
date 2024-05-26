"use client";
import React, { Fragment, useState, useContext } from "react";
import Icon from "@mdi/react";
import { mdiContentSave, mdiClose, mdiArrowLeft } from "@mdi/js";
import { AuthContext } from "@/app/context/AuthContext";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Modal from "react-modal";
import { useRouter } from "next/navigation";

const schema = z.object({
  projectName: z.string().min(1, "Project name is required"),
  category: z.string().min(1, "Category is required"),
  language: z.string().optional(),
  description: z.string().optional()
});

type FormData = z.infer<typeof schema>;

const CreateProject: React.FC = () => {
  const { user } = useContext(AuthContext);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<FormData>({
    resolver: zodResolver(schema)
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const router = useRouter();

  if (!user || user.userType !== "Client") {
    return null;
  }

  const onSubmit = async (data: FormData) => {
    if (!user) {
      console.error("Please Register First!");
      return;
    }

    const categoryValue = getCategoryName(data.category);

    try {
      const formData = new FormData();
      formData.append("projectName", data.projectName);
      formData.append("category", categoryValue);
      formData.append("language", data.language || "");
      formData.append("description", data.description || "");
      if (selectedFile) {
        formData.append("photo", selectedFile);
      }
      formData.append("clientId", user.id);

      const response = await fetch("/api/project", {
        method: "POST",
        body: formData
      });

      if (response.ok) {
        setModalMessage("Project created successfully");
        setIsModalOpen(true);
        reset();
        router.push("/");
      } else {
        setModalMessage("Failed to create project");
        setIsModalOpen(true);
      }
    } catch (error) {
      console.error("Error:", error);
      setModalMessage("An error occurred");
      setIsModalOpen(true);
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

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleBackToHome = () => {
    router.push("/"); //put the directory here after completing the form
  };

  return (
    <Fragment>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Project Creation Result"
        className="fixed inset-0 z-50 flex items-center justify-center"
        overlayClassName="fixed inset-0 z-40 bg-gray-500 bg-opacity-75"
        appElement={document.getElementById("root") || undefined}
        role="modal-info"
      >
        <div className="bg-white p-6 rounded-md shadow-md z-50">
          <h2 className="text-xl font-bold mb-4">{modalMessage}</h2>
          <div className="flex justify-end">
            <button
              data-testid="back-to-home-button"
              className="btn btn-primary flex items-center"
              onClick={handleBackToHome}
            >
              <Icon
                path={mdiArrowLeft}
                size={0.8}
                className="inline-block mr-2"
              />
              Back to Home
            </button>
          </div>
        </div>
      </Modal>

      <div className="flex justify-center">
        <div className="w-full max-w-md mt-10">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white border border-black shadow-md rounded px-8 pt-6 pb-8 mb-4"
          >
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="photo"
              >
                Photo
              </label>
              <input
                data-testid="photo"
                id="photo"
                type="file"
                accept="image/*"
                className="input input-bordered w-full pt-2"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="projectName"
              >
                Project Name
              </label>
              <input
                data-testid="project-name"
                type="text"
                placeholder="Enter project name"
                className={`input input-bordered w-full ${
                  errors.projectName ? "input-error" : ""
                }`}
                {...register("projectName")}
              />
              {errors.projectName && (
                <span className="text-error">{errors.projectName.message}</span>
              )}
            </div>

            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="category"
              >
                Category
              </label>
              <select
                data-testid="category"
                id="category"
                className={`select select-bordered w-full ${
                  errors.category ? "select-error" : ""
                }`}
                {...register("category")}
              >
                <option value="">Select a category</option>
                <option id="game" value="game">
                  Game Development
                </option>
                <option value="mobile">Mobile Application</option>
                <option value="web">Web Development</option>
              </select>
              {errors.category && (
                <span className="text-error">{errors.category.message}</span>
              )}
            </div>

            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="language"
              >
                Language
              </label>
              <input
                data-testid="language"
                id="language"
                type="text"
                placeholder="Enter programming language"
                className="input input-bordered w-full"
                {...register("language")}
              />
            </div>

            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="description"
              >
                Description
              </label>
              <textarea
                data-testid="description"
                id="description"
                className="textarea textarea-bordered w-full"
                placeholder="Enter project description"
                {...register("description")}
              ></textarea>
            </div>

            <div className="flex items-center justify-between">
              {user && user.userType === "Client" && (
                <button
                  data-testid="submit-button"
                  id="submit-button"
                  type="submit"
                  className="btn btn-primary"
                >
                  <Icon
                    path={mdiContentSave}
                    size={0.8}
                    className="inline-block mr-2"
                  />
                  Submit
                </button>
              )}
              <button
                id="cancel"
                type="button"
                className="btn btn-secondary"
                onClick={() => router.push("/")}
              >
                <Icon
                  path={mdiClose}
                  size={0.8}
                  className="inline-block mr-2"
                />
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
