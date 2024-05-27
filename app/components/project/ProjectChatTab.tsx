"use client";
import { MessagesType } from "@/app/utils/MessagesProps";
import { UserType } from "@/app/utils/UserProps";
import React, { Fragment, useEffect, useRef, useState } from "react";
import { supabase } from "@/app/utils/supabase";
import Image from "next/image";
import { useRouter } from "next/navigation";

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
  const chatDivRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

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
          newMessage.sentTime = new Date(
            newMessage.sentTime
          ).toLocaleTimeString();
          setMessages((prevMessages) => [...prevMessages, newMessage]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [projectId]);

  useEffect(() => {
    const chatDiv = chatDivRef.current;
    if (chatDiv) {
      chatDiv.scrollTop = chatDiv.scrollHeight;
    }
  }, [messages]);

  return (
    <Fragment>
      {sender && receiver ? (
        <div
          ref={chatDivRef}
          className="flex-grow overflow-y-auto max-h-[calc(50vh)] lg:px-2"
        >
          {messages ? (
            messages.map((message, index) =>
              message.senderId === sender.id ? (
                <div className={`chat chat-end `} key={index}>
                  <div
                    className="chat-image avatar flex items-start justify-start"
                    onClick={() => router.push(`/user/${sender.username}`)}
                  >
                    <div className="w-10 rounded-full">
                      <Image
                        className=""
                        src={sender.profilePicture}
                        alt="Profile Picture"
                        width={480}
                        height={480}
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
                  <div
                    className="chat-image avatar"
                    onClick={() => router.push(`/profile/${receiver.username}`)}
                  >
                    <div className="w-10 rounded-full">
                      <Image
                        className=""
                        src={receiver.profilePicture}
                        alt="Profile Picture"
                        width={480}
                        height={480}
                      />
                    </div>
                  </div>
                  <div className="chat-header">
                    {receiver.displayName}
                    <time className="text-xs opacity-50 ml-2">
                      {message.sentTime}
                    </time>
                  </div>
                  <div className="chat-bubble bg-primary">
                    {message.content}
                  </div>
                </div>
              )
            )
          ) : (
            <div>No messages sent!</div>
          )}
        </div>
      ) : (
        <div>Users dont exist!</div>
      )}
    </Fragment>
  );
};

export default ProjectChatTab;
