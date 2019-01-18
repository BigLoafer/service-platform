import { Cascader, Icon, Input } from 'antd';
import { If } from 'app/ui';
import React from 'react';
import styles from './EditAddress.scss';
export interface EditAddressProps {
  visible: boolean;
  addressInfo: any;
  options: any;
  defaultVal: any;
  showInputFun: any;
  changeAddressFun: any;
  cancelAddressFun: any;
  confirmEditFun: any;
  changeDetialAddress: any;
  status: any;
  upgrade?: any;
  addressType: any;
}
export default class EditAddress extends React.Component<EditAddressProps> {
  render() {
    const {
      visible,
      addressInfo,
      options,
      defaultVal,
      showInputFun,
      changeAddressFun,
      cancelAddressFun,
      confirmEditFun,
      changeDetialAddress,
      status,
      upgrade,
      addressType
    } = this.props;
    return (
      <div>
        <If data={visible === false}>
          <div className={styles.swspCte}>
            <If data={+addressType === 1}>
              <span>
                {addressInfo.maintenance_province}
                {addressInfo.maintenance_city}
                {addressInfo.maintenance_area}
                {addressInfo.maintenance_address}
              </span>
            </If>
            <If data={+addressType === 2}>
              <span>
                {addressInfo.receive_province}
                {addressInfo.receive_city}
                {addressInfo.receive_area}
                {addressInfo.receive_address}
              </span>
            </If>
            <If data={+status !== 11 && upgrade !== 1}>
              <a className={styles.swspButt} onClick={showInputFun}>
                <Icon type="edit" style={{ color: 'rgba(0,0,0,0.65)' }} />
              </a>
            </If>
          </div>
        </If>
        <If data={visible}>
          <div className={styles.swspCte}>
            <Cascader
              style={{
                width: '200px',
                height: '30px',
                minWidth: '100px'
              }}
              options={options}
              size="large"
              placeholder="请选择区域"
              value={defaultVal}
              onChange={changeAddressFun}
            />
            <If data={+addressType === 1}>
              <Input
                defaultValue={addressInfo.maintenance_address}
                style={{
                  width: '256px',
                  marginTop: '-1px',
                  marginLeft: '16px',
                  minWidth: '170px'
                }}
                onChange={changeDetialAddress}
              />
            </If>
            <If data={+addressType === 2}>
              <Input
                defaultValue={addressInfo.receive_address}
                style={{
                  width: '256px',
                  marginTop: '-1px',
                  marginLeft: '16px',
                  minWidth: '170px'
                }}
                onChange={changeDetialAddress}
              />
            </If>
            <a className={styles.swspButt} onClick={cancelAddressFun}>
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
