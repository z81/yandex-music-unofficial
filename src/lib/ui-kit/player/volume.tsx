import {
  IoMdVolumeHigh,
  IoMdVolumeLow,
  IoMdVolumeMute,
  IoMdVolumeOff,
} from "react-icons/io";

export interface VolumeProps {
  volume: number;
  onVolumeChange(value: number): unknown;
  toggleMute(): unknown;
}

export const Volume: React.FC<VolumeProps> = ({
  volume,
  onVolumeChange,
  toggleMute,
}) => {
  const volumePercent = Math.abs(volume * 100);

  const button = (
    <div onClick={toggleMute}>
      {volumePercent > 70 && <IoMdVolumeHigh />}
      {volumePercent > 30 && volumePercent <= 70 && <IoMdVolumeLow />}
      {volumePercent <= 30 && volumePercent > 0 && <IoMdVolumeMute />}
      {volumePercent === 0 && <IoMdVolumeOff />}
    </div>
  );

  return (
    <div className="group">
      {button}
      <div className="absolute hidden group-hover:flex ml-[-8px] mt-[-190px] p-5">
        <div
          onClick={(e) => {
            const { top, height } = e.currentTarget.getBoundingClientRect();
            onVolumeChange((height - (e.clientY - top)) / height);
          }}
          className="flex flex-col flex-nowrap justify-end w-2 h-32 bg-gray-200 rounded-full overflow-x-hidden dark:bg-gray-700"
        >
          <div
            className="bg-pink-800 overflow-x-hidden"
            role="progressbar"
            style={{ height: `${volumePercent}%` }}
            aria-valuenow={volumePercent}
            aria-valuemin={0}
            aria-valuemax={100}
          ></div>
        </div>
      </div>
    </div>
  );
};
