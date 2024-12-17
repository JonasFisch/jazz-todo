import { useState } from "react";
import { List, ListOfTodos } from "./schema";
import { useAccount } from "./main";
import { Group, ID } from "jazz-tools";
import { ListComponent } from "./components/List";

function App() {
  const { me } = useAccount();
  const [listID, setListID] = useState<ID<List> | undefined>(
    (window.location.search?.replace("?list=", "") || undefined) as
      | ID<List>
      | undefined
  );

  const createList = () => {
    const group = Group.create({ owner: me });
    const newList = List.create(
      {
        name: "Einkaufsliste",
        todos: ListOfTodos.create([], { owner: group }),
      },
      { owner: group }
    );
    setListID(newList.id);
    window.history.pushState({}, "", `?list=${newList.id}`);
  };

  if (listID) {
    return (
      <>
        <h1>{me.profile?.name}</h1>
        <ListComponent listID={listID} />
      </>
    );
  } else {
    return <button onClick={createList}>Create List</button>;
  }
}

export default App;
