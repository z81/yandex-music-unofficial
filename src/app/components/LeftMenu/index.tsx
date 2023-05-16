import { BsMusicNoteList } from "react-icons/bs";
import { CgMediaPodcast } from "react-icons/cg";
import { IoMdMicrophone } from "react-icons/io";
import { TbHorseToy } from "react-icons/tb";
import { MenuItem } from "./MenuItem";

export const LeftMenu = () => {
  return (
    <div className="p-8 px-6 pr-0 bg-gradient-to-b from-[#330229] to-[#1d001e]">
      <div className="text-2xl font-bold flex gap-2 pb-2 mr-4">
        Яндекс Музыка
      </div>
      <div className="mt-5 flex flex-col gap-5 text-lg font-bold">
        <MenuItem
          title="Главное"
          icon={
            <img
              className={"w-5 h-5 mx-[0.1rem] brightness-0 invert "}
              src="https://music.yandex.ru/favicon32.png"
            />
          }
        />
        <MenuItem title="Подкасты" disabled icon={<IoMdMicrophone />} />
        <MenuItem title="Детям" disabled icon={<TbHorseToy />} />
        <MenuItem title="Потоки" id="stations" icon={<CgMediaPodcast />} />
        <MenuItem title="Коллекция" id="playlists" icon={<BsMusicNoteList />} />
      </div>
    </div>
  );
};
