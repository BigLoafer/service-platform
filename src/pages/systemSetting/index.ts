import { asyncLoad } from 'app/loadable';
import AccountStore from './store/AccountStore';
import GroupStore from './store/GroupStore';
import RoleStore from './store/RoleStore';
import SiteStore from './store/SiteStore';

const Account = asyncLoad(() => import('./container/account'));
const Site = asyncLoad(() => import('./container/site'));
const Group = asyncLoad(() => import('./container/group'));
const Role = asyncLoad(() => import('./container/role'));

export const Setting = {
    routes: [
        {
            path: '/systemSetting/account',
            exact: true,
            component: Account
        },
        {
            path: '/systemSetting/site',
            exact: true,
            component: Site
        },
        {
            path: '/systemSetting/group',
            exact: true,
            component: Group
        },
        {
            path: '/systemSetting/role',
            exact: true,
            component: Role
        }
    ],
    store: {SiteStore, GroupStore, RoleStore, AccountStore}
};
