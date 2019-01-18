import { Button, DatePicker, Form, Icon , Input } from 'antd';
import { If , withCommonFoot , withCommonHead , withProvider } from 'app/ui';
import { Svg } from 'app/ui/svg';
import { inject, observer } from 'mobx-react';
import React from 'react';
import DemoChild from '../compoment/DemoChild';
import { demoContext } from '../helpers/context';
import styles from './PageA.scss';
const FormItem = Form.Item;

const InputItem = (props: any) => {
  const {getFieldDecorator} = props;
  return (
    <FormItem>
    {getFieldDecorator(props.type, {
      rules: [{ required: props.required,
      message: props.errMsg }],
      initialValue: '111'
    })(
      <Input
        placeholder= {props.placeholder}
        type={props.type}
        className={styles.input}
      />
    )}
  </FormItem>
  );
};

@withProvider(demoContext, {test: 'PageA'})
@withCommonHead
@withCommonFoot
@inject('demoStore')
@observer
class PageA extends React.Component<any, any> {
  store: any;

  constructor(props: any) {
    super(props);
    this.store = this.props.demoStore;
  }
    componentDidMount() {
        this.props.demoStore.getData({});
    }

    handleSubmit = (e: any) => {
      e.preventDefault();
      this.props.form.validateFields((err: any, values: any) => {
        if (!err) {
          // tslint:disable-next-line:no-console
          console.log('Received values of form: ', values);
        }
      });
    }

    render() {
      const { getFieldDecorator } = this.props.form;
      return (
            <div className={styles.container}>pageA{this.props.demoStore.name}
                <Button type="primary"> 哈哈</Button>
                <Svg name="logo" className={styles.img} />
                <DemoChild/>
                <Form onSubmit={this.handleSubmit}>
                  <div className={styles.login}>
                 <InputItem
                  placeholder="请输入名字"
                  errMsg="请先输入name"
                  type="username"
                  required={true}
                  getFieldDecorator={getFieldDecorator}
                 />
                 <InputItem
                  placeholder="请输入密码"
                  errMsg="请先输入pwd"
                  type="pwd"
                  required={true}
                  getFieldDecorator={getFieldDecorator}
                 />
                    <Button
                      type="primary"
                      htmlType="submit"
                      className="login-form-button"
                    >
                      Log in
                    </Button>
                    </div>
                </Form>
            </div>
        );
    }

}
export default Form.create()(PageA);
