import { withConsumer } from 'app/ui';
import React from 'react';
import { demoContext } from '../helpers/context';

@withConsumer(demoContext)
export default class DemoChild extends React.Component<any> {

  render() {
    return(
      <div>
        <span>{this.props.context.test}</span>
        <span>haha</span>
      </div>
    );
  }
}
