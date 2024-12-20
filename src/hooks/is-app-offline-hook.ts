import { useEffect, useState } from "react";

export default function useIsAppOffline() {
  const [isAppOffline, setIsAppOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsAppOffline(false);
    const handleOffline = () => setIsAppOffline(true);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Cleanup event listeners when the component unmounts
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return isAppOffline;
}
