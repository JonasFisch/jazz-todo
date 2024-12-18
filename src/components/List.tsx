import { List, Todo } from "../schema";
import { TodoComponent } from "./Todo.tsx";
import { Button, Col, Empty, InputRef, Row, Typography } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { useRef } from "react";

export function ListComponent({ list: list }: { list: List }) {
  const uncheckedTodos = (list?.todos ?? []).filter((todo) => !todo?.checked);
  const lastTodo = uncheckedTodos[uncheckedTodos.length - 1];

  const newItemRef = useRef<InputRef | null>(null);

  // const invite = (role: "reader" | "writer") => {
  //   if (list) {
  //     const link = createInviteLink(list, role, {
  //       valueHint: "project",
  //     });
  //     navigator.clipboard.writeText(link);
  //   }
  // };

  const focusLastItem = () => {
    setTimeout(() => {
      // focus referenced item after DOM update
      if (newItemRef.current) newItemRef.current.focus();
    }, 0);
  };

  const createAndAddTodo = () => {
    if (!lastTodo?.isEmpty())
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
    focusLastItem();
  };
  console.log(list);

  if (list) {
    return (
      <Row className="flex flex-col h-full gap-2 flex-nowrap">
        <Col flex={"none"}>
          <Typography.Title
            editable={{
              onChange: (newText) => {
                if (newText.match(/^.+$/)) list.name = newText;
              },
              triggerType: ["text", "icon"],
              icon: <EditOutlined className="ml-2" />,
              autoSize: true,
              maxLength: 28,
              // editing: true,
            }}
            onEnded={(event) => {
              event.preventDefault();
            }}
            className="mt-[1px]"
          >
            {list.name}
            {/* (permission: {list._owner.myRole()}) */}
          </Typography.Title>
          {/* <Paragraph>Das ist ein optionale beschreibung</Paragraph> */}
          {/* {list._owner.myRole() === "admin" && (
              <>
                <button onClick={() => invite("reader")}>Invite Guest</button>
                <button onClick={() => invite("writer")}>Invite Member</button>
              </>
            )} */}
        </Col>
        <Col flex={"auto"} className="overflow-y-auto">
          <div className="flex flex-col gap-0 h-full">
            <div className="flex flex-col gap-4">
              {uncheckedTodos.map(
                (todo, index) =>
                  todo && (
                    <TodoComponent
                      key={todo.id}
                      todo={todo}
                      onEnterPressed={createAndAddTodo}
                      ref={
                        index === (uncheckedTodos.length ?? 0) - 1
                          ? newItemRef
                          : null
                      }
                    />
                  )
              )}
            </div>
            <div className="w-full flex-1" onClick={createAndAddTodo}>
              {uncheckedTodos.length <= 0 && (
                <div className="h-full flex flex-col justify-center">
                  <Empty></Empty>
                </div>
              )}
            </div>
          </div>
        </Col>
        <Col flex={"none"}>
          <div className="p-4 flex flex-row justify-end">
            <Button onClick={createAndAddTodo}>Create Todo</Button>
          </div>
        </Col>
      </Row>
    );
  } else {
    return <div>Loading todos...</div>;
  }
}
