import { client } from "@/app/hooks/useClient";
import { signal, effect } from "@preact/signals-react";
import { createAudio } from "./audio";
import { createQueue } from "./queue";
import { TracksList } from "yandex-music-client";
import { YMusicApi } from "@/app/api/YMusicApi";

export const createPlayer = (
  audio: ReturnType<typeof createAudio>,
  queue: ReturnType<typeof createQueue>
) => {
  const trackUrl = signal<string | undefined>("");
  const likedTracks = signal<TracksList | undefined>(undefined);

  const fetchLikes = () => {
    client.value?.tracks
      .getLikedTracksIds(client.value.userUid!)
      .then(({ result }) => {
        likedTracks.value = result.library;
      });
  };

  effect(() => {
    if (client.value) {
      fetchLikes();
    }
  });

  effect(() => {
    if (queue.currentTrack.value !== undefined) {
      client.value
        ?.getAudioUrl(queue.currentTrack.value.id.toString())
        .then((url) => {
          trackUrl.value = url;
        });
    }
  });

  effect(() => {
    if (trackUrl.value) {
      audio.src.value = trackUrl.value;
      audio.play();

      const track = queue.currentTrack.peek();

      navigator.mediaSession.metadata = new MediaMetadata({
        title: track?.title,
        artist: track?.artists.map((art) => art.name).join(", "),
        album: track?.albums.map((art) => art.title).join(", "),
        artwork: [
          {
            src: YMusicApi.getImageUrl(track?.ogImage, 200),
            sizes: "200x200",
            type: "image/png",
          },
        ],
      });
    }
  });

  return {
    likedTracks,
    trackUrl,
    queue,
    likeTrack: (trackId: string) => {
      client
        .peek()
        ?.tracks.likeTracks(client.value?.userUid!, {
          "track-ids": [trackId],
        })
        .then(fetchLikes);
    },
    dislikeTrack: (trackId: string) => {
      client
        .peek()
        ?.tracks.removeLikedTracks(client.value?.userUid!, {
          "track-ids": [trackId],
        })
        .then(fetchLikes);
    },
  };
};
