import { message } from 'antd';
import { action, computed , observable } from 'mobx';
import { forgetPassword , getVCode } from '../apis';

class ForgetPwdStore {
    timer: any;
     @observable code = {
         isDisble: false,
         time: 60,
         codeText: '获取验证码'
     };

    @action
    getVCode = async (options: any) => {
      try {
        const json = await getVCode(options);
        this.sendCode();
        message.success('发送成功');
      } catch (error) {
        message.error(error.msg);
      }
    }

    @action
    forgetPwd = async (options: any) => {
      try {
        const json = await forgetPassword(options);
        return 'success';
      } catch (error) {
        message.error(error.msg);
        return 'fail';
      }
    }

     @action
     sendCode = () => {
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

 }
export default new ForgetPwdStore();
