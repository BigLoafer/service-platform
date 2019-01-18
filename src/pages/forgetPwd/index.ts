import { asyncLoad } from 'app/loadable';
import forgetPwdStore from './store/ForgetPwdStore';

const ForgetPwd = asyncLoad(() => import('./container/ForgetPwd'));

export const Forget = {
    routes: [
        {
            path: '/forgetPwd',
            exact: true,
            component: ForgetPwd
        }
    ],
    store:{forgetPwdStore}
};