import { List, Todo } from "../schema";
import { TodoComponent } from "./Todo.tsx";
import {
  Button,
  Col,
  Empty,
  Input,
  InputRef,
  Modal,
  Row,
  Typography,
} from "antd";
import { EditOutlined, UsergroupAddOutlined } from "@ant-design/icons";
import { useRef, useState } from "react";
import { createInviteLink, useDemoAuth } from "jazz-react";
import { useAccount, useCoState } from "../hooks/jazz-hooks.ts";
import { Account, Group, ID } from "jazz-tools";
import { InviteModal } from "./InviteModal.tsx";

export function ListComponent({ listID }: { listID: ID<List> }) {
  const newItemRef = useRef<InputRef | null>(null);
  const [inviteOpen, setInviteOpen] = useState(false);

  const { me } = useAccount();

  const list = useCoState(List, listID);
  const uncheckedTodos = (list?.todos ?? []).filter((todo) => !todo?.checked);
  const lastTodo = uncheckedTodos[uncheckedTodos.length - 1];

  const invite = (role: "reader" | "writer") => {
    if (list) {
      console.log("created invite for: ", list.id);

      const inviteLink = createInviteLink(list, "reader", {
        valueHint: "list",
      });
      if (inviteLink) {
        console.log("copied link to clipboard");

        navigator.clipboard.writeText(inviteLink);
      }
    }
  };

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

  console.log("myrole is: ", list?._owner.myRole());

  if (list) {
    return (
      <Row className="flex flex-col h-full gap-2 flex-nowrap">
        <Col flex={"none"}>
          <div className="flex flex-row justify-between items-start">
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
            {list._owner.myRole() === "admin" && (
              <div>
                <Button
                  icon={<UsergroupAddOutlined />}
                  // onClick={() => {
                  //   invite("writer");
                  // }}
                  onClick={() => setInviteOpen(true)}
                >
                  {/* Share */}
                  Invite
                </Button>
                <InviteModal
                  onInvitePressed={async (userID) => {
                    console.log("inviting user here", userID);
                    const account = await Account.load(
                      userID as ID<Account>,
                      me,
                      []
                    );
                    // TODO: try invite with using groups
                    if (account) {
                      const group = list._owner.castAs(Group);
                      group.addMember(account, "writer");
                    } else {
                      console.warn("WARNING: could not load user...");
                    }
                  }}
                  open={inviteOpen}
                  onClose={() => setInviteOpen(false)}
                  onCancel={() => setInviteOpen(false)}
                />
              </div>
            )}
          </div>
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
          <div className="py-4 flex flex-row justify-end">
            <Button onClick={createAndAddTodo}>Create Todo</Button>
          </div>
        </Col>
      </Row>
    );
  } else {
    return <div>Loading todos...</div>;
  }
}
