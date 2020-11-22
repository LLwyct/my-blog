import {Home, PageNotFound, Blog} from '../Views';
import MusicPlayer from '../components/MusicPlayer/MusicPlayer';

type route = Array<{
    path: string;
    component: any;
    exact?: boolean;
}>

const routes: route = [
  {
    path: "/",
    component: Home,
    exact: true,
  },
  {
    path: "/music",
    component: MusicPlayer,
  },
  {
    path: "/blog",
    component: Blog,
  },
  {
    path: "*",
    component: PageNotFound,
  },
];

export default routes;