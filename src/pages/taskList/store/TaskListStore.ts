import { message } from 'antd';
import _ from 'lodash';
import { action, observable, toJS } from 'mobx';
import {
  addRemark,
  create,
  customerConfirm,
  detect,
  exportTask,
  getAdminlist,
  getLogistics,
  getMalflist,
  getMaterialByMsn,
  getModeloptions,
  getRepairByPhone,
  getRepairTasks,
  getSigninDetail,
  getStationDetail,
  getStationList,
  getStatus,
  getTaskDetial,
  repairService,
  rollBack,
  searchMachineInfoBySn,
  sendBack,
  signin,
  snsRepairStatust,
  update,
  upGrade
} from '../apis';
class TaskListStore {
  adminId: string;
  rootStore: any;
  @observable state = {
    btnLoading: false,
    // 任务列表入参
    tasks: {
      list: [],
      perPage: '',
      count: '',
      page: ''
    },
    taskFormData: {
      status: '-1',
      start_time: '',
      end_time: '',
      perPage: '',
      page: '',
      machine_name: '',
      key_words: '',
      order_by_stay: '2'
    },
    // 设备信息
    MachineInfo: {
      machine: {
        name: '',
        spec: '',
        out_time: '',
        active_time: '',
        sn: '',
        over_time: '',
        is_bao: '',
        os_version: '',
        machine_pic: '',
        model: ''
      },
      merchantInfo: {
        channel_name: '',
        merchant_name: '',
        contactName: '',
        contactPhone: '',
        address: '',
        province: '',
        city: '',
        area: ''
      },
      repairHistoryList: [],
      isRepairing: '',
      // 报修人省市区
      repairAddressList: [],
      // 收件人省市区
      receiveAddressList: []
    },
    // 输入的sn
    snNumber: '',
    // 设备未找到
    isFind: false,
    errorVisiable: false,
    // 报修设备
    deviceArr: [] as any[],
    // 报修设备sn集合
    snArr: [] as any[],
    // 任务详情
    taskDetail: {
      taskInfo: {
        // 任务详情
        task_id: '',
        // 任务id
        task_number: '',
        // 任务号
        new_sn: '',
        // 新机SN
        merchant: '',
        // 商户名
        receive_name: '',
        // 收件人
        receive_phone: '',
        // 收件人电话
        receive_province: '',
        // 收件人省份
        receive_city: '',
        // 收件人城市
        receive_area: '',
        // 收件人区县
        receive_address: '',
        // 收件人地址
        logistics_company: '',
        // 设备寄回快递公司
        logistics_number: '',
        // 设备寄回快递单号
        receive_p_id: '',
        // 收件人省份id
        receive_c_id: '',
        // 收件人城市id
        receive_a_id: '',
        // 收件人区县id
        status: '',
        // 任务状态
        stay: '',
        // 任务滞留时间
        charge_name: '',
        // 当前责任人
        sn: '',
        // 机具SN
        task_type: '',
        // 任务类型
        verification_result: '',
        // 验收结果:- 1验收不通过; 0: 未验收 1: 验收通过
        verification_remark: '',
        // 验收备注
        created_at: '',
        // 任务创建时间
        task_type_name: '',
        // 任务类型名
        is_warning: '',
        // 是否告警；1：告警；0未告警
        step_time: '',
        // 当前阶段开始时间
        customer_affirm: '',
        // 客户确认; 1: 未决定; 2: 确认维修; 3: 取消维修
        affirm_remark: '',
        // 客户确认备注
        interview_remark: '',
        // 回访备注
        receiving_result: '',
        // 验收备注
        remark: '',
        // 任务备注
        machine_name: '',
        // 机器名称（大机型名称）
        machine_spec: '',
        // 小机型名称
        refuse_remark: ''
        // 拒单原因；（此字段暂时不用）
      },

      orderInfo: {
        id: '',
        // 工单id
        order_number: '',
        // 工单号
        maintenance_person: '',
        // 报修人
        maintenance_phone: '',
        // 报修人电话
        maintenance_province: '',
        // 报修人省份
        maintenance_city: '',
        // 报修人城市
        maintenance_area: '',
        // 报修人区县
        maintenance_p_id: '',
        // 报修人省份id
        maintenance_c_id: '',
        // 报修人城市id
        maintenance_a_id: '',
        // 报修人区县id
        maintenance_address: '',
        // 报修人地址
        express_no: '',
        // 报修寄来快递单号
        express_com: ''
        // 报修寄来快递公司
      },

      problem: {
        id: '',
        // 故障检测信息id；
        task_id: '',
        // 任务id
        pb_type: '',
        // 故障类型类别；
        user_desc: '',
        // 用户描述故障
        user_parts: '',
        // 收件设备附件
        pb_fact: '',
        // 实际故障
        solution: '',
        // 解决方案
        not_guarantee: '',
        // 非保原因
        no_gur_type: '',
        // 非保类型
        pb_pics: [],
        // 故障图片数组；
        pb_type_name: '',
        // 故障类别名称；
        two_return: '',
        // 是否二返；
        malfunction_id: '',
        // 故障id；
        created_at: ''
        // 创建时间；时间戳
      },
      // 任务维修进度
      taskProcess: [],
      upgradeInfo: {
        task_id: '',
        // 任务id
        rec_station_id: '',
        // 受理站点id
        rec_station_name: '',
        // 受理站点名称
        upgrade_express: '',
        // 任务升级转寄快递公司
        upgrade_express_no: '',
        // 任务升级转寄快递单号
        rec_name: '',
        // 收件人
        rec_phone: '',
        // 收件人电话
        back_to: '',
        // 回寄至字段
        rec_p_id: '',
        // 收件人省份id
        rec_c_id: '',
        // 收件人城市id
        rec_a_id: '',
        // 收件人区县id
        rec_p_name: '',
        // 收件人省份名称
        rec_c_name: '',
        // 收件人城市名称
        rec_a_name: '',
        // 收件人区县名称
        rec_address: '',
        // 收件人地址
        admin_name: '',
        // 任务升级操作管理员名
        admin_id: '',
        // 任务升级操作管理员id
        upgrade: ''
        // 0：未升级；1：已升级；
      },
      // 任务日志
      taskLog: [],
      detectionType: ''
    },
    // 修改责任人
    responsibleVisible: false,
    responsible: '',
    // 获取责任人人
    responsibleList: [],
    // 修改报修人地址
    addressArr: [],
    addressEdit: false,
    repairAddressTxt: '',
    // 修改回寄人地址
    backAddressArr: [],
    backAddressEdit: false,
    reciveAddressTxt: '',
    // 修改报修人姓名
    maintenancePersonEdit: false,
    maintenancePerson: '',
    // 修改报修人电话
    maintenancePhoneEdit: false,
    maintenancePhone: '',
    // 待客户确认
    machineVisibe: false,
    // 寄回弹框
    sendBackVisible: false,
    // 物流公司
    expressList: [],
    // 导出任务参数
    exportTaskListFormData: {
      status: '-1',
      machine_name: '',
      key_words: '',
      start_time: '',
      end_time: ''
    },
    // 状态列表
    statusList: [],
    malfId: '',
    // 设备列表
    modelList: [],
    // 故障列表
    malflist: [],
    // 根据手机号查询到的报修人信息
    maintenanceInfo: {
      maintenance_person: '',
      maintenance_p_id: '',
      maintenance_c_id: '',
      maintenance_a_id: '',
      maintenance_address: ''
    },

    // 创建工单 下一步是否可点击
    btnDisabled: true,
    // 创建工单当前tab
    current: 0,
    // 任务详情备注
    detialRemark: '',
    // 物流信息
    logisticsList: [],
    // 任务升级弹框
    upGradeVisible: false,
    // 签收弹框
    taskSignVisible: false,
    // 设备签收详情
    signinDetail: {
      repair_name: '',
      repair_phone: '',
      user_desc: '',
      machine: '',
      sn: '',
      income_exp_no: ''
    },
    // 维修站列表
    stationList: [],
    // 维修站详情
    stationDetail: {
      station_id: '',
      station_name: '',
      username: '',
      phone: '',
      province: '',
      city: '',
      area: '',
      address: ''
    },
    stationId: '',
    // 故障检测弹框
    detectVisible: false,
    // 物料列表
    materialBySnList: [],
    // 选择的物料
    checkMaterialLists: [],
    checkMaterialList: [],
    materiels: [],
    materielss: [],
    // 列表弹框的taskid
    listTaskId: '',
    oldPic: [],
    malTwoFid: [],
    backPersonEdit: '',
    backPersonEditVisible: false,
    backPhoneEditVisible: false,
    backPhoneEdit: ''
  };
  @action

