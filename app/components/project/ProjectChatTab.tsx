"use client";
import { MessagesType } from "@/app/utils/MessagesProps";
import { UserType } from "@/app/utils/UserProps";
import React, { Fragment, useEffect, useState } from "react";
import { supabase } from "@/app/utils/supabase";

interface ProjectChatTabProps {
  sender: UserType;
  receiver: UserType;
  projectId: string;
}

const ProjectChatTab: React.FC<ProjectChatTabProps> = ({
  sender,
  receiver,
  projectId
}) => {
  const [messages, setMessages] = useState<MessagesType[]>([]);

  useEffect(() => {
    const getMessages = async () => {
      const response = await fetch(`/api/project/${projectId}/messages`, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
      });
      const { formattedMessages } = await response.json();

      setMessages(formattedMessages);
    };
    getMessages();

    const channel = supabase
      .channel(`message-room`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "Messages"
        },
        (payload) => {
          console.log(payload);
          const newMessage = payload.new as MessagesType;
          setMessages((prevMessages) => [...prevMessages, newMessage]);
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [projectId]);

  return (
    <Fragment>
      {sender && receiver ? (
        <Fragment>
          {messages ? (
            messages.map((message, index) =>
              message.senderId === sender.id ? (
                <div className={`chat chat-end `} key={index}>
                  <div className="chat-image avatar flex items-start justify-start">
                    <div className="w-10 rounded-full">
                      <img
                        alt="Tailwind CSS chat bubble component"
                        src={sender.profilePicture}
                      />
                    </div>
                  </div>
                  <div className="chat-header">
                    {sender.displayName}
                    <time className="text-xs opacity-50 ml-2">
                      {message.sentTime}
                    </time>
                  </div>
                  <div className="chat-bubble bg-primary">
                    {message.content}
                  </div>
                </div>
              ) : (
                <div className={`chat chat-start`} key={index}>
                  <div className="chat-image avatar">
                    <div className="w-10 rounded-full">
                      <img
                        alt="Tailwind CSS chat bubble component"
                        src={receiver.profilePicture}
                      />
                    </div>
                  </div>
                  <div className="chat-header">
                    {receiver.displayName}
                    <time className="text-xs opacity-50 ml-2">
                      {message.sentTime}
                    </time>
                  </div>
                  <div className="chat-bubble bg-secondary">
                    {message.content}
                  </div>
                </div>
              )
            )
          ) : (
            <div>No messages sent!</div>
          )}
        </Fragment>
      ) : (
        <div>Users dont exist!</div>
      )}
    </Fragment>
  );
};

export default ProjectChatTab;
