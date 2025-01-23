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
      <div className="bg-card">
        {isAppOffline && (
          <div className="fixed top-0 left-0 w-full">
            <OfflineBanner />
          </div>
        )}
        <div className="flex flex-row w-full justify-center items-center">
          <div className="w-full max-w-4xl bg-card md:border-x">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
