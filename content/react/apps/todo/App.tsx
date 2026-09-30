import { useEffect, useState, type FormEvent } from "react";

type Todo = {
  id: string;
  text: string;
  done: boolean;
};

type Filter = "all" | "active" | "done";

const STORAGE_KEY = "toolkit:todo";
const FILTERS: Filter[] = ["all", "active", "done"];

const loadTodos = (): Todo[] => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]") as Todo[];
  } catch {
    return [];
  }
};

const matchesFilter = (todo: Todo, filter: Filter) =>
  filter === "all" || (filter === "done") === todo.done;

export function App() {
  const [todos, setTodos] = useState<Todo[]>(loadTodos);
  const [filter, setFilter] = useState<Filter>("all");
  const [text, setText] = useState("");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  const addTodo = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmed = text.trim();

    if (!trimmed) {
      return;
    }

    setTodos((prev) => [
      ...prev,
      { id: crypto.randomUUID(), text: trimmed, done: false },
    ]);
    setText("");
  };

  const toggleTodo = (id: string) =>
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, done: !todo.done } : todo,
      ),
    );

  const removeTodo = (id: string) =>
    setTodos((prev) => prev.filter((todo) => todo.id !== id));

  const visibleTodos = todos.filter((todo) => matchesFilter(todo, filter));
  const activeCount = todos.filter((todo) => !todo.done).length;

  return (
    <main className="todo">
      <h1>Todo</h1>

      <form className="todo__form" onSubmit={addTodo}>
        <input
          autoFocus
          placeholder="What needs to be done?"
          value={text}
          onChange={(event) => setText(event.target.value)}
        />
        <button type="submit">Add</button>
      </form>

      <div className="todo__filters" role="group" aria-label="Filter">
        {FILTERS.map((value) => (
          <button
            key={value}
            type="button"
            aria-pressed={filter === value}
            onClick={() => setFilter(value)}
          >
            {value}
          </button>
        ))}
      </div>

      <ul className="todo__list">
        {visibleTodos.map((todo) => (
          <li key={todo.id} className={todo.done ? "_done" : undefined}>
            <label>
              <input
                type="checkbox"
                checked={todo.done}
                onChange={() => toggleTodo(todo.id)}
              />
              {todo.text}
            </label>
            <button
              type="button"
              aria-label={`Remove "${todo.text}"`}
              onClick={() => removeTodo(todo.id)}
            >
              ×
            </button>
          </li>
        ))}
      </ul>

      <p className="todo__footer">{activeCount} left</p>
    </main>
  );
}
