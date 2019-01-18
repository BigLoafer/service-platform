import { Cascader, Col, Form, Input, message, Radio, Row, Select } from 'antd';
const RadioGroup = Radio.Group;
import { If } from 'app/ui';
import React from 'react';
import styles from './CreatTwoStep.scss';
const FormItem = Form.Item;
export interface CreatTwoStepProps {
  options: any;
  form: any;
  malflist: any;
  changePhone: any;
  maintenanceInfo: any;
}

export default class CreatTwoStep extends React.Component<CreatTwoStepProps> {
  render() {
    // 表单项样式
    const formItemLayout = {
      labelCol: {
        xs: { span: 6 }
      },
      wrapperCol: {
        xs: { span: 18 }
      }
    };
    const formItemLayout1 = {
      labelCol: {
        xs: { span: 12 }
      },
      wrapperCol: {
        xs: { span: 12 }
      }
    };
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const { options, malflist, changePhone } = this.props;
    const inComeType = getFieldValue('income_type');
    const pickupType = getFieldValue('pick_method');
    return (
      <div>
        <Form>
          <div className={styles.client}>
            <p className={styles.title}>客户信息</p>
            <Row gutter={24}>
              <Col span={10}>
                <div>
                  <FormItem {...formItemLayout} label="报修人电话">
                    {getFieldDecorator('repair_phone', {
                      rules: [
                        {
                          required: true,
                          message: '请输入报修人电话'
                        }
                      ]
                    })(
                      <Input
                        onChange={changePhone}
                        placeholder="请输入报修人电话"
                        onBlur={this.getMaintenencInfo}
                      />
                    )}
                  </FormItem>
                </div>
              </Col>
              <Col span={14}>
                <div>
                  <FormItem {...formItemLayout} label="报修人姓名">
                    {getFieldDecorator('repair_name', {
                      rules: [
                        {
                          required: true,
                          message: '请输入报修人姓名'
                        }
                      ]
                    })(<Input placeholder="请输入报修人姓名" />)}
                  </FormItem>
                </div>
              </Col>
              <Col span={10}>
                <div className={styles.selectHeight}>
                  <Form.Item {...formItemLayout} label="报修人区域">
                    {getFieldDecorator('repairAddressList', {
                      rules: [{ required: true, message: '请输入报修人地址' }]
                    })(
                      <Cascader
                        options={options}
                        size="large"
                        placeholder="请选择区域"
                        style={{ width: '100%' }}
                      />
                    )}
                  </Form.Item>
                </div>
              </Col>
              <Col span={14}>
                <div>
                  <FormItem {...formItemLayout} label="报修人地址">
                    {getFieldDecorator('repair_address', {
                      rules: [
                        {
                          required: true,
                          message: '请输入报修人地址'
                        }
                      ]
                    })(<Input placeholder="请输入报修人地址" />)}
                  </FormItem>
                </div>
              </Col>
            </Row>
            <p className={styles.title}>报修详情</p>
            <Row gutter={24}>
              <Col span={10}>
                <div>
                  <FormItem {...formItemLayout} label="来件方式">
                    {getFieldDecorator('income_type', {
                      rules: [{ required: true, message: '请选择客户来件方式' }]
                    })(
                      <RadioGroup>
                        <Radio value={'1'}>快递寄送</Radio>
                        <Radio value={'2'}>到站送修</Radio>
                      </RadioGroup>
                    )}
                  </FormItem>
                </div>
              </Col>
              <Col span={14}>
                <Row>
                  <Col span={12}>
                    <If data={+inComeType === 1}>
                      <Form.Item {...formItemLayout1} label="来件快递公司">
                        {getFieldDecorator('income_exp_com', {
                          rules: [
                            {
                              required: true,
                              validator: (
                                rule: any,
                                val: any,
                                callback: any
                              ) => {
                                if (+inComeType === 1) {
                                  if (!val) {
                                    callback('请输入来件快递公司');
                                  }
                                }
                                callback();
                              },
                              message: '请输入来件快递公司'
                            }
                          ]
                        })(<Input placeholder="请输入来件快递公司" />)}
                      </Form.Item>
                    </If>
                  </Col>
                  <Col span={12}>
                    <If data={+inComeType === 1}>
                      <Form.Item {...formItemLayout1} label="来件物流单号">
                        {getFieldDecorator('income_exp_no', {
                          rules: [
                            {
                              required: true,
                              validator: (
                                rule: any,
                                val: any,
                                callback: any
                              ) => {
                                if (+inComeType === 1) {
                                  if (!val) {
                                    callback('请输入来件物流单号');
                                  }
                                }
                                callback();
                              },
                              message: '请输入来件物流单号'
                            }
                          ]
                        })(<Input placeholder="请输入来件物流单号" />)}
                      </Form.Item>
                    </If>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row>
              <Col span={10}>
                <div>
                  <FormItem {...formItemLayout} label="故障类别">
                    {getFieldDecorator('malfunction_id', {
                      rules: [{ required: true, message: '请选故障类别' }]
                    })(
                      <Select placeholder="请选故障类别">
                        {malflist.map((item: any) => {
                          return (
                            <Select.Option key={item.id} value={item.id}>
                              {item.fault_name}
                            </Select.Option>
                          );
                        })}
                      </Select>
                    )}
                  </FormItem>
                </div>
              </Col>
              <Col span={14}>
                <div>
                  <FormItem {...formItemLayout} label="问题描述">
                    {getFieldDecorator('malf_desc', {
                      rules: [
                        {
                          required: true,
                          message: '请输入问题描述'
                        }
                      ]
                    })(<Input placeholder="请输入问题描述" />)}
                  </FormItem>
                </div>
              </Col>
            </Row>
            <Row>
              <Col span={10}>
                <div>
                  <FormItem {...formItemLayout} label="收件设备附件">
                    {getFieldDecorator('attachment', {
                      rules: [
                        {
                          required: true,
                          message: '请输入收件设备附件'
                        }
                      ]
                    })(
                      <Input.TextArea
                        rows={4}
                        placeholder="请输入收件设备附件"
                      />
                    )}
                  </FormItem>
                </div>
              </Col>
            </Row>
            <p className={styles.title}>客户信息</p>
            <Row>
              <Col span={10}>
                <div>
                  <FormItem {...formItemLayout} label="取件方式">
                    {getFieldDecorator('pick_method', {
                      rules: [{ required: true, message: '请选择取件方式' }]
                    })(
                      <RadioGroup>
                        <Radio value={'2'}>到站自取</Radio>
                        <Radio value={'1'}>快递回寄</Radio>
                      </RadioGroup>
                    )}
                    <If data={+pickupType === 1}>
                      <a href="#" onClick={this.setPenson}>
                        寄回至报修人
                      </a>
                    </If>
                  </FormItem>
                </div>
              </Col>
              <If data={+pickupType === 1}>
                <Col span={14}>
                  <Row>
                    <Col span={12}>
                      <Form.Item {...formItemLayout1} label="收件电话">
                        {getFieldDecorator('receive_phone', {
                          rules: [
                            {
                              required: true,
                              validator: (
                                rule: any,
                                val: any,
                                callback: any
                              ) => {
                                if (+pickupType === 1) {
                                  if (!val) {
                                    callback('请输入收件电话');
                                  }
                                }
                                callback();
                              },
                              message: '请输入收件电话'
                            }
                          ]
                        })(<Input placeholder="请输入收件电话" />)}
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item {...formItemLayout1} label="收件人">
                        {getFieldDecorator('receive_name', {
                          rules: [
                            {
                              required: true,
                              validator: (
                                rule: any,
                                val: any,
                                callback: any
                              ) => {
                                if (+pickupType === 1) {
                                  if (!val) {
                                    callback('请输入收件人');
                                  }
                                }
                                callback();
                              },
                              message: '请输入收件人'
                            }
                          ]
                        })(<Input placeholder="请输入收件人" />)}
                      </Form.Item>
                    </Col>
                  </Row>
                </Col>
                <Col span={10}>
                  <div>
                    <FormItem {...formItemLayout} label="收件人地址">
                      {getFieldDecorator('receiveAddressList', {
                        rules: [
                          {
                            required: true,
                            validator: (rule: any, val: any, callback: any) => {
                              if (+pickupType === 1) {
                                if (!val) {
                                  callback('请选择收件人地址');
                                }
                              }
                              callback();
                            },
                            message: '请选择收件人地址'
                          }
                        ]
                      })(
                        <Cascader
                          options={options}
                          size="large"
                          placeholder="请选择区域"
                          style={{ width: '100%' }}
                        />
                      )}
                    </FormItem>
                  </div>
                </Col>
                <Col span={14}>
                  <div>
                    <FormItem {...formItemLayout} label="详细地址">
                      {getFieldDecorator('receive_address', {
                        rules: [
                          {
                            required: true,
                            validator: (rule: any, val: any, callback: any) => {
                              if (+pickupType === 1) {
                                if (!val) {
                                  callback('请输入来件物流单号');
                                }
                              }
                              callback();
                            },
                            message: '请输入详细地址'
                          }
                        ]
                      })(<Input placeholder="请输入详细地址" />)}
                    </FormItem>
                  </div>
                </Col>
              </If>
            </Row>
          </div>
        </Form>
      </div>
    );
  }
  setPenson = () => {
    const { setFieldsValue, getFieldValue } = this.props.form;
    const value = getFieldValue('pick_method');
    if (+value === 1) {
      setFieldsValue({ receive_name: getFieldValue('repair_name') });
      setFieldsValue({ receive_phone: getFieldValue('repair_phone') });
      setFieldsValue({ receive_address: getFieldValue('repair_address') });
      setFieldsValue({
        receiveAddressList: getFieldValue('repairAddressList')
      });
    }
  };
  getMaintenencInfo = () => {
    const { setFieldsValue } = this.props.form;
    const { maintenanceInfo } = this.props;
    if (!!maintenanceInfo.maintenance_person) {
      setFieldsValue({
        repair_name: maintenanceInfo.maintenance_person
      });
      setFieldsValue({
        repair_address: maintenanceInfo.maintenance_address
      });
      setFieldsValue({
        repairAddressList: [
          maintenanceInfo.maintenance_p_id,
          maintenanceInfo.maintenance_c_id,
          maintenanceInfo.maintenance_a_id
        ]
      });
    } else {
      message.error('未查询到报修人信息');
    }
  };
}
