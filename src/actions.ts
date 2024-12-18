import { Group } from "jazz-tools";
import { List, ListManagerAccount, ListOfTodos } from "./schema";

export const createList = (owner: ListManagerAccount) => {
  const group = owner.root?._owner ?? Group.create({ owner: owner });
  const newList = List.create(
    {
      name: "Einkaufsliste",
      todos: ListOfTodos.create([], { owner: group }),
    },
    { owner: group }
  );
  return newList;
};
