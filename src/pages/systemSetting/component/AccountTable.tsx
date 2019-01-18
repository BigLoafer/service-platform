import { Pagination, Table } from 'antd';
import { toJS } from 'mobx';
import React from 'react';
import styles from './AccountTable.scss';

export default class AccountTable extends React.Component<any> {
  constructor(props: any) {
    super(props);
  }
  render() {
    const columns = [
      {
        title: '序号',
        dataIndex: 'a_id',
        key: 'a_id',
        render: (text: any) => {
          return (
            <span>{text}</span>
          );
        }
      },
      {
        title: '账号',
        dataIndex: 'account',
        key: 'account',
        render: (text: any) => {
          return (
            <span>{text}</span>
          );
        }
      },
      {
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
        render: (text: any, record: any) => {

          return (
            <span>{text}</span>
          );
        }
      },
      {
        title: '角色',
        dataIndex: 'roles',
        key: 'roles',
        width: 200,
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
        width: 80,
        render: (text: any) => {
          return (
            <span>{text === 1 ? '启用' : '停用'}</span>
          );
        }
      },
      {
        title: '电话',
        dataIndex: 'phone',
        key: 'phone',
        render: (text: any) => {
          return (
            <span>{text}</span>
          );
        }
      },
      {
        title: '所属组别',
        dataIndex: 'group',
        key: 'group',
        width: 200,
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
            })
          );
        }
      },
      {
        title: '操作',
        dataIndex: 'status2',
        key: 'status2',
        render: (text: any, record: any) => {
          return (
            <div>
              <span
                className={styles.opt}
                onClick={() => { this.props.edit(record); }}
              >编辑
              </span>
              <span className={styles.divder}>|</span>
              <span
                className={styles.opt}
                onClick={() => { this.props.operate(record); }}
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
