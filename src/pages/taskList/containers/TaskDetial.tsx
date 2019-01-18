import {
  Alert,
  Breadcrumb,
  Button,
  Col,
  Icon,
  Input,
  Modal,
  Row,
  Select,
  Steps,
  Tabs,
  Timeline
} from 'antd';
import { post } from 'app/fetch';
import { If, withCommonHead } from 'app/ui';
import { toJS } from 'mobx';
import moment from 'moment';
import React from 'react';
import { getCostlist, packagePager } from '../apis/index';
import DetectionModal from '../component/DetectionModal';
import Edit from '../component/Edit';
import EditAddress from '../component/EditAddress';
import EditMalfunction from '../component/EditMalfunction';
import MaintenanceLogTable from '../component/MaintenanceLogTable';
import ReplaceMachine from '../component/ReplaceMachine';
import SendBackModal from '../component/SendBackModal';
import TaskLogTable from '../component/TaskLogTable';
import TaskSignIn from '../component/TaskSignIn';
import UpGrade from '../component/UpGrade';

import styles from './TaskDetial.scss';
const TabPane = Tabs.TabPane;
import { inject, observer } from 'mobx-react';

@withCommonHead
@inject('TaskListStore')
@observer
export default class TaskDetial extends React.Component<any> {
  state = {
    previewVisible: false,
    previewImage: '',
    options: [],
    expressVisible: false,
    errorVisiable: false,
    historyVisible: false,
    malfunctionId: '',
    userStationDetail: {},
    detectionType: '',
    problem: {},
    editMalfunctionVisible: false
  };
  componentWillMount() {
    const tId = this.props.match.params.taskId;
    this.props.TaskListStore.getTaskDetial({ task_id: tId });
    this.getAddress();
  }

