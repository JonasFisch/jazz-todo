import { Layout } from "antd";
import { Content } from "antd/es/layout/layout";
import { useAcceptInvite, useAccount } from "jazz-react";
import { Outlet, useNavigate } from "react-router-dom";
import useIsAppOffline from "../hooks/is-app-offline-hook";
import { List } from "../schema";
import OfflineBanner from "../components/OfflineBanner";

export function RootLayout() {
  const { me } = useAccount();
  const isAppOffline = useIsAppOffline();
  const navigate = useNavigate();

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
          <Layout className="bg-gray-50">
            <Outlet />
          </Layout>
        </Layout>
      </Content>
    </Layout>
  );
}
