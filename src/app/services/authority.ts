import Des from './secure';

export function logout() {
    window.localStorage.clear();
}

export function setToken(str: string) {
    window.localStorage.setItem('token', Des.encrypt(str));
}

export function setUserInfo(data: any) {
    window.localStorage.setItem('userInfo', Des.encrypt(JSON.stringify(data)));
}

export function getUserInfo(str?: string) {
  const obj = window.localStorage.getItem('userInfo') || '{}';
  const josnString = Des.decrypt(obj);
  return str ? JSON.parse(josnString)[str] : JSON.parse(josnString);
}

export function getToken (key: string) {
  const temporaryToekn: any = window.localStorage.getItem('token');
  return temporaryToekn ? Des.decrypt(temporaryToekn) : '';
}
