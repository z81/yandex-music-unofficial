import { client } from "@/app/hooks/useClient";
import { effect, signal } from "@preact/signals-react";
import { Playlist as PlaylistType } from "yandex-music-client";
import { PageMenu } from "@/app/components/PageMenu/PageMenu";
import { TrackStack } from "@/lib/ui-kit/track/TrackStack";
import { audio, queue } from "@/app/store/state";
import { Link } from "react-router-dom";

const playlists = signal<PlaylistType[]>([]);

effect(() => {
  client.value?.playlists.getPlayLists(client.value.userUid!).then((d) => {
    playlists.value = d.result;
  });
});

export const PlaylistsPage = () => {
  return (
    <div className="flex flex-col relative flex-1 overflow-hidden max-h-screen">
      <div className="absolute h-full w-full flex-1 flex flex-col">
        <div className="flex h-full flex-col gap-4 p-8 pt-9 backdrop-blur-sm bg-gradient-to-r from-[#3302293c] from-10% via-[#c80d8749] via-70% to-[#33022921] to-90%">
          <PageMenu
            activeId="playlist"
            items={[
              { title: "ТРЕКИ", id: "main", url: "" },
              { title: "АЛЬБОМЫ", id: "tracks", url: "" },
              { title: "ИСПОЛНИТЕЛИ", id: "albums", url: "" },
              { title: "ПЛЕЙЛИСТЫ", id: "playlist", url: "" },
              // { title: "ПОДКАСТЫ И КНИГИ", id: "playlist", url: "" },
              // { title: "ДЕТЯМ", id: "playlist", url: "" },
              // { title: "ИСТОРИЯ", id: "playlist", url: "" },
            ]}
          />
          <div className="flex gap-10 flex-wrap h-[calc(100%-140px)]  overflow-x-hidden overflow-auto">
            {playlists.value?.map(
              ({ title, likesCount, owner, kind, cover, ogImage }) => (
                <TrackStack
                  key={kind}
                  title={<Link to={`/playlists/${kind}`}>{title}</Link>}
                  subTitle={likesCount?.toString()}
                  covers={
                    cover?.itemsUri && cover?.itemsUri?.length < 4
                      ? [ogImage!]
                      : cover!.itemsUri! ?? []
                  }
                  onPlay={() => queue.addPlaylist(kind, owner.uid)}
                  onPause={audio.pause}
                  isPlaying={
                    queue.queuePlayType.value.type === "playlist" &&
                    queue.queuePlayType.value.id === kind &&
                    !audio.paused.value
                  }
                />
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
