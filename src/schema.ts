import { Account, CoList, CoMap, Profile, co } from "jazz-tools";

export class ListManagerAccount extends Account {
  profile = co.ref(Profile);
  root = co.ref(TodoAccountRoot);

  migrate(this: ListManagerAccount, creationProps?: { name: string }) {
    super.migrate(creationProps);
    if (!this._refs.root) {
      this.root = TodoAccountRoot.create(
        {
          lists: ListofLists.create([], { owner: this }),
          activeList: undefined,
        },
        { owner: this }
      );
    }
  }
}

export class TodoAccountRoot extends CoMap {
  lists = co.ref(ListofLists);
  activeList = co.optional.ref(List);
}

export class Todo extends CoMap {
  title = co.string;
  description = co.optional.string;
  checked = co.boolean;

  isEmpty = () => {
    return this.title.match(/^\s*$/); // empty = no whitespaces or just spaces
  };
}

export class ListOfTodos extends CoList.Of(co.ref(Todo)) {}

export class List extends CoMap {
  name = co.string;
  todos = co.ref(ListOfTodos);
}

export class ListofLists extends CoList.Of(co.ref(List)) {}
