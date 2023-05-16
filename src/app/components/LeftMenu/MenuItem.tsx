import { router } from "@/app/router";
import clsx from "clsx";
import { NavLink, useLocation } from "react-router-dom";

export interface MenuItemProps {
  title: string;
  icon: JSX.Element;
  id?: string;
  disabled?: boolean;
}

export const MenuItem: React.FC<MenuItemProps> = ({
  title,
  id,
  icon,
  disabled,
}) => {
  const loc = useLocation();
  const route = router.routes.find((r) => r.id === id);
  // Todo: fix router
  const isSubActive =
    route?.path?.split("/")?.[1] === loc.pathname.split("/")?.[1];

  return (
    <NavLink
      end
      className={({ isActive }) =>
        clsx("cursor-pointer flex gap-2 items-center", {
          "opacity-50": !disabled && !isActive && !isSubActive,
          "opacity-25": disabled,
          "hover:opacity-80": !disabled,
        })
      }
      to={router.routes.find((r) => r.id === id)?.path ?? "/"}
    >
      <span className="text-2xl">{icon}</span>
      {title}
    </NavLink>
  );
};
