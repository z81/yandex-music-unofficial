import { client } from "@/app/hooks/useClient";
import { signal, effect } from "@preact/signals-react";
import { Station } from "../Station";
import { Dashboard as DashboardType } from "yandex-music-client";

export const dashboardList = signal<DashboardType | undefined>(undefined);

effect(() => {
  client.value?.rotor.getRotorStationsDashboard().then(({ result }) => {
    // @ts-ignore wrong lib type
    dashboardList.value = result;
  });
});

export const Dashboard = () => {
  return (
    <>
      {dashboardList.value?.stations.map((station) => (
        <Station station={station} key={station.station?.idForFrom} />
      ))}
    </>
  );
};
