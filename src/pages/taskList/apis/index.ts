import { post } from 'app/fetch';

// 获取任务列表 http://rap.sunmi.cn/repository/editor?id=54&mod=345&itf=1660
export function getRepairTasks(options: any) {
  const opts = {
    status: options.status,
    machine_name: options.machine_name,
    key_words: options.key_words,
    page: options.page,
    pageCount: options.pageCount,
    order_by_stay: options.order_by_stay,
    start_time: options.start_time,
    end_time: options.end_time
  };
  const api = '/station/tasks/list';
  return post(api, opts);
}

// 获取任务详情 http://rap.sunmi.cn/repository/editor?id=54&mod=345&itf=1661
export function getTaskDetial(options: any) {
  const opts = {
    task_id: options.task_id
  };
  const api = '/station/tasks/taskinfo';
  return post(api, opts);
}

// 根据sn查询设备信息
// http://rap.sunmi.cn/repository/editor?id=54&mod=345&itf=1737
export function searchMachineInfoBySn(options: any) {
  const opts = {
    sn: options.sn
  };
  const api = '/station/tasks/machine';
  return post(api, opts);
}

// 创建任务 http://rap.sunmi.cn/repository/editor?id=54&mod=345&itf=1705
export function create(options: any) {
  const opts = {
    sns: options.sns,
    repair_name: options.repair_name,
    repair_phone: options.repair_phone,
    repair_p_id: options.repair_p_id,
    repair_c_id: options.repair_c_id,
    repair_a_id: options.repair_a_id,
    repair_address: options.repair_address,
    attachment: options.attachment,
    income_type: options.income_type,
    income_exp_com: options.income_exp_com,
    income_exp_no: options.income_exp_no,
    malf_desc: options.malf_desc,
    pick_method: options.pick_method,
    receive_name: options.receive_name,
    receive_phone: options.receive_phone,
    receive_p_id: options.receive_p_id,
    receive_c_id: options.receive_c_id,
    receive_a_id: options.receive_a_id,
    receive_address: options.receive_address,
    malfunction_id: options.malfunction_id
  };
  const api = '/station/tasks/create';
  return post(api, opts);
}

// 导出任务列表
// http://rap.sunmi.cn/repository/editor?id=54&mod=345&itf=1766
export function exportTask(options: any) {
  const opts = {
    start_time: options.start_time,
    end_time: options.end_time,
    key_words: options.key_words,
    machine_name: options.machine_name,
    status: options.status
  };
  const api = '/station/tasks/export';
  return post(api, opts);
}

// 获取状态列表
// http://rap.sunmi.cn/repository/editor?id=54&mod=345&itf=1739
export function getStatus(options: any) {
  const opts = {};
  const api = '/station/tasks/statuses';
  return post(api, opts);
}

// 获取所有机型列表
// http://rap.sunmi.cn/repository/editor?id=54&mod=345&itf=1740
export function getModeloptions(options: any) {
  const opts = {};
  const api = '/station/tasks/modeloptions';
  return post(api, opts);
}

// 根据sn数组获取故障列表
// http://rap.sunmi.cn/repository/editor?id=54&mod=345&itf=1744
export function getMalflist(options: any) {
  const opts = {
    sns: options.sns
  };
  const api = '/station/tasks/malflist';
  return post(api, opts);
}

// 根据电话号码查询保修人信息
// http://rap.sunmi.cn/repository/editor?id=54&mod=345&itf=1767
export function getRepairByPhone(options: any) {
  const opts = {
    phone: options.phone
  };
  const api = '/station/tasks/getrepairbyphone';
  return post(api, opts);
}

// 设备寄回
// http://rap.sunmi.cn/repository/editor?id=54&mod=345&itf=1662
export function sendBack(options: any) {
  const opts = {
    task_id: options.task_id,
    express_com: options.express_com,
    express_no: options.express_no
  };
  const api = '/station/tasks/sendback';
  return post(api, opts);
}

// 任务详情编辑
// http://rap.sunmi.cn/repository/editor?id=54&mod=345&itf=1769
export function update(options: any) {
  const opts = {
    admin_id: options.admin_id,
    task_id: options.task_id,
    receive_p_id: options.receive_p_id,
    receive_c_id: options.receive_c_id,
    receive_a_id: options.receive_a_id,
    receive_name: options.receive_name,
    receive_phone: options.receive_phone,
    receive_address: options.receive_address,
    repair_p_id: options.repair_p_id,
    repair_c_id: options.repair_c_id,
    repair_a_id: options.repair_a_id,
    repair_name: options.repair_name,
    repair_phone: options.repair_phone,
    repair_address: options.repair_address
  };
  const api = '/station/tasks/update';
  return post(api, opts);
}

