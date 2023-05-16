import { client } from "@/app/hooks/useClient";
import { effect, signal } from "@preact/signals-react";
import { YMusicApi } from "@/app/api/YMusicApi";
import { PageMenu } from "@/app/components/PageMenu/PageMenu";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { Albums } from "./tabs/albums";
import { Tracks } from "./tabs/tracks";

export const viewArtistId = signal<string | undefined>(undefined);
// Todo: добавить тип
const artistInfo = signal<any | undefined>(undefined);

effect(() => {
  if (client.value && viewArtistId.value !== undefined) {
    client.value?.artists
      .getArtistsBriefInfo(viewArtistId.value)
      .then(({ result }) => {
        artistInfo.value = result;
      });
  }
});

export const ArtistPage = () => {
  const params = useParams();

  useEffect(() => {
    viewArtistId.value = params.id;
  }, [params?.id]);

  const tabs = [
    // { title: "Главное", id: "main", url: "" },
    { title: "Треки", id: "tracks", url: "", content: <Tracks /> },
    {
      title: "Альбомы",
      id: "albums",
      url: "",
      content: <Albums albums={artistInfo.value?.albums} />,
    },
    // { title: "Плейлисты", id: "playlist", url: "" },
  ].map((item) =>
    Object.assign(item, {
      url: `/artist/${item.id}/${params.id}`,
    })
  );

  return (
    <div className="flex flex-col relative flex-1 overflow-hidden max-h-screen">
      <div className="max-h-full w-full overflow-hidden absolute">
        <img
          src={YMusicApi.getImageUrl(
            artistInfo.value?.allCovers?.[0].uri,
            1000
          )}
          className="opacity-50 w-full cover"
          alt="cover"
        />
      </div>
      <div className="absolute pt-[300px] h-full w-full  flex-1 flex flex-col">
        <div className="flex items-center justify-between w-full font-bold ml-10 text-5xl">
          <div>{artistInfo.value?.artist.name}</div>
          {/* <AiFillHeart className="mr-20 text-4xl" /> */}
        </div>
        <div className="flex h-full flex-col gap-4 p-8 pt-6 mt-4 backdrop-blur-sm bg-gradient-to-r from-[#3302293c] from-10% via-[#c80d8749] via-70% to-[#33022921] to-90%">
          <PageMenu activeId={params.type as any} items={tabs} />
          <div className="flex gap-10 flex-wrap h-[calc(100%-190px)]  overflow-x-hidden overflow-auto">
            {tabs.find((_) => _.id === params.type)?.content}
          </div>
        </div>
      </div>
      {/* <IoChevronBackSharp className="absolute z-10 mt-8 text-3xl text-white m-4" /> */}
    </div>
  );
};
