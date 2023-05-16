import { PageMenu } from "@/app/components/PageMenu/PageMenu";
import { audio, queue } from "@/app/store/state";
import { TrackItem } from "@/lib/ui-kit/track/TrackItem";

export const Queue = () => {
  return (
    <div className="flex flex-col relative flex-1 overflow-hidden max-h-screen">
      <div className="absolute h-full w-full flex-1 flex flex-col">
        <div className="flex h-full flex-col gap-4 p-8 pt-9 backdrop-blur-sm bg-gradient-to-r from-[#3302293c] from-10% via-[#c80d8749] via-70% to-[#33022921] to-90%">
          <PageMenu
            activeId="queue"
            items={[
              { title: "ОЧЕРЕДЬ", id: "queue", url: "" },
              // { title: "АЛЬБОМЫ", id: "tracks", url: "" },
              // { title: "ИСПОЛНИТЕЛИ", id: "albums", url: "" },
              // { title: "ПЛЕЙЛИСТЫ", id: "playlist", url: "" },
              // { title: "ПОДКАСТЫ И КНИГИ", id: "playlist", url: "" },
              // { title: "ДЕТЯМ", id: "playlist", url: "" },
              // { title: "ИСТОРИЯ", id: "playlist", url: "" },
            ]}
          />
          <div className="flex gap-2 flex-wrap h-[calc(100%-140px)]  overflow-x-hidden overflow-auto">
            {queue.queue.value?.map((track, i) => (
              <TrackItem
                key={track.id}
                track={track}
                index={i}
                isPlaying={
                  queue.currentTrack.value?.id === track.id &&
                  !audio.paused.value
                }
                play={() => queue.addTrack(track.id)}
                pause={audio.pause}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
