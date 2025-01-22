import { CloudOff } from "lucide-react";

function OfflineBanner() {
  return (
    <div className="text-gray-900 w-full p-3 bg-red-400 text-center">
      <CloudOff className="mr-2" />
      Offline Modus
    </div>
  );
}

export default OfflineBanner;
