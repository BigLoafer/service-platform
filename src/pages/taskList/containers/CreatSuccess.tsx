import { Button } from 'antd';
import { withCommonHead } from 'app/ui';
import React from 'react';
import styles from './CreatSuccess.scss';
@withCommonHead
export default class CreatSuccess extends React.Component<any> {
  render() {
    const { task_info } = this.props.location.state;
    const obj = task_info[0];
    return (
      <div className={styles.panel}>
        <div className={styles.container}>
          <div style={{ textAlign: 'center' }}>
            <img
              className={styles.iconStyle}
              src={require('../images/success.svg')}
              alt=""
            />
          </div>
          <div className={styles.successText}>新建成功</div>
          <div className={styles.taskNo}>
            <div className={styles.tasktext}>任务号</div>
            <div className={styles.taskVal}>{obj.task_number}</div>
          </div>
          <div className={styles.btnGroup}>
            <span>您还可以：</span>
            <Button>
              <a href={`/taskList/CreateWorkOrder`}>继续创建</a>
            </Button>
            <Button >
              <a target="_blank" href={`/taskList/taskDetial/${obj.task_id}`}>
                查看详情
              </a>
            </Button>
          </div>
        </div>
      </div>
    );
  }
}
