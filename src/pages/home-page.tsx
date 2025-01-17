import { Button, Flex, Layout, Typography } from "antd";
import { useAccount } from "jazz-react";
import { AccountSettings } from "../components/Header";
import { PlusCircleOutlined } from "@ant-design/icons";
import { createList } from "../actions";
import { useNavigate } from "react-router-dom";

export function HomePage() {
  const { me } = useAccount();
  const navigate = useNavigate();

  return (
    <Layout className={`relative border-r bg-gray-50 sm:block`}>
      <Flex className="flex-col justify-between bg-gray-50 min-h-dvh">
        <div className="flex flex-col">
          {me.root && (
            <div>
              {/* TODO: put sticky and the gradient and backdrop logic in extra component */}
              <div className="flex flex-row justify-between items-center mb-4 pt-4 pb-3 px-4 text-xl font-bold sticky top-0 backdrop-blur-sm bg-gradient-to-b from-gray-50/100 to-gray-50/80 border-b">
                <Typography.Title level={3} className="!mb-0">
                  My Lists
                </Typography.Title>
                <AccountSettings />
              </div>
              <div className="flex flex-col gap-0 rounded-md shadow-md overflow-hidden mx-4">
                {me.root?.lists
                  ?.filter((list) => !!list)
                  .map((list) => (
                    <div
                      key={list.id}
                      className={`w-full px-2 py-4 bg-white border-b-[2px] border-gray-100 cursor-pointer ${
                        me.root?.lists?.indexOf(list) ===
                        (me.root?.lists?.length ?? 0) - 1
                          ? "border-none"
                          : ""
                      }`}
                      onClick={() => {
                        navigate(`/list/${list.id}`);
                      }}
                    >
                      <Typography.Text>
                        {list.getNameWithFallback}
                      </Typography.Text>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
        <div className="flex flex-row justify-center p-4 sticky bottom-0">
          <Button
            icon={<PlusCircleOutlined />}
            size="large"
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
    </Layout>
  );
}
