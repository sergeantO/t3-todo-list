"use client";

import { useCallback, useState, type ChangeEvent, type FormEvent } from "react";
import toast from "react-hot-toast";
import { createInputSchema } from "~/schemas/todo";
import { clientapi } from "~/trpc/react";

// TODO disable button on submit
export default function CreateTodo() {
  const [newTodoText, setNewTodoText] = useState("");

  const utils = clientapi.useUtils();
  const { mutate } = clientapi.todo.create.useMutation({
    onMutate: async () => {
      // Cancel any outgoing refetches,
      // so they don't overwrite our optimistic update.
      await utils.todo.all.cancel();

      // Snapshot the previous value
      const previousTodos = utils.todo.all.getData();

      // Optimistically update to the new value
      utils.todo.all.setData(undefined, (prev) => {
        const optimisticTodo = {
          id: Date.now().toString(),
          text: newTodoText,
          done: false,
        };

        if (!prev) return [optimisticTodo];
        return [...prev, optimisticTodo];
      });

      return { previousTodos };
    },
    onError: (error, newTodo, context) => {
      setNewTodoText(newTodo.text);
      toast.error("Failed to create todo");
      utils.todo.all.setData(undefined, () => context?.previousTodos);
    },
    onSettled: async () => {
      await utils.todo.all.invalidate();
    },
  });

  const submitHandler = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const createTodoData = { text: newTodoText };
      const result = createInputSchema.safeParse(createTodoData);

      if (!result.success) {
        const formatted =
          result.error.format().text?._errors.join("\n") ??
          "Ошибка при создании задачи";

        toast.error(formatted);
        return;
      }

      // Create todo mutation
      mutate(createTodoData);
      setNewTodoText("");
    },
    [newTodoText, mutate],
  );

  const onChangeInputHandler = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setNewTodoText(val);
    },
    [],
  );

  return (
    <div>
      <form onSubmit={submitHandler} className="flex gap-2">
        <input
          className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
          placeholder="New Todo..."
          type="text"
          name="new-todo"
          id="new-todo"
          value={newTodoText}
          onChange={onChangeInputHandler}
        />
        <button className="w-full rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 focus:outline-none sm:w-auto dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
          Create
        </button>
      </form>
    </div>
  );
}
