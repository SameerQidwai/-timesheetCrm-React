import React, { Component } from 'react';
import { Menu, Button, Dropdown, Table, Tag } from 'antd';
import { SettingOutlined, DownOutlined } from '@ant-design/icons'; //Icons
import { Link } from 'react-router-dom';
import {
  formatDate,
  formatCurrency,
  localStore,
  formatFloat,
} from '../../../service/constant';
import { tableSorter } from '../Table/TableFilter';
import { getHierarchy, getProjectTracking } from '../../../service/projects';
import moment from 'moment';

const resourceColumns = [
  {
    title: 'Resource',
    dataIndex: 'fullName',
    key: 'fullName',
    render: (text, record) => (
      <Link
        to={{
          pathname: `milestones/${record.id}/resources`,
        }}
        className="nav-link"
      >
        {text}
      </Link>
    ),
    ...tableSorter('fullName', 'string'),
  },
  {
    title: 'Total Hours',
    dataIndex: ['total', 'totalHours'],
    key: 'total',
    render: (record) => record && formatCurrency(record),
    ...tableSorter('total.totalHours', 'number'),
  },
  {
    title: 'Utilized Hours',
    dataIndex: ['total', 'utilizedHours'],
    key: 'utilized',
    render: (record) => record && formatCurrency(record),
    ...tableSorter('total.utilizedHours', 'number'),
  },
  {
    title: 'Actual Cost',
    dataIndex: ['total', 'actualCost'],
    key: 'actualCost',
    render: (record) => record && formatCurrency(record),
    ...tableSorter('total.actualCost', 'number'),
  },
  {
    title: 'Actual Revenue',
    dataIndex: ['total', 'actualRevenue'],
    key: 'actualRevenue',
    render: (record) => record && formatCurrency(record),
    ...tableSorter('total.actualRevenue', 'number'),
  },
  {
    title: 'CM$',
    dataIndex: ['total', 'cm$'],
    key: 'cm$',
    render: (record) => record && formatCurrency(record),
    ...tableSorter('total.cm$', 'number'),
  },
  {
    title: 'CM%',
    dataIndex: ['total', 'cmPercent'],
    key: 'cmPercent',
    render: (record) => record && formatFloat(record),
    ...tableSorter('total.cmPercent', 'number'),
  },

  {
    title: '...',
    key: 'action',
    align: 'center',
    width: '1%',
    render: (value, record, index) => (
      <Dropdown
        overlay={
          <Menu>
            <Menu.Item>
              <Link
                to={{
                  pathname: `milestones/${record.id}/resources`,
                }}
                className="nav-link"
              >
                Milestone
              </Link>
            </Menu.Item>
          </Menu>
        }
      >
        <Button size="small">
          <SettingOutlined />
        </Button>
      </Dropdown>
    ),
  },
];

const trackingColumn = [
  {
    title: 'Duration',
    dataIndex: 'dateString',
    key: 'dateString',
    ...tableSorter('dateString', 'string'),
  },
  {
    title: 'Working Days',
    dataIndex: 'workDays',
    key: 'workDays',
    sorter: (a, b) => a.workDays - b.workDays,
    ...tableSorter('workDays', 'string'),
  },
  {
    title: 'Effort Rate',
    dataIndex: 'effortRate',
    key: 'effortRate',
    sorter: (a, b) => a.effortRate - b.effortRate,
    ...tableSorter('effortRate', 'string'),
  },
  {
    title: 'Actual Hours',
    dataIndex: 'actualHours',
    key: 'actualHours',
    sorter: (a, b) => a.actualHours - b.actualHours,
    ...tableSorter('actualHours', 'string'),
  },
  {
    title: 'Actual Days',
    dataIndex: 'actualDays',
    key: 'actualDays',
    sorter: (a, b) => a.actualDays - b.actualDays,
    ...tableSorter('actualDays', 'number'),
  },
  {
    title: 'Actual Revenue',
    dataIndex: 'actualRevenue',
    key: 'actualRevenue',
    render: (record) => record && formatCurrency(record),
    ...tableSorter('actualRevenue', 'number'),
  },
  {
    title: 'Actual Cost',
    dataIndex: 'actualCost',
    key: 'actualCost',
    render: (record) => record && formatCurrency(record),
    ...tableSorter('actualCost', 'number'),
  },
  {
    title: 'CM $',
    dataIndex: 'cm$',
    key: 'cm$',
    render: (record) => record && formatCurrency(record),
    ...tableSorter('cm$', 'number'),
  },
  {
    title: 'CM %',
    dataIndex: 'cmPercent',
    key: 'cmPercent',
    render: (record) => `${record ?? '-'} %`,
    ...tableSorter('cmPercent', 'number'),
  },
];

