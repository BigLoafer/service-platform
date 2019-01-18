import { message } from 'antd';
import { setToken } from 'app/services/authority';
import { action, computed, observable } from 'mobx';
import {
  createNewPassword,
  editPassword,
  fpNewPassword,
  getSMSCode ,
  isFistLogin,
  loginByCode,
  loginByPwd
} from '../apis';

class LoginStore {
  timer: any;
  @observable name = '';
  @observable code = {
    isDisble: true,
    time: 60,
    codeText: '获取验证码',
  };
  @observable data = [
    { desc: '手机号登录', selected: true },
    { desc: '账号密码登录', selected: false },
  ];
  @observable errorMessage = '';
  @observable value = {
    phoneInputValue: '',
    codeInputValue: '',
    accountInputValue: '',
    pwdInputValue: '',
    type: 'text',
    isReadOnly: true
  };

  @action
  loginByCode = async (options: any) => {
    try {
      const json: any = await loginByCode(options);
      if (json.data.is_pass === -1) {
        setToken(json.data.token);
        return 'first';
      } else {
        setToken(json.data.token);
        return 'success';
      }
    } catch (error) {
      // message.error(error.msg);
      this.errorMessage = error.msg;
      return 'fail';
    }
  }

  @action
  init = () => {
    this.value.accountInputValue = '';
    this.value.pwdInputValue = '';
    this.value.phoneInputValue = '';
    this.value.codeInputValue = '';
    this.code.time = 60 ;
    this.code.isDisble = true ;
    this.code.codeText = '获取验证码';
  }

  @action
  isFirstLogin = async (options: any) => {
    try {
      const json: any = await isFistLogin(options);
      // tslint:disable-next-line:no-unused-expression
      json.msg && message.error(json.msg);
    } catch (error) {
      // message.error(error.msg);
      this.errorMessage = error.msg;
    }
  }

  @action
  loginByAccount = async (options: any) => {
    try {
      const json: any = await loginByPwd(options);
      setToken(json.data.token);
      return 'success';
    } catch (error) {
      // message.error(error.msg);
      this.errorMessage = error.msg;
      return 'fail';
    }
  }

  @action
  getCode = async (options: any) => {
    try {
      const josn = await getSMSCode(options);
      return 'success';
    } catch (error) {
      message.error(error.msg);
      return 'fail';
    }
  }

  @action
  createNewPwd = async (options: any) => {
    try {
      const json: any = await createNewPassword(options);
      message.success('创建成功');
      return json.data;
    } catch (error) {
      message.error(error.msg);
    }
  }

  @action
  forgetPwdNewPassword = async (options: any) => {
    try {
      const json = await fpNewPassword(options);
      return 'success';
    } catch (error) {
      message.error(error.msg);
    }
  }

  @action
  updatePwd = async (options: any) => {
    try {
      const json = await editPassword(options);
      return 'success';
    } catch (error) {
      message.error(error.msg);
    }
  }

  @action
  changeData = (opt: any) => {
    this.data.map((item, index) => {
      if (opt === index) {
        item.selected = true;
      } else {
        item.selected = false;
      }
    });
  }

  @computed
  get showPhoneLogin() {
    const selectedObj: any =
      this.data.find(item => item.selected === true);
    return selectedObj.desc === '手机号登录';
  }

  @action
  sendCode = () => {
    this.code.time = 60 ;
    this.code.time = this.code.time - 1;
    this.code.isDisble = true;
    this.code.codeText = `重新获取(${this.code.time})s`;
    this.handleCountDown();
  }

  handleCountDown = () => {
    this.timer = setInterval(
      () => {
        if (this.code.time > 1) {
          this.code.time = this.code.time - 1;
          this.code.codeText = `重新获取(${this.code.time})s`;
        } else {
          clearInterval(this.timer);
          this.code.isDisble = false;
          this.code.codeText = '获取验证码';
        }
   }, 1000);
  }

  clear = () => {
    clearInterval(this.timer);
  }

}
export default new LoginStore();
