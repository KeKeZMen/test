"use client";

import type { FC } from "react";
import { deleteTask } from "./lib";

type PropsType = {
  taskId: number;
};

export const DeleteTaskButton: FC<PropsType> = ({ taskId }) => {
  const handleDeleteTask = async () => {
    await deleteTask(taskId);
  };

  return <button onClick={handleDeleteTask}>Удалить</button>;
};
