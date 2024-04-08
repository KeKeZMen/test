import { TaskRow } from "@/entities/task/ui/TaskRow";
import { DeleteTaskButton } from "@/features/task/DeleteTask/ui";
import { prisma } from "@/shared/db/prisma";
import { TaskTable } from "@/widgets/TaskTable";

export default async function Home() {
  const tasks = await prisma.task.findMany();

  return (
    <div>
      <TaskTable>
        {tasks.map((task) => (
          <TaskRow
            task={task}
            deleteButton={<DeleteTaskButton taskId={task.id} />}
          />
        ))}
      </TaskTable>
    </div>
  );
}
