import { useAcceptInvite, useAccount } from "./hooks/jazz-hooks";
import { createList } from "./actions";
import { ListComponent } from "./components/List";
import { Avatar, Button, Flex, Layout, Menu, Modal } from "antd";
import { Content } from "antd/es/layout/layout";
import Sider from "antd/es/layout/Sider";
import { PlusCircleOutlined, UserOutlined } from "@ant-design/icons";
import useIsAppOffline from "./hooks/is-app-offline-hook";
import OfflineBanner from "./components/OfflineBanner";
import { List } from "./schema";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ID } from "jazz-tools";
import { ProfileImageUpload } from "./components/ProfileImageUpload";
import { useState } from "react";
import { Image } from "./components/Image";

function App() {
  const { me } = useAccount();
  const isAppOffline = useIsAppOffline();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [profileModalOpen, setProfileImageOpen] = useState<boolean>(true);

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
    <Layout className="h-full">
      {isAppOffline && (
        <div className="fixed top-0 left-0 w-full">
          <OfflineBanner />
        </div>
      )}
      <Content className="flex flex-row w-full justify-center items-center sm:p-4">
        <Layout className="max-w-4xl h-full sm:h-[80%] rounded-md overflow-hidden bg-white">
          <div className="border-b p-4 flex flex-row justify-end items-center mr-2">
            <Avatar
              onClick={() => setProfileImageOpen(true)}
              size="large"
              icon={
                me.profile?.image ? (
                  <Image image={me.profile.image}></Image>
                ) : (
                  <UserOutlined />
                )
              }
              className="cursor-pointer hover:opacity-85"
            />
            <Modal
              open={profileModalOpen}
              onCancel={() => setProfileImageOpen(false)}
              onOk={() => setProfileImageOpen(false)}
              title="User profile"
            >
              <ProfileImageUpload />
            </Modal>
          </div>
          <Layout className="bg-white">
            <Sider
              width={200}
              className={`relative border-r bg-white sm:block ${
                searchParams.get("active")
                  ? "hidden"
                  : "!w-full !max-w-none !flex-none"
              }`}
            >
              <Flex className="flex-col h-full justify-between">
                <div className="overflow-y-auto">
                  {me.root && (
                    <Menu
                      mode="inline"
                      className=""
                      defaultOpenKeys={["sub1"]}
                      selectedKeys={[searchParams.get("active") ?? ""]}
                      style={{ height: "100%", border: "None" }}
                      onClick={(event) => {
                        searchParams.set("active", event.key);
                        setSearchParams(searchParams);
                      }}
                      items={[
                        {
                          key: "grp",
                          label: "Listen",
                          type: "group",
                          children: me.root?.lists
                            ?.filter((list) => !!list)
                            .map((list) => ({
                              key: list.id,
                              label: list.name.toString(),
                            })),
                        },
                      ]}
                    />
                  )}
                </div>
                <div className="flex flex-row justify-center p-4">
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
