"use client";

import type { ReactNode } from "react";

export interface TodoItem {
  id: string;
  done: boolean;
  text: string;
}

interface TodosSectionProps {
  /** Заголовок раздела */
  title: string;
  /** Список элементов для отображения */
  items: TodoItem[];
  /** Открыт ли раздел */
  isOpen: boolean;
  /** Callback для переключения состояния раздела */
  onToggle: () => void;
  /** Содержимое раздела (обычно список элементов) */
  children?: ReactNode;
  /** Сообщение при пустом списке */
  emptyMessage?: string;
  /** Пользовательское количество элементов (может отличаться от длины массива) */
  itemCount?: number;
}

/**
 * Переиспользуемый компонент раздела с задачами
 *
 * Компонент поддерживает:
 * - Отображение заголовка с количеством элементов
 * - Сворачивание/разворачивание содержимого
 * - Кастомное количество элементов
 * - Сообщение при пустом списке
 */
export function TodosSection({
  title,
  items,
  isOpen,
  onToggle,
  children,
  emptyMessage = "No items",
  itemCount,
}: TodosSectionProps) {
  const displayCount = itemCount ?? items.length;

  return (
    <div className="mb-6 overflow-hidden rounded-lg border border-gray-600">
      <button
        onClick={onToggle}
        className="hover:bg-gray-650 flex w-full items-center justify-between bg-gray-700 px-4 py-3 text-left font-semibold text-gray-100 transition-colors"
        aria-expanded={isOpen}
        aria-label={`${isOpen ? "Collapse" : "Expand"} ${title}`}
      >
        <span>
          {title} ({displayCount})
        </span>
        <span className="text-lg">{isOpen ? "▼" : "▶"}</span>
      </button>

      {isOpen && (
        <div className="bg-gray-800 p-4">
          {items.length > 0 ? (
            <div className="space-y-2">{children}</div>
          ) : (
            <p className="py-2 text-gray-400">{emptyMessage}</p>
          )}
        </div>
      )}
    </div>
  );
}
