import { message } from 'antd';
import { Svg } from 'app/ui/svg';
import { inject, observer } from 'mobx-react';
import React from 'react';
import styles from './ForgetPwd.scss';

@inject('forgetPwdStore')
@observer
export default class ForgetPwd extends React.Component<any, any> {
    store: any;
    options: { phone: string; v_code: string; };

    constructor(props: any) {
        super(props);
        this.store = this.props.forgetPwdStore;
        this.options = {
          phone: '',
          v_code: ''
        };
    }

    _sendCode = () => {
        if (!this.options.phone || this.options.phone.length !== 11) {
          message.warn('请输入正确的手机号');
          return;
        }
        if (!this.store.code.isDisble) {
            this.store.getVCode(this.options);
        }
    }

    phoneInputChnage = (e: any) => {
      this.options.phone = e.target.value;
    }

    vCodeInputChange = (e: any) => {
      this.options.v_code = e.target.value;
    }

    next = async () => {
      if (!this.options.phone || this.options.phone.length !== 11) {
        message.warn('请输入正确的手机号');
        return;
      }
      if (!this.options.v_code) {
        message.warn('请输入短信验证码');
        return;
      }
      const status = await this.store.forgetPwd(this.options);
      if (status === 'success') {
          const {history} = this.props;
          const phone = this.options.phone;
          const code = this.options.v_code;
          history.push(`/updatePwd?phone=${phone}&first=2&code=${code}`);
      }
    }

    render() {
        return (
            <div className={styles.container}>
            <img 
              src={require('../image/logo_img.png')} 
              className={styles.logo_img}
            />
                <div className={styles.content}>
                    <Svg name="logo" className={styles.logo} />
                    <span className={styles.shangmi}>商米服务平台</span>
                    <span className={styles.english}>
                        Sunmi Service Platform</span>
                    <span className={styles.forgetText}>忘记密码</span>

                    <div className={styles.phoneLogin}>
                        <div className={styles.phoneCon}>
                            <div className={styles.area}>
                                <span className={styles.china}>+86</span>
                            </div>
                            <input
                                placeholder="请输入您的手机号"
                                className={styles.phoneInput}
                                onChange={this.phoneInputChnage}
                            />
                            <span
                                className={this.store.code.isDisble ?
                                    styles.grayCode : styles.code}
                                onClick={this._sendCode}
                            >
                                {this.store.code.codeText}
                            </span>
                        </div>
                        <div className={styles.codeCon}>
                            <input
                                placeholder="请输入短信验证码"
                                className={styles.input}
                                onChange={this.vCodeInputChange}
                            />
                        </div>
                    </div>
                    <div className={styles.loginBtn} onClick={this.next}>
                        <span className={styles.loginText}>下一步</span>
                   </div>
                </div>
            </div>
        );
    }

}
