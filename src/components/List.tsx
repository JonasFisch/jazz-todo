import { List, Todo } from "../schema";
import { TodoComponent } from "./Todo.tsx";
import { Button, Col, Drawer, Empty, Row, Typography } from "antd";
import { SettingOutlined } from "@ant-design/icons";
import { useEffect, useRef, useState } from "react";
import { useAccount, useCoState } from "jazz-react";
import { ID } from "jazz-tools";
import { useNavigate } from "react-router-dom";
import { ListSettings } from "./ListSettings.tsx";

export function ListComponent({ listID }: { listID: ID<List> }) {
  const lastItemRef = useRef<HTMLDivElement | null>(null);
  const [showListSettings, setShowListSettings] = useState(false);

  const { me } = useAccount();
  const navigate = useNavigate();

  const list = useCoState(List, listID);
  const uncheckedTodos = (list?.todos ?? []).filter((todo) => !todo?.checked);
  const lastTodo = uncheckedTodos[uncheckedTodos.length - 1];

  const focusLastItem = () => {
    setTimeout(() => {
      // focus referenced item after DOM update
      if (lastItemRef.current) {
        lastItemRef.current.focus();
        lastItemRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, 0);
  };

  // add list to users lists if needed
  useEffect(() => {
    if (
      list &&
      !me.root?.lists?.find((savedLists) => savedLists?.id == list?.id)
    ) {
      me.root?.lists?.push(list);
    }
  }, [list, me.root]);

  const createAndAddTodo = () => {
    // otherwise build try catch around and log error message
    if (list) {
      if (!lastTodo?.isEmpty) {
        const newTodo = Todo.create(
          {
            title: "",
            description: "",
            checked: false,
          },
          { owner: list._owner }
        );
        list?.todos?.push(newTodo);
        if (me.root) me.root.focusedTodo = newTodo;
      }
      focusLastItem();
    }
  };

  const removeLastEmpty = () => {
    if (lastTodo?.isEmpty) {
      list?.todos?.pop();
    }
  };

  if (list) {
    return (
      <Row className="flex flex-col h-full gap-2 flex-nowrap w-full py-4">
        <Col flex={"none"}>
          <div className="flex flex-row justify-between items-start">
            <div className="flex flex-col justify-start items-start">
              <Button
                onClick={() => navigate("/", {})}
                type="text"
                size="middle"
                className="text-gray-400 block sm:hidden pl-0"
              >
                &larr; back
              </Button>
              <div className="flex flex-row justify-between items-start">
                <Typography.Title level={3} className="mt-[1px]">
                  {list.getNameWithFallback}
                </Typography.Title>
              </div>
            </div>
            <div className="flex flex-row gap-2">
              <Button onClick={() => setShowListSettings(true)}>
                <SettingOutlined className="text-xl" />
              </Button>
              <Drawer
                title="Settings"
                open={showListSettings}
                width={720}
                onClose={() => setShowListSettings(false)}
              >
                <ListSettings list={list} />
              </Drawer>
            </div>
          </div>
        </Col>
        <Col flex={"auto"} className="overflow-y-auto">
          <div className="flex flex-col gap-0 h-full">
            <div className="flex flex-col gap-4">
              {uncheckedTodos.map(
                (todo, index) =>
                  todo && (
                    <div
                      ref={
                        index === (uncheckedTodos.length ?? 0) - 1
                          ? lastItemRef
                          : null
                      }
                    >
                      <TodoComponent
                        onFocused={() => {
                          if (me.root) me.root.focusedTodo = todo;
                        }}
                        key={todo.id}
                        todo={todo}
                        onEnterPressed={createAndAddTodo}
                      />
                    </div>
                  )
              )}
            </div>
            <div
              className="w-full flex-1"
              onClick={() => {
                createAndAddTodo();
                removeLastEmpty();
              }}
            >
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
