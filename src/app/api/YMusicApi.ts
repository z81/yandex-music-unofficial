import {
  OpenAPIConfig,
  Track,
  TrackItem,
  YandexMusicClient,
} from "yandex-music-client";

export class YMusicApi extends YandexMusicClient {
  userUid: number | undefined;

  fetchUid() {
    return this.account.getAccountSettings().then(({ result }) => {
      this.userUid = result.uid;
    });
  }

  constructor(config?: Partial<OpenAPIConfig> | undefined) {
    super(config);
  }

  static getImageUrl(template: string | undefined, size: number) {
    if (!template) return "";

    return `https://${template.replace("%%", `${size}x${size}`)}`;
  }

  async getAudioUrl(trackId: string) {
    const downloadInfo = await this.tracks.getDownloadInfo(trackId);
    downloadInfo.result.sort((a, b) => {
      const [left, right] = [a, b].map((v) =>
        `${v.codec === "aac" ? 1 : 0}.${900 - v.bitrateInKbps}`.padEnd(7, "0")
      );

      return right.localeCompare(left);
    });

    const infoUrl = `${downloadInfo.result?.[0].downloadInfoUrl}&format=json`;
    const infoResponse = await fetch(infoUrl);
    const downSegments = await infoResponse.json();

    return `https://${downSegments.host}/get-mp3/${downSegments.s}/${downSegments.ts}${downSegments.path}?track-id=${trackId}&play=false`;
  }

  getOneWaveTracks(
    queue: string,
    radioSessionId: string | undefined,
    config: Record<string, string>
  ) {
    const seeds = {
      settingLanguage: config.language,
      settingMoodEnergy: config.moodEnergy,
      settingDiversity: config.diversity,
    };

    const settingSeeds = Object.entries(seeds)
      .map(([key, value]) => `${key}:${value}`)
      .join(",");

    const url =
      "https://music.yandex.ru/api/v2.1/handlers/radio/user/onyourwave/tracks";
    const paramsObj: Record<string, string> = {
      queue,
      settingSeeds,
      externalDomain: "music.yandex.ru",
      overembed: "no",
      __t: `${Math.trunc(Date.now() / 1000)}`,
    };

    if (radioSessionId) {
      paramsObj.radioSessionId = radioSessionId;
    }

    const searchParams = new URLSearchParams(paramsObj).toString();

    return fetch(`${url}?${searchParams}`, {
      headers: {
        "x-retpath-y": "https%3A%2F%2Fmusic.yandex.ru%2Fhome",
      },
      method: "GET",
      mode: "cors",
      credentials: "include",
    })
      .then((d) => d.json())
      .then((d): { tracks: TrackItem[]; radioSessionId: string } => d);
  }

  async startTrack(playId: string, track: Track) {
    const now = new Date().toISOString();

    // await this.tracks.playAudio({
    //   "play-id": playId,
    //   from: "ym-custom",
    //   "track-id": track.id,
    //   "client-now": now,
    //   "album-id": track.albums[0].id.toString(),
    //   "from-cache": false,
    //   "track-length-seconds": track.durationMs / 1000,
    //   "end-position-seconds": 0,
    //   "total-played-seconds": 0,
    //   timestamp: now,
    //   uid: this.userUid,
    // });
    await this.rotor.sendStationFeedback(
      playId,
      {
        type: "trackStarted",
        timestamp: now,
        trackId: track.id,
      },
      // @ts-ignore
      track.batchId
    );
    // const seeds = {
    //   settingLanguage: config.language,
    //   settingMoodEnergy: config.moodEnergy,
    //   settingDiversity: config.diversity,
    // };

    // const settingSeeds = Object.entries(seeds)
    //   .map(([key, value]) => `${key}:${value}`)
    //   .join(",");

    // const url =
    //   "https://music.yandex.ru/api/v2.1/handlers/radio/user/onyourwave/feedback/radioStarted/";
    // const paramsObj: Record<string, string> = {
    //   queue,
    //   settingSeeds,
    //   externalDomain: "music.yandex.ru",
    //   __t: `${Math.trunc(Date.now() / 1000)}`,
    // };

    // if (radioSessionId) {
    //   paramsObj.radioSessionId = radioSessionId;
    // }

    // const formData = new URLSearchParams({
    //   "timestamp": `${Math.trunc(Date.now() / 1000)}`,
    //   "from": "web-radio-user-main",
    //   "radioSessionId": radioSessionId || "",
    //   "dashId": "1681900766931394-15466647749877776062.3",
    //   "sign": "ac9504d560bf021a9ebf491bbdf1b90016afb2e0:1681900751293",
    //   "external-domain": "music.yandex.ru",
    //   "overembed": "no"
    // }).toString();
    // console.log("formData", formData);

    // const searchParams = new URLSearchParams(paramsObj).toString();

    // return fetch(`${url}65510455:10605459?${searchParams}`, {
    //   headers: {
    //     "x-retpath-y": "https%3A%2F%2Fmusic.yandex.ru%2Fhome",
    //   },
    //   method: "POST",
    //   mode: "cors",
    //   credentials: "include",
    //   body:
    // })
    //   .then((d) => d.json())
    //   .then((d): { tracks: TrackItem[]; radioSessionId: string } => d);
  }
}
