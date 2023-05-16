import { ipcRenderer } from "electron";
import { useEffect } from "react";

export const useIpc = (
  key: string,
  handler: (ev: Electron.IpcRendererEvent, ...args: any[]) => unknown
) => {
  useEffect(() => {
    ipcRenderer.on(key, handler);

    return () => {
      ipcRenderer.off(key, handler);
    };
  }, [key, handler]);
};
