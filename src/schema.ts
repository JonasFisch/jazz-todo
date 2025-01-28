import {
  Account,
  CoList,
  CoMap,
  ImageDefinition,
  Profile,
  co,
} from "jazz-tools";

export class TodoAccountProfile extends Profile {
  image = co.ref(ImageDefinition, { optional: true });
}

export class ListManagerAccount extends Account {
  profile = co.ref(TodoAccountProfile);
  root = co.ref(TodoAccountRoot);

  migrate(this: ListManagerAccount, creationProps?: { name: string }) {
    super.migrate(creationProps);
    if (!this._refs.root) {
      this.root = TodoAccountRoot.create(
        {
          lists: ListofLists.create([], { owner: this }),
          activeList: undefined,
          focusedTodo: undefined,
        },
        { owner: this }
      );
    }
    if (!this._refs.profile) {
      this.profile = TodoAccountProfile.create(
        {
          name: "",
          image: null,
        },
        {
          owner: this,
        }
      );
    }
  }
}

export class TodoAccountRoot extends CoMap {
  lists = co.ref(ListofLists);
  activeList = co.optional.ref(List);
  focusedTodo = co.ref(Todo, { optional: true });
}

export class Todo extends CoMap {
  title = co.string;
  description = co.optional.string;
  checked = co.boolean;

  get isEmpty() {
    return this.title.match(/^\s*$/); // empty = no whitespaces or just spaces
  }
}

export class ListOfTodos extends CoList.Of(co.ref(Todo)) {}

export class List extends CoMap {
  name = co.string;
  deleted = co.boolean;
  todos = co.ref(ListOfTodos);

  get getNameWithFallback() {
    return this.name == "" ? "Untitled List" : this.name;
  }
}

export class ListofLists extends CoList.Of(co.ref(List)) {}
