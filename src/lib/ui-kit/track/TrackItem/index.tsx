import { Track } from "yandex-music-client";
import clsx from "clsx";
import { YMusicApi } from "@/app/api/YMusicApi";
import { FaPlay, FaPause } from "react-icons/fa";
import { Link } from "react-router-dom";
import { Like } from "@/lib/ui-kit/track/Like";

export interface TrackItemProps {
  track: Track;
  index: number;
  isPlaying: boolean;
  play(): unknown;
  pause(): unknown;
}

export const TrackItem: React.FC<TrackItemProps> = ({
  isPlaying,
  track,
  index,
  play,
  pause,
}) => {
  const [h, m, s] = new Date(0, 0, 0, 0, 0, 0, track.durationMs)
    .toLocaleTimeString()
    .split(":");

  const togglePlay = () => {
    if (!track.available) return;

    isPlaying ? pause() : play();
  };

  return (
    <div
      key={track.id}
      className={clsx(
        "group transition-all cursor-pointer backdrop-blur-sm bg-white/10 hover:bg-white/25 rounded-sm p-3 flex w-full flex-row gap-4 items-center",
        {
          grayscale: !track.available,
        }
      )}
    >
      <div className="font-bold opacity-60 text-center mr-2 w-5">
        <div
          onClick={togglePlay}
          className={clsx({ "group-hover:hidden": track.available })}
        >
          {index + 1}
        </div>
        <div
          onClick={togglePlay}
          className={clsx({
            "hidden group-hover:flex": track.available,
          })}
        >
          {!isPlaying ? (
            <FaPlay className="ml-2" />
          ) : (
            <FaPause className="ml-2" />
          )}
        </div>
      </div>
      <div>
        <img
          className="rounded-sm"
          src={YMusicApi.getImageUrl(track.coverUri, 40)}
          alt=""
        />
      </div>
      <Link to={`/artist/tracks/${track.artists[0].id}`} className="flex-1">
        {track.title}
      </Link>
      <Link to={`/artist/albums/${track.artists[0].id}`} className="flex-1">
        {track.albums.map((album) => album.title).join(", ")}
      </Link>
      <div className=" opacity-70">
        <Like trackId={track.id} />
      </div>
      <div className="w-16 text-end pr-2 opacity-70">
        {h === "00" ? "" : `${h}:`}
        {m}:{s}
      </div>
    </div>
  );
};
