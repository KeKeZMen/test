import type { Task } from "@prisma/client";
import type { FC } from "react";

type PropsType = {
  task: Task;
  deleteButton?: JSX.Element;
};

export const TaskRow: FC<PropsType> = ({ task, deleteButton }) => {
  return (
    <div className="flex justify-between items-center gap-3">
      <p>{task.id}</p>
      <p>{task.message}</p>
      {deleteButton}
    </div>
  );
};
