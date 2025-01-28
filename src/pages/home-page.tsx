import { useAccount } from "jazz-react";
import { Header } from "../components/Header";
import { createList } from "../actions";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { TypographyHeading } from "@/components/ui/typography/heading";
import { TypographyText } from "@/components/ui/typography/text";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useState } from "react";
import { ChevronRight, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function HomePage() {
  const { me } = useAccount();
  const navigate = useNavigate();
  const [newListName, setNewListName] = useState("");

  const [createDrawerOpen, setCreateDrawerOpen] = useState(false);

  return (
    <div>
      <main className={`relative sm:block `}>
        <div className="flex flex-col justify-between min-h-dvh">
          <div className="flex flex-col flex-1">
            {me.root && (
              <div>
                {/* TODO: put sticky and the gradient and backdrop logic in extra component */}
                <div className="flex flex-row justify-between items-center mb-4 pt-4 pb-3 px-4 text-xl font-bold sticky top-0 backdrop-blur-sm bg-gradient-to-b from-background/100 to-background/80 border-b border-border">
                  <TypographyHeading level={3} className="!mb-0 font-bold">
                    My Lists
                  </TypographyHeading>
                  <Header />
                </div>
                {me.root?.lists
                  ?.filter((list) => !!list)
                  .filter((list) => !!list._owner.myRole())
                  .map((list) => (
                    <div key={list.id}>
                      <div
                        className={`w-full px-4 py-4 flex flex-row gap-3 items-center justify-between bg-card transition-colors rounded-lg hover:bg-accent cursor-pointer ${
                          me.root?.lists?.indexOf(list) ===
                          (me.root?.lists?.length ?? 0) - 1
                            ? "border-none"
                            : ""
                        }`}
                        onClick={() => {
                          navigate(`/list/${list.id}`);
                        }}
                      >
                        <div className="flex flex-row gap-2 items-center">
                          <TypographyHeading
                            level={4}
                            className="!mb-0 font-normal text-md"
                          >
                            {list.getNameWithFallback}
                          </TypographyHeading>
                          <div className="h-[5px] w-[5px] rounded-full bg-card-foreground"></div>
                          <TypographyText className="text-primary text-sm">
                            {list.todos?.filter((todo) => !todo?.checked)
                              ?.length ?? 0}
                          </TypographyText>
                        </div>
                        <ChevronRight className="text-gray-400" />
                      </div>
                      {/* <Separator orientation="horizontal" /> */}
                    </div>
                  ))}
              </div>
            )}
          </div>
          <div className="flex flex-row justify-end p-4 sticky bottom-0">
            <Button className="" onClick={() => setCreateDrawerOpen(true)}>
              <Plus />
            </Button>
          </div>
          <Drawer
            onClose={() => setCreateDrawerOpen(false)}
            open={createDrawerOpen}
          >
            <div className="mx-auto w-full max-w-sm">
              {/* TODO: put create button in extra component */}
              <DrawerContent className="w-full flex flex-col justify-center">
                <div className="mx-auto w-full max-w-sm">
                  <DrawerHeader>
                    <DrawerTitle>Create List</DrawerTitle>
                    <DrawerDescription>
                      Set a title for your list.
                    </DrawerDescription>
                  </DrawerHeader>
                  <div className="px-4">
                    <Label>Name</Label>
                    <Input
                      placeholder="list name"
                      value={newListName}
                      onChange={(event) => setNewListName(event.target.value)}
                    />
                  </div>
                  <DrawerFooter>
                    <div className="flex flex-col justify-end gap-3">
                      <Button
                        onClick={() => {
                          const newList = createList(me, newListName);
                          if (me.root) {
                            me.root.lists?.push(newList);
                            navigate(`/list/${newList.id}`);
                          }
                        }}
                      >
                        Create List
                      </Button>
                      <Button
                        variant={"outline"}
                        onClick={() => setCreateDrawerOpen(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </DrawerFooter>
                </div>
              </DrawerContent>
            </div>
          </Drawer>
        </div>
      </main>
    </div>
  );
}
