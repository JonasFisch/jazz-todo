import { Todo } from "../schema";

export function TodoComponent({ todo }: { todo: Todo }) {
  return (
    <div className="flex flex-row gap-4">
      <input
        type="checkbox"
        checked={todo.checked}
        onChange={(event) => {
          todo.checked = event.target.checked;
        }}
      />
      <input
        type="text"
        value={todo.title}
        onChange={(event) => {
          todo.title = event.target.value;
        }}
      />
      <input
        type="text"
        value={todo.description}
        onChange={(event) => {
          todo.description = event.target.value;
        }}
      />
    </div>
  );
}
