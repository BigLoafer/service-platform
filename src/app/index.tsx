import { LocaleProvider } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import { onUnhandledrejection, onWindowError } from 'app/error';
import PrivateRoute from 'app/route';
import { Provider } from 'mobx-react';
import moment from 'moment';
import 'moment/locale/zh-cn';
import React from 'react';
import {
  BrowserRouter as Router,
  Redirect,
  Route ,
  Switch
} from 'react-router-dom';

import * as Sentry from '@sentry/browser';
import * as modules from '../pages';
import { fetchToolServer } from './fetch';

// antd日期类控件的国际化
moment.locale('zh-cn');

const routes = [] as any;
let rootStore = {};

Object.keys(modules).forEach((moduleKey) => {
  modules[moduleKey].routes.forEach((item: any) => routes.push(item));
  rootStore = { ...rootStore, ...modules[moduleKey].store };
});

function renderRoutes(data: any) {
  return data.map((item: any, index: any) => {
    const C = item.component;
    // tslint:disable-next-line:max-line-length
    return ( item.path === '/login' || item.path === '/forgetPwd' || item.path === '/updatePwd' ?
      <Route
        key={index}
        exact={item.exact}
        component={C}
        path={item.path}
      /> :
      <PrivateRoute
        key={index}
        exact={item.exact}
        component={C}
        path={item.path}
      />
    );
  });
}
function initSentry() {
  Sentry.init({
    dsn: 'https://d021ca8739b4404a98b2f61e48aabaf0@sentry.io/1358247'
  });
}

function appendScript(url: any) {
  const ns = document.createElement('script');
  ns.src = url;
  document.body.appendChild(ns);
}

function monitorError() {
  window.onerror = (errorMsg, scriptURI, lineNumber, 
                    columnNumber, errorObj) => { onWindowError(errorObj); } ;
  window.addEventListener('unhandledrejection', (event: any) => {
      onUnhandledrejection(event);
  });
}

async function appendIconfont() {
  if (process.env.NODE_ENV === 'production') {
    // 这里的地址
    const path = process.env.SP_ICONFONT_PROD_PATH &&
      process.env.SP_ICONFONT_PROD_PATH.replace('./build/', '');
    appendScript(`/${path}`);
  } else {
    const pid = process.env.SP_ICONFONT_PID;
    // https://webtool.sunmi.com/iconfont-genorator
    const url = await fetchToolServer(`/iconfont-genorator?pid=${pid}`);
    appendScript(url);
  }
}
const Pages = () => {
  return (
    <LocaleProvider locale={zh_CN}>
      <Provider {...rootStore}>
        <Router>
          <Switch>
            {renderRoutes(routes)}
            <Redirect from="/" to="/taskList" />
          </Switch>
        </Router>
      </Provider>
    </LocaleProvider>
  );
};
initSentry();
appendIconfont();
monitorError();

export default Pages;
