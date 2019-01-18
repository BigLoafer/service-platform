import { Button, DatePicker, Input, Select } from 'antd';
import { withCommonFoot, withCommonHead } from 'app/ui';
import { inject, observer } from 'mobx-react';
import React from 'react';
import styles from './TaskList.scss';
const Option = Select.Option;
const { RangePicker } = DatePicker;
import _ from 'lodash';
import { toJS } from 'mobx';
import moment from 'moment';
import TaskListTable from '../component/TaskListTable';
@withCommonHead
@withCommonFoot
@inject('TaskListStore')
@observer
export default class TaskList extends React.Component<any> {
  waitSearchKey: any;
  componentWillMount() {
    this.props.TaskListStore.getRepairTasks(
      this.props.TaskListStore.state.taskFormData
    );
    this.props.TaskListStore.getStatus();
    this.props.TaskListStore.getModeloptions();
  }
  render() {
    const { tasks, statusList, modelList } = this.props.TaskListStore.state;
    const taskList = toJS(tasks.list);
    const pagination = {
      pageSize: tasks.perPage,
      total: tasks.count,
      current: tasks.page,
      onChange: this.handlePageChange
    };
    // const arr = _.find(
    //   statusList, (o) => {
    //   return +o.id === 3;
    // });
    // console.log(arr);

    return (
      <div className={styles.panel}>
        <div className={styles.container}>
          <div className={styles.title}>
            <div>
              {this.renderSelect(statusList, this.changeStatus, '请选择状态')}
              {this.renderSelect(modelList, this.changeDevice, '请选择机型')}
              <Input
                className={styles.input}
                placeholder="请输入关键字"
                onChange={this.changeSearchKey}
              />
              <RangePicker
                style={{ width: '224px' }}
                onChange={this.changeSearchPayTime}
                disabledDate={date => date > moment()}
              />
            </div>
            <div>
              <Button
                type="primary"
                style={{ marginRight: '16px' }}
                onClick={this.crearWorkOrder}
              >
                创建工单
              </Button>
              <Button onClick={this.exportTaskList}>导出任务</Button>
            </div>
          </div>
          <div>
            <TaskListTable
              changeStay={this.changeStay}
              pagination={pagination}
              dataSource={taskList}
            />
          </div>
        </div>
      </div>
    );
  }
  // 下拉框渲染
  renderSelect = (list: any, onChange: any, placeholder: string) => {
    return (
      <Select
        className={styles.select}
        placeholder={placeholder}
        onChange={onChange}
      >
        {list.map((item: any) => {
          return (
            <Option key={item.id} value={item.id}>
              {item.name}
            </Option>
          );
        })}
      </Select>
    );
  };
  // 滞留时间排序
  changeStay = (pagination: any, filters: any, sorter: any) => {
    const str = sorter.order;
    if (str === 'ascend') {
      this.changeOptions({ order_by_stay: '2' });
    } else if (str === 'descend') {
      this.changeOptions({ order_by_stay: '1' });
    }
  };
  // 跳转创建任务页面
  crearWorkOrder = () => {
    window.location.href = '/taskList/CreateWorkOrder';
  };
  // 时间筛选
  changeSearchPayTime = (dateString: any) => {
    let startTime = '';
    let endTime = '';
    if (dateString.length > 0) {
      startTime = moment(dateString[0]).format('YYYY-MM-DD');
      endTime = moment(dateString[1]).format('YYYY-MM-DD');
    } else {
      startTime = '';
      endTime = '';
    }
    this.changeOptions({ start_time: startTime, end_time: endTime });
    this.props.TaskListStore.setExportTaskListFormData({
      start_time: startTime,
      end_time: endTime
    });
  };

  // 分页
  handlePageChange = (page: any, pageCount: any) => {
    this.changeOptions({ page });
  };

  // 选择机型
  changeDevice = (value: any) => {
    this.changeOptions({ machine_name: value });
  };
  // 选择机型
  changeStatus = (value: any) => {
    this.changeOptions({ status: value });
  };

  // 导出筛选任务列表exportTaskList
  exportTaskList = () => {
    const { exportTaskListFormData } = this.props.TaskListStore.state;
    this.props.TaskListStore.exportTask({
      ...toJS(exportTaskListFormData)
    });
  };

  // 搜索框
  changeSearchKey = (event: any) => {
    const { value } = event.target;
    this.props.TaskListStore.setExportTaskListFormData({
      key_words: value
    });
    if (this.waitSearchKey) {
      clearTimeout(this.waitSearchKey);
    }
    this.waitSearchKey = setTimeout(
      () => {
      this.changeOptions({ key_words: value });
    },
      1000);
  };

  // 更改参数
  changeOptions = (opts: any) => {
    const { taskFormData } = this.props.TaskListStore.state;
    this.getRepairTasks({ ...taskFormData, ...opts });
  };

  // 获取工单列表
  getRepairTasks = (option: any) => {
    this.props.TaskListStore.getRepairTasks(option);
  };
}
