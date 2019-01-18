import { Col, Form, Input, Modal, Row } from 'antd';
import React from 'react';
export interface SendBackProps {
  taskId: any;
  sendBack: any;
  sendBackVisible: boolean;
  handleCancel: any;
}
class SendBackModal extends React.Component<any> {
  state = {
    inputVal: ''
  };
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
    const { handleCancel, sendBackVisible } = this.props;
    return (
      <Modal
        title="制作装箱单"
        width={640}
        visible={sendBackVisible}
        onOk={this.checkUpResultSuccess}
        onCancel={handleCancel}
      >
        <Form>
          <Form.Item {...formItemLayout} label="物流公司" >
            {getFieldDecorator('express_com', {
              rules: [{ required: true, message: '请输入物流公司' }],
            })(
              <Input style={{ width: '360px' }} placeholder="请输入物流公司" />
            )}
          </Form.Item>
          <Form.Item {...formItemLayout} label="物流单号" >
            {getFieldDecorator('express_no', {
              rules: [{ required: true, message: '请输入物流单号' }],
            })(
              <Input style={{ width: '360px' }} placeholder="请输入物流单号" />
            )}
          </Form.Item>
        </Form>
        <Row>
          <Col span={6}> {/*  */}</Col>
          <Col span={18}>
            <div style={{ fontSize: '36px' }}>{this.toThousands()}</div>
          </Col>
        </Row>
      </Modal>
    );
  }
  // 分词正则
  toThousands = () => {
    const { getFieldValue } = this.props.form;
    const value = getFieldValue('express_no');
    if (!value) {
      return;
    } else {
      return value.replace(/(\d{3})/g, '$1 ').replace(/\s*$/, '');
    }
  }

  // 验收事件
  checkUpResultSuccess = (e: any) => {
    e.preventDefault();
    const { taskId, sendBack, handleCancel } = this.props;
    this.props.form.validateFields((err: any, values: any) => {
      if (!err) {
        sendBack({
          task_id: taskId,
          express_com: values.express_com,
          express_no: values.express_no
        });
        handleCancel();
      }
    });
  }
}
export default Form.create()(SendBackModal);
