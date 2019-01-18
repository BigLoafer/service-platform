import { Table } from 'antd';
import moment from 'moment';
import React from 'react';
export interface MyTaskListTableProps {
  dataSource: any[];
}

const columns = [{
  title: '操作时间',
  dataIndex: 'operate_time',
  render: (record: any) => {
    return (
      <span>{moment.unix(record).format('YYYY-MM-DD HH:mm')}</span>
    );
  }
}, {
  title: '操作员',
  dataIndex: 'operate_person',
}, {
  title: '操作类型',
  dataIndex: 'operate_type',
}, {
  title: '操作明细',
  width: 600,
  dataIndex: 'operate_remark',
}, {
  title: '耗时',
  dataIndex: 'during',
  render: (text: string) => {
    return (
      <div>{+text < 1 ? '< 1' : text}小时</div>
    );
  }
}];
class TaskLogTable extends React.Component<MyTaskListTableProps> {

  render() {
    const { dataSource } = this.props;
    return (
      <div>
        <Table
          bordered={true}
          rowKey={(record: any, index: any) => index}
          pagination={false}
          columns={columns}
          dataSource={dataSource}
        />
      </div>
    );
  }
}
export default TaskLogTable;
