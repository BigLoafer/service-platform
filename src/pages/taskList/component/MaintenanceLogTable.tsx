import { Table } from 'antd';
import React from 'react';
import styles from './MaintenanceLogTable.scss';
export interface MyTaskListTableProps {
  dataSource: any[];
}

const columns = [{
  title: '报修时间',
  dataIndex: 'repaorReportTime',
}, {
  title: '维修工程师',
  dataIndex: 'enginee_name',
}, {
  title: '维修单号',
  dataIndex: 'task_number',
}, {
  title: '故障原因',
  dataIndex: 'fault_name',
}, {
  title: '解决方案',
  dataIndex: 'solution',
}];

class MaintenanceLogTable extends React.Component<MyTaskListTableProps> {
  render() {
    return (
      <div>
        <Table
          className={styles.table}
          rowKey={(item) => item.task_number}
          bordered={true}
          columns={columns}
          dataSource={this.props.dataSource}
        />
      </div>
    );
  }
}

export default MaintenanceLogTable;
