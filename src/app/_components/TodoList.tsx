"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { clientapi } from "~/trpc/react";
import { TodosSection } from "./TodosSection";
import { TodoItem } from "./TodoItem";

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

  const handleToggle = (id: string, done: boolean) => {
    doneMutation({ id, done });
  };

  const handleDelete = (id: string) => {
    deleteMutation(id);
  };

  if (isPending) return "Loading...";
  if (isError) return "Error";

  if (!todos || todos.length < 1) return "Create your first task...";

  const activeTodos = todos.filter((todo) => !todo.done);
  const completedTodos = todos.filter((todo) => todo.done);

  return (
    <div className="w-full">
      <TodosSection
        title="Active Tasks"
        items={activeTodos}
        isOpen={isActiveSectionOpen}
        onToggle={() => setIsActiveSectionOpen(!isActiveSectionOpen)}
        emptyMessage="No active tasks"
      >
        {activeTodos.map((todo) => (
          <TodoItem
            key={todo.id}
            id={todo.id}
            done={todo.done}
            text={todo.text}
            onToggle={handleToggle}
            onDelete={handleDelete}
          />
        ))}
      </TodosSection>
      <TodosSection
        title="Completed Tasks"
        items={completedTodos}
        isOpen={isCompletedSectionOpen}
        onToggle={() => setIsCompletedSectionOpen(!isCompletedSectionOpen)}
        emptyMessage="No completed tasks"
      >
        {completedTodos.map((todo) => (
          <TodoItem
            key={todo.id}
            id={todo.id}
            done={todo.done}
            text={todo.text}
            onToggle={handleToggle}
            onDelete={handleDelete}
          />
        ))}
      </TodosSection>
    </div>
  );
}
