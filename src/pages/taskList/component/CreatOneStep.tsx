import { Icon, Input, Table } from 'antd';
import { If } from 'app/ui';
import { toJS } from 'mobx';
import React from 'react';
import styles from './CreatOneStep.scss';
export interface OneStepProps {
  searchDevice: any;
  changeSnNumber: any;
  snNumber: string;
  errorVisiable: boolean;
  isFind: boolean;
  deviceArr: any;
  delMachineInfo: any;
}
export default class CreatOneStep extends React.Component<OneStepProps> {
  render() {
    const columns = [
      {
        width: 502,
        key: 'sn',
        render: (text: any, record: any) => {
          return (
            <div style={{ display: 'flex' }}>
              <div>
                <img
                  src={record.machine.machine_pic}
                  width={48}
                  height={48}
                  alt=""
                  style={{ border: '1px solid #ccc', borderRadius: '4px' }}
                />
              </div>
              <div style={{ marginLeft: '8px' }}>
                <p className={styles.snNum}>S/N：{record.machine.sn}</p>
                <p className={styles.deviceName}>{record.machine.name}</p>
                <p className={styles.explain}>{record.machine.spec}</p>
              </div>
            </div>
          );
        }
      },
      {
        key: 'out_time',
        render: (text: any, record: any) => {
          return (
            <div className={styles.field}>
              <p className={styles.fieldName}>出货时间</p>
              <p className={styles.fieldValue}>
                {record.machine.out_time ? record.machine.out_time : '-'}
              </p>
              <p className={styles.fieldName}>所属渠道</p>
              <p className={styles.fieldValue2}>
                {record.merchantInfo.channel_name
                  ? record.merchantInfo.channel_name
                  : '-'}
              </p>
            </div>
          );
        }
      },
      {
        key: 'active_time',
        render: (text: any, record: any) => {
          return (
            <div>
              <p className={styles.fieldName}>激活时间</p>
              <p className={styles.fieldValue}>
                {record.machine.active_time ? record.machine.active_time : '-'}
              </p>
              <p className={styles.fieldName}>维修记录</p>
              <p className={styles.fieldValue2}>
                <a
                // onClick={this.showMaintenanceLogModal}
                >
                  {record.repairHistoryList.length}
                </a>
                次
              </p>
            </div>
          );
        }
      },
      {
        key: 'over_time',
        render: (text: any, record: any) => {
          return (
            <div>
              <p className={styles.fieldName}>保修期至</p>
              <p className={styles.fieldValue}>
                {record.machine.over_time ? record.machine.over_time : '-'}
              </p>
              <p className={styles.fieldName}>OS版本</p>
              <p className={styles.fieldValue2}>
                {record.machine.os_version ? record.machine.os_version : '-'}
              </p>
            </div>
          );
        }
      },
      {
        key: 'os',
        render: (text: any, record: any) => {
          return (
            <div style={{ position: 'relative' }}>
              <p className={styles.fieldName} style={{ marginTop: '-34px' }}>
                是否在保
              </p>
              <p className={styles.fieldValue}>
                {['否', '是'][record.machine.is_bao]}
              </p>
              <p
                className={styles.fieldName}
                style={{ position: 'absolute', top: '55px', color: '#ff6900' }}
              >
                {record.isRepairing === 1 ? '正在维修' : ''}
              </p>
            </div>
          );
        }
      },
      {
        // key: 'action4',
        render: (text: any, record: any) => {
          return (
            <div>
              <span
                className={styles.delMachineInfo}
                onClick={() => this.props.delMachineInfo(record.machine.sn)}
              >
                <Icon style={{ fontSize: '18px' }} type="close-circle-o" />
              </span>
            </div>
          );
        }
      }
    ];
    const {
      snNumber,
      changeSnNumber,
      searchDevice,
      errorVisiable,
      isFind,
      deviceArr
    } = this.props;
    return (
      <div>
        <div className={styles.searchDiv}>
          <Input.Search
            className={styles.searchInput}
            placeholder="请输入S/N码添加设备"
            size="large"
            enterButton="+ 添加"
            onChange={changeSnNumber}
            value={snNumber}
            onSearch={searchDevice}
          />
          <div style={{ height: '18px' }}>
            <If data={errorVisiable}>
              <p className={styles.errorMes}>设备已添加，请勿重复操作！</p>
            </If>
            <If data={isFind}>
              <p className={styles.errorMes}>设备未找到</p>
            </If>
          </div>
        </div>
        <If data={toJS(deviceArr).length < 1}>
          <div className={styles.noSnTip}>
            <img src={require('../images/checkDevice.svg')} alt="" />
            <p className={styles.tips}>您还没添加设备，请先输入SN添加设备。</p>
          </div>
        </If>
        <div className={styles.deviceInfo}>
          <Table
            rowKey={(record: any, index: any) => record.machine.sn}
            columns={columns}
            dataSource={toJS(deviceArr)}
            pagination={false}
          />
        </div>
      </div>
    );
  }

}
