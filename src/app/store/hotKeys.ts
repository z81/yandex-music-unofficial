import { audio, queue } from "./state";

export const createHotKeys = () => {
  const on = navigator.mediaSession.setActionHandler.bind(navigator.mediaSession);

  on("seekto", (seekInfo) => audio.seekTo(seekInfo.seekTime ?? 0));
  on("play", audio.play);
  on("pause", audio.pause);
  on("seekbackward", (s) => audio.seekTo(audio.currentTime.peek() - s.seekOffset!));
  on("seekforward", (s) => audio.seekTo(audio.currentTime.peek() + s.seekOffset!));
  on("previoustrack", queue.prev);
  on("nexttrack", queue.next);
  on("stop", audio.pause);
};