  // 获取任务列表
  getRepairTasks = async (options: any) => {
    try {
      const json: any = await getRepairTasks(options);
      this.setState({
        tasks: json.data
      });
    } catch (error) {
      this.messageError(error.msg);
    }
  };

  // 根据sn查询设备
  searchMachineInfoBySn = async (options: any) => {
    try {
      const json: any = await searchMachineInfoBySn(options);
      this.setState({
        MachineInfo: json.data,
        snNumber: ''
      });

      if (_.includes(this.state.snArr, json.data.machine.sn)) {
        this.setState({
          errorVisiable: true,
          snNumber: ''
        });
        return;
      } else {
        this.setState({
          errorVisiable: false
        });
      }
      this.state.deviceArr.push(toJS(json.data));
      this.setState({
        deviceArr: this.state.deviceArr
      });
      const deviceSn = json.data.machine.sn;
      this.state.snArr.push(deviceSn);
      this.setState({
        snArr: this.state.snArr,
        btnDisabled: false
      });
    } catch (error) {
      if (+error.code === 2215) {
        this.setState({
          isFind: true,
          snNumber: ''
        });
      } else {
        this.messageError(error.msg);
      }
    }
  };
  // 创建任务
  create = async (options: any) => {
    try {
      const json: any = await create(options);
      this.setState({
        btnLoading: false
      });
      return json.data;
    } catch (error) {
      this.messageError(error.msg);
    }
  };

