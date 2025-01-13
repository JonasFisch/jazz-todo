import { List, Todo, TodoAccountProfile } from "../schema";
import { TodoComponent } from "./Todo.tsx";
import {
  Avatar,
  Button,
  Col,
  Empty,
  InputRef,
  Row,
  Tooltip,
  Typography,
} from "antd";
import {
  EditOutlined,
  UsergroupAddOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useRef, useState } from "react";
import { createInviteLink, useAccount, useCoState } from "jazz-react";
import { Account, Group, ID } from "jazz-tools";
import { InviteModal } from "./InviteModal.tsx";
import { useNavigate } from "react-router-dom";
import { Image } from "./Image.tsx";

export function ListComponent({ listID }: { listID: ID<List> }) {
  const newItemRef = useRef<InputRef | null>(null);
  const [inviteOpen, setInviteOpen] = useState(false);

  const { me } = useAccount();
  const navigate = useNavigate();

  const list = useCoState(List, listID);
  const uncheckedTodos = (list?.todos ?? []).filter((todo) => !todo?.checked);
  const lastTodo = uncheckedTodos[uncheckedTodos.length - 1];
  const members = list?._owner.castAs(Group).members ?? [];

  const invite = (role: "reader" | "writer") => {
    if (list) {
      const inviteLink = createInviteLink(list, role, {
        valueHint: "list",
      });
      if (inviteLink) navigator.clipboard.writeText(inviteLink);
    }
  };

  const focusLastItem = () => {
    setTimeout(() => {
      // focus referenced item after DOM update
      if (newItemRef.current) newItemRef.current.focus();
    }, 0);
  };

  // add list to users lists if needed
  // useEffect(() => {
  //   if (
  //     list &&
  //     !me.root?.lists?.find((savedLists) => savedLists?.id == list?.id)
  //   ) {
  //     me.root?.lists?.push(list);
  //   }
  // }, [list, me.root]);

  const createAndAddTodo = () => {
    console.log("lastTodo", lastTodo);
    console.log("lastTodoosEmpty", lastTodo?.isEmpty());
    console.log("list.todos", list?.todos);

    if (lastTodo && !lastTodo?.isEmpty())
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

  if (list) {
    return (
      <Row className="flex flex-col h-full gap-2 flex-nowrap w-full py-4">
        <Col flex={"none"}>
          <Button
            onClick={() => navigate("/", {})}
            type="text"
            size="middle"
            className="text-gray-400 block sm:hidden"
          >
            &larr; back
          </Button>
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
            </Typography.Title>

            {list._owner.myRole() === "admin" && (
              <div>
                <Button
                  icon={<UsergroupAddOutlined />}
                  onClick={() => {
                    invite("writer");
                  }}
                >
                  Share
                </Button>
                <InviteModal
                  onInvitePressed={async (userID) => {
                    const account = await Account.load(
                      userID as ID<Account>,
                      me,
                      []
                    );
                    if (account) {
                      const group = list._owner.castAs(Group);
                      group.addMember(account, "writer");
                    } else console.warn("WARNING: could not load user...");
                  }}
                  open={inviteOpen}
                  onClose={() => setInviteOpen(false)}
                  onCancel={() => setInviteOpen(false)}
                />
              </div>
            )}
          </div>
          {members.length > 1 && (
            <Avatar.Group
              max={{
                count: 2,
                style: { color: "#f56a00", backgroundColor: "#fde3cf" },
              }}
              className="flex flex-row justify-end w-full"
            >
              {members.map((member) => {
                const profile = member.account?.profile as TodoAccountProfile;
                return (
                  <Tooltip
                    key={`avatar-${member.id}`}
                    title={member.account?.profile?.name}
                    placement="top"
                  >
                    <Avatar
                      size={"large"}
                      className="bg-gray-300"
                      icon={
                        profile?.image ? (
                          <Image image={profile.image} />
                        ) : (
                          <UserOutlined />
                        )
                      }
                    />
                  </Tooltip>
                );
              })}
            </Avatar.Group>
          )}
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
          <div className="pt-4 pb-2 flex flex-row justify-end">
            <Button onClick={createAndAddTodo} size="large">
              Create Todo
            </Button>
          </div>
        </Col>
      </Row>
    );
  } else {
    return <div>Loading todos...</div>;
  }
}
