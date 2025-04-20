
type SyncProgressCallback = (current: number, total: number) => void;

export const syncOfflineData = async (progressCallback: SyncProgressCallback): Promise<void> => {
  // TODO: Implement actual sync logic
  return new Promise((resolve) => {
    setTimeout(resolve, 1000);
  });
};
