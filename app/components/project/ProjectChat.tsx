import { Body } from "@/app/fonts/roboto";
import { ProjectType } from "@/app/utils/ProjectProps";
import { UserType } from "@/app/utils/UserProps";
import React, { Fragment } from "react";
import ProjectChatTab from "./ProjectChatTab";
import Icon from "@mdi/react";
import { mdiMessageArrowRightOutline } from "@mdi/js";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

interface ProjectChatProps {
  project: ProjectType;
  user: UserType | null;
  otherUser: UserType | null;
}

const messageSchema = z.object({
  message: z.string().min(1, "Message is required")
});

type Message = z.infer<typeof messageSchema>;

const ProjectChat: React.FC<ProjectChatProps> = ({
  project,
  user,
  otherUser
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<Message>({
    resolver: zodResolver(messageSchema)
  });

  const onSubmit = async (data: Message) => {
    const { message } = data;
    const response = await fetch(`/api/project/${project.id}/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        userId: user?.id,
        content: message,
        type: "text"
      })
    });
    if (response.ok) {
      reset();
    }
  };

  return (
    <Fragment>
      {user && otherUser ? (
        <div
          className={`${Body.className} artboard phone-2 lg:phone-3 gap-2 border-gray-400 border flex flex-col flex-1 h-full w-full lg:mx-12 mx-4 lg:py-8 pt-4 mt-4 shadow-md`}
        >
          <div className="self-center text-letter text-center border-b border-gray-400 ">
            <div className="flex flex-col mb-2">
              <div className="text-2xl ">Chat for: {project.projectName}</div>
              <div className="text-gray-400 text-sm">
                Hello, {user.displayName}
              </div>
              {otherUser && (
                <div className="text-gray-400 text-sm">
                  You are chatting with {otherUser.displayName}
                </div>
              )}
            </div>
          </div>
          <div className="grid grid-rows-[1fr_auto] h-full lg:border border-gray-500 lg:mx-12 mb-2 rounded-md p-4">
            <div className="overflow-y-auto max-h-[calc(100vh-400px)] lg:max-h-[calc(100vh-450px)] lg:px-2">
              <ProjectChatTab
                projectId={project.id}
                sender={user}
                receiver={otherUser}
              />
            </div>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="mt-4 w-full flex "
            >
              <label className="input input-bordered input-primary flex flex-row gap-2 flex-1">
                <input
                  type="text"
                  className="grow"
                  placeholder="Send a message..."
                  {...register("message")}
                />

                <button
                  type="submit"
                  className="btn btn-ghost self-end  text-primary"
                >
                  <Icon path={mdiMessageArrowRightOutline} size={1} />
                </button>
              </label>
              {errors.message && (
                <span className="text-red-500">
                  {String(errors.message.message)}
                </span>
              )}
            </form>
          </div>
        </div>
      ) : (
        "Error!"
      )}
    </Fragment>
  );
};

export default ProjectChat;
