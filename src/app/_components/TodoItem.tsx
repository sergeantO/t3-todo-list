"use client";

export interface TodoItemProps {
  /** Task ID */
  id: string;
  /** Whether the task is completed */
  done: boolean;
  /** Task text/title */
  text: string;
  /** Callback when checkbox is toggled */
  onToggle: (id: string, done: boolean) => void;
  /** Callback when delete button is clicked */
  onDelete: (id: string) => void;
}

/**
 * Individual task item component
 *
 * Features:
 * - Checkbox for toggling task completion status
 * - Visual indication of completed tasks (strikethrough, gray text)
 * - Delete button for removing the task
 * - Full accessibility support
 */
export function TodoItem({
  id,
  done,
  text,
  onToggle,
  onDelete,
}: TodoItemProps) {
  const handleToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    onToggle(id, e.target.checked);
  };

  return (
    <div className="my-3.5 flex items-center justify-between gap-2 rounded bg-gray-800 p-3">
      <div className="flex flex-1 items-center gap-3">
        <input
          className="h-4 w-4 cursor-pointer rounded border border-gray-400 bg-gray-700 accent-blue-500"
          type="checkbox"
          name="done"
          id={id}
          checked={done}
          onChange={handleToggle}
          aria-label={`Mark "${text}" as ${done ? "incomplete" : "complete"}`}
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
        onClick={() => onDelete(id)}
        aria-label={`Delete task "${text}"`}
      >
        Delete
      </button>
    </div>
  );
}
