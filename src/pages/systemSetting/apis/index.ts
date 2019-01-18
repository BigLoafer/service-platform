import { post } from 'app/fetch';

// http://rap.sunmi.cn/repository/editor?id=54&mod=346&itf=1683

export function getRegionData(options: any) {
    const api = '/admin/district/region';
    return post(api, options);
}

export function getSiteDetail(options: any) {
    const api = '/station/setting/stationDetail';
    return post(api, options);
}

export function editStation(options: any) {
    const api = '/station/setting/stationEdit';
    const opt = {
      time_start: options.time_start,
      time_end: options.time_end,
      comp_phone: options.comp_phone,
      contacts: options.contacts,
      cont_phone: options.cont_phone,
      p_id: options.p_id,
      c_id: options.c_id,
      a_id: options.a_id,
      address: options.address,
      traffics: options.traffics
    };
    return post(api, opt);
}

export function getGroupList(options: any) {
    const api = '/station/setting/groupList';
    const opt = {
      page: options.page,
      page_size: 15,
      key_words: options.key_words
    };
    return post(api, opt);
}

export function createGroup(options: any) {
    const api = '/station/setting/groupCreate';
    const opt = {
      group_name: options.groupName,
      machines: options.groupSelectMachine
    };
    return post(api, opt);
}

export function getGroupDetail(options: any) {
    const api = '/station/setting/groupDetail';
    const opt = {
      group_id: options.group_id,
    };
    return post(api, opt);
}

export function editGroup(options: any) {
    const api = '/station/setting/groupEdit';
    const opt = {
      group_id: options.group_id,
      group_name: options.groupName,
      machines: options.groupSelectMachine
    };
    return post(api, opt);
}

export function operateGroup(options: any) {
    const api = '/station/setting/groupEnable';
    const opt = {
      group_id: options.group_id,
      status: options.status,
    };
    return post(api, opt);
}

export function getGroupMachine(options: any) {
    const api = '/station/station/supportMachines';
    return post(api, options);
}

export async function uploadPic(options: any) {
  const api = '/webapi/misun/web/file/1.0/?service=File.uploadPicture';
  const opt = {
    file: options
  };
  return post(api, opt, 2);
}

export async function editImage(options: any) {
  const api = '/station/user/editimage';
  const opt = {
    image_url: options.imag_url
  };
  return post(api, opt);
}

export async function getUserDetail() {
  const api = '/station/user/userdetail';
  const opt = {
  };
  return post(api, opt);
}

export async function getRoleList(options: any) {
  const api = '/station/setting/rolesList';
  const opt = {
    key_words: options.key_words,
    page: options.page,
    page_count: 15
  };
  return post(api, opt);
}

export async function createRole(options: any) {
  const api = '/station/setting/roleCreate';
  const opt = {
    p_ids: options.targetKeys,
    role_name: options.roleName
  };
  return post(api, opt);
}

export async function getPrivilegeList() {
  const api = '/station/setting/privilegeList';
  const opt = {
  };
  return post(api, opt);
}

export async function getRolesDetail(options: any) {
  const api = '/station/setting/rolesDetail';
  const opt = {
    r_id: options.role_id
  };
  return post(api, opt);
}

export async function editRole(options: any) {
  const api = '/station/setting/roleEdit';
  const opt = {
    p_ids: options.targetKeys,
    r_id: options.role_id,
    r_name: options.roleName
  };
  return post(api, opt);
}

export async function operateRole(options: any) {
  const api = '/station/setting/roleDisable';
  const opt = {
    r_id: options.role_id,
    status: options.status
  };
  return post(api, opt);
}

export async function getAccountList(options: any) {
  const api = '/station/setting/accountList';
  const opt = {
    key_words: options.key_words,
    page: options.page,
    page_count: 15
  };
  return post(api, opt);
}

export async function createAccount(options: any) {
  const api = '/station/setting/accountCreate';
  const opt = {
    name: options.name,
    account: options.account,
    phone: options.phone,
    group_ids: options.groupSelectValue,
    role_ids: options.targetKeys,
  };
  return post(api, opt);
}

export async function getGroups() {
  const api = '/station/setting/getGroups';
  const opt = {

  };
  return post(api, opt);
}

export async function getRoles() {
  const api = '/station/setting/getRoles';
  const opt = {

  };
  return post(api, opt);
}

export async function getAccountDetail(options: any) {
  const api = '/station/setting/accountDetail';
  const opt = {
    a_id: options.a_id
  };
  return post(api, opt);
}

export async function operateAccount(options: any) {
  const api = '/station/setting/accountEnable';
  const opt = {
    a_id: options.a_id,
    status: options.status
  };
  return post(api, opt);
}

export async function editAccount(options: any) {
  const api = '/station/setting/accountEdit';
  const opt = {
    name: options.name,
    phone: options.phone,
    group_ids: options.groupSelectValue,
    role_ids: options.targetKeys,
    a_id: options.a_id
  };
  return post(api, opt);
}

export async function getUserPrivilege(options: any) {
  const api = '/station/setting/getUserPrivilege';
  const opt = {
    apis: options.apis
  };
  return post(api, opt);
}
