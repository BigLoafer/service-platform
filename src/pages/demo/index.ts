import { asyncLoad } from 'app/loadable';
import demoStore from './store/testStore';
const PageA = asyncLoad(() => import('./containers/PageA'));
const PageB = asyncLoad(() => import('./containers/PageB'));

let demo = {};
if (process.env.NODE_ENV === 'production') {
    demo = {
      routes: [],
      store: {}
    };
} else {
  demo = {
    routes: [
      {
          path: '/demo/PageA',
          exact: true,
          component: PageA,
      },
      {
          path: '/demo/PageB',
          exact: true,
          component: PageB,
      }
    ],
    store: { demoStore }
  };
}

export {demo};
