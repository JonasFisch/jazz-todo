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
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useState } from "react";
import { Plus } from "lucide-react";

export function HomePage() {
  const { me } = useAccount();
  const navigate = useNavigate();

  const [createDrawerOpen, setCreateDrawerOpen] = useState(false);

  return (
    <div>
      <main
        className={`relative tw-bg-bgPrimary dark:bg-bgPrimaryDark sm:block `}
      >
        <div className="flex flex-col justify-between bg-bgPrimary dark:bg-bgPrimaryDark min-h-dvh">
          <div className="flex flex-col">
            {me.root && (
              <div>
                {/* TODO: put sticky and the gradient and backdrop logic in extra component */}
                <div className="flex flex-row justify-between items-center mb-4 pt-4 pb-3 px-4 text-xl font-bold sticky top-0 backdrop-blur-lg bg-gradient-to-b from-bgPrimary/100 to-bgPrimary/80 border-b border-bgSecondary dark:border-bgSecondaryDark">
                  <TypographyHeading level={3} className="!mb-0">
                    My Lists
                  </TypographyHeading>
                  <Header />
                </div>
                <div className="flex flex-col gap-0 rounded-md shadow-md overflow-hidden mx-4">
                  {me.root?.lists
                    ?.filter((list) => !!list)
                    .map((list) => (
                      <div
                        key={list.id}
                        className={`w-full px-2 py-4 bg-bgSecondary dark:bg-secondaryDark border-b-[2px] border-bgPrimary dark:border-bgPrimaryDark cursor-pointer ${
                          me.root?.lists?.indexOf(list) ===
                          (me.root?.lists?.length ?? 0) - 1
                            ? "border-none"
                            : ""
                        }`}
                        onClick={() => {
                          navigate(`/list/${list.id}`);
                        }}
                      >
                        <TypographyText>
                          {list.getNameWithFallback}
                        </TypographyText>
                      </div>
                    ))}
                </div>
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
              <DrawerContent>
                <DrawerHeader className="w-full flex flex-row justify-center">
                  <DrawerTitle>Create List</DrawerTitle>
                </DrawerHeader>
                <DrawerFooter>
                  <div className="flex flex-row justify-center gap-4">
                    <Button
                      variant={"outline"}
                      onClick={() => setCreateDrawerOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={() => {
                        const newList = createList(me);
                        if (me.root) {
                          me.root.lists?.push(newList);
                          navigate(`/list/${newList.id}`);
                        }
                      }}
                    >
                      Create List
                    </Button>
                  </div>
                </DrawerFooter>
              </DrawerContent>
            </div>
          </Drawer>
        </div>
      </main>
    </div>
  );
}
