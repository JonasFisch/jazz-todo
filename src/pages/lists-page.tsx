import { Content } from "antd/es/layout/layout";
import { ListComponent } from "../components/List";
import { List } from "../schema";
import { ID } from "jazz-tools";
import { useParams } from "react-router-dom";

export function ListPage() {
  const { id } = useParams<{ id: string }>();
  return (
    <Content style={{ padding: "0 24px", minHeight: 280 }}>
      {id && <ListComponent key={id} listID={id as ID<List>} />}
    </Content>
  );
}
