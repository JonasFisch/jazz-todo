import { Todo } from "../schema";
import { forwardRef, useState } from "react";
import { AnimatedInput } from "./AnimatedInput";
import { Input } from "./ui/input";

export const TodoComponent = forwardRef<
  HTMLInputElement,
  {
    todo: Todo;
    onEnterPressed?: () => void;
    onFocused?: () => void;
  }
>(({ todo, onEnterPressed: onSave, onFocused }, ref) => {
  const [checked, setChecked] = useState(todo.checked);

  return (
    <div className="flex flex-row gap-4 items-center px-3">
      <AnimatedInput
        id={`todo-checkbox-${todo.id}`}
        onChange={(event) => {
          setChecked(event.target.checked);
          todo.checked = event.target.checked;
        }}
        checked={checked}
      />
      <div className=" w-full my-1">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            onSave?.();
          }}
        >
          <Input
            type="text"
            placeholder=""
            ref={ref}
            value={todo.title}
            spellCheck={false}
            onChange={(event) => {
              todo.title = event.target.value;
            }}
            className={`focus-visible:ring-offset-0 focus-visible:ring-0 text-tiny border-0 bg-transparent ${
              todo.checked ? "line-through" : ""
            }`}
            onFocus={() => {
              onFocused?.();
            }}
          />
        </form>
      </div>
    </div>
  );
});
