import { computed } from "@preact/signals-react";
import { FaPause, FaPlay } from "react-icons/fa";
import { dashboardList } from "../stations/tabs/dashboard";
import { audio, queue } from "@/app/store/state";
import { YMusicApi } from "@/app/api/YMusicApi";
import bg from "./bg.jpg";
import bg2 from "./bg2.jpg";
import bg3 from "./bg3.jpg";
import bg4 from "./bg4.jpg";
import bg5 from "./bg4.jpg";
import { useState } from "react";
import { Settings, changedSettingsNames, waveSettings } from "./settings";
import { AiFillSetting } from "react-icons/ai";
import { isEqual } from "radash";

const defaultCovers = [bg, bg2, bg3, bg4, bg5];

const wave = computed(() => {
  return dashboardList.value?.stations.find(
    (s) => s.station?.idForFrom === "user-onyourwave"
  );
});

const cover = defaultCovers[Math.trunc(Math.random() * defaultCovers.length)];

export const Main = () => {
  const [isSettingsOpen, setOpenSettings] = useState(false);
  // @ts-ignore
  const id = `${wave.value?.station?.id.type}:${wave.value?.station?.id.tag}`;
  const isPlaying =
    queue.queuePlayType.value.type === "station" &&
    queue.queuePlayType.value.id === id &&
    !audio.paused.value;

  const ogImage = queue.currentTrack.value?.ogImage;

  return (
    <div className="flex flex-col relative flex-1 overflow-hidden max-h-screen">
      <div className="flex gap-2 m-2 justify-center h-screen items-center overflow-hidden">
        <img
          className={
            "absolute min-w-screen w-full h-screen opacity-60 object-cover"
          }
          src={ogImage ? YMusicApi.getImageUrl(ogImage, 1000) : cover}
          alt=""
        />
        <div className="z-10 cursor-pointer flex flex-col text-2xl font-bold gap-1 justify-center items-center">
          {
            <div
              className="flex gap-3 items-center justify-center"
              onClick={() => {
                if (
                  queue.queuePlayType.value.id === id &&
                  !audio.paused.value
                ) {
                  audio.pause();
                } else {
                  queue.addStation(id, waveSettings.peek());
                  setOpenSettings(false);
                }
              }}
            >
              {isPlaying ? <FaPause /> : <FaPlay />}{" "}
              {isSettingsOpen ? "Сохранить и слушать" : "Моя волна"}
            </div>
          }
          {!isSettingsOpen && (
            <div
              onClick={() => setOpenSettings(true)}
              className="text-lg flex flex-col gap-2 items-center justify-center"
            >
              <div className="text-lg flex gap-2 items-center justify-center">
                <AiFillSetting className="text-2xl" /> Настроить
              </div>
              <div className="flex gap-4">
                {changedSettingsNames.value.map((item) => (
                  <div
                    className="flex items-center justify-center gap-2"
                    key={item.id}
                  >
                    {item.icon}
                    {item.title}
                  </div>
                ))}
              </div>
            </div>
          )}
          {isSettingsOpen && <Settings />}
        </div>
      </div>
    </div>
  );
};