  render() {
    // 文本项渲染
    const textCom = (
      text: string,
      value: any,
      linktext?: string,
      showModal?: any,
      linktext2?: string,
      click?: any
    ) => {
      return (
        <p>
          {text}：<span>{value}</span>
          <a style={{ paddingLeft: '16px' }} onClick={showModal}>
            {linktext}
          </a>
          <a style={{ paddingLeft: '16px' }} onClick={click}>
            {linktext2}
          </a>
        </p>
      );
    };

    const {
      taskDetail,
      MachineInfo,
      responsibleVisible,
      addressEdit,
      addressArr,
      maintenancePersonEdit,
      maintenancePhoneEdit,
      responsibleList,
      machineVisibe,
      sendBackVisible,
      taskSignVisible,
      signinDetail,
      upGradeVisible,
      stationList,
      stationDetail,
      stationId,
      detectVisible,
      backPersonEditVisible,
      backPhoneEditVisible,
      backAddressArr,
      backAddressEdit
    } = this.props.TaskListStore.state;
    const { problem, taskInfo, taskLog, taskProcess, upgradeInfo } = taskDetail;
    const { machine, repairHistoryList, merchantInfo } = MachineInfo;
    const taskStatusString = [
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
    ][taskInfo.status];
    const current = taskProcess.findIndex(
      (item: any) => item.process_name === taskStatusString
    );
    const tId = this.props.match.params.taskId;
    return (
      <div className={styles.panel}>
        <div className={styles.breadcrumb}>
          <Breadcrumb>
            <Breadcrumb.Item>首页</Breadcrumb.Item>
            <Breadcrumb.Item>任务列表</Breadcrumb.Item>
            <Breadcrumb.Item>
              <span style={{ color: '#ff6900 ' }}>任务详情</span>
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <div className={styles.container}>
          <div className={styles.container_body}>
            <div className={styles.taskNum}>
              <div className={styles.taskNumTitle}>
                维修任务号：{taskInfo.task_number}
                <span className={styles.pdl16}>
                  工单号：{taskInfo.order_number}
                </span>
              </div>
              <div>
                <If data={upgradeInfo.upgrade === 0}>
                  <If data={taskInfo.status === 5}>
                    {this.showBtn('报价', this.showMachineModal, 'primary')}
                  </If>
                  <If data={taskInfo.status === 6}>
                    {this.showBtn('维修', this.submitDetection, 'primary')}
                  </If>
                  <If data={taskInfo.status === 8}>
                    {this.showBtn('寄回', this.showSendBackModal, 'primary')}
                  </If>
                  <If data={taskInfo.status === 12}>
                    {this.showBtn('签收', this.showTaskSignModal, 'primary')}
                  </If>
                  <If data={taskInfo.status === 3}>
                    {this.showBtn(
                      '检测',
                      () =>
                        this.showDetectionModal(
                          machine.sn,
                          problem.malfunction_id
                        ),
                      'primary'
                    )}
                  </If>

                  <If
                    data={
                      taskInfo.status !== 8 &&
                      taskInfo.status !== 12 &&
                      taskInfo.status !== 11
                    }
                  >
                    {this.showBtn('任务升级', this.showUpGradeModal, 'default')}
                  </If>
                  <If data={taskInfo.status === 5 || taskInfo.status === 6}>
                    {this.showBtn('任务回滚', this.rollBack, 'default')}
                  </If>
                </If>
                {this.showBtn('备注', this.showRemarkModal, 'default')}
              </div>
            </div>
            <div className={styles.merchantInfo}>
              <div className={styles.swServiceProvider}>
                报修人姓名：
                <Edit
                  visible={maintenancePersonEdit}
                  defaultVal={taskInfo.maintenance_person}
                  showInputFun={this.showPersonInput}
                  changeFun={this.changePersonFun}
                  cancelFun={this.cancelPersonFun}
                  confirmEditFun={this.confirmPersonEditFun}
                  status={taskInfo.status}
                  upgrade={upgradeInfo.upgrade}
                />
              </div>
              <div className={styles.swServiceProvider}>
                报修人电话：
                <Edit
                  visible={maintenancePhoneEdit}
                  defaultVal={taskInfo.maintenance_phone}
                  showInputFun={this.showPhoneInput}
                  changeFun={this.changePhoneFun}
                  cancelFun={this.cancelPhoneFun}
                  confirmEditFun={this.confirmPhoneEditFun}
                  status={taskInfo.status}
                  upgrade={upgradeInfo.upgrade}
                />
              </div>
              <div className={styles.swServiceProvider}>
                报修人地址：
                <EditAddress
                  visible={addressEdit}
                  addressInfo={taskInfo}
                  options={this.state.options}
                  defaultVal={addressArr}
                  showInputFun={this.editAddress}
                  changeAddressFun={this.onChangeAddress}
                  changeDetialAddress={this.onChangeCity}
                  cancelAddressFun={this.cancelAddress}
                  confirmEditFun={this.onClickAddress}
                  status={taskInfo.status}
                  upgrade={upgradeInfo.upgrade}
                  addressType={1}
                />
              </div>
              <If data={taskInfo.express_com}>
                <p>
                  来件运单：<span>{taskInfo.express_com}</span>
                  <span className={styles.pdl16}>{taskInfo.express_no}</span>
                  <a className={styles.pdl16} onClick={this.showReciveModal}>
                    查看物流进度
                  </a>
                </p>
              </If>
            </div>
            <div className={styles.taskStatus}>
              <div className={styles.line1}>
                <p className={styles.title}>任务状态</p>
                <p className={styles.text}>{taskStatusString}</p>
              </div>
              <div className={styles.line2}>
                <p className={styles.title}>总耗时</p>
                <p className={styles.text}>
                  {+taskInfo.stay > 1 ? taskInfo.stay : '< 1'}小时
                </p>
              </div>
              <div className={styles.line3}>
                <p className={styles.title}>当前责任人</p>
                <div className={styles.swServiceProvider}>
                  <If data={responsibleVisible === false}>
                    <div className={styles.swspCte}>
                      <p className={styles.text}>{taskInfo.charge_name}</p>
                      <If
                        data={
                          upgradeInfo.upgrade === 0 && +taskInfo.status !== 11
                        }
                      >
                        <a
                          className={styles.swspButt}
                          onClick={this.editEesponsible}
                        >
                          <Icon
                            type="edit"
                            style={{
                              fontSize: '14px',
                              color: 'rgba(0,0,0,0.65)'
                            }}
                          />
                        </a>
                      </If>
                    </div>
                  </If>
                  <If data={responsibleVisible}>
                    <div className={styles.swspCte}>
                      <Select
                        style={{ width: '80px', marginTop: '5px' }}
                        defaultValue={taskInfo.charge_name}
                        onChange={this.onChangeResponsible}
                      >
                        {responsibleList.map((item: any) => {
                          return (
                            <Select.Option
                              key={item.id}
                              value={String(item.id)}
                            >
                              {item.name}
                            </Select.Option>
                          );
                        })}
                      </Select>
                      <a
                        className={styles.swspButt}
                        onClick={this.onCanelEditCharge}
                      >
                        取消
                      </a>
                      <a
                        className={styles.swspButt}
                        onClick={this.selsecResponsible}
                      >
                        确认
                      </a>
                    </div>
                  </If>
                </div>
              </div>
            </div>
            <div className={styles.taskSchedule}>
              <span style={{ paddingRight: '16px' }}>任务进度</span>
              <If data={+taskInfo.status === 1}>
                <Alert
                  style={{ width: '326px' }}
                  message="无人接单，请重新分配"
                  type="warning"
                  closable={true}
                  showIcon={true}
                />
              </If>
              <If data={+taskInfo.verification_result === -1}>
                <Alert
                  style={{ width: '426px' }}
                  message="机具验收未通过，请维修后重新提交"
                  type="warning"
                  closable={true}
                  showIcon={true}
                />
              </If>
            </div>
            <div>
              <Steps current={current} progressDot={true}>
                {taskProcess.map((item: any) => {
                  const time = (
                    <div>
                      <div>{moment.unix(item.time).format('YYYY-MM-DD')}</div>
                      <p>{moment.unix(item.time).format('HH:mm')}</p>
                    </div>
                  );
                  const content = (
                    <div style={{ textAlign: 'center' }}>
                      <div>{item.name}</div>
                      <div>{item.time ? time : ''}</div>
                    </div>
                  );
                  return (
                    <Steps.Step
                      key={Math.random()}
                      title={item.process_name}
                      description={content}
                    />
                  );
                })}
              </Steps>
            </div>
          </div>
        </div>
        <div className={styles.container}>
          <div className={styles.titleText}>
            <p className={styles.troubleshoot}>故障诊断</p>
            <p>
              <If
                data={
                  (taskInfo.status === 5 || +taskInfo.status === 6) &&
                  upgradeInfo.upgrade === 0
                }
              >
                <span className={styles.editText} onClick={this.showEditModal}>
                  编辑
                </span>
              </If>
            </p>
          </div>
          <div className={styles.container_body}>
            <Row gutter={24}>
              <Col span={8}>
                <div>
                  {textCom(
                    '故障类别',
                    problem.pb_type_name ? problem.pb_type_name : '-'
                  )}
                  {textCom(
                    '问题描述',
                    problem.user_desc ? problem.user_desc : '-'
                  )}
                </div>
              </Col>
              <Col span={8}>
                <div>
                  {textCom('实际故障', problem.pb_fact ? problem.pb_fact : '-')}
                  {textCom(
                    '维修方案',
                    problem.solution ? problem.solution : '-',
                    '查看费用清单',
                    this.getCostlist
                  )}
                </div>
              </Col>
              <Col span={8}>
                {textCom(
                  '收件清单',
                  problem.user_parts ? problem.user_parts : '-'
                )}
                {textCom(
                  '非保原因',
                  problem.not_guarantee ? problem.not_guarantee : '-'
                )}
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={24}>
                <p>
                  故障图片：
                  <If data={problem.pb_pics.length <= 0}>
                    <span>-</span>
                  </If>
                </p>
                <If data={problem.pb_pics.length > 0}>
                  <div style={{ display: 'flex' }}>
                    {problem.pb_pics.map((item: any) => {
                      return (
                        <div
                          key={item}
                          style={{
                            width: '104px',
                            cursor: 'pointer',
                            height: '104px'
                          }}
                          className={styles.img}
                        >
                          <img
                            onClick={() => this.lookImg(item)}
                            src={item}
                            alt=""
                            width="100%"
                            height="100%"
                          />
                        </div>
                      );
                    })}
                  </div>
                </If>
              </Col>
            </Row>
          </div>
        </div>
        {/* 机具信息 */}
        <div className={styles.container}>
          <Tabs defaultActiveKey="1">
            <TabPane tab="机具信息" key="1">
              <div className={styles.container_body}>
                <Row gutter={24}>
                  <Col span={24}>
                    <div
                      className={styles.swspCte}
                      style={{ marginBottom: '24px', display: 'flex' }}
                    >
                      <If data={taskInfo.sn}>
                        <img
                          src={
                            machine.machine_pic !== ''
                              ? machine.machine_pic
                              : require('../images/defaultImg.png')
                          }
                          style={{
                            border: '1px solid #ccc',
                            borderRadius: '5px'
                          }}
                          width="48"
                          height="48"
                          alt=""
                        />
                      </If>
                      <If data={!taskInfo.sn}>
                        <img
                          src={
                            taskInfo.machine_pic !== ''
                              ? taskInfo.machine_pic
                              : require('../images/defaultImg.png')
                          }
                          style={{
                            border: '1px solid #ccc',
                            borderRadius: '5px'
                          }}
                          width="48"
                          height="48"
                          alt=""
                        />
                      </If>
                      <div className={styles.machineTitle}>
                        <div style={{ marginBottom: '8px' }}>
                          {taskInfo.sn !== ''
                            ? machine.name
                            : taskInfo.machine_name}
                          <If data={+machine.is_bao === 1}>
                            <span className={styles.blue}>在保</span>
                          </If>
                          <If data={+problem.two_return === 1}>
                            <span className={styles.origin}>疑似二返</span>
                          </If>
                          <If data={+problem.two_return === 2}>
                            <span className={styles.origin}>二返</span>
                          </If>
                        </div>
                        <div>
                          <span>{machine.spec}</span>
                        </div>
                      </div>
                    </div>
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col span={8}>
                    {textCom('S/N', machine.sn ? machine.sn : '-')}
                    {textCom(
                      '激活时间',
                      machine.active_time ? machine.active_time : '-'
                    )}
                    {textCom(
                      '历史维修记录',
                      '',
                      `${repairHistoryList.length}次`,
                      this.showMaintenanceLogCancel
                    )}
                  </Col>
                  <Col span={8}>
                    {textCom(
                      '所属渠道',
                      merchantInfo.channel_name
                        ? merchantInfo.channel_name
                        : '-'
                    )}
                    {textCom(
                      '保修期至',
                      machine.over_time ? machine.over_time : '-'
                    )}
                  </Col>
                  <Col span={8}>
                    {textCom(
                      '出货时间',
                      machine.out_time ? machine.out_time : '-'
                    )}
                    {textCom(
                      'OS版本',
                      machine.os_version ? machine.os_version : '-'
                    )}
                  </Col>
                </Row>
              </div>
            </TabPane>
            <TabPane tab="设备来件" key="2">
              <div className={styles.container_body}>
                <Row gutter={24}>
                  <Col span={24}>
                    {textCom(
                      '收件清单',
                      problem.user_parts ? problem.user_parts : '-'
                    )}
                  </Col>
                </Row>
                <Row gutter={24}>
                  <Col span={8}>
                    {textCom(
                      '来件方式',
                      taskInfo.income_type ? taskInfo.income_type : '-'
                    )}
                  </Col>
                  <Col span={8}>
                    {textCom(
                      '物流公司',
                      taskInfo.express_com_come
                        ? taskInfo.express_com_come
                        : '-'
                    )}
                  </Col>
                  <Col span={8}>
                    {textCom(
                      '物流单号',
                      taskInfo.express_no_come ? taskInfo.express_no_come : '-',
                      taskInfo.express_no_come ? '物流信息' : '',
                      this.comeExpressModal
                    )}
                  </Col>
                </Row>
              </div>
            </TabPane>
            <TabPane tab="设备寄回" key="3">
              <div className={styles.container_body}>
                <Row gutter={24}>
                  <Col span={8}>
                    {textCom(
                      '取件方式',
                      taskInfo.pick_method ? taskInfo.pick_method : '-'
                    )}
                  </Col>
                  <Col span={8}>
                    {textCom(
                      '物流公司',
                      taskInfo.logistics_company
                        ? taskInfo.logistics_company
                        : '-'
                    )}
                  </Col>
                  <Col span={8}>
                    {textCom(
                      '物流单号',
                      taskInfo.logistics_number
                        ? taskInfo.logistics_number
                        : '-',
                      taskInfo.logistics_number ? '物流信息' : '',
                      this.sendBackExpressModal,
                      taskInfo.logistics_number ? '装箱单' : '',
                      this.packingpaper
                    )}
                  </Col>
                  <Col span={8}>
                    <div
                      style={{
                        display: 'flex',
                        marginBottom: '8px',
                        lineHeight: '36px'
                      }}
                    >
                      收件人：
                      <Edit
                        visible={backPersonEditVisible}
                        defaultVal={taskInfo.receive_name}
                        showInputFun={this.showBackInput}
                        changeFun={this.changeBackFun}
                        cancelFun={this.cancelBackFun}
                        confirmEditFun={this.confirmBackEditFun}
                        status={taskInfo.status}
                        upgrade={upgradeInfo.upgrade}
                      />
                    </div>
                  </Col>
                  <Col span={8}>
                    <div
                      style={{
                        display: 'flex',
                        marginBottom: '8px',
                        lineHeight: '36px'
                      }}
                    >
                      收件人电话：
                      <Edit
                        visible={backPhoneEditVisible}
                        defaultVal={taskInfo.receive_phone}
                        showInputFun={this.showBackPhoneInput}
                        changeFun={this.changeBackPhoneFun}
                        cancelFun={this.cancelBackPhoneFun}
                        confirmEditFun={this.confirmBackPhoneEditFun}
                        status={taskInfo.status}
                        upgrade={upgradeInfo.upgrade}
                      />
                    </div>
                  </Col>
                  <Col span={24}>
                    <div className={styles.swServiceProvider}>
                      收件地址：
                      <EditAddress
                        visible={backAddressEdit}
                        addressInfo={taskInfo}
                        options={this.state.options}
                        defaultVal={backAddressArr}
                        showInputFun={this.editBackAddress}
                        changeAddressFun={this.onChangeBackAddress}
                        changeDetialAddress={this.onChangeBackCity}
                        cancelAddressFun={this.cancelBackAddress}
                        confirmEditFun={this.onClickBackAddress}
                        status={taskInfo.status}
                        upgrade={upgradeInfo.upgrade}
                        addressType={2}
                      />
                    </div>
                  </Col>
                </Row>
              </div>
            </TabPane>

            <TabPane tab="任务升级" key="4">
              <If data={+upgradeInfo.upgrade === 0}>
                <div className={styles.container_body}>暂无升级信息！</div>
              </If>
              <If data={+upgradeInfo.upgrade === 1}>
                <div className={styles.container_body}>
                  <Row gutter={24}>
                    <Col span={8}>
                      {textCom(
                        '收件人',
                        upgradeInfo.rec_name ? upgradeInfo.rec_name : '-'
                      )}
                      {textCom(
                        '收件人电话',
                        upgradeInfo.rec_phone ? upgradeInfo.rec_phone : '-'
                      )}
                      {textCom(
                        '收件地址',
                        upgradeInfo.rec_address ? upgradeInfo.rec_address : '-'
                      )}
                    </Col>
                    <Col span={8}>
                      {textCom(
                        '受理站点',
                        upgradeInfo.rec_station_name
                          ? upgradeInfo.rec_station_name
                          : '-'
                      )}
                      {textCom(
                        '回寄至',
                        upgradeInfo.back_to ? upgradeInfo.back_to : '-'
                      )}
                    </Col>
                    <Col span={8}>
                      {textCom(
                        '物流公司',
                        upgradeInfo.upgrade_express
                          ? upgradeInfo.upgrade_express
                          : '-'
                      )}
                      {textCom(
                        '物流单号',
                        upgradeInfo.upgrade_express_no
                          ? upgradeInfo.upgrade_express_no
                          : '-',
                        upgradeInfo.upgrade_express_no ? '查看物流信息' : '',
                        this.showUpgradeExpressModal
                      )}
                    </Col>
                  </Row>
                </div>
              </If>
            </TabPane>
          </Tabs>
        </div>
        {/* 任务日志 */}
        <div className={styles.container}>
          <div className={styles.titleText}>
            <p className={styles.troubleshoot}>任务日志</p>
          </div>
          <div className={styles.container_body}>
            <TaskLogTable dataSource={toJS(taskLog)} />
          </div>
        </div>
        {/* 图片预览 */}
        <Modal
          width={640}
          visible={this.state.previewVisible}
          footer={null}
          onCancel={this.closeLookImg}
        >
          <img
            alt="example"
            style={{ width: '100%' }}
            src={this.state.previewImage}
          />
        </Modal>
        {/* 待客户确认弹框 */}
        <If data={machineVisibe}>
          <ReplaceMachine
            machineVisibe={machineVisibe}
            closeMachineModal={this.closeMachineModal}
            taskId={tId}
            customerConfirm={this.props.TaskListStore.customerConfirm}
          />
        </If>
        {/* 设备寄回弹框 */}
        <If data={sendBackVisible}>
          <SendBackModal
            sendBackVisible={sendBackVisible}
            handleCancel={this.closeSendBackModal}
            taskId={tId}
            sendBack={this.props.TaskListStore.sendBack}
          />
        </If>
        {/* 任务签收 */}
        <If data={taskSignVisible}>
          <TaskSignIn
            taskSignVisible={taskSignVisible}
            onCancel={this.closeTaskSignModal}
            taskSignInDetail={signinDetail}
            taskId={tId}
            taskSignIn={this.props.TaskListStore.signin}
          />
        </If>
        {/* 任务升级 */}
        <If data={upGradeVisible}>
          <UpGrade
            upGradeVisible={upGradeVisible}
            taskId={tId}
            UpGradeFun={this.props.TaskListStore.upGrade}
            onCancel={this.closeUpGradeModal}
            stationList={stationList}
            options={this.state.options}
            changeStation={this.changeStation}
            stationInfo={stationDetail}
            stationId={stationId}
            getStationDetail={this.props.TaskListStore.getStationDetail}
          />
        </If>
        {/* 故障检测弹框 */}
        <If data={detectVisible}>
          <DetectionModal
            visible={detectVisible}
            taskId={tId}
            onCancel={this.closeDetectionModal}
            detect={this.props.TaskListStore.detect}
            malfunctionid={this.state.malfunctionId}
            problem={problem}
            // detectionType={detectionType}
          />
        </If>
        {/* 编辑故障信息 */}
        <If data={this.state.editMalfunctionVisible}>
          <EditMalfunction
            detectionVisible={this.state.editMalfunctionVisible}
            closeCancel={this.cancelEditModal}
            disabled={true}
            taskId={tId}
            malfunctionid={this.state.malfunctionId}
          />
        </If>
        {/* 添加备注 */}
        {this.renderRemarkModal()}
        {/* 物流信息弹框 */}
        {this.renderExpreModal()}
        {/* // 历史维修记录弹框 */}
        {this.renderHistory()}
      </div>
    );
  }
  // -------------------------------------------------
  // 查看装箱单
  packingpaper = async () => {
    try {
      const json: any = await packagePager({
        task_id: this.props.match.params.taskId
      });
      const myWindow = window.open('', '');
      if (myWindow) {
        myWindow.document.write(json.data);
        myWindow.focus();
      }
    } catch (error) {
      // console.log(error);
    }
  };
  // -------------------------------------------------
  // 查看费用清单
  getCostlist = async () => {
    try {
      const json: any = await getCostlist({
        task_id: this.props.match.params.taskId
      });
      // console.log(json.data);
      const myWindow = window.open('', '');
      if (myWindow) {
        myWindow.document.write(json.data);
        myWindow.focus();
      }
    } catch (error) {
      //
    }
  };
  // -------------------------------------------------
  // 任务回滚
  rollBack = () => {
    const { rollBack } = this.props.TaskListStore;
    const { taskId } = this.props.match.params;
    Modal.confirm({
      title: '任务回滚',
      content:
        '警告！你正在试图将状态回滚至待检测，回滚后已填写的数据将清除并不可恢复！',
      onOk() {
        rollBack({ task_id: taskId });
      }
    });
  };
  // -------------------------------------------------
  // 显示编辑弹框
  showEditModal = () => {
    const {
      materials,
      taskInfo,
      problem
    } = this.props.TaskListStore.state.taskDetail;
    const { sn } = taskInfo;
    this.setState({
      editMalfunctionVisible: true
    });
    const arr: any = [];
    materials.map((item: any) => {
      const obj = { m_id: item.material_id, num: 1 };
      arr.push(obj);
    });
    this.props.TaskListStore.setState({
      taskIds: [this.props.match.params.taskId],
      materielss: arr,
      oldPic: problem.pb_pics
    });
    this.props.TaskListStore.setState({
      materiels: arr
    });
    this.props.TaskListStore.getMalflist({ sns: [sn] });
    this.props.TaskListStore.getMaterialByMsn({ sn });
  };
  cancelEditModal = () => {
    this.setState({
      editMalfunctionVisible: false
    });
  };
  // -------------------------------------------------

