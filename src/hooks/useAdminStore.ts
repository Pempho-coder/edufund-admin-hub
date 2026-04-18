import { useSyncExternalStore } from "react";
import { subscribe, getApplications } from "@/data/adminMockData";

// Triggers re-render whenever the admin store changes.
export function useAdminStore() {
  return useSyncExternalStore(
    (cb) => subscribe(cb),
    () => getApplications(),
    () => getApplications()
  );
}
