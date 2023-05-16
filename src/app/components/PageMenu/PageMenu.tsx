import clsx from "clsx";
import { Link } from "react-router-dom";

export interface PageMenuItem {
  url: string;
  id: string;
  title: string;
}

export interface InPageMenuProps {
  items: PageMenuItem[];
  activeId: PageMenuItem["id"];
}

export const PageMenu: React.FC<InPageMenuProps> = ({ items, activeId }) => {
  return (
    <div className="flex gap-10">
      {items.map((item) => (
        <Link
          key={item.id}
          to={item.url}
          className={clsx("font-bold text-xl", {
            "opacity-50": item.id !== activeId,
          })}
        >
          {item.title}
        </Link>
      ))}
    </div>
  );
};
