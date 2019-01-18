import fetch from 'isomorphic-fetch';
import md5 from 'md5';
import { env, isEncrypted, md5Key } from './env';
import { getToken , logout } from './services';
import Des from './services/secure';

function resolveParams(params: any) {
    const normalizedParams = normalizeParams(params);
    return converParamsToFormData(normalizedParams);
}

function converParamsToFormData(params: any) {
    const myFormData = new FormData();
    Object.keys(params).forEach((key) => {
      myFormData.append(key, params[key]);
    });
    return myFormData;
  }

function normalizeParams(params: any) {
    const formData = {} as any;
    formData.timeStamp = Math.floor(new Date().getTime() / 1000);
    formData.randomNum = Math.floor(Math.random() * 1000000);
    formData.isEncrypted = isEncrypted;
    if (!params) {
      formData.params = '';
    } else {
      if (params.file) {
        formData.file = params.file;
        delete params.file;
      }
      formData.params = paramsEncode(params);
    }
    formData.sign = signEncode(formData);
    formData.lang = 'zh';
    return formData;
  }

function paramsEncode(params: any) {
    const paramsString = JSON.stringify(params);
    if (isEncrypted) {
      return Des.encrypt(paramsString);
    } else {
      return paramsString;
    }
  }

function signEncode(form: any) {
    if (!md5Key) {
      throw new Error('请检查配置文件！no md5Key');
    }
    const key = md5Key;
    const { params, timeStamp, randomNum } = form;
    return md5(params + isEncrypted + timeStamp + randomNum + md5(key));
  }

function getData(url: any, body: any, to: number) {
    const token = getToken('token');
    const globbalParams = {token, request_target: 'cs'};
    let baseUrl: any = '';
    if (to === 1) {
       baseUrl = getUrlByHost('webapi.serviceplat.sunmi.com');
    } else {
       baseUrl = getUrlByHost('webapi.sunmi.com');
    }
    return fetch(baseUrl + url, {
        body: resolveParams({...globbalParams, ...body}),
        method: 'POST',
    });
}

function getDataToolServer(url: any) {
    const toolUrl = process.env.SP_REMOTESERVER;
    return fetch(toolUrl + url, {
        method: 'GET'
    });
}

function getMockData(url: any) {
    const mockUrl =
    `${process.env.SP_RAP_SERVER}/${encodeURIComponent(url)}`;
    return fetch(mockUrl , {
        method: 'POST'
    });
}

function timeout(time: any) {
    const p = new Promise((resole, reject) => {
        setTimeout(
        () => {
            reject('网络好像不给力,请稍后再试');
     }, time);
    });
    return p;
}

function getUrlByHost(host: string ) {
    switch (env) {
        case 'dev':
        case 'test':
            return `http://${env}.${host}`;
        case 'uat':
            return `https://${env}.${host}`;
        case 'pub':
            return `https://${host}`;
        default:
            break;
    }
}
// to: 1 代表webapi.serviceplat.sunmi.com，非1 代表webapi.sunmi.com
export function post(url: any, body: any, to: number= 1 , time: number= 10000) {
    return new Promise((resolve, reject) => {
        Promise.race([getData(url, body, to), timeout(time)])
            .then((res: any) => res.json())
            .then((jsondata) => {
                if (jsondata) {
                    if (jsondata.code === 1) {
                        resolve(jsondata);
                    // tslint:disable-next-line:max-line-length
                    } else if (jsondata.code === 2317 || jsondata.code === 2334) {
                       logout();
                       if (!window.location.pathname.includes('login')) {
                        window.location.href = '/login';
                       }
                       reject(jsondata);
                    } else {
                        reject(jsondata);
                    }
                } else {
                    reject('您的网络好像不太给力,请稍后再试');
                }

            })
            .catch((error) => {
                reject(error);
            });
});
}

export function fetchToolServer(url: any, time: number= 10000) {
    return new Promise((resolve, reject) => {
        Promise.race([getDataToolServer(url), timeout(time)])
            .then((res: any) => res.text())
            .then((jsondata) => {
                if (jsondata) {
                    resolve(jsondata);
                } else { reject('您的网络好像不太给力,请稍后再试'); }

            })
            .catch((error) => {
                reject(error);
            });
});
}

export function fetchMock(url: any, time: number= 10000) {
  return new Promise((resolve, reject) => {
    Promise.race([getMockData(url), timeout(time)])
        .then((res: any) => res.json())
        .then((jsondata) => {
            if (jsondata) {
                resolve(jsondata);
            } else { reject('您的网络好像不太给力,请稍后再试'); }

        })
        .catch((error) => {
            reject(error);
        });
});
}
