import { YMusicApi } from "@/app/api/YMusicApi";
import { queue, audio, visualizer } from "@/app/store/state";
import clsx from "clsx";
import { StationResult } from "yandex-music-client";

export interface StationProps {
  station: StationResult & {
    children?: StationResult[];
  };
  size?: number;
}

export const Station: React.FC<StationProps> = ({ station, size = 15 }) => {
  const queuePlayType = queue.queuePlayType.value;
  const isPlaying =
    queuePlayType.type === "station" &&
    [station, ...(station.children ?? [])].some(
      (st) =>
        // @ts-ignore
        queuePlayType.id === `${st.station?.id.type}:${st.station?.id.tag}`
    ) &&
    !audio.paused.value;

  return (
    <div className="cursor-pointer relative flex  items-center justify-center">
      <div
        className=" flex flex-col  items-center justify-center"
        onClick={() =>
          isPlaying
            ? audio.pause()
            : queue.addStation(
                // @ts-ignore
                `${station.station?.id.type}:${station.station?.id.tag}`
              )
        }
      >
        <div
          className="flex justify-center items-center"
          style={{
            width: `${size}rem`,
            height: `${size}rem`,
          }}
        >
          {!audio.paused.value &&
            Array.from(visualizer.dataArray.slice(0, 4)).map((d, i) => (
              <div
                key={i}
                style={{
                  width: `${size}rem`,
                  height: `${size}rem`,
                  transform: `scale(${(d / 255).toFixed(2)})`,
                  backgroundColor: station.station?.icon.backgroundColor,
                  opacity: 0.25,
                }}
                className="absolute rounded-full p-10"
              ></div>
            ))}
          <img
            src={YMusicApi.getImageUrl(station.station?.icon.imageUrl, 150)}
            alt=""
            className="absolute rounded-full p-10 transition-all"
            style={{
              backgroundColor: station.station?.icon.backgroundColor,
              transform: isPlaying
                ? `scale(${visualizer.audioFreq.value.toFixed(
                    2
                  )}) rotate(${Math.abs(
                    visualizer.audioFreq.value * 30 - 15
                  )}deg)`
                : "",
              maxWidth: `${size}rem`,
              maxHeight: `${size}rem`,
            }}
          />
        </div>
        <div className="text-center mt-5 text-2xl">
          {station?.station?.name}
        </div>
      </div>
      {station.children && (
        <div className=" m-5 gap-4">
          {station.children?.map((ch) => (
            <div
              key={ch.station?.idForFrom}
              onClick={() => {
                queue.addStation(
                  // @ts-ignore
                  `${ch.station?.id.type}:${ch.station?.id.tag}`
                );
              }}
              className={clsx("font-bold", {
                "opacity-50":
                  queuePlayType.id !==
                  // @ts-ignore
                  `${ch.station?.id.type}:${ch.station?.id.tag}`,
              })}
            >
              {ch.station?.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
