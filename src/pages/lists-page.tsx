import { ListComponent } from "../components/List";
import { List } from "../schema";
import { ID } from "jazz-tools";
import { useParams } from "react-router-dom";

export function ListPage() {
  const { id } = useParams<{ id: string }>();
  return (
    <main style={{ minHeight: 280 }}>
      {id && <ListComponent key={id} listID={id as ID<List>} />}
    </main>
  );
}
