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
    <div className="flex flex-row gap-4 items-center">
      <AnimatedInput
        id={`todo-checkbox-${todo.id}`}
        onChange={(event) => {
          setChecked(event.target.checked);
          todo.checked = event.target.checked;
        }}
        checked={checked}
      />
      <div className="border-b border-1 border-solid w-full">
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
            className={`border-0 bg-transparent ${
              todo.checked ? "line-through" : ""
            }`}
            onFocus={() => {
              onFocused?.();
            }}
          />
          {/* <Input
            
          /> */}
        </form>
      </div>
    </div>
  );
});
