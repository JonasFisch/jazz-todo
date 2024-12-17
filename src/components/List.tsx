import { ID } from "jazz-tools";
import { List, Todo } from "../schema";
import { useCoState } from "../main";
import { createInviteLink } from "jazz-react";
import { TodoComponent } from "./Todo.tsx";

export function ListComponent({ listID: listId }: { listID: ID<List> }) {
  const list = useCoState(List, listId);

  const invite = (role: "reader" | "writer") => {
    if (list) {
      const link = createInviteLink(list, role, {
        valueHint: "project",
      });
      navigator.clipboard.writeText(link);
    }
  };

  const createAndAddTodo = () => {
    list?.todos?.push(
      Todo.create(
        {
          title: "",
          description: "",
          checked: false,
        },
        { owner: list._owner }
      )
    );
  };

  return list ? (
    <div>
      <h1>
        {list.name} (permission: {list._owner.myRole()})
      </h1>
      {list._owner.myRole() === "admin" && (
        <>
          <button onClick={() => invite("reader")}>Invite Guest</button>
          <button onClick={() => invite("writer")}>Invite Member</button>
        </>
      )}
      <div className="border-r border-b flex flex-col gap-4">
        {list.todos
          ?.filter((todo) => !todo?.checked)
          .map((todo) => todo && <TodoComponent key={todo.id} todo={todo} />)}
        <button onClick={createAndAddTodo}>Create Todo</button>
      </div>
    </div>
  ) : (
    <div>Loading project...</div>
  );
}