  // 获取任务详情
  getTaskDetial = async (options: any) => {
    try {
      const json: any = await getTaskDetial(options);
      const { taskInfo } = json.data;
      this.setState({
        taskDetail: json.data,
        addressArr: [
          taskInfo.maintenance_p_id,
          taskInfo.maintenance_c_id,
          taskInfo.maintenance_a_id
        ],
        backAddressArr: [
          taskInfo.receive_p_id,
          taskInfo.receive_c_id,
          taskInfo.receive_a_id
        ],
        malTwoFid: json.data.problem.malfunction_id,
        checkMaterialLists: json.data.materials
      });
      this.searchMachineInfoBySn({ sn: json.data.taskInfo.sn });
    } catch (error) {
      this.messageError(error.msg);
    }
  };
  // 获取责任人列表
  getAdminlist = async (options: any) => {
    try {
      const json: any = await getAdminlist(options);
      this.setState({
        responsibleList: json.data
      });
    } catch (error) {
      this.messageError(error.msg);
    }
  };
  // 导出任务列表
  exportTask = async (options: any) => {
    try {
      const json: any = await exportTask(options);
      location.href = json.data.downloadUrl;
      this.messageSuccess();
    } catch (error) {
      this.messageError(error.msg);
    }
  };
  // 获取状态列表
  getStatus = async (options: any) => {
    try {
      const json: any = await getStatus(options);
      this.setState({
        statusList: json.data.list
      });
    } catch (error) {
      this.messageError(error.msg);
    }
  };
  // 获取机型列表
  getModeloptions = async (options: any) => {
    try {
      const json: any = await getModeloptions(options);
      this.setState({
        modelList: json.data.list
      });
    } catch (error) {
      this.messageError(error.msg);
    }
  };

  // getMalflist 获取故障列表
  getMalflist = async (options: any) => {
    try {
      const json: any = await getMalflist(options);
      this.setState({
        malflist: json.data.list
      });
    } catch (error) {
      this.messageError(error.msg);
    }
  };
  // getRepairByPhone根据手机号查询报修人信息
  getRepairByPhone = async (options: any) => {
    try {
      const json: any = await getRepairByPhone(options);
      this.setState({
        maintenanceInfo: json.data.info
      });
    } catch (error) {
      this.messageError(error.msg);
    }
  };
  // 快递寄回
  sendBack = async (options: any) => {
    try {
      await sendBack(options);
      this.messageSuccess();
      this.getTaskDetial({ task_id: options.task_id });
      this.getRepairTasks(this.state.taskFormData);
      this.setState({
        listTaskId: ''
      });
    } catch (error) {
      this.messageError(error.msg);
    }
  };
  // 编辑任务详情
  update = async (options: any) => {
    try {
      await update(options);
      this.getTaskDetial({ task_id: options.task_id });
      this.messageSuccess('修改成功!');
    } catch (error) {
      this.messageError(error.msg);
    }
  };

  // 判断sn是否正在维修
  snsRepairStatust = async (options: any) => {
    try {
      await snsRepairStatust(options);
      this.setState({
        current: this.state.current + 1
      });
    } catch (error) {
      if (error.code === -2316) {
        this.messageError('设备正在维修，请移除后再试');
      }
      if (error.code === 2404) {
        this.messageError(error.msg);
      }

      return error;
    }
  };
  // 添加备注
  addRemark = async (options: any) => {
    try {
      await addRemark(options);

      this.setState({
        remarkVisiable: false,
        detialRemark: '',
        btnLoading: false
      });
      this.messageSuccess('添加成功!');
      this.getTaskDetial({ task_id: options.task_id });
    } catch (error) {
      this.messageError(error.msg);
    }
  };
  // 获取物流信息
  getLogistics = async (options: any) => {
    try {
      const json: any = await getLogistics(options);
      this.setState({
        logisticsList: json.data.result
      });
    } catch (error) {
      this.messageError(error.msg);
    }
  };

