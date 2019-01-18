import { message } from 'antd';
import _ from 'lodash';
import { action, observable } from 'mobx';
import {
  createAccount,
  editAccount,
  getAccountDetail,
  getAccountList,
  getGroups,
  getRoles,
  operateAccount
} from '../apis';

class AccountStore {
  @observable accountOptions = {
    isEdit: false,
    modalVisable: false,
    listData: [],
    page: 1,
    key_words: '',
    count: 0,
    account: '',
    name: '',
    phone: '',
    groupData: [],
    transferData: [],
    targetKeys: [],
    groupSelectValue: [],
    a_id: ''
  };

  formateRoleData(data: any) {
    return data.map((item: any) => {
      return {
        ...item,
        ...{key: item.r_id, description: item.r_name}
      };
    });
  }

  @action
  initOptions = () => {
    this.accountOptions.name = '';
    this.accountOptions.account = '';
    this.accountOptions.phone = '';
    this.accountOptions.groupSelectValue.length = 0;
    this.accountOptions.targetKeys.length = 0;
  }

  @action
  getAccountList = async () => {
    try {
      const json: any = await getAccountList(this.accountOptions);
      this.accountOptions.count = json.data.count;
      this.accountOptions.listData = json.data.accounts.map(
        (item: any, index: any) => {
          return {
            ...item,
            ...{status2: item.status}
          };
        }
      );
    } catch (error) {
      message.error(error.msg);
    }
  };

  @action
  getAccountDetail = async (options: any) => {
    try {
      const json: any = await getAccountDetail(options);
      this.accountOptions.name = json.data.name;
      this.accountOptions.phone = json.data.phone;
      this.accountOptions.account = json.data.account;
      this.accountOptions.a_id = json.data.a_id;
      this.accountOptions.groupSelectValue =
      json.data.group.map((item: any) => item.g_id);
      this.accountOptions.targetKeys = json.data.roles.map(
        (item: any) => item.r_id
      );
    } catch (error) {
      message.error(error.msg);
    }
  };

  @action
  createAccount = async () => {
    try {
      const json: any = await createAccount(this.accountOptions);
      message.success('创建成功');
      this.getAccountList();
    } catch (error) {
      message.error(error.msg);
    }
  };

  @action
  editAccount = async () => {
    try {
      const json: any = await editAccount(this.accountOptions);
      message.success('操作成功');
      this.getAccountList();
    } catch (error) {
      message.error(error.msg);
    }
  };

  @action
  operateAccount = async (options: any) => {
    try {
      const json: any = await operateAccount(options);
      message.success('操作成功');
      this.getAccountList();
    } catch (error) {
      message.error(error.msg);
    }
  };

  @action
  getGroups = async () => {
    try {
      const json: any = await getGroups();
      this.accountOptions.groupData = json.data;
    } catch (error) {
      message.error(error.msg);
    }
  };

  @action
  getRoles = async () => {
    try {
      const json: any = await getRoles();
      this.accountOptions.transferData = this.formateRoleData(json.data);
    } catch (error) {
      message.error(error.msg);
    }
  };
}
export default new AccountStore();
