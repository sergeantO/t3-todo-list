"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { clientapi } from "~/trpc/react";

export function TodoList() {
  const { data: todos, isPending, isError } = clientapi.todo.all.useQuery();
  const [isActiveSectionOpen, setIsActiveSectionOpen] = useState(true);
  const [isCompletedSectionOpen, setIsCompletedSectionOpen] = useState(true);

  const utils = clientapi.useUtils();
  const invalidateAll = async () => {
    await utils.todo.all.invalidate();
  };

  const { mutate: doneMutation } = clientapi.todo.toggle.useMutation({
    onSettled: invalidateAll,
    onSuccess: (data, { done }) => {
      if (done) {
        toast.success("Task moved to completed");
      } else {
        toast.success("Task moved to active");
      }
    },
    onMutate: async ({ id, done }) => {
      await utils.todo.all.cancel();
      const previousTodos = utils.todo.all.getData();

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
    onError: (error, variables, context) => {
      toast.error(
        `Failed to move task to ${variables.done ? "completed" : "active"}`,
      );
      utils.todo.all.setData(undefined, () => context?.previousTodos);
    },
  });

  const { mutate: deleteMutation } = clientapi.todo.delete.useMutation({
    onSettled: invalidateAll,
    onSuccess: () => {
      toast.success("Task deleted");
    },
    onMutate: async (deletedId: string) => {
      await utils.todo.all.cancel();
      const previousTodos = utils.todo.all.getData();

      utils.todo.all.setData(undefined, (prev) => {
        if (!prev) return previousTodos;
        return prev.filter((todo) => todo.id !== deletedId);
      });

      return { previousTodos };
    },
    onError: (error, variables, context) => {
      toast.error("Failed to delete task");
      utils.todo.all.setData(undefined, () => context?.previousTodos);
    },
  });

  const toggleHandler = (
    id: string,
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    doneMutation({ id, done: event.target.checked });
  };

  if (isPending) return "Loading...";
  if (isError) return "Error";

  if (!todos || todos.length < 1) return "Create your first task...";

  const activeTodos = todos.filter((todo) => !todo.done);
  const completedTodos = todos.filter((todo) => todo.done);

  const TodoItem = ({
    id,
    done,
    text,
  }: {
    id: string;
    done: boolean;
    text: string;
  }) => (
    <div className="my-3.5 flex items-center justify-between gap-2 rounded bg-gray-800 p-3">
      <div className="flex flex-1 items-center gap-3">
        <input
          className="h-4 w-4 cursor-pointer rounded border border-gray-400 bg-gray-700 accent-blue-500"
          type="checkbox"
          name="done"
          id={id}
          checked={done}
          onChange={(e) => toggleHandler(id, e)}
        />
        <label
          htmlFor={id}
          className={`flex-1 cursor-pointer ${
            done ? "text-gray-400 line-through" : "text-white"
          }`}
        >
          {text}
        </label>
      </div>
      <button
        className="rounded bg-red-700 px-3 py-1 text-sm font-medium text-white transition-colors hover:bg-red-800"
        onClick={() => deleteMutation(id)}
      >
        Delete
      </button>
    </div>
  );

  const TaskSection = ({
    title,
    items,
    isOpen,
    onToggle,
  }: {
    title: string;
    items: Array<{ id: string; done: boolean; text: string }>;
    isOpen: boolean;
    onToggle: () => void;
  }) => (
    <div className="mb-6 overflow-hidden rounded-lg border border-gray-600">
      <button
        onClick={onToggle}
        className="hover:bg-gray-650 flex w-full items-center justify-between bg-gray-700 px-4 py-3 text-left font-semibold text-gray-100 transition-colors"
      >
        <span>
          {title} ({items.length})
        </span>
        <span className="text-lg">{isOpen ? "▼" : "▶"}</span>
      </button>

      {isOpen && (
        <div className="bg-gray-800 p-4">
          {items.length > 0 ? (
            <div className="space-y-2">
              {items.map((todo) => (
                <TodoItem key={todo.id} {...todo} />
              ))}
            </div>
          ) : (
            <p className="py-2 text-gray-400">No {title.toLowerCase()}</p>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="w-full">
      <TaskSection
        title="Active Tasks"
        items={activeTodos}
        isOpen={isActiveSectionOpen}
        onToggle={() => setIsActiveSectionOpen(!isActiveSectionOpen)}
      />
      <TaskSection
        title="Completed Tasks"
        items={completedTodos}
        isOpen={isCompletedSectionOpen}
        onToggle={() => setIsCompletedSectionOpen(!isCompletedSectionOpen)}
      />
    </div>
  );
}
