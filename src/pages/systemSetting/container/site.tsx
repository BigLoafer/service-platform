import { Breadcrumb, Button, Cascader, Input, message, TimePicker } from 'antd';
import { withCommonFoot, withCommonHead } from 'app/ui';
import { toJS } from 'mobx';
import { inject, observer } from 'mobx-react';
import moment from 'moment';
import React from 'react';
import styles from './site.scss';
const { TextArea } = Input;

@withCommonHead
@withCommonFoot
@inject('SiteStore')
@observer
export default class Site extends React.Component<any, any> {
  store: any;
  options: {};

  constructor(props: any) {
    super(props);
    this.store = this.props.SiteStore;
    this.store.getAddress({});
    this.store.getSiteDetail({});
  }

  companyPhoneChange = (e: any) => {
    this.store.siteData.comp_phone = e.target.value ;
  }

  startDateChange = (time: any, timeString: any) => {
    const startTime = moment(timeString, 'HH:mm:ss').valueOf() / 1000;
    this.store.siteData.time_start = startTime;
  }
  endDateChange = (time: any, timeString: any) => {
    const endTime = moment(timeString, 'HH:mm:ss').valueOf() / 1000;
    this.store.siteData.time_end = endTime;
  }

  peopleChange = (e: any) => {
    this.store.siteData.contacts = e.target.value;
  }

  peoplePhoneChange = (e: any) => {
    this.store.siteData.cont_phone = e.target.value;
  }

  onAddressChange = (value: any, selectedOptions: any) => {
    this.store.changePcaAddress(value, selectedOptions);
  }

  addressDetailChange = (e: any) => {
    this.store.siteData.address = e.target.value;
  }

  traficChange = (e: any) => {
    this.store.siteData.traffics = e.target.value;
  }

  submit = () => {
    if (!this.store.siteData.comp_phone) {
      message.error('请先输入公司电话');
      return ;
    }
    if (!this.store.siteData.contacts) {
      message.error('请先输入联系人');
      return ;
    }
    if (!this.store.siteData.cont_phone) {
      message.error('请先输入联系人电话');
      return ;
    }
    if (!this.store.siteData.address) {
      message.error('请先输入地址');
      return ;
    }
    if (!this.store.siteData.traffics) {
      message.error('请先输入交通方式');
      return ;
    }
    this.store.submitStationInfo();
  }

  renderInputItem = (
    { name,
      placeholder,
      callBack,
      value,
      disabled }: any) => {
    return (
      <div className={styles.inputItemCon}>
        <div className={styles.nameCon}>
          <span>{name}</span>
        </div>
        <div className={styles.inputCon}>
          <Input
            placeholder={placeholder}
            onChange={callBack}
            value={value}
            className={styles.input}
            disabled={disabled}
          />
        </div>
      </div>
    );
  }

  renderDatePicker = () => {
    const dateFormat = 'HH:mm:ss';
    return (
      <div className={styles.inputItemCon}>
        <div className={styles.nameCon}>
          <span>营业时间:</span>
        </div>
        <div className={styles.inputCon}>
          <TimePicker
            allowEmpty={false}
            onChange={this.startDateChange}
            value={moment.unix(this.store.siteData.time_start)}
            format={dateFormat}
            className={styles.timePicker}
          />
          <div className={styles.line}/>
          <TimePicker
            allowEmpty={false}
            onChange={this.endDateChange}
            value={moment.unix(this.store.siteData.time_end)}
            format={dateFormat}
            className={styles.timePicker}
          />
        </div>
      </div>
    );
  }

  renderArea = (data: any) => {
    return (
      <div className={styles.inputItemCon}>
        <div className={styles.nameCon}>
          <span>区域:</span>
        </div>
        <div className={styles.inputCon}>
          <Cascader
            options={toJS(this.store.addressData)}
            onChange={this.onAddressChange}
            placeholder="请选择省市区"
            className={styles.cascader}
            value={data}
            allowClear={false}
          />
        </div>
      </div>
    );
  }

  renderTraffic = (str: any) => {
    return (
      <div className={styles.inputItemCon}>
        <div className={styles.nameCon}>
          <span>交通方式:</span>
        </div>
        <div className={styles.inputCon}>
          <TextArea
            placeholder="请输入"
            onChange={this.traficChange}
            value= {str}
            className={styles.textArea}
          />
        </div>
      </div>
    );
  }

  renderBtn = () => {
    return (
      <div className={styles.btnCon}>
        <Button
          className={styles.btn}
          onClick={this.submit}
          type="primary"
          size="large"
        >提交
        </Button>
      </div>
    );
  }

  render() {

    const {station_no,
           name,
           level,
           support_mas,
           comp_phone,
           time_start,
           time_end,
           contacts,
           cont_phone,
           country,
           p_id,
           c_id,
           a_id,
           address,
           traffics,
           p_name,
           c_name,
           a_name
          } = this.store.siteData;
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <Breadcrumb>
            <Breadcrumb.Item>系统设置</Breadcrumb.Item>
            <Breadcrumb.Item>站点设置</Breadcrumb.Item>
          </Breadcrumb>
          <div className={styles.site}>
            {this.renderInputItem({
              name: 'ID:',
              placeholder: '请输入',
              callBack: null,
              value: station_no,
              disabled: true
            })}
            {this.renderInputItem({
              name: '名称:',
              placeholder: '请输入',
              callBack: null,
              value: name,
              disabled: true
            })}
            {this.renderInputItem({
              name: '站点级别:',
              placeholder: '请输入',
              callBack: null,
              value: level,
              disabled: true
            })}
            {this.renderInputItem({
              name: '支持系列:',
              placeholder: '请输入',
              callBack: null,
              value: support_mas,
              disabled: true
            })}
            {this.renderInputItem({
              name: '公司电话:',
              placeholder: '请输入',
              callBack: this.companyPhoneChange,
              value: comp_phone,
              disabled: false
            })}
            {this.renderDatePicker()}
            {this.renderInputItem({
              name: '联系人:',
              placeholder: '请输入',
              callBack: this.peopleChange,
              value: contacts,
              disabled: false
            })}
            {this.renderInputItem({
              name: '联系人电话:',
              placeholder: '请输入',
              callBack: this.peoplePhoneChange,
              value: cont_phone,
              disabled: false
            })}
            {this.renderInputItem({
              name: '国家/地区:',
              placeholder: '请输入',
              callBack: null,
              value: country,
              disabled: true
            })}
            {this.renderArea([p_name, c_name, a_name])}
            {this.renderInputItem({
              name: '地址:',
              placeholder: '请输入',
              callBack: this.addressDetailChange,
              value: address,
              disabled: false
            })}
            {this.renderTraffic(traffics)}
            {this.renderBtn()}
          </div>
        </div>
      </div>
    );
  }
}
