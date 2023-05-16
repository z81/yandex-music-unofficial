import { useEffect, useState } from "react";
import { useAuth, userUid } from "./useAuth";
import { YMusicApi } from "@/app/api/YMusicApi";
import { signal } from "@preact/signals-react";

export const client = signal<YMusicApi | undefined>(undefined);

export const useClient = () => {
  const [info] = useAuth();

  useEffect(() => {
    if (info?.token) {
      const newClient = new YMusicApi({
        BASE: "https://api.music.yandex.net:443",
        HEADERS: {
          Authorization: `OAuth ${info.token}`,
          // specify 'en' to receive data in English
          "Accept-Language": "ru",
        },
      });

      console.log(info.token);

      newClient.fetchUid().then(() => {
        client.value = newClient;
      });
    }
  }, [info]);

  return client.value;
};
