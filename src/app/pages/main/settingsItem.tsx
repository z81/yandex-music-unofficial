import clsx from "clsx";

interface ItemProps {
  id: string;
  icon?: React.ReactNode;
  title: string;
  selected?: boolean;
  onClick: () => unknown;
}

export const Item: React.FC<ItemProps> = ({
  id,
  onClick,
  icon,
  title,
  selected,
}) => (
  <div
    onClick={onClick}
    className={clsx(
      "flex flex-col gap-1 p-4 justify-center items-center cursor-pointer",
      {
        "backdrop-blur-sm bg-[#330229]/30 rounded-lg": selected,
      }
    )}
  >
    {icon && <div className="text-5xl">{icon}</div>}
    {title}
  </div>
);
