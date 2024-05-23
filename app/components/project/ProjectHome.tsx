"use client";
import { Body, Headings } from "@/app/fonts/roboto";
import { ProjectType } from "@/app/utils/ProjectProps";
import { UserType } from "@/app/utils/UserProps";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { z } from "zod";
import { mdiAlertCircleOutline } from "@mdi/js";
import Icon from "@mdi/react";
import { useRouter } from "next/navigation";
import React, { Fragment, useState } from "react";
import Modal from "react-modal";

interface ProjectHomeProps {
  project: ProjectType;
  client: UserType | null;
  user: UserType | null;
}

const RatingSchema = z.object({
  rating: z.number().min(1, "Rating is required").max(5, "Rating is too high"),
  comment: z.string().min(3, "Rating comment is required")
});

type FormData = z.infer<typeof RatingSchema> & {
  rating: number;
  comment: string;
};

const ProjectHome: React.FC<ProjectHomeProps> = ({ project, client, user }) => {
  const [progress, setProgress] = useState(project.progress);
  const [errorVisible, setErrorVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const progressBar = {
    "--value": project.progress
  } as React.CSSProperties;

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({
    resolver: zodResolver(RatingSchema)
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    const rating = Number(data.rating);
    const response = await fetch(`/api/project/${project.id}/rate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: project.developerId,
        comment: data.comment,
        rate: rating
      })
    });

    if (response.ok) {
      handleFinishProject(true);
      router.push("/");
    } else {
      setErrorMessage("Error submitting rating!");
      setErrorVisible(true);
      setTimeout(() => {
        setErrorVisible(false);
      }, 5000);
    }
  };

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
                contentLabel="Project Finished?"
                className="fixed inset-0 z-50 flex items-center justify-center mx-4"
                overlayClassName="fixed inset-0 z-40 bg-gray-500 bg-opacity-75"
                appElement={document.getElementById("root") || undefined}
              >
                <div className="bg-white p-6 rounded-md shadow-md z-50">
                  <h2 className="text-xl mb-4">
                    Are you sure the project is finished?
                  </h2>
                  <div>
                    <form
                      onSubmit={handleSubmit(onSubmit)}
                      className="flex flex-col"
                    >
                      <div className="rating rating-md">
                        <Controller
                          name="rating"
                          control={control}
                          render={({ field }) => (
                            <>
                              <input
                                type="radio"
                                {...field}
                                value={1}
                                className="mask mask-star-2 bg-orange-400"
                                checked={field.value === 1}
                                onChange={() => field.onChange(1)}
                              />
                              <input
                                type="radio"
                                {...field}
                                value={2}
                                className="mask mask-star-2 bg-orange-400"
                                checked={field.value === 2}
                                onChange={() => field.onChange(2)}
                              />
                              <input
                                type="radio"
                                {...field}
                                value={3}
                                className="mask mask-star-2 bg-orange-400"
                                checked={field.value === 3}
                                onChange={() => field.onChange(3)}
                              />
                              <input
                                type="radio"
                                {...field}
                                value={4}
                                className="mask mask-star-2 bg-orange-400"
                                checked={field.value === 4}
                                onChange={() => field.onChange(4)}
                              />
                              <input
                                type="radio"
                                {...field}
                                value={5}
                                className="mask mask-star-2 bg-orange-400"
                                checked={field.value === 5}
                                onChange={() => field.onChange(5)}
                              />
                            </>
                          )}
                        />
                        {errors.rating && (
                          <p className="text-red-500">
                            {errors.rating.message}
                          </p>
                        )}
                      </div>
                      <Controller
                        name="comment"
                        control={control}
                        render={({ field }) => (
                          <textarea
                            className={`${Body.className} w-full h-32 border border-gray-300 rounded-lg p-2`}
                            placeholder="Write a comment about the developer..."
                            {...field}
                          />
                        )}
                      />
                      {errors.comment && (
                        <p className="text-red-500">{errors.comment.message}</p>
                      )}
                      <button
                        type="submit"
                        className={`btn btn-primary ${Body.className} mt-2`}
                      >
                        Submit Rating
                      </button>
                    </form>
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
