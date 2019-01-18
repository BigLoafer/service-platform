import { Form, Input, InputNumber, Modal, Radio, Select, Table } from 'antd';

import { If } from 'app/ui';
const RadioGroup = Radio.Group;
const Option = Select.Option;
import _ from 'lodash';
import { observable, toJS } from 'mobx';
import { inject } from 'mobx-react';
import React from 'react';
import styles from './EditMalfunction.scss';
import UploadImg from './UploadImg';

export interface MyTaskListTableProps {
  detectionVisible: any;
  closeCancel: any;
  confirmSuccess: any;
  malfunctionid: any;
  form?: any;
}
@inject('TaskListStore')
class EditMalfunction extends React.Component<MyTaskListTableProps & any> {
  @observable newArr = [];
  @observable totalArr = [];
  @observable total = 0;
  temPrice = 0;
  state = {
    disabled: true
  };
  render() {
    let editTotal = 0;
    this.props.TaskListStore.state.checkMaterialLists.map((item: any) => {
      if (item.num) {
        editTotal = editTotal + Number(item.num) * parseFloat(item.price);
      } else {
        editTotal = 0;
      }
    });
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const columns = [
      {
        title: '物料编码',
        dataIndex: 'material_code',
        key: 'material_code',
        render: (text: any) => <span>{text}</span>
      },
      {
        title: '物料名称',
        dataIndex: 'material_name',
        key: 'material_name'
      },
      {
        title: '数量',
        dataIndex: 'num',
        key: 'num',
        render: (text: any, record: any, index: number) => {
          this.temPrice = record.price;
          return (
            <div className={styles.inputStyle}>
              <InputNumber
                style={{ width: '100px' }}
                value={record.num}
                min={1}
                onChange={e => this.changeNumber(index, { num: e })}
              />
            </div>
          );
        }
      },
      {
        title: '单价',
        dataIndex: 'price',
        key: 'price'
      },
      {
        title: '操作',
        key: 'action',
        render: (text: any, record: any) => {
          return (
            <span
              style={{ color: '#6590dc', cursor: 'pointer' }}
              onClick={() => this.delete(record.material_id)}
            >
              删除
            </span>
          );
        }
      }
    ];

    const repairType = getFieldValue('repair_type');
    const norGuaranteeType = getFieldValue('not_guar_type');
    const {
      checkMaterialLists,
      materialBySnList,
      malflist
    } = this.props.TaskListStore.state;

    const { problem } = this.props.TaskListStore.state.taskDetail;
    return (
      <Modal
        title="故障诊断"
        width={640}
        visible={this.props.detectionVisible}
        onOk={this.confirmSuccess}
        onCancel={this.props.closeCancel}
      >
        <Form>
          <Form.Item label="维修类型">
            {getFieldDecorator('repair_type', {
              rules: [{ required: true, message: '请选择维修类型' }],
              initialValue: String(problem.repair_type)
            })(
              <RadioGroup disabled={true}>
                <Radio value="1">保内</Radio>
                <Radio value="2">非保</Radio>
              </RadioGroup>
            )}
          </Form.Item>
          <If data={repairType}>
            {/* 新增字段 */}
            <Form.Item label="故障类别">
              {getFieldDecorator('malf_id', {
                rules: [
                  {
                    required: true,
                    validator: (rule: any, val: any, callback: any) => {
                      if (repairType) {
                        if (!val) {
                          callback('请选择故障类别');
                        }
                      }
                      callback();
                    },
                    message: '请选择故障类别'
                  }
                ],
                initialValue: String(problem.malf_id)
              })(
                <div>
                  <Select
                    style={{ width: '100%' }}
                    placeholder="请选择故障类别"
                    value={this.props.TaskListStore.state.malTwoFid}
                    onChange={this.changemalfunction}
                  >
                    {malflist.map((item: any) => {
                      return (
                        <Option value={Number(item.id)} key={String(item.id)}>
                          {item.fault_name}
                        </Option>
                      );
                    })}
                  </Select>
                </div>
              )}
            </Form.Item>
          </If>
          <If data={+repairType === 2}>
            <Form.Item label="非保类型">
              {getFieldDecorator('not_guar_type', {
                rules: [
                  {
                    required: true,
                    validator: (rule: any, val: any, callback: any) => {
                      if (+repairType === 2) {
                        if (!val) {
                          callback('请选择非保类型');
                        }
                      }
                      callback();
                    },
                    message: '请选择非保类型'
                  }
                ],
                initialValue: String(problem.no_gur_type)
              })(
                <RadioGroup onChange={this.changeGuarantee}>
                  <Radio value={'1'}>超出保修期</Radio>
                  <Radio value={'2'}>人为非保</Radio>
                </RadioGroup>
              )}
            </Form.Item>
            <Form.Item label="非保原因">
              {getFieldDecorator('not_guarantee', {
                rules: [
                  {
                    required: true,
                    validator: (rule: any, val: any, callback: any) => {
                      if (+repairType === 2) {
                        if (!val) {
                          callback('请输入非保原因');
                        }
                      }
                      callback();
                    },
                    message: '请输入非保原因'
                  }
                ],
                initialValue: problem.not_guarantee
                  ? problem.not_guarantee
                  : '超出保修期'
              })(
                <Input
                  disabled={
                    +norGuaranteeType === 2 ? false : this.state.disabled
                  }
                  placeholder="请输入非保原因"
                />
              )}
            </Form.Item>
          </If>
          <If data={+repairType}>
            <Form.Item label="实际故障">
              {getFieldDecorator('pb_fact', {
                rules: [{ required: true, message: '请输入实际故障' }],
                initialValue: problem.pb_fact
              })(<Input placeholder="请输入实际故障" />)}
            </Form.Item>
            <Form.Item label="维修方案">
              {getFieldDecorator('solution', {
                rules: [
                  {
                    required: true,
                    message: '请输入维修方案'
                  }
                ],
                initialValue: problem.solution
              })(<Input placeholder="请输入维修方案" />)}
            </Form.Item>
          </If>
          <If data={+repairType === 1 || +repairType === 2}>
            <Form.Item label="添加收费项目">
              {getFieldDecorator('materials', {
                rules: [
                  {
                    required: true,
                    validator: (rule: any, val: any, callback: any) => {
                      if (+repairType !== 3) {
                        if (!val) {
                          callback('请选择收费项目');
                        }
                      }
                      callback();
                    },
                    message: '请选择收费项目'
                  }
                ],
                initialValue: this.props.TaskListStore.state.materielss
              })(
                <div>
                  <Select
                    placeholder="请选择收费项目"
                    onSelect={this.checkMaterial}
                    showSearch={true}
                    style={{ width: '100%' }}
                    optionFilterProp="children"
                  >
                    {materialBySnList.map((item: any) => {
                      return (
                        <Option
                          disabled={item.disable ? true : false}
                          key={item.material_id}
                        >
                          {item.material_name}
                        </Option>
                      );
                    })}
                  </Select>
                  <Table
                    pagination={false}
                    columns={columns}
                    dataSource={toJS(checkMaterialLists)}
                    rowKey={(__: any, index: any) => index.toString()}
                  />
                  <p style={{ textAlign: 'right' }}>
                    总价：
                    {this.total === 0 ? editTotal : this.total}
                  </p>
                </div>
              )}
            </Form.Item>
          </If>
          <If data={+repairType === 2}>
            <Form.Item label="故障图片（非必要）">
              {getFieldDecorator('pb_pics', {
                initialValue: this.props.TaskListStore.state.oldPic
              })(
                <UploadImg
                  onChange={this.changePic}
                  maxCount={50}
                  topTip={`建议尺寸480*480`}
                />
              )}
            </Form.Item>
          </If>
        </Form>
      </Modal>
    );
  }
  changeGuarantee = (e: any) => {
    const { value } = e.target;
    const { setFieldsValue } = this.props.form;
    if (+value === 1) {
      setFieldsValue({ not_guarantee: '超出保修期' });
      this.setState({
        disabled: true
      });
    } else {
      setFieldsValue({ not_guarantee: '' });
      this.setState({
        disabled: false
      });
    }
  };
  // 更新照片数量
  changePic = (value: any) => {
    this.props.TaskListStore.setState({
      oldPic: value
    });
  };
  changemalfunction = (e: any) => {
    const { setFieldsValue } = this.props.form;
    setFieldsValue({ malf_id: e });
    this.props.TaskListStore.setState({
      malTwoFid: e
    });
  };
  confirmSuccess = (e: any) => {
    e.preventDefault();
    const { detect, state } = this.props.TaskListStore;
    const { checkMaterialLists, oldPic } = state;
    const { malTwoFid } = this.props.TaskListStore.state;
    const arr: any = [];
    checkMaterialLists.map((item: any) => {
      const obj = { m_id: item.material_id, num: item.num };
      arr.push(obj);
    });
    this.props.form.validateFields((err: any, values: any) => {
      if (!err) {
        detect({
          task_id: this.props.taskId,
          malf_id: malTwoFid,
          pb_fact: values.pb_fact,
          solution: values.solution,
          not_guar_type:
            +values.not_guar_type === 0 ? '' : values.not_guar_type,
          not_guarantee: values.not_guarantee ? values.not_guarantee : '',
          materials: arr,
          pb_pics: oldPic,
          repair_type: values.repair_type ? values.repair_type : '',
          action_type: 2
        });
        this.props.closeCancel();
      }
    });
  };

