
export const If = (props: any) => {
  if (!_.isObject(props.children)) {
    throw new Error('If只接受对象，不接受数组');
  }
  return !!props.data ? props.children : null;
};

export * from './svg';
export * from './PageLoadingComponent';
export * from './hoc';
