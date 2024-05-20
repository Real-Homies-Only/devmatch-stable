import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import Icon from "@mdi/react";
import { mdiPlus } from "@mdi/js";
import { motion } from "framer-motion";
import { AddTaskProps, NewTaskType } from "@/app/utils/KanbanProps";

const AddTask: React.FC<AddTaskProps> = ({
  column,
  setTasks,
  projectId,
  userType
}) => {
  const [text, setText] = useState("");
  const [adding, setAdding] = useState(false);
  const [characterCount, setCharacterCount] = useState(0);
  const maxCharacters = 100;

  useEffect(() => {
    const fetchTasks = async () => {
      const response = await fetch(`/api/project/${projectId}/kanban`);
      const data = await response.json();
      setTasks(data);
    };
    fetchTasks();
  }, [setTasks, projectId]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!text.trim().length || characterCount > maxCharacters) return;

    const newTask: NewTaskType = {
      column,
      title: text.trim(),
      projectId
    };

    const response = await fetch(`/api/project/${projectId}/kanban`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newTask)
    });
    const data = await response.json();
    setTasks((pv) => [...pv, data]);

    setAdding(false);
  };

  const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    const newCharacterCount = newText.length;
    setCharacterCount(newCharacterCount);
    setText(newText);
  };

  return (
    <>
      {adding ? (
        <motion.form layout onSubmit={handleSubmit} className="w-full">
          <textarea
            onChange={handleTextChange}
            placeholder="Add new task..."
            className="w-full rounded border border-violet-400 bg-violet-400/20 p-3 text-sm text-gray-700 placeholder-violet-300 focus:outline-0"
          />
          <div className="mt-1.5 flex items-center justify-end gap-1.5">
            <button
              onClick={() => setAdding(false)}
              className="px-3 py-1.5 text-xs text-neutral-400 transition-colors hover:text-neutral-50"
            >
              Close
            </button>
            <button
              type="submit"
              disabled={characterCount > maxCharacters}
              className={`flex items-center gap-1.5 rounded bg-neutral-50 px-3 py-1.5 text-xs text-neutral-950 transition-colors hover:bg-neutral-300 ${
                characterCount > maxCharacters
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              <span>Add</span>
              <Icon path={mdiPlus} size={0.6} />
            </button>
            {characterCount > maxCharacters && (
              <div className="text-xs text-red-500">
                Character limit exceeded ({maxCharacters} characters max)
              </div>
            )}
          </div>
        </motion.form>
      ) : userType === "Client" ? (
        <> </>
      ) : (
        <motion.button
          layout
          onClick={() => setAdding(true)}
          className="flex w-full items-center gap-1.5 px-3 py-1.5 text-xs text-neutral-400 transition-colors hover:text-neutral-50"
        >
          <span>Add task</span>
          <Icon path={mdiPlus} size={0.6} />
        </motion.button>
      )}
    </>
  );
};

export default AddTask;