  // 判断当前任务状态显示按钮
  showBtn = (text: string, click: any, btnStyle: any) => {
    return (
      <Button
        size="large"
        type={btnStyle}
        style={{ marginRight: '16px' }}
        onClick={click}
      >
        {text}
      </Button>
    );
  };

  // -----------------------------------------------
  // 故障检测
  closeDetectionModal = () => {
    this.props.TaskListStore.setState({
      detectVisible: false
    });
  };
  showDetectionModal = (sn: any, malfunctionid: any) => {
    this.setState({
      malfunctionId: malfunctionid,
      detectionType: 1
    });
    this.props.TaskListStore.setState({
      detectVisible: true
    });
    this.props.TaskListStore.getMalflist({ sns: [sn] });
    this.props.TaskListStore.getMaterialByMsn({ sn });
  };
  // -----------------------------------------------
  // 任务升级
  showUpGradeModal = () => {
    this.props.TaskListStore.setState({
      upGradeVisible: true
    });
    this.props.TaskListStore.getStationList({
      task_id: this.props.match.params.taskId
    });
  };
  closeUpGradeModal = () => {
    this.props.TaskListStore.setState({
      upGradeVisible: false
    });
    this.props.TaskListStore.clearStationDetail();
  };
  changeStation = (value: any) => {
    this.props.TaskListStore.getStationDetail({
      station_id: value
    }).then((data: any) => {
      this.props.TaskListStore.setState({
        stationDetail: data
      });
    });
    this.props.TaskListStore.setState({
      stationId: value
    });
  };
  // -----------------------------------------------
  // 历史维修记录弹框
  renderHistory = () => {
    const { repairHistoryList } = this.props.TaskListStore.state.MachineInfo;
    return (
      <Modal
        width={740}
        title="历史维修记录"
        visible={this.state.historyVisible}
        onCancel={this.handleMaintenanceLogCancel}
        footer={[
          <Button
            key="back"
            type="primary"
            size="large"
            onClick={this.handleMaintenanceLogCancel}
          >
            关闭
          </Button>
        ]}
      >
        <MaintenanceLogTable dataSource={repairHistoryList} />
      </Modal>
    );
  };
  handleMaintenanceLogCancel = () => {
    this.setState({
      historyVisible: false
    });
  };
  showMaintenanceLogCancel = () => {
    this.setState({
      historyVisible: true
    });
  };
  // -----------------------------------------------
  // 物流进度弹框
  renderExpreModal = () => {
    const { logisticsList } = this.props.TaskListStore.state;
    return (
      <Modal
        title="物流记录"
        visible={this.state.expressVisible}
        footer={
          <Button type="primary" onClick={this.closeLogisticsModal}>
            关闭
          </Button>
        }
        onCancel={this.closeLogisticsModal}
      >
        <Timeline>
          {logisticsList.map((item: any, index: any) => {
            return (
              <Timeline.Item color="green" key={index}>
                <p>{item.context}</p>
                <p>{item.time}</p>
              </Timeline.Item>
            );
          })}
          <If data={logisticsList.length < 1}>
            <div className={styles.ogisticsTip}>暂无物流信息</div>
          </If>
        </Timeline>
      </Modal>
    );
  };

