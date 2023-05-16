import clsx from "clsx";
import { BsCircleFill } from "react-icons/bs";
import {
  FcFlashOn,
  FcLike,
  FcMediumPriority,
  FcQuestions,
} from "react-icons/fc";
import { Item } from "./settingsItem";
import { computed, effect, signal } from "@preact/signals-react";
import { client } from "@/app/hooks/useClient";

const diversity = [
  {
    id: "favorite",
    title: "Любимое",
    icon: <FcLike />,
  },
  {
    id: "discover",
    title: "Незнакомое",
    icon: <FcQuestions />,
  },
  {
    id: "popular",
    title: "Популярное",
    icon: <FcFlashOn />,
  },
];

const moodEnergy = [
  { id: "active", title: "Бодрое", icon: "text-yellow-500" },
  { id: "fun", title: "Весёлое", icon: "text-red-500" },
  { id: "calm", title: "Спокойное", icon: "text-green-500" },
  { id: "sad", title: "Грустное", icon: "text-blue-500" },
].map((m) => ({
  ...m,
  icon: <BsCircleFill className={clsx(m.icon)} />,
}));

const language = [
  {
    id: "russian",
    title: "Русский",
  },
  {
    id: "not-russian",
    title: "Иностранный",
  },
  {
    id: "without-words",
    title: "Без слов",
  },
];

const items = { diversity, moodEnergy, language };

const defaults: Record<keyof typeof items, string> = {
  diversity: "default",
  moodEnergy: "any",
  language: "any",
};

const key = "wave-settings";
const storageData = localStorage.getItem(key);

export const waveSettings = signal(
  storageData
    ? JSON.parse(storageData)
    : {
        ...defaults,
      }
);

export const changedSettingsNames = computed(() => {
  return Object.keys(defaults)
    .filter((key) => (defaults as any)[key] !== waveSettings.value[key])
    .map((key) =>
      (items as any)[key].find((n: any) => n.id === waveSettings.value[key])
    );
});

effect(() => {
  localStorage.setItem("wave-settings", JSON.stringify(waveSettings.value));
});

export const Settings = () => {
  return (
    <div className="flex flex-col gap-10 rounded-lg p-6 backdrop-blur-sm bg-[#930229]/30">
      {Object.entries(items).map(([key, value]) => (
        <div key={key} className="flex gap-4 items-center justify-between">
          {value.map((m) => {
            const isSelected = waveSettings.value[key] === m.id;

            const handleClick = () => {
              waveSettings.value = {
                ...waveSettings.peek(),
                //@ts-expect-error
                [key]: isSelected ? defaults[key] : m.id,
              };
            };

            return (
              <Item
                key={m.id}
                {...m}
                selected={isSelected}
                onClick={handleClick}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
};
