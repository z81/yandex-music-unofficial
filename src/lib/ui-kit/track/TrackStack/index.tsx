import { YMusicApi } from "@/app/api/YMusicApi";
import clsx from "clsx";
import { FaPause, FaPlay } from "react-icons/fa";

export interface TrackStackProps {
  title: React.ReactNode;
  subTitle: string;
  covers: string[];
  onPlay(): unknown;
  onPause(): unknown;
  isPlaying: boolean;
}

export const TrackStack: React.FC<TrackStackProps> = ({
  title,
  subTitle,
  covers,
  onPlay,
  onPause,
  isPlaying,
}) => {
  return (
    <div className="group cursor-pointer relative flex flex-col gap-2 w-[200px]">
      <div className="rounded-md overflow-hidden w-[200px] h-[200px] flex flex-wrap bg-gray-400/50">
        {covers.length < 4 ? (
          <img
            src={YMusicApi.getImageUrl(covers?.[0], 200)}
            alt=""
            className="w-[200px] h-[200px]"
          />
        ) : (
          covers?.map((url, i) => (
            <img
              key={i}
              src={YMusicApi.getImageUrl(url, 100)}
              alt=""
              className="w-[100px] h-[100px]"
            />
          ))
        )}
      </div>
      <div
        onClick={() => (isPlaying ? onPause() : onPlay())}
        className={clsx(
          isPlaying ? "flex" : "hidden group-hover:flex",
          "cursor-pointer transition-all absolute text-2xl justify-center bg-gray-800/70 w-[200px] h-[200px] items-center"
        )}
      >
        {isPlaying ? <FaPause /> : <FaPlay />}
      </div>
      <div>
        <div className="font-bold overflow-hidden text-ellipsis whitespace-nowrap">
          {title}
        </div>
        <div className="opacity-75">{subTitle}</div>
      </div>
    </div>
  );
};
