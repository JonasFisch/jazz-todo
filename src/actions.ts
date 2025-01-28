import { co, Group } from "jazz-tools";
import { List, ListManagerAccount, ListofLists, ListOfTodos } from "./schema";

export const createList = (owner: ListManagerAccount, name: string = "") => {
  const group = Group.create({ owner: owner });
  const newList = List.create(
    {
      name: name,
      todos: ListOfTodos.create([], { owner: group }),
      getNameWithFallback: "",
      deleted: false,
    },
    { owner: group }
  );
  return newList;
};

export const removeListFromRoot = (list: List, me: ListManagerAccount) => {
  if (me.root && me.root.lists) {
    const lists: co<List | null>[] =
      me.root?.lists?.filter((l) => l?.id !== list.id) ?? [];
    me.root.lists = ListofLists.create(lists);
  }
};

export const deleteList = (list: List, owner: ListManagerAccount) => {
  if (owner.root && owner.root.lists) {
    list.deleted = true;
    list._owner.castAs(Group).removeMember(owner);
    removeListFromRoot(list, owner);
    const lists: co<List | null>[] =
      owner.root?.lists?.filter((l) => l?.id !== list.id) ?? [];
    owner.root.lists = ListofLists.create(lists);
  }
};

export const removeAccountFromList = (
  list: List,
  account: ListManagerAccount
) => {
  if (list._owner.myRole() == "admin") {
    list._owner.castAs(Group).removeMember(account);
  } else {
    throw new Error("No permission to do that!");
  }
};
