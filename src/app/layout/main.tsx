import { Player } from "@/lib/ui-kit/player/player";
import { LeftMenu } from "../components/LeftMenu";
import { audio } from "@/app/store/state";
import { queue } from "@/app/store/state";
import { player } from "@/app/store/state";
import { Progress } from "@/lib/ui-kit/player/progress";

export const Layout = ({ children }: React.PropsWithChildren) => {
  // Todo: не пинайте, пока запаузил перенос во время реракторинга
  // нет времени пока разбираться с этим
  return (
    <>
      <LeftMenu />
      {children}
      <Player
        duration={audio.duration.value}
        currentTime={audio.currentTime.value}
        isPaused={audio.paused.value}
        currentTrack={queue.currentTrack.value!}
        volume={audio.volume.value}
        orderType={queue.orderType.value}
        queuePlayType={queue.queuePlayType.value}
        onVolumeChange={(value) => (audio.volume.value = value)}
        setCurrentTime={(value) => (audio.currentTime.value = value)}
        dislikeTrack={(id) => player.dislikeTrack(id)}
        next={queue.next}
        prev={queue.prev}
        play={audio.play}
        pause={audio.pause}
        toggleMute={audio.toggleMute}
        slots={{
          progress: (
            <Progress
              duration={audio.duration.value}
              currentTime={audio.currentTime.value}
              setCurrentTime={audio.setCurrentTime}
            />
          ),
        }}
      />
    </>
  );
};
