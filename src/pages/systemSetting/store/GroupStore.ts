import { message } from 'antd';
import { setUserInfo } from 'app/services';
import { action, observable } from 'mobx';
import {
  createGroup ,
  editGroup,
  editImage,
  getGroupDetail,
  getGroupList,
  getGroupMachine,
  getUserDetail,
  getUserPrivilege,
  operateGroup,
  uploadPic
} from '../apis';

class GroupStore {

  @observable groupData = {
    count:  0,
    group_list: [],
    isEdit: false,
    groupName: '',
    groupMachine: '',
    groupSelectMachine: [],
    groupSelectMachine_page: [],
    group_id: '',
    key_words: '',
    page: 1,
    modalVisible: false,
    hasInput: 0,
  };
  @observable userInfo: any = {};
  @observable headData = {
    tabData: [
      { iconName: 'task', desc: '任务列表', selected: false }
    ],
    modalVisible: false,
    picUrl: '',
  };

  @action
  getGroupList = async () => {
      try {
        const json: any = await getGroupList(this.groupData);
        this.groupData.group_list = json.data.group_list.map((item: any ) => {
          return {...item, ...{operation: item.status}};
        });
        this.groupData.count = json.data.count;
      } catch (error) {
        //
      }
  }

  formatGroupData = (data: any) => {
    return data.map((item: any, index: any) => {
      const { category } = item;
      const { category_id } = item;
      const { machines } = item;
      const children = machines.map((machine: any, machineIndex: any) => {
        const {m_name} = machine;
        const {m_id} = machine;
        return {
          title: m_name,
          value: `c${m_id}`,
          key: `c${m_id}`
        };
      });
      return {
        title: category,
        value: `f${category_id}`,
        key: `f${category_id}`,
        // tslint:disable-next-line:object-shorthand-properties-first
        children
      };
    });
  }

  @action
  getGroupMachine = async () => {
      try {
        const json: any = await getGroupMachine({});
        this.groupData.groupMachine = this.formatGroupData(json.data);
      } catch (error) {
        //
      }
  }

  @action
  getGroupDetail = async(options: any) => {
      try {
        const json: any = await getGroupDetail(options);
        this.groupData.groupSelectMachine_page = json.data.machines.map(
          (item: any) => `c${item}`
        );
        this.groupData.groupSelectMachine = json.data.machines;
        this.groupData.group_id = options.group_id;
      } catch (error) {
        message.error(error.msg);
      }
    }

  @action
  createGroup = async() => {
    try {
      const json = await createGroup(this.groupData);
      this.getGroupList();
      message.success('操作成功');
    } catch (error) {
      message.error(error.msg);
    }
  }

  @action
  editGroup = async() => {
    try {
      const json = await editGroup(this.groupData);
      this.getGroupList();
      message.success('操作成功');
    } catch (error) {
      message.error(error.msg);
    }
  }

  @action
  operateGroup = async(options: object) => {
    try {
      const json = await operateGroup(options);
      this.getGroupList();
      message.success('操作成功');
    } catch (error) {
      message.error(error.msg);
    }
  }

  @action
  uploadFile = async(file: any) => {
    try {
      const json: any = await uploadPic(file);
      message.success('上传成功');
      return json.data.url;
    } catch (error) {
      message.error(error.msg);
    }
  }

  @action
  editImage = async(options: any) => {
    try {
      const json: any = await editImage(options);
      message.success(json.msg);
      return 'success';
    } catch (error) {
      message.error(error.msg);
    }
  }

  @action
  getUserInfo = async() => {
    try {
      const json: any = await getUserDetail();
      this.userInfo = json.data.info;
      this.headData.picUrl = json.data.info.image_url;
      setUserInfo(json.data.info);
    } catch (error) {
      message.error(error.msg);
    }
  }

  @action
  getUserPrivilege = async(options: any) => {
    try {
      const json: any = await getUserPrivilege(options);
      const obj = json.data.find(
        (item: any) => item.api === '/station/setting/stationEdit');
      if (obj.status === 1) {
        this.headData.tabData = [
          { iconName: 'task', desc: '任务列表', selected: false },
          { iconName: 'setting', desc: '系统设置', selected: false }
        ];
        if (window.location.pathname.includes('systemSetting')) {
          this.headData.tabData[1].selected = true;
          this.headData.tabData[0].selected = false;
        } else {
          this.headData.tabData[1].selected = false;
          this.headData.tabData[0].selected = true;
        }
      } else {
        this.headData.tabData = [
          { iconName: 'task', desc: '任务列表', selected: false },
        ];
        if (window.location.pathname === '/taskList') {
          this.headData.tabData[0].selected = true;
        }
      }
     
    } catch (error) {
      message.error(error.msg);
    }
  }

}
export default new GroupStore();
