import { client } from "@/app/hooks/useClient";
import { signal } from "@preact/signals-react";
import { YMusicApi } from "@/app/api/YMusicApi";
import { Link, useParams } from "react-router-dom";
import { useEffect } from "react";
import { Album } from "yandex-music-client";
import { IoChevronBackSharp } from "react-icons/all";
import { audio, queue } from "@/app/store/state";
import { TrackItem } from "@/lib/ui-kit/track/TrackItem";

const album = signal<Album | undefined>(undefined);

export const AlbumView = () => {
  const params = useParams();

  useEffect(() => {
    if (params.id) {
      client.value?.albums
        .getAlbumsWithTracks(Number(params.id))
        .then(({ result }) => {
          album.value = result;
        });
    }
  }, [params.id]);

  return (
    <div className="flex flex-col relative flex-1 overflow-hidden max-h-screen">
      <Link
        to={`/artist/albums/${album.value?.artists[0].id}`}
        className="absolute cursor-pointer z-100"
      >
        <IoChevronBackSharp className="absolute z-10 mt-8 text-3xl text-white m-4" />
      </Link>
      <div className="max-h-full w-full overflow-hidden absolute">
        <img
          src={YMusicApi.getImageUrl(album.value?.coverUri, 1000)}
          className="opacity-50 w-full cover"
          alt="cover"
        />
      </div>
      <div className="absolute pt-[300px] h-full w-full  flex-1 flex flex-col">
        <div className="flex items-center justify-between w-full font-bold ml-10 text-5xl">
          <div>{album.value?.title}</div>
          {/* <AiFillHeart className="mr-20 text-4xl" /> */}
        </div>
        <div className="flex h-full flex-col gap-4 p-8 pt-6 mt-4 backdrop-blur-sm bg-gradient-to-r from-[#3302293c] from-10% via-[#c80d8749] via-70% to-[#33022921] to-90%">
          <div className="flex gap-10 flex-wrap h-[calc(100%-190px)] overflow-x-hidden overflow-auto">
            <div className="mt-2 flex flex-col w-full text-lg gap-3">
              {album.value?.volumes?.[0].map((track, i) => {
                return (
                  <TrackItem
                    key={i}
                    track={track}
                    index={i}
                    isPlaying={
                      queue.currentTrack.value?.id === track.id &&
                      !audio.paused.value
                    }
                    play={() => queue.addTrack(track.id)}
                    pause={audio.pause}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