  // 关闭物流进度弹框
  closeLogisticsModal = () => {
    this.setState({
      expressVisible: false
    });
  };
  // 头部查看物流进度
  showReciveModal = () => {
    const { taskInfo } = this.props.TaskListStore.state.taskDetail;
    this.setState({
      expressVisible: true
    });
    this.props.TaskListStore.getLogistics({ express_no: taskInfo.express_no });
  };
  // 来件物流信息
  comeExpressModal = () => {
    const {
      express_no_come
    } = this.props.TaskListStore.state.taskDetail.taskInfo;
    this.setState({
      expressVisible: true
    });
    this.props.TaskListStore.getLogistics({ express_no: express_no_come });
  };
  // 回寄物流信息
  sendBackExpressModal = () => {
    const {
      logistics_number
    } = this.props.TaskListStore.state.taskDetail.taskInfo;
    this.setState({
      expressVisible: true
    });
    this.props.TaskListStore.getLogistics({ express_no: logistics_number });
  };
  // 任务升级物流信息
  showUpgradeExpressModal = () => {
    const {
      upgrade_express_no
    } = this.props.TaskListStore.state.taskDetail.upgradeInfo;
    this.setState({
      expressVisible: true
    });
    this.props.TaskListStore.getLogistics({ express_no: upgrade_express_no });
  };
  // -----------------------------------------------
  // 添加备注弹框
  renderRemarkModal = () => {
    const {
      remarkVisiable,
      btnLoading,
      detialRemark
    } = this.props.TaskListStore.state;
    return (
      <Modal
        title="备注"
        visible={remarkVisiable}
        onCancel={this.handleRemarkCancel}
        onOk={this.addTaskRemark}
        confirmLoading={btnLoading}
      >
        <Input.TextArea
          rows={4}
          value={detialRemark}
          onChange={this.changeRemark}
        />
        <If data={this.state.errorVisiable}>
          <p style={{ color: '#f50f50' }}>请输入备注信息</p>
        </If>
      </Modal>
    );
  };

