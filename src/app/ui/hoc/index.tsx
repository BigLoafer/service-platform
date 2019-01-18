import MainLayout from 'app/layout/MainLayout';
import _ from 'lodash';
import React from 'react';
import styles from './index.scss';

export const withCommonHead: any = (WarppedComponent: any) => {
  return class MainHeadProvider extends React.Component {
    render() {
      return (
        <MainLayout>
          <WarppedComponent {...this.props} />
        </MainLayout>
      );
    }
  };
};

export const withCommonFoot: any = (WarppedComponent: any) => {
  // tslint:disable-next-line:max-classes-per-file
  return class MainFootProvider extends React.Component {
    render() {
      return (
        <div >
          <div className={styles.contentContainer}>
            <WarppedComponent {...this.props} />
          </div>
          <div className={styles.foot}>
            ️️️️©2019 上海商米科技有限公司
          </div>
        </div>
      );
    }
  };
};

export const withProvider: any = (
  { Provider }: any, initState = {}) => (WarppedComponent: any) => {
    // tslint:disable-next-line:max-classes-per-file
    return class extends React.Component {
      state = initState;
      updateState = (newState: any) => this.setState(newState);
      render() {
        return (
          <Provider value={{ ...this.state, updateState: this.updateState }}>
            <WarppedComponent {...this.props} />
          </Provider>
        );
      }
    };
  };

export const withConsumer: any = (
  { Consumer }: any) => (WarppedComponent: any) => {
  // tslint:disable-next-line:max-classes-per-file
  return class extends React.Component {
    render() {
      return (
        <Consumer>
          {(data: any) => <WarppedComponent context={data} {...this.props} />}
        </Consumer>
      );
    }
  };
};

export const timeout: any = (time: number = 0) => {
  return (target: any, key: any, descriptor: any): any => {
      const originalMethod = descriptor.value;
      descriptor.value = function(...args: any) {
          setTimeout(
            () => {
              // tslint:disable-next-line:no-invalid-this
              originalMethod.apply(this, args);
         }, time);
      };
      return descriptor;
  };
};
