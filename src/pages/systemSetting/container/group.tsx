import { Breadcrumb, Button, Input, message, Modal, TreeSelect } from 'antd';
import { If, withCommonFoot, withCommonHead } from 'app/ui';
import { Debounce } from 'lodash-decorators';
import { inject, observer } from 'mobx-react';
import React from 'react';
import GroupTable from '../component/GroupTable';
import styles from './group.scss';
const MAX_LENGTH = 9;
const SHOW_PARENT = TreeSelect.SHOW_PARENT;

@withCommonHead
@withCommonFoot
@inject('GroupStore')
@observer
export default class Group extends React.Component<any, any> {

  store: any;
  constructor(props: any) {
    super(props);
    this.store = this.props.GroupStore;
    this.store.getGroupList();
    this.store.getGroupMachine();
  }

  showModal = () => {
    this.store.groupData.groupName = '';
    this.store.groupData.groupSelectMachine.length = 0;
    this.store.groupData.groupSelectMachine_page.length = 0;
    this.store.groupData.modalVisible = true;
    this.store.groupData.isEdit = false;
  }

  handleOk = () => {
    if (!this.store.groupData.groupName) {
      message.error('请先输入组别名称');
      return;
    }
    if (this.store.groupData.groupSelectMachine.length <= 0) {
      message.error('请先选择分管型号');
      return;
    }
    if (this.store.groupData.isEdit) {
      this.store.editGroup();
    } else {
      this.store.createGroup();
    }
    this.store.groupData.modalVisible = false;
  }

  handleCancel = () => {
    this.store.groupData.modalVisible = false;
  }

  inputChange = (e: any) => {
    this.store.groupData.groupName = e.target.value;
  }

  handleChange = (targetKeys: any) => {
    this.store.options.targetKeys = targetKeys;
  }

  treeChange = (value: any, label: any, extra: any) => {
    this.store.groupData.groupSelectMachine.length = 0;
    this.store.groupData.groupSelectMachine_page = value;
    value.map((item: string) => {
      if (item.includes('f')) {
        const data = this.store.groupData.groupMachine.find(
          (machine: any) => machine.value === item).children;
        data.map((child: any) => {
          this.store.groupData.groupSelectMachine.
            push(child.value.split('c')[1]);
        });
      } else {
        this.store.groupData.groupSelectMachine.
          push(item.split('c')[1]);
      }
    });
  }

  onPageSizeChange = (value: any) => {
    this.store.groupData.page = value;
    this.store.getGroupList();
  }

  searchInputChange = (e: any) => {
    this.store.groupData.key_words = e.target.value;
    this.store.groupData.page = 1;
    this.filterGroupList();
  }

  @Debounce(600)
  filterGroupList() {
    this.store.getGroupList();
  }

  edit = (data: any) => {
    this.store.groupData.isEdit = true;
    this.store.groupData.modalVisible = true;
    this.store.groupData.groupName = data.name;
    this.store.getGroupDetail({ group_id: data.group_id });
  }

  operate = (data: any) => {
    if (data.operation === 1) {
      this.store.operateGroup({ group_id: data.group_id, status: -1 });
    } else {
      this.store.operateGroup({ group_id: data.group_id, status: 1 });
    }
  }

  renderModal = () => {
    return (
      <Modal
        title={this.store.groupData.isEdit ? '编辑组别' : '新增组别'}
        visible={this.store.groupData.modalVisible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        width="640px"
        style={{ borderRadius: '10' }}
      >
        <div className={styles.modalContent}>
          <div className={styles.headCon}>
            <div className={styles.w120}>
              <span>组别名称:</span>
            </div>
            <Input
              placeholder="请输入"
              className={styles.input}
              maxLength={MAX_LENGTH}
              onChange={this.inputChange}
              value={
                this.store.groupData.groupName
              }
            />
            <div className={styles.text}>
              <span>{this.store.groupData.groupName.length}/9</span>
            </div>
          </div>
          <span className={styles.privilege}>分管型号:</span>
          <TreeSelect
            treeData={this.store.groupData.groupMachine}
            value={this.store.groupData.groupSelectMachine_page}
            onChange={this.treeChange}
            treeCheckable={true}
            showCheckedStrategy={SHOW_PARENT}
            searchPlaceholder="请选择"
            className={styles.tree}
            dropdownStyle={{maxHeight: '300px'}}
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
            <Breadcrumb.Item>组别管理</Breadcrumb.Item>
          </Breadcrumb>
          <div className={styles.role}>
            <div className={styles.head}>
              <Input
                placeholder="组名称"
                className={styles.inputAccount}
                onChange={this.searchInputChange}
              />
              <div className={styles.empty} />
              <Button type="primary" onClick={this.showModal}>
                新建组别</Button>
            </div>
            <GroupTable
              dataSource={this.store.groupData.group_list}
              total={this.store.groupData.count}
              current={this.store.groupData.page}
              edit={this.edit}
              operate={this.operate}
              onChange={this.onPageSizeChange}
            />
          </div>
          <If data={this.store.groupData.modalVisible}>
            {this.renderModal()}
          </If>
        </div>
      </div>
    );
  }
}
