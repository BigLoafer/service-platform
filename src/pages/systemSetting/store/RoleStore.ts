import { message } from 'antd';
import _ from 'lodash';
import { action, observable } from 'mobx';
import {
  createRole,
  editRole,
  getPrivilegeList,
  getRoleList,
  getRolesDetail,
  operateRole
} from '../apis';

class RoleStore {
  @observable roleListData = [];
  @observable roleOptions = {
    page: 1,
    key_words: '',
    modalVisable: false,
    roleName: '',
    privilegeListData: [],
    targetKeys: [] as any,
    count: 0,
    isEdit: false,
    role_id: '',
  };

  formatePrivilegeListData(data: any) {
    return data.map((item: any) => {
      return {
        ...item,
        ...{ key: item.p_id, description: item.p_name }
      };
    });
  }

  @action
  initOptions = () => {
    this.roleOptions.targetKeys.length = 0;
    this.roleOptions.roleName = '';
    this.roleOptions.modalVisable = true;
  }

  @action
  getRoleListData = async () => {
    try {
      const json: any = await getRoleList(this.roleOptions);
      this.roleOptions.count = json.data.count;
      this.roleListData = json.data.role_list && json.data.role_list.map(
        (item: any) => {
          return {
            ...item,
            ...{ status2: item.status }
          };
        }
      );
    } catch (error) {
      message.error(error.msg);
    }
  };

  @action
  createRole = async () => {
    try {
      const json = await createRole(this.roleOptions);
      message.success('操作成功');
      this.getRoleListData();
    } catch (error) {
      message.error(error.msg);
    }
  };

  @action
  getPrivilegeList = async () => {
    try {
      const json: any = await getPrivilegeList();
      this.roleOptions.privilegeListData =
        this.formatePrivilegeListData(json.data);
    } catch (error) {
      message.error(error.msg);
    }
  };

  @action
  getDetail = async () => {
    try {
      const json: any = await getRolesDetail(this.roleOptions);
      this.getPrivilegeList();
      const data = json.data.privi_in.map(
        (item: any) => _.pick(item, ['p_id'])
      );
      this.roleOptions.targetKeys = data.map((item: any) => item.p_id);
    } catch (error) {
      message.error(error.msg);
    }
  };

  @action
  editRole = async () => {
    try {
      const json: any = await editRole(this.roleOptions);
      message.success('操作成功');
      this.getRoleListData();
    } catch (error) {
      message.error(error.msg);
    }
  };

  @action
  operateRole = async (options: any) => {
    try {
      const json: any = await operateRole(options);
      message.success('操作成功');
      this.getRoleListData();
    } catch (error) {
      message.error(error.msg);
    }
  };

}

export default new RoleStore();
