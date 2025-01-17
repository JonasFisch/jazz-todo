import { Checkbox, Input, InputRef } from "antd";
import { Todo } from "../schema";
import { forwardRef } from "react";

export const TodoComponent = forwardRef<
  InputRef,
  {
    todo: Todo;
    onEnterPressed?: () => void;
    onFocused?: () => void;
  }
>(({ todo, onEnterPressed: onSave, onFocused }, ref) => {
  return (
    <div className="flex flex-row gap-4">
      <Checkbox
        onChange={(event) => {
          todo.checked = event.target.checked;
        }}
        checked={todo.checked}
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
            onFocus={() => {
              onFocused?.();
            }}
          />
        </form>
      </div>
    </div>
  );
});