class ProjectTracking extends Component {
  constructor() {
    super();

    this.state = {
      leadId: false,
      data: [],
      desc: {},
      skillId: false,
      levelId: false,
      resource: false,
      permissons: { ADD: true },
    };
  }

  componentDidMount = () => {
    const { id } = this.props;
    getProjectTracking(id, {
      startDate: moment().format('01-07-YYYY'),
      endDate: moment().add(1, 'year').format('30-06-YYYY'),
    }).then((res) => {
      if (res) {
        const { success, data } = res;
        console.log(data);
        this.setState({
          leadId: id,
          data: success ? data : [],
        });
      }
    });
  };

  render() {
    const { desc, data, leadId, permissions } = this.state;
    return (
      //will remove it in near future will be using NestedTable Function here as well
      <Table
        bordered
        pagination={{ pageSize: localStore().pageSize }}
        rowKey={(record) => record.employeeId}
        columns={resourceColumns}
        dataSource={data}
        size="small"
        className="fs-small"
        expandable={{
          rowExpandable: (record) => record?.currentYear?.length > 0,
          expandedRowRender: (record) => {
            return (
              <NestedTable
                data={record.currentYear}
                columns={trackingColumn}
                expandable={true}
                checked={false}
              />
            );
          },
        }}
      />
    );
  }
}

function NestedTable({ columns, data }) {
  // const [data, setData] = useState(data);

  return (
    <div style={{ paddingRight: 20 }}>
      <Table
        bordered
        size="small"
        className="fs-small project-tracking-nested"
        rowKey={(record) => record.allocationId}
        rowClassName={(record) => (record.current ? 'current' : 'forecast')}
        columns={columns}
        dataSource={data}
        pagination={false}
        summary={(data) => {
          console.log(data);
          let totalWorkDays = 0;
          let totalActualHours = 0;
          let totalActualDays = 0;
          let totalRevenue = 0;
          let totalCost = 0;
          let totalCm$ = 0;
          let totalCmPercent = 0;
          let rowCount = 0;

          data.forEach((row) => {
            totalWorkDays += parseFloat(row.workDays ?? 0);
            totalActualHours += parseFloat(row.actualHours ?? 0);
            totalActualDays += parseFloat(row.actualDays ?? 0);
            totalRevenue += parseFloat(row.actualRevenue ?? 0);
            totalCost += parseFloat(row.actualCost ?? 0);
            totalCm$ += parseFloat(row.cm$ ?? 0);
            totalCmPercent += parseFloat(row.cmPercent ?? 0);
            if (row.cmPercent) rowCount++;
          });

          let averageCmPercent = totalCmPercent / rowCount;

          return (
            <Table.Summary fixed="bottom">
              <Table.Summary.Row>
                <Table.Summary.Cell index={0}>Total</Table.Summary.Cell>
                <Table.Summary.Cell index={1}>
                  {totalWorkDays}
                </Table.Summary.Cell>
                <Table.Summary.Cell index={2}>-</Table.Summary.Cell>
                <Table.Summary.Cell index={3}>
                  {totalActualHours}
                </Table.Summary.Cell>
                <Table.Summary.Cell index={4}>
                  {totalActualDays}
                </Table.Summary.Cell>
                <Table.Summary.Cell index={5}>
                  {formatCurrency(totalRevenue)}
                </Table.Summary.Cell>
                <Table.Summary.Cell index={6}>
                  {formatCurrency(totalCost)}
                </Table.Summary.Cell>
                <Table.Summary.Cell index={7}>
                  {formatCurrency(totalCm$)}
                </Table.Summary.Cell>
                <Table.Summary.Cell index={8}>
                  {averageCmPercent} %
                </Table.Summary.Cell>
              </Table.Summary.Row>
            </Table.Summary>
          );
        }}
      />
    </div>
  );
}

export default ProjectTracking;

//COST = Actual hours.
//TIMESHEET BY PROJECT
//TOP ROW = Total ((Cost, Revenue) Total, Utilized, Remaining  ,CM$, CM%)
//Add actual in Columns
//Background Colors
//Margin Or padding
//Resource two digit %
//Green and Red
