import { Input, InputRef } from "antd";
import { Todo } from "../schema";
import { forwardRef, useState } from "react";
import { AnimatedInput } from "./AnimatedInput";

export const TodoComponent = forwardRef<
  InputRef,
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
          setChecked(true);
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
            ref={ref}
            type="text"
            placeholder=""
            variant="borderless"
            value={todo.title}
            spellCheck={false}
            onChange={(event) => {
              todo.title = event.target.value;
            }}
            className={todo.checked ? "line-through" : ""}
            onFocus={() => {
              onFocused?.();
            }}
          />
        </form>
      </div>
    </div>
  );
});