  // 任务升级
  upGrade = async (options: any) => {
    try {
      await upGrade(options);
      this.setState({
        upGradeVisible: false
      });
      this.messageSuccess();
      this.getTaskDetial({ task_id: options.task_id });
    } catch (error) {
      this.messageError(error.msg);
    }
  };
  // 获取签收详情
  getSigninDetail = async (options: any) => {
    try {
      const json: any = await getSigninDetail(options);
      this.setState({
        signinDetail: json.data.detail
      });
    } catch (error) {
      this.messageError(error.msg);
    }
  };

  // 获取维修站列表
  getStationList = async (options: any) => {
    try {
      const json: any = await getStationList(options);
      this.setState({
        stationList: json.data.list
      });
    } catch (error) {
      this.messageError(error.msg);
    }
  };
  // 签收
  signin = async (options: any) => {
    try {
      await signin(options);
      this.setState({
        taskSignVisible: false,
        listTaskId: ''
      });
      this.messageSuccess('签收成功！');
      this.getTaskDetial({ task_id: options.task_id });
      this.getRepairTasks(this.state.taskFormData);
    } catch (error) {
      this.messageError(error.msg);
    }
  };
  // 获取维修站详情
  getStationDetail = async (options: any) => {
    try {
      const json: any = await getStationDetail(options);
      return json.data.detail;
    } catch (error) {
      this.messageError(error.msg);
    }
  };

  // 故障检测
  detect = async (options: any) => {
    try {
      await detect(options);
      this.setState({
        detectVisible: false,
        listTaskId: ''
      });
      this.getTaskDetial({ task_id: options.task_id });
      this.getRepairTasks(this.state.taskFormData);
      this.messageSuccess();
    } catch (error) {
      this.messageError(error.msg);
    }
  };
  // 获取物料列表
  getMaterialByMsn = async (options: any) => {
    try {
      const json: any = await getMaterialByMsn(options);
      const marterList = json.data.map((item: any) => {
        return {
          ...item,
          ...{
            disable: false
          }
        };
      });
      this.setState({ materialBySnList: marterList });
    } catch (error) {
      this.messageError(error.msg);
    }
  };
  // 维修
  repairService = async (options: any) => {
    try {
      await repairService(options);
      this.getTaskDetial({ task_id: options.task_id });
      this.getRepairTasks(this.state.taskFormData);
      this.messageSuccess();
    } catch (error) {
      this.messageError(error.msg);
    }
  };
  //  待客户确认
  customerConfirm = async (options: any) => {
    try {
      await customerConfirm(options);
      this.setState({
        machineVisibe: false,
        listTaskId: ''
      });
      this.getTaskDetial({ task_id: options.task_id });
      this.getRepairTasks(this.state.taskFormData);
      this.messageSuccess();
    } catch (error) {
      this.messageError(error.msg);
    }
  };
  // 任务回滚
  rollBack = async (options: any) => {
    try {
      await rollBack(options);
      this.getTaskDetial({ task_id: options.task_id });
      this.messageSuccess();
    } catch (error) {
      this.messageError(error.msg);
    }
  };
  // ------------------------------------------------------------
  setExportTaskListFormData = (newExportTaskListFormData: any) => {
    this.setState({
      exportTaskListFormData: {
        ...this.state.exportTaskListFormData,
        ...newExportTaskListFormData
      }
    });
  };
  // 设置筛选参数
  setTaskFormData = (newTaskData: any) => {
    this.setState({
      taskFormData: {
        ...this.state.taskFormData,
        ...newTaskData
      }
    });
  };
  // 操作动作，提示方法
  messageSuccess = (text = '操作成功') => {
    message.success(text);
  };
  messageError = (text = '操作失败') => {
    message.error(text);
  };
  @action setState = (newState: any) => {
    this.state = { ...this.state, ...newState };
  };
  clearStationDetail = () => {
    this.setState({
      stationDetail: {
        station_id: '',
        station_name: '',
        username: '',
        phone: '',
        province: '',
        city: '',
        area: '',
        address: ''
      }
    });
  };
}
export default new TaskListStore();
