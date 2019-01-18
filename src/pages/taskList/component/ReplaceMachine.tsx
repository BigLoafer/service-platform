import { Form, Input, Modal, Radio } from 'antd';
const RadioGroup = Radio.Group;
const { TextArea } = Input;

import { inject, observer } from 'mobx-react';
import React from 'react';

@inject('TaskListStore')
@observer
class ReplaceMachine extends React.Component<any> {
  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const { machineVisibe, closeMachineModal } = this.props;
    const customerAffirm = getFieldValue('customer_affirm');
    return (
      <Modal
        title="维修确认"
        width={640}
        visible={machineVisibe}
        onOk={this.handleOk}
        onCancel={closeMachineModal}
      >
        <Form>
          <Form.Item label="客户意愿">
            {getFieldDecorator('customer_affirm', {
              rules: [{ required: true, message: '请选择' }]
            })(
              <RadioGroup>
                <Radio value={'1'}>未决定</Radio>
                <Radio value={'2'}>确认维修</Radio>
                <Radio value={'3'}>取消维修</Radio>
              </RadioGroup>
            )}
          </Form.Item>
          <Form.Item label="备注">
            {getFieldDecorator('affirm_remark', {
              rules: [
                {
                  validator: (rule: any, val: any, callback: any) => {
                    if (+customerAffirm !== 2) {
                      if (!val) {
                        callback('请输入和客户的确认结果');
                      }
                    }
                    callback();
                  }
                }
              ]
            })(
              <TextArea
                rows={4}
                maxLength={200}
                placeholder="请输入和客户的确认结果"
              />
            )}
          </Form.Item>
        </Form>
      </Modal>
    );
  }

  handleOk = (e: any) => {
    const { taskId, closeMachineModal, customerConfirm } = this.props;
    e.preventDefault();
    this.props.form.validateFields((err: any, values: any) => {
      if (!err) {
        customerConfirm({
          task_id: taskId,
          customer_affirm: values.customer_affirm,
          affirm_remark: values.affirm_remark
        });
        closeMachineModal();
      }
    });
  };
}
export default Form.create()(ReplaceMachine);
