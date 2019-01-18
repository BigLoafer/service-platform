import { message } from 'antd';
import { getToken, logout , setToken } from 'app/services/authority';
import { If } from 'app/ui';
import { Svg } from 'app/ui/svg';
import { getQueryString } from 'app/utils/getUrlParam';
import { inject, observer } from 'mobx-react';
import React from 'react';
import styles from './UpdatePwd.scss';

@inject('loginStore')
@observer
export default class UpdatePwd extends React.Component<any, any> {
    first: any;
    phone: any;
    options: any;
    secondInputValue: any;
    store: any;
    code: any;
    edit: any;
    constructor(props: any) {
        super(props);
        this.store = this.props.loginStore;
        this.first = getQueryString('first');
        this.phone = getQueryString('phone');
        this.code = getQueryString('code');
        this.edit = getQueryString('edit');
        this.options = {
          phone: this.phone,
          password: '',
          v_code: this.code,
          oldPass: ''
        };
    }

    firstInputChange = (e: any) => {
      this.options.password = e.target.value;
    }

    secondInputChange = (e: any) => {
      this.secondInputValue = e.target.value;
    }

    oldPwdInputChange = (e: any) => {
      this.options.oldPass = e.target.value;
    }

    submit = async () => {
      const str = '^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$';
      if (!this.options.password.match(str)) {
        message.error('请输入6-16位的字母和数字，区分大小写');
        return;
      }
      if (this.options.password !== this.secondInputValue) {
        message.error('二次密码输入不一致');
        return ;
      }
      if (this.first === '1') {
        const data = await this.store.createNewPwd(this.options);
        setToken(data.token);
        this.props.history.replace('/');
      } else if (this.first === '2') {
        const status = await this.store.forgetPwdNewPassword(this.options);
        if ('success' === status) {
          this.props.history.replace('/login');
        }
      } else {
        const status = await this.store.updatePwd(this.options);
        if ('success' === status) {
          logout();
          this.props.history.replace('/login');
        }
      }

    }

    render() {
        return(
            <div className={styles.container}>
            <img 
              src={require('../image/logo_img.png')} 
              className={styles.logo_img}
            />
                <div className={styles.content}>
                    <Svg name="logo" className={styles.logo}/>
                    <span className={styles.shangmi}>商米服务平台</span>
                    <span className={styles.english}>
                        Sunmi Service Platform</span>
                    <span className={styles.forgetText}>
                    {this.first === '1' ? '创建密码' :
                    this.first === '2' ? '忘记密码' : '重置密码'}</span>
                    <div className={styles.phoneLogin}>
                        <If data={this.edit === '1'}>
                          <div className={styles.phoneCon}>
                              <input
                                  placeholder="请输入旧密码"
                                  className={styles.input}
                                  onChange={this.oldPwdInputChange}
                                  type="password"
                              />
                          </div>
                        </If>
                        <div className={styles.phoneCon}>
                            <input
                                placeholder="新密码必须是6-16位且包含字母和数字，区分大小写"
                                className={styles.input}
                                onChange={this.firstInputChange}
                                type="password"
                            />
                        </div>
                        <div className={styles.codeCon}>
                            <input
                                placeholder="请再次确认新密码"
                                className={styles.input}
                                onChange={this.secondInputChange}
                                type="password"
                            />
                        </div>
                    </div>
                    <div className={styles.submit} onClick={this.submit}>
                        <span
                          className={styles.submitText}
                        >提交
                        </span>
                    </div>
                </div>
            </div>
        );
    }

}
