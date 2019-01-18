import { Alert, Checkbox } from 'antd';
import { If, Svg, timeout } from 'app/ui';
import { isChrome, isWin } from 'app/utils';
import { Debounce } from 'lodash-decorators';
import { inject, observer } from 'mobx-react';
import React from 'react';
import { task } from '../../taskList';
import styles from './login.scss';

@inject('loginStore')
@observer
export default class Login extends React.Component<any, any> {
  store: any;
  options: any;
  constructor(props: any) {
    super(props);
    this.store = this.props.loginStore;
    this.store.init();
    this.options = {
      phone: '',
      v_code: '',
      account: '',
      password: '',
      is_remember: -1
    };
  }

  componentDidMount() {
    this.changeInputReadOnly();
    const obj = task.routes.find(item => item.path === '/taskList');
    // tslint:disable-next-line:no-unused-expression
    obj && obj.component.preload();
  }

  @timeout(20)
  changeInputReadOnly() {
    this.store.value.isReadOnly = false;
  }

  componentWillUnmount() {
    this.store.clear();
  }

  clickItem = (index: any) => {
    this.store.changeData(index);
    this.store.errorMessage = '';
  };

  _sendCode = async () => {
    if (this.store.code.isDisble) {
      return;
    }
    if (
      this.options.phone.length !== 11 ||
      this.options.phone.indexOf('1') !== 0
    ) {
      // message.warn('请输入正确的电话号码');
      this.store.errorMessage = '请输入正确的电话号码';
      return;
    }
    const status = await this.store.getCode(this.options);
    if (status === 'success') {
      if (!this.store.code.isDisble) {
        this.store.sendCode();
      }
    }
  };

  cbChange = (e: any) => {
    if (e.target.checked) {
      this.options.is_remember = 1;
    } else {
      this.options.is_remember = -1;
    }
  };

  goToForgetPwd = () => {
    this.props.history.push('/forgetPwd');
  };

  down = () => {
    if (isWin()) {
      // tslint:disable-next-line:max-line-length
      window.location.href = 'http://sunmi-misun.oss-cn-hangzhou.aliyuncs.com/APK/Chrome%20for%20Windows%2064.exe';
    } else {
      // tslint:disable-next-line:max-line-length
      window.location.href = 'http://sunmi-misun.oss-cn-hangzhou.aliyuncs.com/APK/Chrome%20for%20mac.dmg';
    }
  };

  phoneInputChange = (e: any) => {
    this.store.value.phoneInputValue = e.target.value.replace(/[^\d]+/, '');
    this.options.phone = e.target.value.replace(/[^\d]+/, '');
    if (
      this.options.phone.length === 11 &&
      this.options.phone.indexOf('1') === 0
    ) {
      this.store.code.isDisble = false;
    } else {
      this.store.code.isDisble = true;
    }
  };

  codeChange = (e: any) => {
    this.store.value.codeInputValue = e.target.value.replace(/[^\d]+/, '');
    this.options.v_code = e.target.value.replace(/[^\d]+/, '');
  };

  accountChange = (e: any) => {
    this.store.value.accountInputValue = e.target.value.replace(/\s+/g, '');
    this.store.errorMessage = '';
    this.options.account = e.target.value.replace(/\s+/g, '');
    this.checkFirstLogin();
  };

  @Debounce(600)
  checkFirstLogin() {
    if (this.options.account) {
      this.store.isFirstLogin(this.options);
    }
  }

  pwdChange = (e: any) => {
    this.store.value.pwdInputValue = e.target.value.replace(/\s+/g, '');
    this.options.password = e.target.value.replace(/\s+/g, '');
  };

  pwdFocus = () => {
    this.store.value.type = 'password';
  };

  _onKeyUp = (e: any) => {
    if (e.keyCode === 13) {
      this.login();
    }
  };

  login = async () => {
    if (this.store.showPhoneLogin) {
      if (
        this.options.phone.length !== 11 ||
        this.options.phone.indexOf('1') !== 0
      ) {
        // message.warn('请输入正确的电话号码');
        this.store.errorMessage = '请输入正确的电话号码';
        return;
      }
      if (!this.options.v_code) {
        // message.warn('请输入短信验证码');
        this.store.errorMessage = '请输入短信验证码';
        return;
      }
    } else {
      if (!this.options.account) {
        // message.warn('请输入正确的账号');
        this.store.errorMessage = '请输入正确的账号';
        return;
      }
      if (!this.options.password) {
        // message.warn('请输入密码');
        this.store.errorMessage = '请输入密码';
        return;
      }
    }

    let status = '';

    if (this.store.showPhoneLogin) {
      status = await this.store.loginByCode(this.options);
    } else {
      status = await this.store.loginByAccount(this.options);
    }

    if ('success' === status) {
      this.props.history.replace('/taskList');
    } else if ('first' === status) {
      const { history } = this.props;
      history.replace(`/updatePwd?phone=${this.options.phone}&first=1`);
    }
  };

