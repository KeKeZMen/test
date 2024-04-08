"use server";

import { prisma } from "@/shared/db/prisma";
import { revalidatePath } from "next/cache";

export async function deleteTask(taskId: number) {
  await prisma.task.delete({
    where: {
      id: taskId,
    },
  });

  revalidatePath("/");
}
