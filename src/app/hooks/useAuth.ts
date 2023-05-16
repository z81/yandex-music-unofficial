import { ipcRenderer } from "electron";
import { useEffect, useState } from "react";
import { useIpc } from "./useIpc";

let authInfo: { token: string; expires: number; uid: string } | undefined;
let isAuthWinOpen = false;

export const userUid: number | undefined = 0;

export const useAuth = () => {
  const [info, setInfo] = useState(authInfo);

  useEffect(() => {
    if (!info && !authInfo && !isAuthWinOpen) {
      isAuthWinOpen = true;
      ipcRenderer.send("auth-window");
    }
  }, [info]);

  useEffect(() => {
    authInfo = info;
  }, [info]);

  useIpc("auth-info", (event, info) => {
    isAuthWinOpen = false;
    setInfo(info);
  });

  useIpc("logout-processed", () => {
    setInfo(undefined);
  });

  const logout = () => {
    ipcRenderer.send("logout");
  };

  return [info, logout] as const;
};
