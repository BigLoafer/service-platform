import { Pagination, Table } from 'antd';
import { toJS } from 'mobx';
import React from 'react';
import styles from './GroupTable.scss';

export default class RoleTable extends React.Component<any> {
  store: any;
  constructor(props: any) {
    super(props);
  }
  render() {
    const columns = [
      {
        title: '序号',
        dataIndex: 'group_id',
        key: 'group_id',
        width: 220,
        render: (text: any) => {
          return (
            <span>{text}</span>
          );
        }
      },
      {
        title: '组名称',
        dataIndex: 'name',
        key: 'name',
        render: (text: any) => {
          return (
            <span>{text}</span>
          );
        }
      },
      {
        title: '人数',
        dataIndex: 'count',
        key: 'count',
        render: (text: any, record: any) => {

          return (
            <span>{text}</span>
          );
        }
      },
      {
        title: '分管型号',
        dataIndex: 'categories',
        key: 'categories',
        render: (text: any) => {
          return (
            text.map((item: any, index: any) => {
            if (index < 3) {
               return index === text.length - 1 ?
                  <span key ={index}>{item}</span> :
                  <span key ={index}>{item}，</span>;
            } else if (index === 3) {
              return '...';
            } else {
              return '';
            }
          }
            )
          );
        }
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        render: (text: any) => {
          return (
            <span>{text === 1 ? '启用' : '停用'}</span>
          );
        }
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        render: (text: any, record: any) => {
          return (
            <div>
              <span
                className={styles.opt}
                onClick={() => {this.props.edit(record); }}
              >编辑
              </span>
              <span className={styles.divder}>|</span>
              <span
                className={styles.opt}
                onClick={() => {this.props.operate(record); }}
              >{text === 1 ? '停用' : '启用'}
              </span>
            </div>

          );
        }
      },
    ];
    return (
      <div className={styles.container}>
        <Table
          rowKey={(_, index) => index.toString()}
          columns={columns}
          dataSource={toJS(this.props.dataSource)}
          bordered={false}
          pagination={false}
          // locale={this.props.localOptions}
          onChange={this.props.onTableChange}
        />
        <div className={styles.pagetion}>
          <div style={{ flex: 1 }} />
          <Pagination
            defaultPageSize={15}
            showQuickJumper={true}
            total={this.props.total}
            onChange={this.props.onChange}
            current={this.props.current}
          />
        </div>
      </div>
    );
  }
}
