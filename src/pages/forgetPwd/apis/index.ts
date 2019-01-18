import { post } from 'app/fetch';

// http://rap.sunmi.cn/repository/editor?id=54&mod=347&itf=1700

export function forgetPassword (options: any) {
  const opts = {
    phone: options.phone,
    v_code: options.v_code,
  };
  const api = '/station/user/forgetPassword';
  return post(api, opts);
}

export function getVCode (options: any) {
  const opts = {
    phone: options.phone,
    sms_type: 'CS_FORGET_PS',
  };
  const api = '/weixin/repair/sendsms';
  return post(api, opts);
}
