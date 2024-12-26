import { useAcceptInvite, useAccount } from "./hooks/jazz-hooks";
import { createList } from "./actions";
import { ListComponent } from "./components/List";
import { Button, Flex, Layout, Menu, theme } from "antd";
import { Content } from "antd/es/layout/layout";
import Sider from "antd/es/layout/Sider";
import { PlusCircleOutlined } from "@ant-design/icons";
import useIsAppOffline from "./hooks/is-app-offline-hook";
import OfflineBanner from "./components/OfflineBanner";
import { List } from "./schema";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CoValue, ID, InviteSecret } from "jazz-tools";
import { useEffect } from "react";
import { parseInviteLink } from "jazz-react";

function App() {
  const { me } = useAccount();
  const isAppOffline = useIsAppOffline();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  console.log(me.id);

  // useAcceptInvite({
  //   invitedObjectSchema: List,
  //   onAccept: async (listID) => {
  //     console.log("accepted ", listID);
  //     navigate(`/?active=${listID}`);
  //   },
  //   forValueHint: "list",
  // });
  const handleInviteLink = async (values: {
    valueID: ID<CoValue>;
    valueHint?: string;
    inviteSecret: InviteSecret;
  }) => {
    await me
      ?.acceptInvite(values.valueID as ID<List>, values.inviteSecret, List)
      .then((newList) => {
        console.log("successfully added to list: ", newList);

        if (newList && me?.root?.lists) {
          me.root.lists.push(newList);
        }
      });
  };

  useEffect(() => {
    const inviteLinkObject = parseInviteLink(window.location.href);
    if (inviteLinkObject) handleInviteLink(inviteLinkObject);
  }, []);

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
            className="overflow-y-auto"
          >
            {searchParams.get("active") && (
              <ListComponent listID={searchParams.get("active") as ID<List>} />
            )}
          </Content>
        </Layout>
      </Content>
    </Layout>
  );
}

export default App;
