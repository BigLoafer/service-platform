import { asyncLoad } from 'app/loadable';

const ForgetPwd = asyncLoad(() => import('./container/UpdatePwd'));

export const Update = {
    routes: [
        {
            path: '/updatePwd',
            exact: true,
            component: ForgetPwd
        }
    ]
};