import { asyncLoad } from 'app/loadable';
import TaskListStore from './store/TaskListStore';
const TaskList = asyncLoad(() => import('./containers/TaskList'));
const TaskDetial = asyncLoad(() => import('./containers/TaskDetial'));
const CreateWorkOrder = asyncLoad(() => import('./containers/CreateWorkOrder'));
const CreatSuccess = asyncLoad(() => import('./containers/CreatSuccess'));
export const task = {
  routes: [
    {
      path: '/taskList',
      exact: true,
      component: TaskList,
    },
    {
      path: '/taskList/TaskDetial/:taskId',
      exact: true,
      component: TaskDetial,
    },
    {
      path: '/taskList/CreateWorkOrder',
      exact: true,
      component: CreateWorkOrder,
    },
    {
      path: '/taskList/CreatSuccess',
      exact: true,
      component: CreatSuccess,
    }
  ],
  store: { TaskListStore }
};
