import { createList } from "./actions";
import { ListComponent } from "./components/List";
import { Button, Flex, Layout, Typography } from "antd";
import { Content } from "antd/es/layout/layout";
import Sider from "antd/es/layout/Sider";
import { PlusCircleOutlined } from "@ant-design/icons";
import useIsAppOffline from "./hooks/is-app-offline-hook";
import OfflineBanner from "./components/OfflineBanner";
import { List } from "./schema";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ID } from "jazz-tools";
import { useAcceptInvite, useAccount } from "jazz-react";
import { AccountSettings } from "./components/Header";
// import { AccountSettings } from "./components/Header";

function App() {
  const { me } = useAccount();
  const isAppOffline = useIsAppOffline();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  useAcceptInvite({
    invitedObjectSchema: List,
    onAccept: async (listID) => {
      const newList = await List.load(listID, me, []);
      if (newList) navigate(`/?active=${listID}`);
      else console.error("error in after invite accept action");
    },
    forValueHint: "list",
  });

  return (
    <Layout className="bg-gray-100">
      {isAppOffline && (
        <div className="fixed top-0 left-0 w-full">
          <OfflineBanner />
        </div>
      )}
      <Content className="flex flex-row w-full justify-center items-center">
        <Layout className="max-w-4xl rounded-md bg-gray-50">
          {/* {!searchParams.get("active") && (
            <header className="border-b p-4 flex flex-row justify-end items-center mx-2">
              <AccountSettings />
            </header>
          )} */}
          <Layout className="bg-gray-50">
            <Sider
              width={200}
              className={`relative border-r bg-gray-50 sm:block ${
                searchParams.get("active")
                  ? "hidden"
                  : "!w-full !max-w-none !flex-none"
              }`}
            >
              <Flex className="flex-col justify-between bg-gray-50 min-h-dvh">
                <div className="flex flex-col">
                  {me.root && (
                    <div className="px-4">
                      {/* TODO: put sticky and the gradient and backdrop logic in extra component */}
                      <div className="flex flex-row justify-between items-center mb-4 pt-4 pb-3 text-xl font-bold sticky top-0 backdrop-blur-sm bg-gradient-to-b from-gray-50/100 to-gray-50/80 border-b">
                        <Typography.Title level={3} className="!mb-0">
                          My Lists
                        </Typography.Title>
                        <AccountSettings />
                      </div>
                      <div className="flex flex-col gap-0 rounded-md shadow-md overflow-hidden">
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
                                searchParams.set("active", list.id);
                                setSearchParams(searchParams);
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
                        searchParams.set("active", newList.id);
                        setSearchParams(searchParams);
                      }
                    }}
                  >
                    Create List
                  </Button>
                </div>
              </Flex>
            </Sider>
            <Content
              style={{ padding: "0 24px", minHeight: 280 }}
              className={`sm:block ${
                searchParams.get("active") ? null : "hidden"
              }`}
            >
              {searchParams.get("active") ? (
                <ListComponent
                  key={searchParams.get("active")}
                  listID={searchParams.get("active") as ID<List>}
                />
              ) : (
                <div>select a list or create a new one</div>
              )}
            </Content>
          </Layout>
        </Layout>
      </Content>
    </Layout>
  );
}

export default App;
