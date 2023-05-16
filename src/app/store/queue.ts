import { client } from "@/app/hooks/useClient";
import { computed, effect, signal } from "@preact/signals-react";
import { StationTracksResult, Track } from "yandex-music-client";
import { createAudio } from "./audio";

export enum QueueOrder {
  RANDOM = "RANDOM",
  REPEAT_ONE = "REPEAT_ONE",
  REPEAT_ALL = "REPEAT_ALL",
}

export type QueuePlayType = {
  type: "track" | "playlist" | "album" | "station";
  id: number | string;
  source?: StationTracksResult;
};

export const createQueue = (audio: ReturnType<typeof createAudio>) => {
  const queue = signal<Track[]>([]);
  const currentPosition = signal(0);
  const playId = signal("");
  const queuePlayType = signal<QueuePlayType>({ type: "track", id: 0 });
  const orderType = signal<QueueOrder>(QueueOrder.REPEAT_ALL);
  const currentTrack = computed(() => queue.value.at(currentPosition.value));
  let stationConfig: any = undefined;
  let stationQueue: string[] = [];
  let radioSessionId: string | undefined;
  let batchId: string | undefined;

  const fetchStationTracks = async (stationId: string, config?: Record<string, string>) => {
    if (queue.value.length > 0 && currentTrack.value) {
      console.log("currentTrack", currentTrack.value);
      const join = (track: Track) => `${track.id}:${track.albums[0].id}`;

      const next = queue.value[currentPosition.value + 1];

      if (stationQueue.length === 0) {
        stationQueue = [join(currentTrack.value), join(next)];
      } else {
        stationQueue = [stationQueue[1], join(currentTrack.value)];
      }
      console.log(stationQueue.join(","));

      // queueString = [
      //   stationPrevTack ? stationPrevTack : `${next.id}:${next.albums[0].id}`,
      //   current,
      //   // `${next2?.id}:${next2?.albums[0].id}`,
      // ].join(",");

      // stationPrevTack = current; //`${currentTrack.value.id}:${currentTrack.value.albums[0].id}`;
    }

    stationConfig = config;
    queuePlayType.value = {
      type: "station",
      id: stationId,
    };

    // if (stationId === "user:onyourwave") {
    //   console.log("radioSessionId", radioSessionId);

    //   return client
    //     .peek()
    //     ?.getOneWaveTracks(stationQueue.join(","), radioSessionId, config!)
    //     .then((data) => {
    //       radioSessionId = data.radioSessionId || radioSessionId;
    //       queue.value = [...queue.value, ...data.tracks.map((t) => t.track!)];
    //       const firstTrack = queue.peek()[0];
    //       // stationPrevTack = `${firstTrack.id}:${firstTrack.albums[0].id}`;

    //       setCurrentPos(currentPosition.value + 1);
    //       audio.play();
    //       client
    //         .peek()
    //         ?.startTrack(
    //           radioSessionId!,
    //           queue.value[currentPosition.value + 1]
    //         );
    //     });
    // }

    client
      .peek()
      ?.rotor.getStationTracks(stationId, true, currentTrack.peek()?.id)
      .then(({ result }) => {
        radioSessionId = result.radioSessionId;
        batchId = result.batchId;
        console.log("ss", result);

        queue.value = result.sequence.map((t) => t.track);
        setCurrentPos(0);
        audio.play();
      });
  };

  const nextTrack = async () => {
    if (currentTrack.peek()?.id) {
      // played_seconds = track.duration_ms / 1000;
      // total_seconds = track.duration_ms / 1000;
      // client.peek()?.tracks.playAudio({
      //   from_: "desktop_win-home-playlist_of_the_day-playlist-default",
      //   track_id: track.id,
      //   album_id: track.albums[0].id,
      //   play_id: play_id,
      //   track_length_seconds: int(total_seconds),
      //   total_played_seconds: played_seconds,
      //   end_position_seconds: total_seconds,
      // });
      // (
      //   currentTrack.peek()!.id,
      //   {
      //     type: "trackFinished",
      //     timestamp: new Date().toISOString(),
      //     trackId: currentTrack.peek()!.id,
      //   },
      //   // @ts-ignore
      //   track.batchId
      // );
      // await client.peek()!.tracks.playAudio({
      //   "play-id": playId,
      //   from: "vscode-extension",
      //   "track-id": track.id,
      //   "client-now": now,
      //   "album-id": track.albums[0].id.toString(),
      //   "from-cache": false,
      //   "track-length-seconds": track.durationMs / 1000,
      //   "end-position-seconds": 0,
      //   "total-played-seconds": 0,
      //   timestamp: now,
      //   uid: this.userId,
      // });
      // if (radioId) {
      //   await this.client!.rotor.sendStationFeedback(radioId, {
      //     type: 'trackStarted',
      //     timestamp: now,
      //     trackId: track.id,
      //   }, batchId);
      // }
      // client.peek()?.rotor.sendStationFeedback(
      //   currentTrack.peek()!.id,
      //   {
      //     type: "radioStarted",
      //     timestamp: new Date().toISOString(),
      //     trackId: currentTrack.peek()!.id,
      //   },
      //   // @ts-ignore
      //   track.batchId
      // );
    }

    if (queuePlayType.peek().type === "station") {
      // self.__send_play_end_radio(self.current_track, self.station_tracks.batch_id)
      // fetchStationTracks(`${queuePlayType.peek().id}`, stationConfig);

      if (currentPosition.peek() === queue.peek().length - 2) {
        fetchStationTracks(`${queuePlayType.peek().id}`, stationConfig);
      } else {
        setCurrentPos(currentPosition.peek() + 1);
      }
      return;
    }

    switch (orderType.peek()) {
      case QueueOrder.RANDOM:
        setCurrentPos(Math.trunc(Math.random() * queue.peek().length));
        break;
      case QueueOrder.REPEAT_ONE:
        audio.currentTime.value = 0;
        audio.play();
        break;
      case QueueOrder.REPEAT_ALL:
        if (currentPosition.peek() === queue.peek().length - 1) {
          setCurrentPos(0);
          audio.play();
        } else {
          setCurrentPos(currentPosition.peek() + 1);
        }
        break;
    }
  };

  effect(() => {
    if (audio.paused.value && audio.currentTime.peek() === audio.duration.peek()) {
      nextTrack();
    }
  });

  effect(() => {
    if (currentTrack.value && !audio.paused.value) {
      const now = new Date().toISOString();
      const track = currentTrack.value;

      client.value!.tracks.playAudio({
        "play-id": playId.value,
        from: "vscode-extension",
        "track-id": track.id,
        "client-now": now,
        "album-id": track.albums[0].id.toString(),
        "from-cache": false,
        "track-length-seconds": track.durationMs / 1000,
        "end-position-seconds": 0,
        "total-played-seconds": 0,
        timestamp: now,
        uid: client.value?.userUid,
      });

      if (queuePlayType.value.id) {
        client.value!.rotor.sendStationFeedback(
          `${queuePlayType.value.id}`,
          {
            type: "trackStarted",
            timestamp: now,
            trackId: track.id,
          },
          batchId
        );
      }
    }
  });

  const setCurrentPos = (position: number) => {
    const nextPos = Math.min(queue.value.length - 1, Math.max(0, position));

    if (queue.value?.at(nextPos)?.available === false && position < queue.value.length) {
      setCurrentPos(nextPos + 1);
    } else {
      currentPosition.value = nextPos;
    }
  };

  return {
    queue,
    queuePlayType,
    currentPosition,
    currentTrack,
    orderType,
    addTrack: (trackId: string) => {
      const curTrackPos = queue.peek().findIndex((track) => track.id === trackId);

      if (curTrackPos !== -1) {
        return setCurrentPos(curTrackPos);
      }

      client.value?.tracks
        .getTracks({
          "track-ids": [trackId],
        })
        .then((data) => {
          queuePlayType.value = {
            type: "track",
            id: trackId,
          };
          queue.value = [...queue.value, ...data.result];
        });
    },
    addPlaylist: (playlistKind: number, ownerUid: number) => {
      client.value?.playlists.getPlaylistById(ownerUid, playlistKind).then(({ result }) => {
        queuePlayType.value = {
          type: "playlist",
          id: playlistKind,
        };
        queue.value = result.tracks.map(({ track }) => track!).reverse();
        setCurrentPos(currentPosition.value);
      });
    },
    addAlbum: (albumId: number) => {
      client.value?.albums.getAlbumsWithTracks(albumId).then(({ result }) => {
        queuePlayType.value = {
          type: "album",
          id: albumId,
        };
        queue.value = result.volumes!?.[0].reverse();
        setCurrentPos(0);
      });
    },
    addStation: async (...args: Parameters<typeof fetchStationTracks>) => {
      queue.value = [];
      stationQueue = [];

      function generatePlayId(): string {
        return `${Math.floor(Math.random() * 1000)}-${Math.floor(Math.random() * 1000)}-${Math.floor(
          Math.random() * 1000
        )}`;
      }

      playId.value = generatePlayId();

      const x = await client.peek()!.rotor.sendStationFeedback(args[0], {
        type: "radioStarted",
        timestamp: new Date().toISOString(),
        from: "ym-custom",
      });

      console.log("x", x);

      return fetchStationTracks(...args);
    },
    prev() {
      if (currentPosition.peek() === 0) {
        setCurrentPos(queue.peek().length - 1);
      } else {
        setCurrentPos(currentPosition.peek() - 1);
      }
    },
    next() {
      if (orderType.peek() === QueueOrder.REPEAT_ONE) {
        setCurrentPos(queue.peek().length + 1);
      } else {
        nextTrack();
      }
    },
  };
};
