import { Form, Input, InputNumber, Modal, Radio, Select, Table } from 'antd';
const RadioGroup = Radio.Group;
import { If } from 'app/ui';
import _ from 'lodash';
import { observable, toJS } from 'mobx';
import { inject } from 'mobx-react';
import React from 'react';
import styles from './DetectionModal.scss';
import UploadImg from './UploadImg';
export interface DetectionProps {
  visible: boolean;
  form: any;
  taskId?: any;
  onCancel: any;
  detect: any;
  TaskListStore?: any;
  malfunctionid: any;
  problem?: any;
}
@inject('TaskListStore')
class DetectionModal extends React.Component<DetectionProps, any> {
  @observable total = 0;
  temPrice = 0;
  render() {
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
                defaultValue={record.num}
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
        render: (text: any, record: any) => (
          <span
            style={{ color: '#6590dc', cursor: 'pointer' }}
            onClick={() => this.delete(record.material_id)}
          >
            删除
          </span>
        )
      }
    ];

    // 表单项样式
    const {
      materialBySnList,
      malflist,
      checkMaterialList,
    } = this.props.TaskListStore.state;
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const { visible, onCancel } = this.props;
    const repairType = getFieldValue('repair_type');
    const norGuaranteeType = getFieldValue('not_guar_type');

    return (
      <Modal
        visible={visible}
        title="故障检测"
        width={640}
        onOk={this.detectionSuccess}
        onCancel={onCancel}
      >
        <Form>
          <Form.Item label="维修类型">
            {getFieldDecorator('repair_type', {
              rules: [{ required: true, message: '请选择维修类型' }]
            })(
              <RadioGroup onChange={this.changeType}>
                <Radio value={1}>保内</Radio>
                <Radio value={2}>非保</Radio>
              </RadioGroup>
            )}
          </Form.Item>
          <If data={repairType}>
            {/* 新增字段 */}
            <Form.Item label="故障类别" className={styles.item1}>
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
                ]
              })(
                <div>
                  <Select
                    style={{ width: '100%' }}
                    placeholder="请选择故障类别"
                    value={String(this.props.TaskListStore.state.malfId)}
                    onChange={this.changemalfunction}
                  >
                    {malflist.map((item: any) => {
                      return (
                        <Select.Option value={String(item.id)} key={item.id}>
                          {item.fault_name}
                        </Select.Option>
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
                ]
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
                ]
              })(
                <Input
                  disabled={
                    +norGuaranteeType === 2 || !norGuaranteeType ? false : true
                  }
                  placeholder="请输入非保原因"
                />
              )}
            </Form.Item>
          </If>
          <If data={repairType}>
            <Form.Item label="实际故障">
              {getFieldDecorator('pb_fact', {
                rules: [{ required: true, message: '请输入实际故障' }]
              })(<Input placeholder="请输入实际故障" />)}
            </Form.Item>

            <Form.Item label="维修方案">
              {getFieldDecorator('solution', {
                rules: [
                  {
                    required: true,
                    message: '请输入维修方案'
                  }
                ]
              })(<Input placeholder="请输入维修方案" />)}
            </Form.Item>
            <Form.Item label="添加收费项目" className={styles.item1}>
              {getFieldDecorator('materiels', {
                rules: [
                  {
                    required: true,
                    message: '请选择收费项目'
                  }
                ]
              })(
                <div>
                  <Select
                    placeholder="请选择收费项目"
                    // onSelect={}
                    showSearch={true}
                    style={{ width: '100%' }}
                    onChange={this.checkMaterial}
                    optionFilterProp="children"
                  >
                    {materialBySnList.map((item: any) => {
                      return (
                        <Select.Option
                          disabled={item.disable}
                          value={String(item.material_id)}
                          key={item.material_id}
                        >
                          {item.material_name}
                        </Select.Option>
                      );
                    })}
                  </Select>
                  <Table
                    pagination={false}
                    columns={columns}
                    dataSource={toJS(checkMaterialList)}
                    rowKey={(__: any, index: any) => index.toString()}
                  />
                  <p style={{ textAlign: 'right' }}>
                    总价：{this.total ? this.total : 0}
                  </p>
                </div>
              )}
            </Form.Item>
          </If>
          <If data={+repairType === 2}>
            <Form.Item label="故障图片（非必要）">
              {getFieldDecorator('pb_pic')(
                <UploadImg maxCount={50} topTip={`建议尺寸480*480`} />
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
    } else {
      setFieldsValue({ not_guarantee: '' });
    }
  };
  changeType = () => {
    const { setFieldsValue } = this.props.form;
    setFieldsValue({ malf_id: this.props.malfunctionid });
    this.props.TaskListStore.setState({
      malfId: this.props.malfunctionid
    });
  };
  changemalfunction = (e: any) => {
    const { setFieldsValue } = this.props.form;
    setFieldsValue({ malf_id: e });
    this.props.TaskListStore.setState({
      malfId: e
    });
  };
  confirmSuccess = (e: any) => {
    e.preventDefault();
    const { problemDetection, clearProblemFormData } = this.props.TaskListStore;
    this.props.form.validateFields((err: any, values: any) => {
      if (!err) {
        problemDetection();
        clearProblemFormData();
        this.props.onCancel();
        this.props.TaskListStore.setState({
          checkMaterialList: []
        });
        this.total = 0;
      }
    });
  };

  // 选择物料
  checkMaterial = (key: any) => {
    const {
      materialBySnList,
      checkMaterialList
    } = this.props.TaskListStore.state;
    const { setFieldsValue } = this.props.form;
    materialBySnList.map((item: any) => {
      if (+item.material_id === +key) {
        checkMaterialList.push(item);
      }
    });
    const object: any = materialBySnList.find(
      (item: any) => item.material_id === Number(key)
    );
    object.disable = true;
    const newkkk = [...toJS(checkMaterialList)];
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
    const arr: any = [];
    newkkk.map((item: any) => {
      const obj = { m_id: item.material_id, num: 1 };
      arr.push(obj);
    });
    setFieldsValue({ materiels: arr });
    this.props.TaskListStore.setState({
      checkMaterialList: newkkk,
      materiels: arr
    });
  };
  delete = (id: any) => {
    const {
      checkMaterialList,
      materialBySnList
    } = this.props.TaskListStore.state;
    const newData = checkMaterialList;
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
    const newData = [...this.props.TaskListStore.state.checkMaterialList];
    newData.splice(index, 1, { ...newData[index], ...e });
    this.props.TaskListStore.setState({
      checkMaterialList: newData
    });
    this.total = 0;
    newData.map((item: any) => {
      if (item.num) {
        this.total = this.total + Number(item.num) * parseFloat(item.price);
      }
    });
    const arr: any = [];
    newData.map((item: any) => {
      const obj = { m_id: item.material_id, num: item.num };
      arr.push(obj);
    });

    this.props.TaskListStore.setState({
      materiels: arr
    });
  };
  // 确认检测事件
  detectionSuccess = (e: any) => {
    e.preventDefault();
    const { taskId, onCancel, detect } = this.props;
    const { malfId, materiels } = this.props.TaskListStore.state;
    this.props.form.validateFields((err: any, values: any) => {
      if (!err) {
        detect({
          task_id: taskId,
          malf_id: malfId,
          pb_fact: values.pb_fact,
          solution: values.solution,
          not_guar_type: values.not_guar_type ? values.not_guar_type : '',
          not_guarantee: values.not_guarantee ? values.not_guarantee : '',
          materials: toJS(materiels),
          pb_pics: values.pb_pic ? values.pb_pic : [],
          repair_type: values.repair_type ? values.repair_type : '',
          action_type: 1
        });
        onCancel();
        this.props.onCancel();
        this.props.TaskListStore.setState({
          checkMaterialList: []
        });
        this.total = 0;
      }
    });
  };
}
export default Form.create()(DetectionModal);