  showRemarkModal = () => {
    this.props.TaskListStore.setState({
      remarkVisiable: true
    });
  };
  handleRemarkCancel = () => {
    this.props.TaskListStore.setState({
      remarkVisiable: false
    });
  };
  changeRemark = (e: any) => {
    this.props.TaskListStore.setState({
      detialRemark: e.target.value
    });
    if (this.props.TaskListStore.state.detialRemark) {
      this.setState({
        errorVisiable: false
      });
    } else {
      this.setState({
        errorVisiable: true
      });
    }
  };
  addTaskRemark = () => {
    const { detialRemark } = this.props.TaskListStore.state;
    if (!detialRemark) {
      this.setState({
        errorVisiable: true
      });
      return;
    }
    this.props.TaskListStore.setState({
      btnLoading: true
    });
    this.props.TaskListStore.addRemark({
      task_id: this.props.match.params.taskId,
      remark: detialRemark
    });
  };
  // -----------------------------------------------
  // 修改保修人地址
  editAddress = () => {
    this.props.TaskListStore.setState({
      addressEdit: true
    });
  };
  onChangeAddress = (value: any) => {
    this.props.TaskListStore.setState({
      addressArr: value
    });
  };
  onChangeCity = (e: any) => {
    this.props.TaskListStore.setState({
      repairAddressTxt: e.target.value
    });
  };
  cancelAddress = () => {
    this.props.TaskListStore.setState({
      addressEdit: false
    });
  };
  onClickAddress = () => {
    this.props.TaskListStore.setState({
      addressEdit: false
    });
    const { addressArr, repairAddressTxt } = this.props.TaskListStore.state;
    this.props.TaskListStore.update({
      task_id: this.props.match.params.taskId,
      repair_p_id: addressArr[0],
      repair_c_id: addressArr[1],
      repair_a_id: addressArr[2],
      repair_address: repairAddressTxt
    });
  };
  // -----------------------------------------------
  // 修改回寄人地址
  editBackAddress = () => {
    this.props.TaskListStore.setState({
      backAddressEdit: true
    });
  };
  onChangeBackAddress = (value: any) => {
    this.props.TaskListStore.setState({
      backAddressArr: value
    });
  };
  onChangeBackCity = (e: any) => {
    this.props.TaskListStore.setState({
      reciveAddressTxt: e.target.value
    });
  };
  cancelBackAddress = () => {
    this.props.TaskListStore.setState({
      backAddressEdit: false
    });
  };
  onClickBackAddress = () => {
    this.props.TaskListStore.setState({
      backAddressEdit: false
    });
    const { backAddressArr, reciveAddressTxt } = this.props.TaskListStore.state;
    this.props.TaskListStore.update({
      task_id: this.props.match.params.taskId,
      receive_p_id: backAddressArr[0],
      receive_c_id: backAddressArr[1],
      receive_a_id: backAddressArr[2],
      receive_address: reciveAddressTxt
    });
  };
  // -----------------------------------------------
  // 修改回寄手机
  showBackPhoneInput = () => {
    this.props.TaskListStore.setState({
      backPhoneEditVisible: true
    });
  };
  changeBackPhoneFun = (e: any) => {
    this.props.TaskListStore.setState({
      backPhoneEdit: e.target.value
    });
  };
  cancelBackPhoneFun = () => {
    this.props.TaskListStore.setState({
      backPhoneEditVisible: false
    });
  };
  confirmBackPhoneEditFun = () => {
    this.props.TaskListStore.setState({
      backPhoneEditVisible: false
    });
    this.props.TaskListStore.update({
      receive_phone: this.props.TaskListStore.state.backPhoneEdit,
      task_id: this.props.match.params.taskId
    });
  };
  // -----------------------------------------------
  // 修改回寄姓名
  showBackInput = () => {
    this.props.TaskListStore.setState({
      backPersonEditVisible: true
    });
  };
  changeBackFun = (e: any) => {
    this.props.TaskListStore.setState({
      backPersonEdit: e.target.value
    });
  };
  cancelBackFun = () => {
    this.props.TaskListStore.setState({
      backPersonEditVisible: false
    });
  };
  confirmBackEditFun = () => {
    this.props.TaskListStore.setState({
      backPersonEditVisible: false
    });
    this.props.TaskListStore.update({
      receive_name: this.props.TaskListStore.state.backPersonEdit,
      task_id: this.props.match.params.taskId
    });
  };
  // -----------------------------------------------
  // 修改保修人姓名
  showPersonInput = () => {
    this.props.TaskListStore.setState({
      maintenancePersonEdit: true
    });
  };
  changePersonFun = (e: any) => {
    this.props.TaskListStore.setState({
      maintenancePerson: e.target.value
    });
  };
  cancelPersonFun = () => {
    this.props.TaskListStore.setState({
      maintenancePersonEdit: false
    });
  };
  confirmPersonEditFun = () => {
    this.props.TaskListStore.setState({
      maintenancePersonEdit: false
    });
    this.props.TaskListStore.update({
      repair_name: this.props.TaskListStore.state.maintenancePerson,
      task_id: this.props.match.params.taskId
    });
  };

