import { CreateTask } from "@/features/task/CreateTask/ui";
import type { ReactNode, FC } from "react";

type PropsType = {
  children: ReactNode;
};

export const TaskTable: FC<PropsType> = ({ children }) => {
  return (
    <div>
      <CreateTask />
      <div>{children}</div>
    </div>
  );
};
