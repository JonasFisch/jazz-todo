import { useAccount } from "./hooks/jazz-hooks";
import { createList } from "./actions";
import { ListComponent } from "./components/List";
import { Button, Flex, Layout, Menu, theme } from "antd";
import { Content } from "antd/es/layout/layout";
import Sider from "antd/es/layout/Sider";
import { PlusCircleOutlined } from "@ant-design/icons";
import useIsAppOffline from "./hooks/is-app-offline-hook";
import OfflineBanner from "./components/OfflineBanner";

function App() {
  const { me } = useAccount();
  const activeList = me.root?.activeList;
  const isAppOffline = useIsAppOffline();

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout className="h-full">
      {isAppOffline && (
        <div className="fixed top-0 left-0 w-full">
          <OfflineBanner />
        </div>
      )}
      <Content
        style={{ padding: "0 48px" }}
        className="flex flex-row w-full justify-center items-center"
      >
        <Layout
          style={{
            padding: "24px 0",
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
          className="max-w-4xl h-[80%]"
        >
          <Sider
            style={{ background: colorBgContainer }}
            width={200}
            className=" relative border-r"
          >
            <Flex className="flex-col h-full justify-between">
              <div className="overflow-y-auto">
                {me.root && (
                  <Menu
                    mode="inline"
                    className=""
                    defaultOpenKeys={["sub1"]}
                    selectedKeys={[activeList?.id.toString() ?? ""]}
                    style={{ height: "100%", border: "None" }}
                    onClick={(event) => {
                      if (me.root) {
                        me.root.activeList = me.root.lists?.find(
                          (list) => list?.id == event.key
                        );
                      }
                    }}
                    items={[
                      {
                        key: "grp",
                        label: "Listen",
                        type: "group",
                        children: me.root?.lists
                          ?.filter((list) => list != null)
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
                  onClick={() => {
                    const newList = createList(me);
                    if (me.root) {
                      me.root.lists?.push(newList);
                      me.root.activeList = newList;
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
            className="overflow-y-auto"
          >
            {activeList && <ListComponent list={activeList} />}
          </Content>
        </Layout>
      </Content>
    </Layout>
  );
}

export default App;
