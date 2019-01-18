import {
  Breadcrumb,
  Button,
  Input,
  message,
  Modal,
  Select,
  Transfer
} from 'antd';
import { If, withCommonFoot, withCommonHead } from 'app/ui';
import { Debounce } from 'lodash-decorators';
import { toJS } from 'mobx';
import { inject, observer } from 'mobx-react';
import React from 'react';
import AccountTable from '../component/AccountTable';
import styles from './account.scss';

@withCommonHead
@withCommonFoot
@inject('AccountStore', 'GroupStore')
@observer
export default class Account extends React.Component<any, any> {

  store: any;
  constructor(props: any) {
    super(props);
    this.store = this.props.AccountStore;
    this.store.getAccountList();
    this.store.getGroups();
    this.store.getRoles();
  }

  showModal = () => {
    this.store.initOptions();
    this.store.accountOptions.isEdit = false;
    this.store.accountOptions.modalVisable = true;
  }

  handleOk = () => {
    if (!this.store.accountOptions.account) {
      message.error('请先输入账号');
      return;
    }
    if (!this.store.accountOptions.name) {
      message.error('请先输入姓名');
      return;
    }
    if (!this.store.accountOptions.phone) {
      message.error('请先输入手机');
      return;
    }
    if (this.store.accountOptions.isEdit) {
      this.store.editAccount();
    } else {
      this.store.createAccount();
    }
    this.store.accountOptions.modalVisable = false;
  }

  handleCancel = () => {
    this.store.accountOptions.modalVisable = false;
  }

  accountChange = (e: any) => {
    this.store.accountOptions.account = e.target.value;
  }

  nameChange = (e: any) => {
    this.store.accountOptions.name = e.target.value;
  }

  phoneChange = (e: any) => {
    this.store.accountOptions.phone = e.target.value;
  }

  handleChange = (targetKeys: any) => {
    this.store.accountOptions.targetKeys = targetKeys;
  }

  handleChangeSelect = (value: any) => {
    this.store.accountOptions.groupSelectValue = value ;
  }

  serachAccountChange = (e: any) => {
    this.store.accountOptions.key_words = e.target.value;
    this.store.accountOptions.page = 1;
    this.accordSearchChoseGetListData();
  }

  @Debounce(600)
  accordSearchChoseGetListData() {
    this.store.getAccountList();
  }

  handlePaseSizeChange = (page: any) => {
    this.store.accountOptions.page = page;
    this.store.getAccountList();
  }

  editAccount = (data: any) => {
    this.store.accountOptions.isEdit = true;
    this.store.accountOptions.modalVisable = true;
    this.store.getAccountDetail({a_id: data.a_id});
  }

  operateAccount = (data: any) => {
    this.store.operateAccount({a_id: data.a_id,
      status: data.status === 1 ? -1 : 1});
  }

  renderGroup = () => {
    return (
      <div className={styles.headCon}>
        <div className={styles.w120}>
          <span>组别:</span>
        </div>
        <Select
          className={styles.select}
          onChange={this.handleChangeSelect}
          placeholder="请选择"
          mode="multiple"
          value={this.store.accountOptions.groupSelectValue}
        >
          {
            this.store.accountOptions.groupData.map(
              (item: any) =>
                <Select.Option value={item.g_id} key={item.g_id}>
                  {item.g_name}
                </Select.Option>
            )
          }
        </Select>
      </div>
    );
  }

  renderInputItem = ({
    name, placeholder, callBack, value,
    disabled = false, maxLength }: any) => {
    return (
      <div className={styles.headCon}>
        <div className={styles.w120}>
          <span>{name}</span>
        </div>
        <Input
          placeholder={placeholder}
          className={styles.input}
          onChange={callBack}
          value={value}
          disabled={disabled}
          maxLength={maxLength}
        />
      </div>
    );
  }

  renderModal = () => {
    return (
      <Modal
        title={this.store.accountOptions.isEdit ? '编辑账号' : '新增账号'}
        visible={this.store.accountOptions.modalVisable}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        width="640px"
      >
        <div className={styles.modalContent}>
          {this.renderInputItem({
            name: '账号:',
            placeholder: '可输入字母,数字,长度不超过20位',
            callBack: this.accountChange,
            value: this.store.accountOptions.account,
            disabled: this.store.accountOptions.isEdit,
            maxLength: 20
          })}
          {this.renderInputItem({
            name: '姓名:',
            placeholder: '请输入',
            callBack: this.nameChange,
            value: this.store.accountOptions.name
          })}
          {this.renderInputItem({
            name: '手机:',
            placeholder: '请输入11位手机号',
            callBack: this.phoneChange,
            value: this.store.accountOptions.phone,
            maxLength: 11
          })}
          {this.renderGroup()}
          <span className={styles.privilege}>角色:</span>
          <Transfer
            dataSource={this.store.accountOptions.transferData}
            className={styles.transfer}
            listStyle={{
              width: 170,
              height: 250,
            }}
            operations={['添加角色', '移除角色']}
            targetKeys={this.store.accountOptions.targetKeys}
            onChange={this.handleChange}
            titles={['角色列表', '已有角色列表']}
            locale={{ itemUnit: '项', itemsUnit: '项' }}
            render={item =>
              <span>{item.description}</span>
            }
          />
        </div>
      </Modal>);
  }

  render() {

    return (
      <div className={styles.container}>
        <div className={styles.content} >
          <Breadcrumb>
            <Breadcrumb.Item>系统设置</Breadcrumb.Item>
            <Breadcrumb.Item>账户管理</Breadcrumb.Item>
          </Breadcrumb>
          <div className={styles.role}>
            <div className={styles.head}>
              <Input
                placeholder="账号/姓名"
                className={styles.inputAccount}
                onChange={this.serachAccountChange}
              />
              <div className={styles.empty} />
              <Button type="primary" onClick={this.showModal}>
                新建账户</Button>
            </div>
            <AccountTable
              dataSource={toJS(this.store.accountOptions.listData)}
              total={this.store.accountOptions.count}
              current={this.store.accountOptions.page}
              onChange={this.handlePaseSizeChange}
              edit={this.editAccount}
              operate={this.operateAccount}
            />
          </div>
          <If data={this.store.accountOptions.modalVisable}>
            {this.renderModal()}
          </If>
        </div>
      </div>
    );
  }
}
