import { asyncLoad } from 'app/loadable';
import loginStore from './store/LoginsStore';

const Login = asyncLoad(() => import('./container/Login'));

export const login = {
    routes: [
        {
            path: '/login',
            exact: true,
            component: Login
        }
    ],
    store: {loginStore}
};