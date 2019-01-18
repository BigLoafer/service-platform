import { Form, Input, Modal } from 'antd';
import { observer } from 'mobx-react';
import React from 'react';
export interface TaskSignInProps {
  taskSignVisible: any;
  form: any;
  taskSignInDetail: any;
  taskId?: any;
  taskSignIn: any;
  onCancel: any;
}
@observer
class TaskSignIn extends React.Component<TaskSignInProps> {
  render() {
    const { getFieldDecorator } = this.props.form;

    const formItemLayout = {
      labelCol: {
        xs: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 18 },
      },
    };
    const spanStyle: any = {
      height: '39px',
      lineHeight: '39px',
      display: 'inline-block',
      textAlign: 'right',
      width: '152px',
      color: 'rgba(0,0,0,.85)'
    };
    const { taskSignInDetail, taskSignVisible, onCancel } = this.props;
    return (
      <Modal
        title="设备签收"
        width={640}
        visible={taskSignVisible}
        onOk={this.signingSuccess}
        onCancel={onCancel}
      >
        <Form>
          <div style={{ marginBottom: '8px' }}>
            <span style={spanStyle}>报修人姓名：</span>
            <span>{taskSignInDetail.repair_name}</span>
          </div>
          <div style={{ marginBottom: '8px' }}>
            <span style={spanStyle}>报修人电话：</span>
            <span>{taskSignInDetail.repair_phone}</span>
          </div>
          <div style={{ marginBottom: '8px' }}>
            <span style={spanStyle}>问题描述：</span>
            <span>{taskSignInDetail.user_desc}</span>
          </div>
          <div style={{ marginBottom: '8px' }}>
            <span style={spanStyle}>设备型号：</span>
            <span>{taskSignInDetail.machine}</span>
          </div>
          <Form.Item {...formItemLayout} label="设备SN" >
            {getFieldDecorator('sn', {
              rules: [{
                required: true, message: '请输入SN',
              }],
              initialValue: taskSignInDetail.sn
            })(
              <Input
                style={{ width: '360px' }}
                placeholder="请输入SN"
              />
            )}
          </Form.Item>
          <Form.Item {...formItemLayout} label="来件快递单号" >
            {getFieldDecorator('express_no', {
              initialValue: taskSignInDetail.income_exp_no
            })(
              <Input
                style={{ width: '360px' }}
                placeholder="请输入来件快递单号"
              />
            )}
          </Form.Item>
          <Form.Item {...formItemLayout} label="收件设备清单" >
            {getFieldDecorator('attachment', {
              rules: [{
                required: true, message: '收件设备清单'
              }]
            })(
              <Input
                style={{ width: '360px' }}
                placeholder="整机，SIM卡，数据线等"
              />
            )}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
  // 确认签收事件
  signingSuccess = (e: any) => {
    e.preventDefault();
    const { taskId, taskSignIn, onCancel } = this.props;
    this.props.form.validateFields((err: any, values: any) => {
      const { getFieldValue } = this.props.form;
      if (!err) {
        taskSignIn({
          task_id: taskId,
          sn: getFieldValue('sn'),
          express_no: getFieldValue('express_no'),
          attachment: getFieldValue('attachment'),
        });
        onCancel();
      }
    });
  }
}
export default Form.create()(TaskSignIn);
