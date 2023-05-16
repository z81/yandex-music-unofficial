export interface ProgressProps {
  currentTime: number;
  setCurrentTime(value: number): unknown;
  duration: number;
}

export const Progress: React.FC<ProgressProps> = ({
  currentTime,
  duration,
  setCurrentTime,
}) => {
  const width = Math.abs((currentTime / duration) * 100);

  return (
    <div
      className="absolute w-full h-4 bottom-0 mb-[-0.7rem] ml-[-2rem] "
      onClick={(e) => {
        const { width, left } = e.currentTarget.getBoundingClientRect();
        const percentage = 1 - (width - (e.clientX - left)) / width;
        setCurrentTime(percentage * duration);
      }}
    >
      <div
        className="transition-all duration-150 ease-out h-1 bg-gradient-to-r from-transparent to-gray-300/70"
        style={{
          width: `${width}%`,
        }}
      ></div>
    </div>
  );
};
