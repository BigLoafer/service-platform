import { Modal, Table, Tooltip } from 'antd';
import { If } from 'app/ui';
import { inject } from 'mobx-react';
import React from 'react';
import DetectionModal from '../component/DetectionModal';
import ReplaceMachine from '../component/ReplaceMachine';
import SendBackModal from '../component/SendBackModal';
import TaskSignIn from '../component/TaskSignIn';
export interface TaskListProps {
  dataSource: any;
  pagination: any;
  TaskListStore?: any;
  changeStay: any;
}
@inject('TaskListStore')
export default class TaskListTable extends React.Component<TaskListProps> {
  state = {
    selectedRowKeys: [], // 选中此处以配置默认列
    errorVisiable: false,
    previewVisible: false,
    previewImage: '',
    options: [],
    expressVisible: false,
    historyVisible: false,
    malfunctionId: '',
    sortedInfo: {}
  };

  render() {
    const { sortedInfo } = this.state;
    const columns = [
      {
        title: '机具信息',
        width: 400,
        dataIndex: 'machine_name',
        key: 'machine_name',
        render: (__: any, record: any) => {
          return (
            <div style={{ display: 'flex' }}>
              <div>
                <img
                  src={
                    record.pic
                      ? record.pic
                      : require('../images/defaultImg.png')
                  }
                  width={48}
                  height={48}
                  alt=""
                />
              </div>
              <div style={{ marginLeft: '8px' }}>
                <p style={{ marginBottom: '8px' }}>{record.machine_name}</p>
                <Tooltip placement="top" title={record.spec_name}>
                  <p
                    style={{
                      width: '360px',
                      height: '21px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                  >
                    {record.spec_name}
                  </p>
                </Tooltip>
              </div>
            </div>
          );
        }
      },
      {
        title: '单号',
        dataIndex: 'task_number',
        key: 'task_number'
      },
      {
        title: '故障类别',
        dataIndex: 'pb_type',
        key: 'pb_type'
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        render: (__: any, record: any) => {
          return (
            <div>
              {
                [
                  '',
                  '',
                  '',
                  '待检测',
                  '',
                  '待报价',
                  '待维修',
                  '',
                  '待寄回',
                  '',
                  '',
                  '已完成',
                  '待签收'
                ][record.status]
              }
              <If data={+record.is_upgrade === 1}>
                <p>已升级</p>
              </If>
            </div>
          );
        }
      },
      {
        title: '滞留时间',
        dataIndex: 'stay',
        key: 'stay',
        sorter: (a: any, b: any) => a.stay - b.stay,
        render: (text: any) => {
          return <div>{+text < 1 ? '< 1' : text}小时</div>;
        }
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        render: (__: any, record: any) => {
          return (
            <div>
              <If data={+record.status === 12}>
                <a
                  href="javascript:void(0)"
                  onClick={() => this.showTaskSignModal(record.id)}
                >
                  签收
                </a>
                <span style={{ padding: '0 10px' }}>|</span>
              </If>
              {/* 检测 */}
              <If data={+record.status === 3}>
                <a
                  href="javascript:void(0)"
                  onClick={() =>
                    this.showDetectionModal(
                      record.sn,
                      record.id,
                      record.malfunction_id
                    )
                  }
                >
                  检测
                </a>
                <span style={{ padding: '0 10px' }}>|</span>
              </If>
              {/* 待客户确认 */}
              <If data={+record.status === 5}>
                <a
                  href="javascript:void(0)"
                  onClick={() => this.showMachineModal(record.id)}
                >
                  报价
                </a>
                <span style={{ padding: '0 10px' }}>|</span>
              </If>
              {/* 维修 */}
              <If data={+record.status === 6}>
                <a
                  href="javascript:void(0)"
                  onClick={() => this.submitDetection(record.id)}
                >
                  维修
                </a>
                <span style={{ padding: '0 10px' }}>|</span>
              </If>
              {/* 寄回 */}
              <If data={+record.status === 8}>
                <a
                  href="javascript:void(0)"
                  onClick={() => this.showSendBackModal(record.id)}
                >
                  寄回
                </a>
                <span style={{ padding: '0 10px' }}>|</span>
              </If>
              <a target="_blank" href={`/taskList/taskDetial/${record.id}`}>
                查看
              </a>
            </div>
          );
        }
      }
    ];
    const {
      machineVisibe,
      sendBackVisible,
      taskSignVisible,
      signinDetail,
      detectVisible,
      listTaskId
    } = this.props.TaskListStore.state;
    const { dataSource, pagination, changeStay } = this.props;
    return (
      <div style={{ marginTop: '16px' }}>
        <Table
          pagination={pagination}
          dataSource={dataSource}
          columns={columns}
          rowKey={(__, index) => index.toString()}
          onChange={changeStay}
        />
        {/* 故障检测弹框 */}
        <If data={detectVisible}>
          <DetectionModal
            visible={detectVisible}
            onCancel={this.closeDetectionModal}
            detect={this.props.TaskListStore.detect}
            malfunctionid={this.state.malfunctionId}
            taskId={listTaskId}
          />
        </If>
        {/* 待客户确认弹框 */}
        <If data={machineVisibe}>
          <ReplaceMachine
            machineVisibe={machineVisibe}
            closeMachineModal={this.closeMachineModal}
            taskId={listTaskId}
            customerConfirm={this.props.TaskListStore.customerConfirm}
          />
        </If>
        {/* 设备寄回弹框 */}
        <If data={sendBackVisible}>
          <SendBackModal
            taskId={listTaskId}
            sendBackVisible={sendBackVisible}
            handleCancel={this.closeSendBackModal}
            sendBack={this.props.TaskListStore.sendBack}
            callBack={this.props.TaskListStore.getTaskDetial}
          />
        </If>
        {/* 任务签收 */}
        <If data={taskSignVisible}>
          <TaskSignIn
            taskSignVisible={taskSignVisible}
            onCancel={this.closeTaskSignModal}
            taskSignInDetail={signinDetail}
            taskSignIn={this.props.TaskListStore.signin}
            taskId={this.props.TaskListStore.state.listTaskId}
          />
        </If>
      </div>
    );
  }

  // -----------------------------------------------
  // 故障检测
  closeDetectionModal = () => {
    this.props.TaskListStore.setState({
      detectVisible: false
    });
  };
  showDetectionModal = (sn: any, id: any, malfunctionid: any) => {
    this.setState({
      malfunctionId: malfunctionid
    });
    this.props.TaskListStore.setState({
      detectVisible: true,
      listTaskId: id
    });
    this.props.TaskListStore.getMalflist({ sns: [sn] });
    this.props.TaskListStore.getMaterialByMsn({ sn });
  };
  // -----------------------------------------------
  // 待客户确认
  // 显示弹框
  showMachineModal = (id: any) => {
    this.props.TaskListStore.setState({
      machineVisibe: true
    });
    this.props.TaskListStore.setState({
      listTaskId: id
    });
  };
  closeMachineModal = () => {
    this.props.TaskListStore.setState({
      machineVisibe: false
    });
  };

  // -------------------------------------------------
  // 维修
  submitDetection = (id: any) => {
    const { repairService } = this.props.TaskListStore;
    Modal.confirm({
      title: '确认维修完成',
      content: '确认操作后不可撤回',
      onOk() {
        repairService({ task_id: id });
      }
    });
  };
  // -------------------------------------------------
  // 设备寄回
  showSendBackModal = (id: any) => {
    this.props.TaskListStore.setState({
      sendBackVisible: true,
      listTaskId: id
    });
  };
  closeSendBackModal = () => {
    this.props.TaskListStore.setState({
      sendBackVisible: false
    });
  };
  // -------------------------------------------------
  // 签收
  closeTaskSignModal = () => {
    this.props.TaskListStore.setState({
      taskSignVisible: false
    });
  };
  showTaskSignModal = (id: any) => {
    this.props.TaskListStore.setState({
      taskSignVisible: true,
      listTaskId: id
    });
    this.props.TaskListStore.getSigninDetail({
      task_id: id
    });
  };
  // -------------------------------------------------
}
