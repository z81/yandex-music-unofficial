import { YMusicApi } from "@/app/api/YMusicApi";
import {
  AiOutlineDislike,
  BsRepeat,
  BsRepeat1,
  BsShuffle,
  FaFastBackward,
  FaFastForward,
  FaPause,
  FaPlay,
  MdFormatListBulleted,
} from "react-icons/all";
import { Link } from "react-router-dom";
import { Track } from "yandex-music-client";
import { Like } from "../track/Like";
import { QueueOrder, QueuePlayType } from "@/app/store/queue";
import { Volume } from "./volume";
import { Progress } from "./progress";

const orderIcons: Record<QueueOrder, JSX.Element> = {
  [QueueOrder.RANDOM]: <BsShuffle />,
  [QueueOrder.REPEAT_ONE]: <BsRepeat1 />,
  [QueueOrder.REPEAT_ALL]: <BsRepeat />,
};

export interface PlayerProps {
  currentTrack: Track;
  isPaused: boolean;
  queuePlayType: QueuePlayType;
  orderType: QueueOrder;
  volume: number;
  duration: number;
  currentTime: number;
  setCurrentTime(value: number): unknown;
  prev(): unknown;
  next(): unknown;
  play(): unknown;
  pause(): unknown;
  dislikeTrack(id: Track["id"]): unknown;
  toggleMute(): unknown;
  onVolumeChange(value: number): unknown;

  slots: {
    progress: React.ReactNode;
  };
}

export const Player: React.FC<PlayerProps> = ({
  currentTrack,
  volume,
  currentTime,
  isPaused,
  queuePlayType,
  orderType,
  duration,
  setCurrentTime,
  onVolumeChange,
  pause,
  play,
  prev,
  next,
  dislikeTrack,
  toggleMute,
  slots,
}) => {
  return (
    <div className="flex gap-5 fixed items-center  backdrop-blur-sm px-8 h-20 rounded-xl bg-[#330229]/30 bottom-6 right-6 w-[calc(100vw-270px)]">
      <div className="flex gap-5 text-3xl opacity-70">
        <FaFastBackward onClick={prev} />
        {!isPaused ? <FaPause onClick={pause} /> : <FaPlay onClick={play} />}
        <FaFastForward onClick={next} />
      </div>
      <div className="flex-1 flex flex-row gap-4">
        <div className="ml-6">
          {currentTrack && (
            <img
              src={YMusicApi.getImageUrl(currentTrack?.ogImage!, 400)}
              alt=""
              className="bg-transparent w-[50px] h-[50px] rounded-md"
            />
          )}
        </div>
        <div>
          <div className="font-bold">
            <Link to={`/artist/tracks/${currentTrack?.artists[0].id}`}>
              {currentTrack?.title}
            </Link>
            {!currentTrack && (
              <div className="opacity-60">Сейчас ничего не играет</div>
            )}
          </div>
          <div className="opacity-70">
            <Link to={`/artist/albums/${currentTrack?.artists[0].id}`}>
              {currentTrack?.artists[0].name}
            </Link>
          </div>
        </div>
        {currentTrack && <Like trackId={currentTrack.id} />}
        {currentTrack && queuePlayType.type === "station" && (
          <AiOutlineDislike
            onClick={() => {
              dislikeTrack(currentTrack.id);
              next();
            }}
            className="cursor-pointer ml-5 text-4xl self-center"
          />
        )}
      </div>
      <div className="flex gap-5 text-3xl opacity-70">
        <Link to="/queue">
          <MdFormatListBulleted />
        </Link>
        <div
          onClick={() => {
            const steps = Object.keys(orderIcons);
            let nextStepId = steps.indexOf(orderType) + 1;

            if (nextStepId >= steps.length) {
              nextStepId = 0;
            }

            orderType = steps[nextStepId] as QueueOrder;
          }}
        >
          {orderIcons[orderType]}
        </div>
        <Volume
          volume={volume}
          onVolumeChange={onVolumeChange}
          toggleMute={toggleMute}
        />
      </div>
      {slots.progress}
    </div>
  );
};
