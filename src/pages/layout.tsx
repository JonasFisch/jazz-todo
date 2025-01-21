import { Layout } from "antd";
import { Content } from "antd/es/layout/layout";
import { useAcceptInvite, useAccount } from "jazz-react";
import { Outlet, useNavigate } from "react-router-dom";
import useIsAppOffline from "../hooks/is-app-offline-hook";
import { List } from "../schema";
import OfflineBanner from "../components/OfflineBanner";
import { useTheme } from "../hooks/use-theme";

export function RootLayout() {
  const { me } = useAccount();
  const isAppOffline = useIsAppOffline();
  const navigate = useNavigate();
  const { theme } = useTheme();

  useAcceptInvite({
    invitedObjectSchema: List,
    onAccept: async (listID) => {
      const newList = await List.load(listID, me, []);
      if (newList) navigate(`/list/${listID}`);
      else console.error("error in after invite accept action");
    },
    forValueHint: "list",
  });

  return (
    <div className={`theme-${theme}`}>
      <Layout className="bg-bgSecondary dark:bg-bgSecondaryDark">
        {isAppOffline && (
          <div className="fixed top-0 left-0 w-full">
            <OfflineBanner />
          </div>
        )}
        <Content className="flex flex-row w-full justify-center items-center">
          <Layout className="max-w-4xl sm:rounded-md bg-bgPrimary dark:bg-bgPrimaryDark">
            <Outlet />
          </Layout>
        </Content>
      </Layout>
    </div>
  );
}
