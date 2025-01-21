import { Flex, Layout, Typography } from "antd";
import { useAccount } from "jazz-react";
import { AccountSettings } from "../components/Header";
import { PlusCircleOutlined } from "@ant-design/icons";
import { createList } from "../actions";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function HomePage() {
  const { me } = useAccount();
  const navigate = useNavigate();
  return (
    <div>
      <Layout
        className={`relative tw-bg-bgPrimary dark:bg-bgPrimaryDark sm:block `}
      >
        <Flex className="flex-col justify-between bg-bgPrimary dark:bg-bgPrimaryDark min-h-dvh">
          <div className="flex flex-col">
            {me.root && (
              <div>
                {/* TODO: put sticky and the gradient and backdrop logic in extra component */}
                <div className="flex flex-row justify-between items-center mb-4 pt-4 pb-3 px-4 text-xl font-bold sticky top-0 backdrop-blur-lg bg-gradient-to-b from-bgPrimary/100 to-bgPrimary/80 border-b border-bgSecondary dark:border-bgSecondaryDark">
                  <Typography.Title level={3} className="!mb-0">
                    <span className="text-tBase dark:text-tBaseDark">
                      My Lists
                    </span>
                  </Typography.Title>
                  <AccountSettings />
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
                        <Typography.Text className="text-tBase">
                          <span className="text-tBase dark:text-tBaseDark">
                            {list.getNameWithFallback}
                          </span>
                        </Typography.Text>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
          <div className="flex flex-row justify-center p-4 sticky bottom-0">
            <Button
              className="bg-primary"
              icon={<PlusCircleOutlined />}
              // size="large"
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
        </Flex>
      </Layout>{" "}
    </div>
  );
}