  renderPhoneLogin = () => {
    return (
      <div className={styles.phoneLogin}>
        <div className={styles.phoneCon}>
          <div className={styles.picCon}>
            <img src={require('../image/mobile.svg')} className={styles.tel} />
          </div>
          <input
            placeholder="请输入您的手机号"
            className={styles.input}
            onChange={this.phoneInputChange}
            maxLength={11}
            value={this.store.value.phoneInputValue}
            autoComplete="off"
            type="text"
          />
          <span
            className={this.store.code.isDisble ? styles.grayCode : styles.code}
            onClick={this._sendCode}
          >
            {this.store.code.codeText}
          </span>
        </div>
        <div className={styles.codeCon}>
          <div className={styles.picCon}>
            <img
              src={require('../image/code.svg')}
              className={styles.yanzhengma}
            />
          </div>
          <input
            placeholder="请输入短信验证码"
            className={styles.input}
            onChange={this.codeChange}
            value={this.store.value.codeInputValue}
            autoComplete="off"
            type="text"
            onKeyUp={this._onKeyUp}
          />
        </div>
      </div>
    );
  };

  renderAccountLogin = () => {
    return (
      <div className={styles.phoneLogin}>
        <div className={styles.phoneCon}>
          <div className={styles.picCon}>
            <img src={require('../image/account.svg')} className={styles.tel} />
          </div>
          <input
            placeholder="请输入您的账号"
            className={styles.input}
            maxLength={11}
            onChange={this.accountChange}
            value={this.store.value.accountInputValue}
            autoComplete="off"
            type="text"
          />
        </div>
        <div className={styles.codeCon}>
          <div className={styles.picCon}>
            <img
              src={require('../image/pwd.svg')}
              className={styles.yanzhengma}
            />
          </div>
          <input
            placeholder="请输入密码"
            className={styles.input}
            onChange={this.pwdChange}
            type={this.store.value.type}
            value={this.store.value.pwdInputValue}
            autoComplete="off"
            onFocus={this.pwdFocus}
            onKeyUp={this._onKeyUp}
            readOnly={this.store.value.isReadOnly}
          />
        </div>
      </div>
    );
  };

  renderRightInput = () => {
    return this.store.showPhoneLogin
      ? this.renderPhoneLogin()
      : this.renderAccountLogin();
  };

  renderLoginStyle = () => {
    return this.store.data.map((item: any, index: any) => {
      return (
        <div
          className={styles.loginItem}
          key={index}
          onClick={() => this.clickItem(index)}
        >
          <span
            className={
              item.selected ? styles.selectedText : styles.unselectedText
            }
          >
            {item.desc}
          </span>
          <div
            className={item.selected ? styles.selectedLine : styles.grayLine}
          />
        </div>
      );
    });
  };

  renderError = () => {
    return (
      <If data={this.store.errorMessage}>
        <div className={styles.errorCon}>
          <Svg name="error" className={styles.errorPic} />
          <span className={styles.errorText}>{this.store.errorMessage}</span>
        </div>
      </If>
    );
  };

  render() {
    return (
      <div className={styles.container}>
        <img 
          src={require('../image/logo_img.png')} 
          className={styles.logo_img} 
        />
        <div className={styles.loginCon}>
          <div className={styles.loginCon1}>
            <Svg name="logo" className={styles.logo} />
            <span className={styles.shangmi}>商米服务平台</span>
            <span className={styles.english}>Sunmi Service Platform</span>
            <div className={styles.loginStyleCon}>
              {this.renderLoginStyle()}
            </div>
            {this.renderRightInput()}
            {this.renderError()}
            <div className={styles.loginBtn} onClick={this.login}>
              <span className={styles.loginText}>登录</span>
            </div>
            <div className={styles.bottom}>
              <Checkbox onChange={this.cbChange}>5天内自动登录</Checkbox>
              <div className={styles.empty} />
              <span className={styles.forgetPwd} onClick={this.goToForgetPwd}>
                忘记密码
              </span>
            </div>
          </div>
        </div>
        <If data={!isChrome()}>
          <Alert
            className={styles.alert}
            message={
              <div>
                <Svg name="warning" className={styles.warn} />
                <span>为了保证系统正常运作,建议您使用谷歌浏览器</span>
                <span className={styles.down} onClick={this.down}>
                  点此下载
                </span>
              </div>
            }
            banner={true}
            closable={true}
            showIcon={false}
          />
        </If>
      </div>
    );
  }
}
