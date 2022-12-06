import React, { Component } from 'react';
import {
  Row,
  Col,
  Menu,
  Tabs,
  Button,
  Dropdown,
  Popconfirm,
  Descriptions,
} from 'antd';
import { SettingOutlined, DownOutlined } from '@ant-design/icons'; //Icons
import { Link } from 'react-router-dom';

import Comments from '../../components/Core/Comments';
import Projects from '../../components/Core/Projects';
// import Travels from "../../components/Core/Travels";
import Attachments from '../../components/Core/Attachments';
import Bank from '../../components/Core/Bank';

import InfoModal from './Modals/InfoModal';

import { getRecord, toggleActiveStatus } from '../../service/Employees';
import LeaveBalance from '../../components/Core/LeaveBalance';
import {
  formatDate,
  GENDER,
  JOB_TYPE,
  localStore,
} from '../../service/constant';
import AuthError from '../../components/Core/AuthError';
import EmployeeCalculator from '../../components/Core/Cost Calculator/EmployeeCalculator';
import { generalDelete } from "../../service/delete-Api's";
import Opportunities from '../../components/Core/Opportunities';

const { Item } = Descriptions;
const { TabPane } = Tabs;

class OrgInfo extends Component {
  constructor() {
    super();
    this.state = {
      infoModal: false,
      emp: false,
      data: {},
      bank: {},
      contract: {},
      permissions: {},
      notAuth: false,
    };
  }
  componentDidMount = () => {
    const { id } = this.props.match.params;
    this.getRecord(id);
  };

  getRecord = (id) => {
    const { USERS } = JSON.parse(localStore().permissions);
    getRecord(id).then((res) => {
      if (res.success) {
        this.setState({
          data: res.basic,
          contract: res.billing,
          bank: res.bank,
          permissions: USERS,
          emp: id,
          infoModal: false,
        });
      } else if (res.authError) {
        this.setState({ notAuth: true });
      }
    });
  };

  closeModal = () => {
    this.setState({ infoModal: false });
  };

  handleDelete = (id) => {
    const url = '/employees';
    const { history } = this.props;
    generalDelete(history, url, id).then((res) => {
      if (res.success) {
        // will not run
      }
    });
  };

  toggleActiveStatus = (id) => {
    toggleActiveStatus(id).then((res) => {
      if (res.success) {
        this.setState({
          data: { ...this.state.data, active: !this.state.data.active },
        });
      }
    });
  };

  callBack = () => {
    const { emp } = this.state;
    this.getRecord(emp);
  };

  render() {
    const { data, infoModal, emp, bank, notAuth, contract, permissions } =
      this.state;
    const DescTitle = (
      <Row justify="space-between">
        <Col>Basic Information</Col>
        <Col>
          <Dropdown
            overlay={
              <Menu>
                <Menu.Item
                  key="delete"
                  danger
                  disabled={!permissions?.['DELETE']}
                  className="pop-confirm-menu"
                >
                  <Popconfirm
                    title="Are you sure you want to delete ?"
                    onConfirm={() => this.handleDelete(emp)}
                    okText="Yes"
                    cancelText="No"
                  >
                    <div> Delete </div>
                  </Popconfirm>
                </Menu.Item>
                <Menu.Item
                  key="edit"
                  disabled={!permissions?.['UPDATE']}
                  onClick={() => {
                    this.setState({ infoModal: true });
                  }}
                >
                  Edit
                </Menu.Item>
                <Menu.Item key="contracts">
                  <Link
                    to={{
                      pathname: `/Employee/${emp}/contracts`,
                    }}
                    className="nav-link"
                  >
                    Contract History
                  </Link>
                </Menu.Item>
                <Menu.Item key="novated-lease">
                  <Link
                    to={{
                      pathname: `/Employee/${emp}/novated-lease`,
                    }}
                    className="nav-link"
                  >
                    Novated Lease
                  </Link>
                </Menu.Item>
                <Menu.Item
                  key="deactive"
                  disabled={!permissions?.['DELETE']}
                  className="pop-confirm-menu"
                >
                  <Popconfirm
                    title={`Are you sure you want to ${
                      data.active ? 'Deactive' : 'Activate'
                    }`}
                    onConfirm={() => this.toggleActiveStatus(emp)}
                    okText="Yes"
                    cancelText="No"
                  >
                    <div> {data.active ? 'Deactivate' : 'Activate'} </div>
                  </Popconfirm>
                </Menu.Item>
              </Menu>
            }
          >
            <Button size="small">
              <SettingOutlined /> Option <DownOutlined />
            </Button>
          </Dropdown>
        </Col>
      </Row>
    );
    return (
      <>
        <Descriptions
          title={DescTitle}
          size="small"
          bordered
          layout="horizontal"
          // extra={<Button type="primary">Edit</Button>}
        >
          <Item label="First Name">{data.firstName}</Item>
          <Item label="Last Name">{data.lastName}</Item>
          <Item label="Phone">{data.phoneNumber} </Item>
          <Item label="Email">{data.email}</Item>
          <Item label="Address">{data.address}</Item>
          <Item label="Date Of Birth">
            {formatDate(data.dateOfBirth, true, true)}
          </Item>
          <Item label="Gender">{GENDER[data.gender]}</Item>
          <Item label="Employment Status">{JOB_TYPE[contract?.type]}</Item>
        </Descriptions>
        {emp && (
          <Tabs
            type="card"
            style={{ marginTop: '50px' }}
            // defaultActiveKey="cost-calculator"
          >
            <TabPane tab="Opportunities" key="leads">
              <Opportunities
                  targetId={emp}
                  customUrl={`helpers/work?type=O&employee=${emp}`}
              />
            </TabPane>
            <TabPane tab="Project" key="project">
              <Projects
                targetId={emp}
                customUrl={`helpers/work?type=P&employee=${emp}`}
              />
            </TabPane>
            <TabPane tab="Comments" key="comments">
              <Comments targetType="EMP" targetId={emp} />
            </TabPane>
            <TabPane tab="Attachments" key="attachments">
              <Attachments targetType="EMP" targetId={emp} />
            </TabPane>
            <TabPane tab="Bank Account" key="account">
              <Bank
                targetType="EMP"
                targetId={emp}
                title={data.name}
                bank={bank}
              />
            </TabPane>
            <TabPane tab="Leave Balance" key="leaveBalance">
              <LeaveBalance empId={emp} editable={true} />
            </TabPane>
            <TabPane tab="Cost Calculator" key="cost-calculator">
              <EmployeeCalculator empId={emp} />
            </TabPane>
          </Tabs>
        )}
        {infoModal && (
          <InfoModal
            visible={infoModal}
            editEmp={emp}
            close={this.closeModal}
            callBack={this.callBack}
          />
        )}
        {notAuth && <AuthError {...this.props} />}
      </>
    );
  }
}

export default OrgInfo;
