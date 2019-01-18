import { Breadcrumb, Button, Form, message, Modal, Steps } from 'antd';
const Step = Steps.Step;
import { post } from 'app/fetch';
import { If, withCommonFoot, withCommonHead } from 'app/ui';
import _ from 'lodash';
import { toJS } from 'mobx';
import { inject, observer } from 'mobx-react';
import React from 'react';
import CreatOneStep from '../component/CreatOneStep';
import CreatTwoStep from '../component/CreatTwoStep';
import styles from './CreateWorkOrder.scss';
@inject('TaskListStore')
@withCommonHead
@withCommonFoot
@observer
class CreateWorkOrder extends React.Component<any> {
  state = {
    options: []
  };
  componentDidMount() {
    this.getAddress();
  }
  render() {
    const steps = [
      {
        title: '录入设备',
        key: '1'
      },
      {
        title: '输入故障',
        key: '2'
      },
      {
        title: '完成',
        key: '3'
      }
    ];

    const {
      snNumber,
      isFind,
      errorVisiable,
      deviceArr,
      malflist,
      maintenanceInfo,
      btnDisabled,
      current,
      btnLoading
    } = this.props.TaskListStore.state;
    return (
      <div className={styles.panel}>
        <div className={styles.breadcrumb}>
          <Breadcrumb>
            <Breadcrumb.Item>首页</Breadcrumb.Item>
            <Breadcrumb.Item>任务列表</Breadcrumb.Item>
            <Breadcrumb.Item>
              <span className={styles.cf690}>新建任务</span>
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <div className={styles.container}>
          <div className={styles.titleText}>
            <p className={styles.troubleshoot}>新建任务</p>
          </div>
          <div className={styles.container_body}>
            <div style={{ width: '80%', margin: '0 auto' }}>
              <Steps current={current}>
                {steps.map(item => {
                  return <Step key={item.key} title={item.title} />;
                })}
              </Steps>
            </div>
            <div>
              <div className={styles.stepsContent}>
                <If data={+current === 0}>
                  <CreatOneStep
                    searchDevice={this.searchDevice}
                    changeSnNumber={this.changeSnNumber}
                    snNumber={snNumber}
                    isFind={isFind}
                    errorVisiable={errorVisiable}
                    deviceArr={deviceArr}
                    delMachineInfo={this.delMachineInfo}
                  />
                </If>
                <If data={+current === 1}>
                  <CreatTwoStep
                    form={this.props.form}
                    options={this.state.options}
                    malflist={malflist}
                    changePhone={this.changePhone}
                    maintenanceInfo={maintenanceInfo}
                  />
                </If>
              </div>
              <div className={styles.stepsAction}>
                {current === 0 && (
                  <div className={styles.btnGroup}>
                    <Button className={styles.btn} onClick={this.cancel}>
                      取消
                    </Button>
                    <Button
                      className={styles.btn}
                      type="primary"
                      onClick={this.next}
                      disabled={btnDisabled}
                    >
                      下一步
                    </Button>
                  </div>
                )}
                {current === 1 && (
                  <div className={styles.btnGroup}>
                    <Button onClick={() => this.prev()} className={styles.btn}>
                      上一步
                    </Button>
                    <Button
                      className={styles.btn}
                      type="primary"
                      onClick={this.handleSubmit}
                      loading={btnLoading}
                    >
                      创建工单
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  // 取消创建并返回列表页
  cancel = () => {
    window.location.href = '/taskList';
  };
  // 删除当前设备
  delMachineInfo = (sn: any) => {
    const dataSource = [...this.props.TaskListStore.state.deviceArr];
    const { setState, state } = this.props.TaskListStore;
    Modal.confirm({
      title: '提示',
      content: '确认要删除这条信息吗？',
      onOk() {
        setState({
          deviceArr: dataSource.filter(
            (item: any) => toJS(item).machine.sn !== sn
          ),
          snArr: state.snArr.filter((item: any) => item !== sn)
        });
        const selectArr = dataSource.filter(
          (item: any) => toJS(item).machine.sn !== sn
        );
        if (selectArr.length < 1) {
          setState({
            btnDisabled: true
          });
        }
      }
    });
  };
  // 下一步
  next = () => {
    const { snArr } = this.props.TaskListStore.state;
    this.props.TaskListStore.getMalflist({ sns: snArr });
    if (snArr.length > 0) {
      this.props.TaskListStore.snsRepairStatust({ sns: snArr });
    } else {
      this.props.TaskListStore.setState({
        btnDisabled: true
      });
      return;
    }
  };
  // 上一步
  prev = () => {
    const current = this.props.TaskListStore.state.current - 1;
    this.props.TaskListStore.setState({ current });
  };
  // 输入sn
  changeSnNumber = (e: any) => {
    this.props.TaskListStore.setState({
      snNumber: e.target.value,
      errorVisiable: false,
      isFind: false
    });
  };
  // 扫码枪扫入SN录入设备
  searchDevice = (value: any) => {
    if (!value) {
      message.error('请输入sn');
      return;
    }
    const { searchMachineInfoBySn } = this.props.TaskListStore;
    searchMachineInfoBySn({ sn: value });
  };

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
  handleSubmit = (e: any) => {
    e.preventDefault();
    this.props.form.validateFields((err: any, values: any) => {
      if (!err) {
        this.props.TaskListStore.setState({
          btnLoading: true
        });
        const { snArr } = this.props.TaskListStore.state;
        this.props.TaskListStore.create({
          sns: toJS(snArr),
          repair_name: values.repair_name,
          repair_phone: values.repair_phone,
          repair_p_id: toJS(values).repairAddressList
            ? toJS(values).repairAddressList[0]
            : '',
          repair_c_id: toJS(values).repairAddressList
            ? toJS(values).repairAddressList[1]
            : '',
          repair_a_id: toJS(values).repairAddressList
            ? toJS(values).repairAddressList[2]
            : '',
          repair_address: values.repair_address,
          attachment: values.attachment,
          income_type: values.income_type,
          income_exp_com: values.income_exp_com ? values.income_exp_com : '',
          income_exp_no: values.income_exp_no ? values.income_exp_no : '',
          malfunction_id: values.malfunction_id,
          malf_desc: values.malf_desc,
          pick_method: values.pick_method,
          receive_name: values.receive_name ? values.receive_name : '',
          receive_phone: values.receive_phone ? values.receive_phone : '',
          receive_p_id: toJS(values).receiveAddressList
            ? toJS(values).receiveAddressList[0]
            : '',
          receive_c_id: toJS(values).receiveAddressList
            ? toJS(values).receiveAddressList[1]
            : '',
          receive_a_id: toJS(values).receiveAddressList
            ? toJS(values).receiveAddressList[2]
            : '',
          receive_address: values.receive_address ? values.receive_address : ''
        }).then((data: any) => {
          this.props.history.replace('/taskList/CreatSuccess', data);
        });
      }
    });
  };
  // 根据报修人电话获取报修人信息
  changePhone = (e: any) => {
    const { getRepairByPhone } = this.props.TaskListStore;
    if (!!e.target.value) {
      getRepairByPhone({ phone: e.target.value });
    }
  };
}
export default Form.create()(CreateWorkOrder);
