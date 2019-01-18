import {
  Breadcrumb,
  Button,
  Input,
  message,
  Modal,
  Popover,
  Transfer
} from 'antd';
import { If, Svg, withCommonFoot , withCommonHead } from 'app/ui';
import { Debounce } from 'lodash-decorators';
import { toJS } from 'mobx';
import { inject, observer } from 'mobx-react';
import React from 'react';
import RoleTable from '../component/RoleTable';
import styles from './role.scss';
const MAX_LENGTH = 9;

@withCommonHead
@withCommonFoot
@inject('RoleStore')
@observer
export default class Role extends React.Component<any> {

  store: any;
  constructor(props: any) {
    super(props);
    this.store = this.props.RoleStore;
    this.store.getRoleListData();
    this.store.getPrivilegeList();
  }

  showModal = () => {
    this.store.roleOptions.isEdit = false;
    this.store.initOptions();
  }

  handleOk = () => {
    if (!this.store.roleOptions.roleName) {
      message.error('请先输入角色名字');
      return;
    }
    if (this.store.roleOptions.targetKeys.length === 0) {
      message.error('请先分配权限');
      return;
    }
    if (this.store.roleOptions.isEdit) {
      this.store.editRole();
    } else {
      this.store.createRole();
    }
    this.store.roleOptions.modalVisable = false;
  }

  handleCancel = () => {
    this.store.roleOptions.modalVisable = false;
  }

  inputChange = (e: any) => {
    this.store.roleOptions.roleName = e.target.value;
  }

  handleChange = (targetKeys: any) => {
    this.store.roleOptions.targetKeys = targetKeys;
  }

  handlePageChange = (page: any) => {
    this.store.roleOptions.page = page;
    this.store.getRoleListData();
  }

  handleSearchChange = (e: any) => {
    this.store.roleOptions.key_words = e.target.value;
    this.store.roleOptions.page = 1;
    this.accordSearchGetRoleList();
  }

  @Debounce(600)
  accordSearchGetRoleList() {
    this.store.getRoleListData();
  }

  editRole = (data: any) => {
    this.store.roleOptions.isEdit = true;
    this.store.initOptions();
    this.store.roleOptions.roleName = data.role;
    this.store.roleOptions.role_id = data.role_id;
    this.store.getDetail();
  }

  operateRole = (data: any) => {
    this.store.operateRole({
      role_id: data.role_id,
      status: data.status2 === 1 ? -1 : 1
    });
  }

  renderModal = () => {
    return (
      <Modal
        title={this.store.roleOptions.isEdit ? '编辑角色' : '新增角色'}
        visible={this.store.roleOptions.modalVisable}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        width="640px"
      >
        <div className={styles.modalContent}>
          <div className={styles.headCon}>
            <div className={styles.w120}>
              <span>角色名称:</span>
            </div>
            <Input
              placeholder="请输入"
              className={styles.input}
              maxLength={MAX_LENGTH}
              onChange={this.inputChange}
              value={this.store.roleOptions.roleName}
            />
            <div className={styles.text}>
              <span>{this.store.roleOptions.roleName.length}/9</span>
            </div>
          </div>
          <span className={styles.privilege}>权限:</span>
          <Transfer
            dataSource={this.store.roleOptions.privilegeListData}
            className={styles.transfer}
            listStyle={{
              width: 170,
              height: 250,
            }}
            operations={['添加权限', '移除权限']}
            targetKeys={this.store.roleOptions.targetKeys}
            onChange={this.handleChange}
            titles={['权限列表', '已有权限列表']}
            locale={{ itemUnit: '项', itemsUnit: '项' }}
            render={(item: any) =>
              <span>{item.description}
                <Popover content={item.desc}>
                  <Svg
                    name="warning"
                    className={styles.warn}
                  />
                </Popover>
              </span>
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
            <Breadcrumb.Item>角色管理</Breadcrumb.Item>
          </Breadcrumb>
          <div className={styles.role}>
            <div className={styles.head}>
              <Input
                placeholder="角色"
                className={styles.inputAccount}
                onChange={this.handleSearchChange}
              />
              <div className={styles.empty} />
              <Button type="primary" onClick={this.showModal}>
                新建角色</Button>
            </div>
            <RoleTable
              dataSource={toJS(this.store.roleListData)}
              total={this.store.roleOptions.count}
              current={this.store.roleOptions.page}
              onChange={this.handlePageChange}
              edit={this.editRole}
              operate={this.operateRole}
            />
          </div>
          <If data={this.store.roleOptions.modalVisable}>
            {this.renderModal()}
          </If>
        </div>
      </div>
    );
  }
}
