"use server";

import { prisma } from "@/shared/db/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { writeFile } from "fs/promises";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const ACCEPTED_FILE_TYPES = ["image/svg+xml"];
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const taskSchema = z.object({
  message: z.string().min(5, "Недостаточно символов"),
  file: z.instanceof(File).superRefine((f, ctx) => {
    if (!ACCEPTED_FILE_TYPES.includes(f.type)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Расширение файла должно быть одно из [${ACCEPTED_FILE_TYPES.join(
          ", "
        )}], но у вас ${f.type}`,
      });
    }
  }),
});

export async function createTask(state: any, formData: FormData) {
  const result = taskSchema.safeParse({
    message: formData.get("message"),
    file: formData.get("file"),
  });

  if (result.success) {
    await prisma.task.create({
      data: {
        message: result.data.message,
      },
    });

    const fileBytes = await result.data.file.arrayBuffer();
    const fileBuffer = Buffer.from(fileBytes);

    await writeFile(join(__dirname, result.data.file.name), fileBuffer);

    revalidatePath("/");

    return { data: { message: result.data.message } };
  }

  if (result.error) {
    return { error: result.error.errors };
  }
}
