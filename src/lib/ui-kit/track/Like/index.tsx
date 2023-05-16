import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { player } from "../../../../app/store/state";

export interface LikeProps {
  trackId: string;
}

export const Like: React.FC<LikeProps> = ({ trackId }) => {
  const isLiked = !!player.likedTracks.value?.tracks.some(
    (track) => track.id === trackId
  );

  return isLiked ? (
    <AiFillHeart
      onClick={() => {
        player.dislikeTrack(trackId);
      }}
      className="ml-5 text-4xl self-center"
    />
  ) : (
    <AiOutlineHeart
      onClick={() => {
        player.likeTrack(trackId);
      }}
      className="ml-5 text-4xl self-center"
    />
  );
};
