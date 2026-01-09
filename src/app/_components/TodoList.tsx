"use client";

import { clientapi } from "~/trpc/react";

export function TodoList() {
  const { data: todos, isPending, isError } = clientapi.todo.all.useQuery();

  if (isPending) return "loading...";
  if (isError) return "error";

  if (todos.length < 1) return "Create your first todo...";

  return (
    <>
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
                  // onChange={(e) => {
                  //   doneMutation({ id, done: e.target.checked });
                  // }}
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
                // onClick={() => {
                //   deleteMutation(id);
                // }}
              >
                Delete
              </button>
            </div>
          </div>
        );
      })}
    </>
  );
}
