import React, { Component } from 'react';
import {
  Table,
  Button,
  Row,
  Col,
  Typography,
  Menu,
  Dropdown,
  Tag,
  Tooltip,
  Space,
  Popconfirm,
} from 'antd';
import {
  DownOutlined,
  SettingOutlined,
  PlusSquareOutlined,
  AuditOutlined,
} from '@ant-design/icons';
import {
  formatFloat,
  formatDate,
  localStore,
  R_STATUS,
  STATUS_COLOR,
} from '../../service/constant';
import AddRequestModal from './Modals/AddRequestModal';
import { getRequests } from '../../service/leaveRequest-Apis';
import LeaveBalance from '../../components/Core/LeaveBalance';
import {Tag_s} from '../../components/Core/Custom/Index';

import { generalDelete } from "../../service/delete-Api's";
const { Title } = Typography;

class LeaveRequest extends Component {
  constructor(props) {
    super(props);
    this.typeColumns = [
      {
        title: 'Type',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: 'Accrued',
        dataIndex: 'carryForward',
        key: 'carryForward',
        render: (text) => formatFloat(text),
      },
      {
        title: 'Earned YTD',
        dataIndex: 'earned',
        key: 'earned',
        render: (text, record) =>
          formatFloat(record.balanceHours - record.carryForward + record.used),
      },
      {
        title: 'Used YTD',
        dataIndex: 'used',
        key: 'used',
        render: (text) => formatFloat(text),
      },
      {
        title: 'Balance',
        dataIndex: 'balanceHours',
        key: 'balanceHours',
        render: (text) => formatFloat(text),
      },
    ];

    this.requestColumns = [
      {
        title: 'Start Date',
        dataIndex: 'startDate',
        key: 'startDate',
        render: (text, records) => text && formatDate(text, true, true),
      },
      {
        title: 'End Date',
        dataIndex: 'endDate',
        key: 'endDate',
        render: (text, records) => text && formatDate(text, true, true),
      },
      {
        title: 'Leave Type',
        dataIndex: 'leaveRequestName',
        key: 'leaveRequestName',
      },
      {
        title: 'Project',
        dataIndex: 'project',
        key: 'project',
      },
      {
        title: 'Hours',
        dataIndex: 'totalHours',
        key: 'totalHours',
        render: (text) => formatFloat(text),
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        render: (text, records) => {
          // note outside the tag
          return (
            <Space align="end">
              <Tag_s text={text}/>
              <Tooltip
                placement="top"
                title={records.note}
                destroyTooltipOnHide
              >
                {records.note && (
                  <AuditOutlined style={{ fontSize: 'large' }} />
                )}
              </Tooltip>
            </Space>
          );
        },
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
                <Menu.Item
                  key="delete"
                  danger
                  disabled={
                    !this?.state?.permissions?.['DELETE'] ||
                    record.status === 'AP'
                  }
                  className="pop-confirm-menu"
                >
                  <Popconfirm
                    title="Are you sure you want to delete ?"
                    onConfirm={() => this.handleDelete(record.id, index)}
                    okText="Yes"
                  >
                    <div> Delete </div>
                  </Popconfirm>
                </Menu.Item>
                <Menu.Item
                  key="update"
                  disabled={!this?.state?.permissions?.['UPDATE']}
                  onClick={() => {
                    this.setState({
                      openModal: true,
                      editRequest: record.id,
                      readOnly: record.status,
                      // editIndex: index
                    });
                  }}
                >
                  {record.status === 'AP' ? 'View' : 'Edit'}
                </Menu.Item>
                {/* <Menu.Item 
                                onClick={()=>{}}
                            >Delete</Menu.Item> */}
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

    this.state = {
      request: [],
      readOnly: false,
      editRequest: false,
      permissions: {},
      type: [],
      reload: true,
      openModal: false,
    };
  }

  componentDidMount = () => {
    this.getData();
  };

  getData = () => {
    const { permissions } = localStore();
    const { LEAVE_REQUESTS } = JSON.parse(permissions);
    getRequests().then((res) => {
      this.setState(
        {
          openModal: false,
          readOnly: false,
          editRequest: false,
          reload: false,
          request: res?.success ? res.data : [],
          permissions: LEAVE_REQUESTS,
        },
        () => this.setState({ reload: true })
      );
    });
  };

  closeModal = () => {
    this.setState({
      openModal: false,
      editRequest: false,
      readOnly: false,
    });
  };

  handleDelete = (id, index) => {
    const { request } = this.state;
    const { history } = this.props;
    const url = `/leave-requests`;
    generalDelete(history, url, id, index, request, false).then((res) => {
      if (res.success) {
        this.setState({
          request: [...res.filterData],
        });
      }
    });
  };

  callBack = (reqObj) => {
    this.getData();
  };

  render() {
    const { request, openModal, editRequest, permissions, readOnly, reload } =
      this.state;
    return (
      <>
        <Row justify="space-between">
          <Col>
            <Title level={4}>Leave Requests</Title>
          </Col>
          <Col style={{ marginLeft: 'auto' }}>
            <Button
              type="primary"
              size="small"
              disabled={!permissions['ADD']}
              onClick={() => {
                this.setState({
                  openModal: true,
                  readOnly: false,
                });
              }}
            >
              <PlusSquareOutlined />
              Add Request
            </Button>
          </Col>
          <Col span={24}>
            <Table
              // sticky
              bordered
              style={{ maxHeight: '40vh', overflowY: 'scroll' }}
              // scroll={{y: '40vh' }}
              pagination={{ pageSize: localStore().pageSize }}
              rowKey={(data) => data.id}
              columns={this.requestColumns}
              dataSource={request}
              size="small"
              className="fs-small"
            />
          </Col>
        </Row>

        <Row style={{ marginTop: '20px' }} justify="space-between">
          <Col>
            <Title level={4}>Leave Balance</Title>
          </Col>

          <Col span={24}>
            {reload && (
              <LeaveBalance
                editable={false}
                style={{ maxHeight: '30vh', overflowY: 'scroll' }}
              />
            )}
          </Col>
        </Row>
        {openModal && (
          <AddRequestModal
            visible={openModal}
            close={this.closeModal}
            edit={editRequest}
            callBack={this.getData}
            readOnly={readOnly === 'AP'}
            showDetails={!readOnly || readOnly === 'SB' || readOnly === 'RJ'}
          />
        )}
      </>
    );
  }
}

export default LeaveRequest;

// inside tag
// (<Tooltip
//     placement="top"
//     title={records.note}
//     destroyTooltipOnHide
// >
//     <Tag color={STATUS_COLOR[text]}>
//     <Space style={{ display: 'flex'}} align="baseline">
//         {R_STATUS[text]}
//         {records.note && <AuditOutlined />}
//     </Space>
//         </Tag>

// </Tooltip>
// )
