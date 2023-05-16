import { queue, audio } from "@/app/store/state";
import { TrackStack } from "@/lib/ui-kit/track/TrackStack";
import { Link } from "react-router-dom";
import { Album as AlbumType } from "yandex-music-client";

export interface AlbumsProps {
  albums: AlbumType[];
}
export const Albums: React.FC<AlbumsProps> = ({ albums }) => {
  return (
    <>
      {albums?.map((album: any) => (
        <TrackStack
          key={album.id}
          title={<Link to={`/album/${album.id}`}>{album.title}</Link>}
          subTitle={album.year}
          covers={album.ogImage ? [album.ogImage] : []}
          onPlay={() => {
            queue.addAlbum(album.id);
          }}
          onPause={audio.pause}
          isPlaying={
            queue.queuePlayType.value.type === "album" &&
            queue.queuePlayType.value.id === album.id &&
            !audio.paused.value
          }
        />
      ))}
    </>
  );
};