  // -----------------------------------------------
  // 修改保修人电话
  showPhoneInput = () => {
    this.props.TaskListStore.setState({
      maintenancePhoneEdit: true
    });
  };
  changePhoneFun = (e: any) => {
    this.props.TaskListStore.setState({
      maintenancePhone: e.target.value
    });
  };
  cancelPhoneFun = () => {
    this.props.TaskListStore.setState({
      maintenancePhoneEdit: false
    });
  };
  confirmPhoneEditFun = () => {
    this.props.TaskListStore.setState({
      maintenancePhoneEdit: false
    });
    this.props.TaskListStore.update({
      repair_phone: this.props.TaskListStore.state.maintenancePhone,
      task_id: this.props.match.params.taskId
    });
  };
  // -----------------------------------------------
  // 修改责任人
  editEesponsible = () => {
    this.props.TaskListStore.setState({
      responsibleVisible: true
    });
    this.props.TaskListStore.getAdminlist({
      task_id: this.props.match.params.taskId
    });
  };
  onCanelEditCharge = () => {
    this.props.TaskListStore.setState({
      responsibleVisible: false
    });
  };
  onChangeResponsible = (value: any) => {
    this.props.TaskListStore.setState({
      responsible: value
    });
  };
  selsecResponsible = () => {
    this.props.TaskListStore.setState({
      responsibleVisible: false
    });
    this.props.TaskListStore.update({
      admin_id: this.props.TaskListStore.state.responsible,
      task_id: this.props.match.params.taskId
    });
  };
  // -------------------------------------------------
  // 获取省市区
  getAddress = async () => {
    const api = '/admin/district/region';
    const opts = {
      method: 'POST',
      body: {
        adminId: '1'
      }
    };
    const json: any = await post(api, opts).then(res => {
      return res;
    });
    const formatData = (data: any) => {
      return data.map((item: any) => {
        const { name, id } = item;
        let { children } = item;
        if (children && children.length > 0) {
          children = formatData(children);
        }
        return {
          children,
          label: name,
          value: id
        };
      });
    };
    await this.setState({ options: formatData(json.data) });
  };
  // -------------------------------------------------
  // 待客户确认
  // 显示弹框
  showMachineModal = () => {
    this.props.TaskListStore.setState({
      machineVisibe: true
    });
  };
  closeMachineModal = () => {
    this.props.TaskListStore.setState({
      machineVisibe: false
    });
  };