  // 选择物料
  checkMaterial = (key: any) => {
    const {
      materialBySnList,
      checkMaterialLists
    } = this.props.TaskListStore.state;

    const obj: any = materialBySnList.find(
      (item: any) => item.material_id === +key
    );
    obj.disable = true;
    materialBySnList.map((item: any) => {
      if (+item.material_id === +key) {
        checkMaterialLists.push(item);
      }
    });
    const newkkk = [...toJS(checkMaterialLists)];
    newkkk.splice(newkkk.length - 1, 1, {
      ...newkkk[newkkk.length - 1],
      ...{ num: 1 }
    });
    this.total = 0;
    newkkk.map((item: any) => {
      if (item.num) {
        this.total += Number(item.num) * parseFloat(item.price);
      }
    });
    this.props.TaskListStore.setState({
      checkMaterialLists: newkkk
    });
  };
  delete = (id: any) => {
    const {
      checkMaterialLists,
      materialBySnList
    } = this.props.TaskListStore.state;
    const newData = checkMaterialLists;
    _.remove(newData, (n: any) => {
      return n.material_id === id;
    });
    this.total = 0;
    newData.map((item: any) => {
      if (item.num) {
        this.total = this.total + Number(item.num) * parseFloat(item.price);
      }
    });
    const obj: any = materialBySnList.find(
      (item: any) => item.material_id === +id
    );
    obj.disable = false;
    this.props.TaskListStore.setState({
      checkMaterialLists: newData
    });
  };
  // 更改数量
  changeNumber = (index: number, e: any) => {
    const newData = [...this.props.TaskListStore.state.checkMaterialLists];
    newData.splice(index, 1, { ...newData[index], ...e });
    this.props.TaskListStore.setState({
      checkMaterialLists: newData
    });
    this.total = 0;
    newData.map((item: any) => {
      if (item.num) {
        this.total = this.total + Number(item.num) * parseFloat(item.price);
      }
    });
  };
}
export default Form.create()(EditMalfunction);
