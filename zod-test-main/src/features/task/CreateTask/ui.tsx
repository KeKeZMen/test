"use client";

import { useFormState, useFormStatus } from "react-dom";
import { createTask } from "./lib";

const SubmitButton = () => {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      className={`${pending ? "text-white" : "text-black"}`}
      disabled={pending}
    >
      {pending ? "Отправка" : "Отправить"}
    </button>
  );
};

export const CreateTask = () => {
  const [state, formAction] = useFormState(createTask, {
    data: { message: "123" },
  });

  return (
    <form action={formAction}>
      <input type="text" name="message" defaultValue={state?.data?.message}/>
      <input type="file" name="file" />
      <SubmitButton />
      {state?.error?.map((e, i) => (
        <p key={i}>{e.message}</p>
      ))}
    </form>
  );
};
