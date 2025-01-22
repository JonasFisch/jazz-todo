import { List, Todo } from "../schema";
import { TodoComponent } from "./Todo.tsx";
import { useEffect, useRef } from "react";
import { useAccount, useCoState } from "jazz-react";
import { ID } from "jazz-tools";
import { useNavigate } from "react-router-dom";
import { ListSettings } from "./ListSettings.tsx";
import { AnimatePresence, motion } from "motion/react";
import { Button } from "./ui/button.tsx";
import { TypographyHeading } from "./ui/typography/heading.tsx";
import { Settings, SquareCheck } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog.tsx";

export function ListComponent({ listID }: { listID: ID<List> }) {
  const lastItemRef = useRef<HTMLInputElement | null>(null);

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
            <Dialog>
              <DialogTrigger>
                <div className="transition-all cursor-pointer hover:bg-bgPrimary dark:hover:bg-bgSecondaryDark p-3 rounded-md">
                  <Settings className="text-xl" />
                </div>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>List settings</DialogTitle>
                </DialogHeader>
                <DialogDescription>
                  Change list settings here.
                </DialogDescription>
                {list && <ListSettings list={list} />}
                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="secondary">
                      Done
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            {/* </Dialog> */}
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
              <div className="h-auto flex flex-col justify-center items-center flex-1">
                <SquareCheck className="mb-2 text-gray-400" />
                <TypographyHeading level={4}>
                  <span className="text-gray-400">All done!</span>
                </TypographyHeading>
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
