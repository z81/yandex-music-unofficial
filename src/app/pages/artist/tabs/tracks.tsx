import { client } from "@/app/hooks/useClient";
import { signal } from "@preact/signals-react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Track } from "yandex-music-client";
import { queue, audio } from "@/app/store/state";
import { TrackItem } from "@/lib/ui-kit/track/TrackItem";

const tracks = signal<Track[]>([]);

export interface TracksProps {}
export const Tracks: React.FC<TracksProps> = ({}) => {
  const params = useParams();

  useEffect(() => {
    client.value?.artists.getArtistTracks(params.id!).then(({ result }) => {
      tracks.value = result.tracks;
    });
  }, [params.id]);

  return (
    <>
      <div className="mt-2 flex flex-col w-full text-lg gap-3">
        {tracks.value.map((track, i) => {
          return (
            <TrackItem
              key={i}
              track={track}
              index={i}
              isPlaying={
                queue.currentTrack.value?.id === track.id && !audio.paused.value
              }
              play={() => queue.addTrack(track.id)}
              pause={audio.pause}
            />
          );
        })}
      </div>
    </>
  );
};
