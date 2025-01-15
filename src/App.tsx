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
import { Header } from "./components/Header";

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
    <Layout className="h-full bg-gray-200">
      {isAppOffline && (
        <div className="fixed top-0 left-0 w-full">
          <OfflineBanner />
        </div>
      )}
      <Content className="flex flex-row w-full justify-center items-center sm:p-4">
        <Layout className="max-w-4xl h-full sm:h-[80%] rounded-md overflow-hidden bg-gray-50">
          <Header />
          <Layout className="bg-gray-50">
            <Sider
              width={200}
              className={`relative border-r bg-gray-50 sm:block ${
                searchParams.get("active")
                  ? "hidden"
                  : "!w-full !max-w-none !flex-none"
              }`}
            >
              <Flex className="flex-col h-full justify-between bg-gray-50">
                <div className="overflow-y-auto">
                  {me.root && (
                    <div className="p-4">
                      <div className="py-4 text-xl font-bold">
                        <Typography.Title level={4}>My Lists</Typography.Title>
                      </div>
                      <div className="flex flex-col gap-0 rounded-md overflow-hidden">
                        {me.root?.lists
                          ?.filter((list) => !!list)
                          .map((list) => (
                            <div
                              key={list.id}
                              className={`w-full bg-white px-2 py-4 border-b-[2px] border-gray-100 cursor-pointer ${
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
                <div className="flex flex-row justify-center p-4 mb-2">
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
              className={`overflow-y-auto sm:block ${
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
