import { Pagination, Table } from 'antd';
import { toJS } from 'mobx';
import React from 'react';
import styles from './RoleTable.scss';

export default class RoleTable extends React.Component<any> {
    store: any;
    constructor(props: any) {
        super(props);
    }
    render() {
        const columns = [
            {
                title: '序号',
                dataIndex: 'role_id',
                key: 'role_id',
                render: (text: any) => {
                    return (
                        <span>{text}</span>
                    );
                }
            },
            {
                title: '角色',
                dataIndex: 'role',
                key: 'role',
                width: 350,
                render: (text: any) => {
                    return (
                        <span>{text}</span>
                    );
                }
            },
            {
                title: '权限',
                dataIndex: 'privilege',
                key: 'privilege',
                width: 350,
                render: (text: any, record: any) => {
                    return (
                        text.map(
                          (item: any, index: any) => {
                            if (index === text.length - 1) {
                              return <span key={index}>{item}</span>;
                            } else {
                              return <span key={index}>{item}，</span>;
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
                dataIndex: 'status2',
                key: 'status2',
                render: (text: any , record: any) => {
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