  // -------------------------------------------------
  // 维修
  submitDetection = () => {
    const { repairService } = this.props.TaskListStore;
    const { taskId } = this.props.match.params;
    Modal.confirm({
      title: '确认维修完成',
      content: '确认操作后不可撤回',
      onOk() {
        repairService({ task_id: taskId });
      }
    });
  };
  // -------------------------------------------------
  // 设备寄回
  showSendBackModal = () => {
    this.props.TaskListStore.setState({
      sendBackVisible: true
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
  showTaskSignModal = () => {
    this.props.TaskListStore.setState({
      taskSignVisible: true
    });
    this.props.TaskListStore.getSigninDetail({
      task_id: this.props.match.params.taskId
    });
  };
  // -------------------------------------------------
  // 预览图片
  lookImg = (img: string) => {
    this.setState({
      previewVisible: true,
      previewImage: img
    });
  };
  // 关闭预览弹框
  closeLookImg = () => {
    this.setState({
      previewVisible: false
    });
  };
  // 故障信息图片
  renderPic = () => {
    const { problem } = this.props.TaskListStore.state.taskDetail;
    return (
      <div className={styles.img}>
        <div style={{ display: 'flex' }}>
          {problem.pb_pics.map((item: any) => {
            return (
              <img
                onClick={() => this.lookImg(item)}
                key={item}
                src={item}
                alt=""
                width="100%"
                height="100%"
                style={{
                  width: '104px',
                  cursor: 'pointer',
                  height: '104px'
                }}
              />
            );
          })}
        </div>
      </div>
    );
  };
}
