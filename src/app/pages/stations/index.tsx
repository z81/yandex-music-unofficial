import { PageMenu } from "@/app/components/PageMenu/PageMenu";
import { Dashboard } from "./tabs/dashboard";
import { useParams } from "react-router-dom";
import { client } from "@/app/hooks/useClient";
import { signal, effect, computed } from "@preact/signals-react";
import { StationResult } from "yandex-music-client";
import { Station } from "./Station";

export const stations = signal<StationResult[]>([]);

effect(() => {
  client.value?.rotor.getStationsList().then(({ result }) => {
    stations.value = result;
  });
});

const genre = computed(() => {
  const tree = new Map();

  const getId = (id: any) => `${id?.type}:${id?.tag}`;

  // @ts-ignore
  for (let item of stations.value.filter(
    // @ts-ignore
    (s) => s.station?.id.type === "genre"
  )) {
    if (item.station?.parentId) {
      if (!tree.has(getId(item.station?.parentId))) {
        tree.set(getId(item.station?.parentId), { children: [] });
      }

      tree.get(getId(item.station?.parentId)).children.push(item);
    } else {
      const newItem = Object.assign(
        tree.get(getId(item.station?.id)) ?? {},
        item,
        {
          children: [],
        }
      );
      if (!tree.has(getId(item.station?.id))) {
        tree.set(getId(item.station?.id), newItem);
      } else {
        tree.set(getId(item.station?.id), newItem);
      }
    }
  }

  return [...tree.values()].map((item) =>
    !item.station
      ? {
          ...item.children[0],
          children: [],
        }
      : item
  );
});

export const Stations = () => {
  const tab = useParams()?.["*"]!;

  const tabs = [
    {
      title: "ОБЗОР",
      id: "*",
      url: "/stations/*",
      render: () => <Dashboard />,
    },
    {
      title: "ЖАНРЫ",
      id: "genre",
      url: "/stations/genre",
      render: () =>
        genre.value.map((st) => (
          <Station size={7} key={st.station.idForFrom} station={st} />
        )),
    },
    { title: "НАСТРОЕНИЕ", id: "mood", url: "/stations/mood" },
    { title: "ЗАНЯТИЯ", id: "activity", url: "/stations/activity" },
    {
      title: "ЭПОХИ",
      id: "epoch",
      url: "/stations/epoch",
    },
  ];

  return (
    <div className="flex flex-col relative flex-1 overflow-hidden max-h-screen">
      <div className="absolute h-full w-full flex-1 flex flex-col">
        <div className="flex h-full flex-col gap-4 p-8 pt-9 backdrop-blur-sm bg-gradient-to-r from-[#3302293c] from-10% via-[#c80d8749] via-70% to-[#33022921] to-90%">
          <PageMenu activeId={tab} items={tabs} />
          <div className="flex gap-10 m-6 flex-wrap content-start h-[calc(100%-140px)]  overflow-x-hidden overflow-auto">
            {tabs.find(({ id }) => id === tab)?.render?.() ||
              stations.value
                // @ts-ignore
                .filter((st) => st.station?.id.type === tab)
                .map((st) => (
                  <Station
                    size={10}
                    key={st.station?.idForFrom}
                    station={st!}
                  />
                ))}
          </div>
        </div>
      </div>
    </div>
  );
};
