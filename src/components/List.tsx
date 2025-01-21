import { List, Todo } from "../schema";
import { TodoComponent } from "./Todo.tsx";
import { Drawer, Empty } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { useEffect, useRef, useState } from "react";
import { useAccount, useCoState } from "jazz-react";
import { ID } from "jazz-tools";
import { useNavigate } from "react-router-dom";
import { ListSettings } from "./ListSettings.tsx";
import { AnimatePresence, motion } from "motion/react";
import { Button } from "./ui/button.tsx";
import { TypographyHeading } from "./ui/typography/heading.tsx";
import { Settings } from "lucide-react";

export function ListComponent({ listID }: { listID: ID<List> }) {
  const lastItemRef = useRef<HTMLInputElement | null>(null);
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
    <div className="flex flex-col gap-2 flex-nowrap w-full min-h-[100dvh]">
      {/* TODO: put this in seperate component with two slots for header and body */}
      <div className="px-6 py-2 sticky top-0 bg-gradient-to-b from-bgPrimary/100 to-bgPrimary/80 backdrop-blur-lg pt-4 z-50 border-b border-bgSecondary dark:border-bgSecondaryDark">
        <div className="flex flex-row justify-between items-start">
          <div className="flex flex-col justify-start items-start">
            <Button
              size={"icon"}
              onClick={() => navigate("/", {})}
              variant={"link"}
              className="text-tBase dark:text-tBaseDark block pl-0"
            >
              &larr; back
            </Button>
            <div className="flex flex-row justify-between items-start">
              <TypographyHeading level={3}>
                <span className="text-tBase dark:text-tBaseDark">
                  {list && list.getNameWithFallback}
                </span>
              </TypographyHeading>
            </div>
          </div>
          <div className="flex flex-row gap-2">
            <Button onClick={() => setShowListSettings(true)}>
              <Settings className="text-xl" />
            </Button>
            <Drawer
              className="!bg-bgPrimary dark:!bg-bgPrimaryDark"
              title={
                <TypographyHeading level={4} className="!mb-0 ml-2 ">
                  <span className="text-tBase dark:text-tBaseDark">
                    List settings
                  </span>
                </TypographyHeading>
              }
              closeIcon={
                <CloseOutlined className="text-tBase dark:text-tBaseDark">
                  {" "}
                </CloseOutlined>
              }
              open={showListSettings}
              width={720}
              onClose={() => setShowListSettings(false)}
            >
              {list && <ListSettings list={list} />}
            </Drawer>
          </div>
        </div>
      </div>
      <div className="flex-auto flex flex-col px-6">
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
      </div>
      <div className="flex-none sticky bottom-4 right-0 w-auto mr-0 ml-auto">
        <Button onClick={createAndAddTodo} className="mx-6">
          Create Todo
        </Button>
      </div>
    </div>
  );
}
