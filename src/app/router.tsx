import { createHashRouter } from "react-router-dom";
import { ArtistPage } from "@/app/pages/artist";
import { PlaylistsPage } from "./pages/playlists";
import { View } from "./pages/playlists/view";
import { AlbumView } from "./pages/album/view";
import { Queue } from "./pages/queue";
import { Stations } from "./pages/stations";
import { Main } from "./pages/main";
import { Layout } from "@/app/layout/main";

export const router = createHashRouter([
  {
    path: "/queue",
    id: "queue",
    element: (
      <Layout>
        <Queue />
      </Layout>
    ),
  },
  {
    path: "/album/:id",
    id: "album_view",
    element: (
      <Layout>
        <AlbumView />
      </Layout>
    ),
  },
  {
    path: "/playlists/:id",
    id: "playlists_view",
    element: (
      <Layout>
        <View />
      </Layout>
    ),
  },
  {
    path: "/artist/:type/:id",
    id: "artist",
    element: (
      <Layout>
        <ArtistPage />
      </Layout>
    ),
  },
  {
    path: "/playlists",
    id: "playlists",
    element: (
      <Layout>
        <PlaylistsPage />
      </Layout>
    ),
  },
  {
    path: "/",
    id: "main",
    element: (
      <Layout>
        <Main />
      </Layout>
    ),
  },
  {
    path: "/stations/*",
    id: "stations",
    element: (
      <Layout>
        <Stations />
      </Layout>
    ),
  },
]);
