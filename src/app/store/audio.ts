import { persistSignal } from "@/lib/persist-signal";
import { effect, signal } from "@preact/signals-react";

export const createAudio = () => {
  const audio = new Audio();

  const watch = <K extends keyof typeof audio>(
    key: K,
    update = true,
    storeKey?: string
  ) => {
    let initValue = audio[key];

    if (storeKey) {
      const storedRaw = localStorage.getItem(storeKey);
      initValue = storedRaw ? JSON.parse(storedRaw) : audio[key];
    }
    const sig = storeKey
      ? persistSignal(initValue, storeKey)
      : signal(initValue);

    effect(() => {
      try {
        if (update) {
          // @ts-ignore
          audio[key] = sig.value;
        }
      } catch (e) {
        console.error(e);
      }
    });

    return sig;
  };

  audio.addEventListener("pause", () => {
    signals.paused.value = true;
  });
  audio.addEventListener("play", () => {
    signals.paused.value = false;
  });
  audio.addEventListener("loadeddata", () => {
    signals.duration.value = audio.duration;
  });
  audio.addEventListener("timeupdate", () => {
    signals.currentTime.value = audio.currentTime;
  });

  let prevVolume = audio.volume;

  const signals = {
    play: () => {
      setTimeout(() => audio.play());
    },
    pause: () => audio.pause(),
    toggleMute: () => {
      if (signals.volume.value === 0) {
        signals.volume.value = prevVolume;
      } else {
        prevVolume = signals.volume.value;
        signals.volume.value = 0;
      }
    },
    setCurrentTime: (time: number) => {
      audio.currentTime = time;
      signals.currentTime.value = time;
    },
    paused: watch("paused", false),
    volume: watch("volume", true, "playerVolume"),
    duration: watch("duration", false),
    currentTime: watch("currentTime", false),
    src: watch("src"),
    audioElement: audio,
    seekTo: (time: number) => {
      signals.currentTime.value = Math.max(0, Math.min(time, audio.duration));
    },
  };

  signals.duration.value = Number.MAX_SAFE_INTEGER;

  return signals;
};
