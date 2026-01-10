"use client";

import toast from "react-hot-toast";
import { clientapi } from "~/trpc/react";

// TODO: lock and animate a todo item on toggle or delete
export function TodoList() {
  const { data: todos, isPending, isError } = clientapi.todo.all.useQuery();

  // Refresh the list after toggling the todo's done status
  const utils = clientapi.useUtils();
  const invalidateAll = async () => {
    await utils.todo.all.invalidate();
  };

  const { mutate: doneMutation } = clientapi.todo.toggle.useMutation({
    onSettled: invalidateAll,
    onSuccess: (data, { done, id }, context) => {
      if (done) {
        toast.success(`Todo '${id}' toggled to done`);
      }
    },
    onMutate: async ({ id, done }) => {
      // Cancel any outgoing refetches,
      // so they don't overwrite our optimistic update.
      await utils.todo.all.cancel();

      // Snapshot the previous value
      const previousTodos = utils.todo.all.getData();

      // Optimistically update to the new value
      utils.todo.all.setData(undefined, (prev) => {
        if (!prev) return previousTodos;
        return prev.map((todo) => {
          if (todo.id === id) {
            return { ...todo, done };
          }
          return todo;
        });
      });

      return { previousTodos };
    },
    onError: (error, newTodo, context) => {
      toast.error(
        `Failed to toggle todo to ${newTodo.done ? "done" : "undone"}`,
      );
      utils.todo.all.setData(undefined, () => context?.previousTodos);
    },
  });

  const { mutate: deleteMutation } = clientapi.todo.delete.useMutation({
    onSettled: invalidateAll,
    onMutate: async (deletedId: string) => {
      // Cancel any outgoing refetches,
      // so they don't overwrite our optimistic update.
      await utils.todo.all.cancel();

      // Snapshot the previous value
      const previousTodos = utils.todo.all.getData();

      // Optimistically update to the new value
      utils.todo.all.setData(undefined, (prev) => {
        if (!prev) return previousTodos;
        return prev.filter((todo) => todo.id !== deletedId);
      });

      return { previousTodos };
    },
    onError: (error, newTodo, context) => {
      toast.error("Failed to create todo");
      utils.todo.all.setData(undefined, () => context?.previousTodos);
    },
  });

  const toggleHandler = (
    id: string,
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    doneMutation({ id, done: event.target.checked });
  };

  if (isPending) return "loading...";
  if (isError) return "error";

  if (todos.length < 1) return "Create your first todo...";

  return (
    <div className="">
      {todos.map((todo) => {
        const { id, done, text } = todo;
        return (
          <div className="my-3.5" key={id}>
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <input
                  className="h-4 w-4 cursor-pointer rounded border border-gray-300 bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
                  type="checkbox"
                  name="done"
                  id={id}
                  checked={done}
                  onChange={(e) => toggleHandler(id, e)}
                />
                <label
                  htmlFor={id}
                  className={`cursor-pointer ${done ? "line-through" : ""}`}
                >
                  {text}
                </label>
              </div>
              <button
                className="w-full rounded-lg bg-blue-700 px-2 py-1 text-center text-sm font-medium text-white hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 focus:outline-none sm:w-auto dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                onClick={() => deleteMutation(id)}
              >
                Delete
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
