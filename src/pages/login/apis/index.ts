import { post } from 'app/fetch';

// http://rap.sunmi.cn/repository/editor?id=54&mod=347&itf=1697

export function loginByCode (options: any) {
    const opts = {
      v_code: options.v_code,
      phone: options.phone,
      is_remember: options.is_remember
    };
    const api = '/station/user/loginByVCode';
    return post(api, opts);
}

export function loginByPwd (options: any) {
    const opts = {
      account: options.account,
      password: options.password,
      is_remember: options.is_remember
    };
    const api = '/station/user/loginByPassword';
    return post(api, opts);
}

export function isFistLogin (options: any) {
    const opts = {
      phone: options.account,
    };
    const api = '/station/user/isFirstLogin';
    return post(api, opts);
}

export function createNewPassword (options: any) {
    const opts = {
      phone: options.phone,
      password: options.password,
    };
    const api = '/station/user/createNewPassword';
    return post(api, opts);
}

export function fpNewPassword (options: any) {
    const opts = {
      phone: options.phone,
      password: options.password,
      v_code: options.v_code,
    };
    const api = '/station/user/fpNewPassword';
    return post(api, opts);
}

export function editPassword (options: any) {
    const opts = {
      password: options.password,
      oldPass: options.oldPass,
    };
    const api = '/station/user/editPassword';
    return post(api, opts);
}

export function getSMSCode (options: any) {
    const opts = {
      phone: options.phone,
      sms_type: 'CS_USER_LOGIN'
    };
    const api = '/weixin/repair/sendsms';
    return post(api, opts);
}
