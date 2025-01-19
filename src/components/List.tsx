import { List, Todo } from "../schema";
import { TodoComponent } from "./Todo.tsx";
import { Button, Col, Drawer, Empty, InputRef, Row, Typography } from "antd";
import { SettingOutlined } from "@ant-design/icons";
import { useEffect, useRef, useState } from "react";
import { useAccount, useCoState } from "jazz-react";
import { ID } from "jazz-tools";
import { useNavigate } from "react-router-dom";
import { ListSettings } from "./ListSettings.tsx";
import { AnimatePresence, motion } from "motion/react";

export function ListComponent({ listID }: { listID: ID<List> }) {
  const lastItemRef = useRef<InputRef | null>(null);
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
        lastItemRef.current.select();
        // lastItemRef.current.scrollIntoView({
        //   behavior: "smooth",
        // });
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

  return (
    <Row className="flex flex-col gap-2 flex-nowrap w-full min-h-[100dvh]">
      <Col
        flex={"none"}
        className="sticky top-0 bg-gradient-to-b from-gray-50/100 to-gray-50/80 backdrop-blur-[2px] pt-4 z-50 border-b"
      >
        <div className="flex flex-row justify-between items-start">
          <div className="flex flex-col justify-start items-start">
            <Button
              onClick={() => navigate("/", {})}
              type="text"
              size="middle"
              className="text-gray-400 block pl-0"
            >
              &larr; back
            </Button>
            <div className="flex flex-row justify-between items-start">
              <Typography.Title level={3}>
                {list && list.getNameWithFallback}
              </Typography.Title>
            </div>
          </div>
          <div className="flex flex-row gap-2">
            <Button onClick={() => setShowListSettings(true)}>
              <SettingOutlined className="text-xl" />
            </Button>
            <Drawer
              title={
                <Typography.Title level={4} className="!mb-0 ml-2">
                  List settings
                </Typography.Title>
              }
              open={showListSettings}
              width={720}
              onClose={() => setShowListSettings(false)}
            >
              {list && <ListSettings list={list} />}
            </Drawer>
          </div>
        </div>
      </Col>
      <Col flex={"auto"} className="flex flex-col">
        <div className="flex flex-col gap-0 flex-1">
          <div className="flex flex-col gap-4">
            <AnimatePresence>
              {uncheckedTodos.map(
                (todo, index) =>
                  todo && (
                    <motion.div
                      key={`todo-motion-${todo.id}`}
                      exit={{ opacity: 0 }}
                      transition={{ delay: 0.6 }}
                    >
                      <TodoComponent
                        onFocused={() => {
                          if (me.root) me.root.focusedTodo = todo;
                        }}
                        key={todo.id}
                        todo={todo}
                        onEnterPressed={createAndAddTodo}
                        ref={
                          index === (uncheckedTodos.length ?? 0) - 1
                            ? lastItemRef
                            : null
                        }
                      />
                    </motion.div>
                  )
              )}
            </AnimatePresence>
          </div>
          <div
            className="w-full flex-1 flex flex-col"
            onClick={() => {
              createAndAddTodo();
              removeLastEmpty();
            }}
          >
            {uncheckedTodos.length <= 0 && (
              <div className="h-auto flex flex-col justify-center flex-1">
                <Empty></Empty>
              </div>
            )}
          </div>
        </div>
      </Col>
      <Col
        flex={"none"}
        className="sticky bottom-4 right-0 w-auto mr-0 ml-auto"
      >
        <Button onClick={createAndAddTodo} size="large">
          Create Todo
        </Button>
      </Col>
    </Row>
  );
}
