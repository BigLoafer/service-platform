import { Icon, Input } from 'antd';
import { If } from 'app/ui';
import React from 'react';
import styles from './Edit.scss';
export interface EditProps {
  visible: boolean;
  defaultVal: any;
  showInputFun: any;
  changeFun: any;
  cancelFun: any;
  confirmEditFun: any;
  status: any;
  upgrade?: any;
}
export default class Edit extends React.Component<EditProps> {
  render() {
    const {
      visible,
      defaultVal,
      changeFun,
      cancelFun,
      confirmEditFun,
      showInputFun,
      status,
      upgrade
    } = this.props;
    return (
      <div>
        <If data={visible === false}>
          <div className={styles.swspCte}>
            <span>{defaultVal} </span>
            <If data={+status !== 11 && upgrade !== 1}>
              <a className={styles.swspButt} onClick={showInputFun}>
                <Icon type="edit" style={{ color: 'rgba(0,0,0,0.65)' }} />
              </a>
            </If>
          </div>
        </If>
        <If data={visible === true}>
          <div className={styles.swspCte}>
            <Input
              defaultValue={defaultVal}
              style={{ width: '180px', minWidth: '170px' }}
              onChange={changeFun}
            />
            <a className={styles.swspButt} onClick={cancelFun}>
              取消
            </a>
            <a className={styles.swspButt} onClick={confirmEditFun}>
              确认
            </a>
          </div>
        </If>
      </div>
    );
  }
}
