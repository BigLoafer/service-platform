import { Skeleton } from 'antd';
import React from 'react';
import ErrorPage from './ErrorPage';

const PageLoadingComponent = ({ isLoading, error, pastDelay }: any) => {
  if (pastDelay) {
    return (
      <div>
        <Skeleton active={true} />
      </div>
    );
  } else if (error) {
    return <ErrorPage />;
  } else {
    return null;
  }
};
export default PageLoadingComponent;
