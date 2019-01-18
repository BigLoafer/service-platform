import { Dropdown, Icon, Input, Menu, Modal, Popover, Upload } from 'antd';
import { logout } from 'app/services';
import { If } from 'app/ui';
import { Svg } from 'app/ui/svg';
import { inject, observer } from 'mobx-react';
import React from 'react';
import { withRouter } from 'react-router-dom';
import styles from './Head.scss';
const SETTINGINDEX = 1;

const InputItem = (props: any) => (
  <div className={styles.inputItemCon}>
    <div className={styles.nameCon}>
      <span>{props.name}</span>
    </div>
    <div className={styles.inputCon}>
      <Input
        value={props.value}
        className={styles.input}
        disabled={true}
      />
    </div>
  </div>);

@inject('GroupStore')
@observer
class Head extends React.Component<any, any> {
  
  store: any;
  tabData: any [] ;
  constructor(props: any) {
    super(props);
    this.store = this.props.GroupStore;
    this.init();
  }

   componentDidMount() {
    this.store.getUserInfo();
  }

  init = () => {
   this.store.getUserPrivilege({apis: ['/station/setting/stationEdit']});
  }

  _clickItem = (pos: any, extra: any = 0) => {
    const { history } = this.props;
    if (pos === SETTINGINDEX) {
      switch (extra) {
        case 1:
          history.push('/systemSetting/site');
          break;
        case 2:
          history.push('/systemSetting/group');
          break;
        case 3:
          history.push('/systemSetting/role');
          break;
        case 4:
          history.push('/systemSetting/account');
          break;

        default:
          break;
      }
    } else {
      history.push('/taskList');
    }

  }
  renderTab = () => {

    const content = (
      <div>
        <span
          className={styles.site}
          onClick={() => this._clickItem(SETTINGINDEX, 1)}
        >站点设置
        </span>
        <span
          className={styles.site}
          onClick={() => this._clickItem(SETTINGINDEX, 2)}
        >组别管理
        </span>
        <span
          className={styles.site}
          onClick={() => this._clickItem(SETTINGINDEX, 3)}
        >角色管理
        </span>
        <span
          className={styles.site}
          onClick={() => this._clickItem(SETTINGINDEX, 4)}
        >账户管理
        </span>
      </div>
    );
    return (
      this.store.headData.tabData.map((item: any, index: any) => {
        if (item.desc === '系统设置') {
          return (
            <div
              className={styles.tabItemCon}
              key={index}
            >
              <Svg
                name={item.iconName}
                className={index === 0 ? styles.taskIcon :
                  styles.taskIconMargin}
              />
              <Popover content={content} >
                <span
                  className={item.selected ?
                    styles.taskTextWhite : styles.taskText}
                >
                  {item.desc}
                </span>
              </Popover>
            </div >
          );
        } else {
          return (
            <div
              className={styles.tabItemCon}
              key={index}
              onClick={() => this._clickItem(index)}
            >
              <Svg
                name={item.iconName}
                className={index === 0 ? styles.taskIcon :
                  styles.taskIconMargin}
              />
              <span
                className={item.selected ?
                  styles.taskTextWhite : styles.taskText}
              >
                {item.desc}
              </span>
            </div>
          );
        }
      }
      )
    );
  }

  updatePwd = () => {
    const { history } = this.props;
    history.push('/updatePwd?edit=1');
  }

  updateAccount = () => {
    this.store.headData.modalVisible = true;
  }

  exit = () => {
    logout();
    const { history } = this.props;
    history.replace('/login');
  }

  updateAcountOk = async () => {
    const status = await this.store.editImage(
      { imag_url: this.store.headData.picUrl });
    if ('success' === status) {
      this.store.headData.modalVisible = false;
    }
  }

  updateAcountCancle = () => {
    this.store.headData.modalVisible = false;
  }

  deletePic = () => {
    this.store.headData.picUrl = '';
  }

  renderModal = () => {
    const {account, name, phone, groups, roles}
    = this.props.GroupStore.userInfo;
    const optionsPic = {
      name: 'filePic',
      beforeUpload: async (file: any) => {
        const url = await this.props.GroupStore.uploadFile(file);
        this.store.headData.picUrl = url;
        return false;
      },
      accept: 'image/*',
      fileList: []
    };

    return (
      <Modal
        onOk={this.updateAcountOk}
        onCancel={this.updateAcountCancle}
        title="编辑账号"
        visible={this.store.headData.modalVisible}
        width={640}
      >
        <InputItem name="账号:" value={account} />
        <InputItem name="姓名:" value={name} />
        <InputItem name="手机:" value={phone} />
        <InputItem name="组别:" value={groups} />
        <InputItem name="角色:" value={roles}/>
        <span className={styles.uploadText}>上传图像:</span>

        <div className={styles.bottom}>
          <If data={this.store.headData.picUrl}>
            <Upload {...optionsPic}>
              <div className={styles.imgCon}>
                <img 
                  src={this.store.headData.picUrl} 
                  alt="" 
                  className={styles.img} 
                />
              </div>
            </Upload>
          </If>
          <If data={!this.store.headData.picUrl}>
            <Upload {...optionsPic}>
              <div className={styles.uploadCon}>
                <Icon type="plus" />
                <div>上传</div>
              </div>
            </Upload>
          </If>
        </div>
      </Modal>
    );

  }

  render() {
    const {name} = this.props.GroupStore.userInfo;
    const menu = (
      <Menu>
        <Menu.Item>
          <span onClick={this.updatePwd}>修改密码</span>
        </Menu.Item>
        <Menu.Item>
          <span onClick={this.updateAccount}>编辑账号</span>
        </Menu.Item>
        <Menu.Item>
          <span onClick={this.exit}>退出平台</span>
        </Menu.Item>
      </Menu>
    );
    return (
      <div className={styles.container}>
        <div className={styles.headContent}>
          <Svg name="logo" className={styles.logo} />
          <span className={styles.service}>服务平台</span>
          <div className={styles.tabContent}>
            {this.renderTab()}
          </div>
          <div className={styles.empty} />
          <div className={styles.account}>
            <Dropdown overlay={menu}>
              <span className={styles.accountText}>
                {name} <Icon type="down" /></span>
            </Dropdown>
          </div>
        </div>
        {this.renderModal()}
      </div>
    );
  }
}

export default withRouter(Head);