// 获取责任人列表
// http://rap.sunmi.cn/repository/editor?id=54&mod=345&itf=1779
export function getAdminlist(options: any) {
  const opts = {
    task_id: options.task_id
  };
  const api = '/station/tasks/adminlist';
  return post(api, opts);
}

// 判断sn是否正在维修
// http://rap.sunmi.cn/repository/editor?id=54&mod=345&itf=1776
export function snsRepairStatust(options: any) {
  const opts = {
    sns: options.sns
  };
  const api = '/station/tasks/snsrepairstatus';
  return post(api, opts);
}

// 添加备注
// http://rap.sunmi.cn/repository/editor?id=54&mod=345&itf=1778
export function addRemark(options: any) {
  const opts = {
    task_id: options.task_id,
    remark: options.remark
  };
  const api = '/station/tasks/addremark';
  return post(api, opts);
}

// 获取物流信息
// http://rap.sunmi.cn/repository/editor?id=54&mod=345&itf=1777

export function getLogistics(options: any) {
  const opts = {
    express_no: options.express_no,
    express_com: options.express_com
  };
  const api = '/station/tasks/getlogistics';
  return post(api, opts);
}

// 任务升级
// http://rap.sunmi.cn/repository/editor?id=54&mod=345&itf=1665

export function upGrade(options: any) {
  const opts = {
    task_id: options.task_id,
    station_id: options.station_id,
    express_com: options.express_com,
    express_no: options.express_no,
    send_back_type: options.send_back_type,
    rec_name: options.rec_name,
    rec_phone: options.rec_phone,
    rec_p_id: options.rec_p_id,
    rec_c_id: options.rec_c_id,
    rec_a_id: options.rec_a_id,
    rec_address: options.rec_address
  };
  const api = '/station/tasks/upgrade';
  return post(api, opts);
}
// 设备签收详情
// http://rap.sunmi.cn/repository/editor?id=54&mod=345&itf=1775

export function getSigninDetail(options: any) {
  const opts = {
    task_id: options.task_id
  };
  const api = '/station/tasks/signindetail';
  return post(api, opts);
}

// 维修站列表
// http://rap.sunmi.cn/repository/editor?id=54&mod=361
export function getStationList(options: any) {
  const opts = {
    task_id: options.task_id
  };
  const api = '/station/station/option';
  return post(api, opts);
}

// 签收
// http://rap.sunmi.cn/repository/editor?id=54&mod=345&itf=1793

export function signin(options: any) {
  const opts = {
    task_id: options.task_id,
    sn: options.sn,
    express_com: options.express_com,
    express_no: options.express_no,
    attachment: options.attachment
  };
  const api = '/station/tasks/signin';
  return post(api, opts);
}

// 获取维修站详情
// http://rap.sunmi.cn/repository/editor?id=54&mod=361&itf=1795

export function getStationDetail(options: any) {
  const opts = {
    station_id: options.station_id
  };
  const api = '/station/station/detail';
  return post(api, opts);
}

// 故障检测
// http://rap.sunmi.cn/repository/editor?id=54&mod=345&itf=1696

export function detect(options: any) {
  const opts = {
    task_id: options.task_id,
    malf_id: options.malf_id,
    pb_fact: options.pb_fact,
    solution: options.solution,
    not_guar_type: options.not_guar_type,
    not_guarantee: options.not_guarantee,
    materials: options.materials,
    pb_pics: options.pb_pics,
    repair_type: options.repair_type,
    action_type: options.action_type
  };
  const api = '/station/tasks/detect';
  return post(api, opts);
}

// 物料列表
export function getMaterialByMsn(options: any) {
  const opts = {
    sn: options.sn,
    searchKey: options.searchKey
  };
  const api = '/station/tasks/getmaterialbysn';
  return post(api, opts);
}

// 提交检测（维修）
export function repairService(options: any) {
  const opts = {
    task_id: options.task_id
  };
  const api = '/station/tasks/repair';
  return post(api, opts);
}

// 待客户确认
export function customerConfirm(options: any) {
  const opts = {
    task_id: options.task_id,
    customer_affirm: options.customer_affirm,
    affirm_remark: options.affirm_remark
  };
  const api = '/station/tasks/customerconfirm';
  return post(api, opts);
}

// 任务回滚
export function rollBack(options: any) {
  const opts = {
    task_id: options.task_id,
  };
  const api = '/station/tasks/rollback';
  return post(api, opts);
}
// 费用清单
export function getCostlist(options: any) {
  const opts = {
    task_id: options.task_id,
  };
  const api = '/station/tasks/costlist';
  return post(api, opts);
}
// 装箱单
export function packagePager(options: any) {
  const opts = {
    task_id: options.task_id,
  };
  const api = '/station/tasks/packpaper';
  return post(api, opts);
}
