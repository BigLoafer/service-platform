import { Cascader, Form, Input, Modal, Radio, Select } from 'antd';
const Option = Select.Option;
const RadioGroup = Radio.Group;
import { getUserInfo } from 'app/services';
import { If } from 'app/ui';
import { toJS } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import styless from './UpGrade.scss';

export interface UpGradeProps {
  upGradeVisible: any;
  form: any;
  taskId: any;
  UpGradeFun: any;
  onCancel: any;
  stationList: any;
  options: any;
  changeStation: any;
  stationInfo: any;
  stationId: any;
  getStationDetail: any;
}
@observer
class UpGrade extends React.Component<UpGradeProps> {
  render() {
    const { getFieldDecorator } = this.props.form;

    const formItemLayout = {
      labelCol: {
        xs: { span: 6 }
      },
      wrapperCol: {
        xs: { span: 18 }
      }
    };
    const {
      upGradeVisible,
      onCancel,
      stationList,
      options,
      changeStation,
      stationInfo
    } = this.props;
    const styles: any = {
      lineHeight: '24px',
      marginBottom: '8px'
    };
    return (
      <Modal
        title="任务升级"
        width={640}
        visible={upGradeVisible}
        onOk={this.upgradeSuccess}
        onCancel={onCancel}
      >
        <Form>
          <Form.Item {...formItemLayout} label="接收站点">
            {getFieldDecorator('station_id', {
              rules: [
                {
                  required: true,
                  message: '请选择接收站点'
                }
              ]
            })(
              <Select
                style={{ width: '360px' }}
                placeholder="请选择接收站点"
                onChange={changeStation}
              >
                {stationList.map((item: any) => {
                  return (
                    <Option
                      key={String(item.station_id)}
                      value={Number(item.station_id)}
                    >
                      {item.station_name}
                    </Option>
                  );
                })}
              </Select>
            )}
          </Form.Item>
          <If data={toJS(stationInfo).username}>
            <div style={{ marginLeft: '25%', marginBottom: '24px' }}>
              <p style={styles}>联系人：{stationInfo.username}</p>
              <p style={styles}>联系电话：{stationInfo.phone}</p>
              <p style={styles}>
                地址：{stationInfo.province}
                {stationInfo.city}
                {stationInfo.area}
                {stationInfo.address}
              </p>
            </div>
          </If>
          <Form.Item {...formItemLayout} label="物流公司">
            {getFieldDecorator('express_com', {
              rules: [
                {
                  required: true,
                  message: '请输入物流公司'
                }
              ]
            })(
              <Input style={{ width: '360px' }} placeholder="请输入物流公司" />
            )}
          </Form.Item>
          <Form.Item {...formItemLayout} label="物流单号">
            {getFieldDecorator('express_no', {
              rules: [
                {
                  required: true,
                  message: '请输入物流单号'
                }
              ]
            })(
              <Input style={{ width: '360px' }} placeholder="请输入物流单号" />
            )}
          </Form.Item>
          <Form.Item {...formItemLayout} label="回寄至">
            {getFieldDecorator('send_back_type', {
              rules: [
                {
                  required: true,
                  message: '请选择回寄类型'
                }
              ]
            })(
              <RadioGroup onChange={this.changeReturnType}>
                <Radio value={'1'}>本站</Radio>
                <Radio value={'2'}>客户</Radio>
              </RadioGroup>
            )}
          </Form.Item>
          <Form.Item {...formItemLayout} label="收件电话">
            {getFieldDecorator('rec_phone', {
              rules: [
                {
                  required: true,
                  message: '请输入收件电话'
                }
              ]
            })(
              <Input style={{ width: '360px' }} placeholder="请输入收件电话" />
            )}
          </Form.Item>
          <Form.Item {...formItemLayout} label="收件人">
            {getFieldDecorator('rec_name', {
              rules: [
                {
                  required: true,
                  message: '请输入收件人姓名'
                }
              ]
            })(
              <Input
                style={{ width: '360px' }}
                placeholder="请输入收件人姓名"
              />
            )}
          </Form.Item>
          <Form.Item {...formItemLayout} label="收件人地址">
            {getFieldDecorator('receiveAddressList', {
              rules: [
                {
                  required: true,
                  message: '请选择收件人地址'
                }
              ]
            })(
              <Cascader
                options={options}
                size="large"
                placeholder="请选择区域"
                style={{ width: '360px' }}
                className={styless.addressSelect}
              />
            )}
          </Form.Item>
          <Form.Item {...formItemLayout} label="详细地址">
            {getFieldDecorator('rec_address', {
              rules: [
                {
                  required: true,
                  message: '请输入详细地址'
                }
              ]
            })(
              <Input style={{ width: '360px' }} placeholder="请输入详细地址" />
            )}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
  changeReturnType = (e: any) => {
    const { setFieldsValue } = this.props.form;
    const { value } = e.target;
    if (+value === 1) {
      this.props
        .getStationDetail({
          station_id: getUserInfo('station_id')
        })
        .then((data: any) => {
          setFieldsValue({
            rec_name: data.username,
            rec_phone: data.phone,
            rec_address: data.address,
            receiveAddressList: [data.p_id, data.c_id, data.a_id]
          });
        });
    } else {
      setFieldsValue({
        rec_name: '',
        rec_phone: '',
        rec_address: '',
        receiveAddressList: [],
        rec_p_id: '',
        rec_c_id: '',
        rec_a_id: ''
      });
    }
  };

  // 确认签收事件
  upgradeSuccess = (e: any) => {
    e.preventDefault();
    const { taskId, onCancel, UpGradeFun } = this.props;
    this.props.form.validateFields((err: any, values: any) => {
      if (!err) {
        UpGradeFun({
          task_id: taskId,
          station_id: values.station_id,
          express_com: values.express_com,
          express_no: values.express_no,
          send_back_type: values.send_back_type,
          rec_name: values.rec_name,
          rec_phone: values.rec_phone,
          rec_p_id: values.receiveAddressList[0],
          rec_c_id: values.receiveAddressList[1],
          rec_a_id: values.receiveAddressList[2],
          rec_address: values.rec_address
        });
        onCancel();
      }
    });
  };
}
export default Form.create()(UpGrade);
