import { useEffect, useState } from "react";
import { useClient } from "./useClient";
import { useAuth } from "./useAuth";
import { YMusicApi } from "@/app/api/YMusicApi";

export const useApi = <
  T extends keyof YMusicApi,
  M extends keyof YMusicApi[T],
  F extends YMusicApi[T][M],
  FN extends F extends (...args: any[]) => any ? F : never,
  A extends Parameters<FN>,
  R extends Awaited<ReturnType<FN>>
>(
  type: T,
  method: M,
  args: A
): ReturnType<FN>["result"] | undefined => {
  const [info] = useAuth();
  const client = useClient();
  const [data, setData] = useState<R>();

  useEffect(() => {
    if (info && client) {
      // @ts-expect-error
      client?.[type][method](...args).then(setData);
    }
  }, [type, method, ...args, info?.uid, client]);

  return data?.["result"];
};
