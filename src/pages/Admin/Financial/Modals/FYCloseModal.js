import React, { useEffect, useState } from 'react';
import { Modal, Steps, message, Spin, Typography } from 'antd';
import { formatDate } from '../../../../service/constant';
import { closingFY } from '../../../../service/financial-year-apis';
import { ExclamationCircleOutlined } from '@ant-design/icons'; //Icons
import '../styles.css';
import { Link } from 'react-router-dom';
import { Tag_s } from '../../../../components/Core/Custom';
import ATable from '../../../../components/Core/Table/TableFilter';
const { Step } = Steps;
const { Title, Paragraph } = Typography

const stepsInitial = [
  {
    title: 'First',
    key: 'First',
    content: 'First-content',
  },
  {
    title: 'Second',
    key: 'Second',
    content: 'Second-content',
  },
  {
    title: 'Last',
    key: 'Last',
    content: 'Last-content',
  },
];

const projectColumns = [
  {
    title: 'Project',
    dataIndex: 'title',
    key: 'title',
    render: (text, record) => (
      <Link
        to={{
          pathname: `/projects/${record.id}/info`,
        }}
        className="nav-link"
      >
        {text}
      </Link>
    ),
  },
  {
    title: 'Project Code',
    dataIndex: 'id',
    key: 'id',
    render: (text) => `00${text}`,
  },
  {
    title: 'Start Date',
    dataIndex: 'startDate',
    key: 'startDate',
  },
  {
    title: 'End Date',
    dataIndex: 'endDate',
    key: 'endDate',
  },
];
const milestoneColumns = [
  {
    title: 'Milestone',
    dataIndex: 'title',
    key: 'title',
    render: (text, record) => (
      <Link
        to={{
          pathname: `/projects/${record.projectId}/milestones/${record.id}`,
        }}
        className="nav-link"
      >
        {text}
      </Link>
    ),
  },
  {
    title: 'Milestone Code',
    dataIndex: 'id',
    key: 'id',
    render: (text) => `00${text}`,
  },
  {
    title: 'Project',
    dataIndex: 'projectName',
    key: 'projectName',
    render: (text, record) => (
      <Link
        to={{
          pathname: `/projects/${record.projectId}/info`,
        }}
        className="nav-link"
      >
        {text}
      </Link>
    ),
  },
  {
    title: 'Start Date',
    dataIndex: 'startDate',
    key: 'startDate',
    render: (text) => formatDate(text, true, 'DD-MM-YYYY'),
  },
  {
    title: 'End Date',
    dataIndex: 'endDate',
    key: 'endDate',
    render: (text) => formatDate(text, true, 'DD-MM-YYYY'),
  },
];
const timesheetColumns = [
  {
    title: 'Employee',
    dataIndex: 'employeeName',
    key: 'employeeName',
    render: (text, record) => (
      <Link
        to={{
          pathname: `/employees/${record.employeeId}/info`,
        }}
        className="nav-link"
      >
        {text}
      </Link>
    ),
  },
  {
    title: 'Project',
    dataIndex: 'projectName',
    key: 'projectName',
    render: (text, record) => (
      <Link
        to={{
          pathname: `/projects/${record.id}/info`,
        }}
        className="nav-link"
      >
        {text}
      </Link>
    ),
  },
  {
    title: 'Month',
    dataIndex: 'startDate',
    key: 'startDate',
    render: (text) => formatDate(text).format('MMM'),
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    render: (text) => <Tag_s text={text} />,
  },
];
const contractColumns = [
  {
    title: 'Employee',
    dataIndex: 'employeeName',
    key: 'employeeName',
    render: (text, record) => (
      <Link
        to={{
          pathname: `/employees/${record.employeeId}/info`,
        }}
        className="nav-link"
      >
        {text}
      </Link>
    ),
  },
  {
    title: 'Contract Code',
    dataIndex: 'id',
    key: 'id',
    render: (text) => `00${text}`,
  },
  {
    title: 'Start Date',
    dataIndex: 'startDate',
    key: 'startDate',
    render: (text) => formatDate(text, true, 'DD-MM-YYYY'),
  },
  {
    title: 'End Date',
    dataIndex: 'endDate',
    key: 'endDate',
    render: (text) => formatDate(text, true, 'DD-MM-YYYY'),
  },
  {
    title: 'Impact',
    dataIndex: 'accross',
    key: 'accross',
    render: (text) =>
      text ? 'Only End Date Will Be Changeable' : 'Need New Contract',
  },
];
const leaveColumns = [
  {
    title: 'Employee',
    dataIndex: 'employeeName',
    key: 'employeeName',
    render: (text, record) => (
      <Link
        to={{
          pathname: `/employees/${record.employeeId}/info`,
        }}
        className="nav-link"
      >
        {text}
      </Link>
    ),
  },
  {
    title: 'Project',
    dataIndex: 'projectName',
    key: 'projectName',
    render: (text, record) => (
      <Link
        to={{
          pathname: `/projects/${record.id}/info`,
        }}
        className="nav-link"
      >
        {text}
      </Link>
    ),
  },
  {
    title: 'Start Date',
    dataIndex: 'startDate',
    key: 'startDate',
    render: (text) => formatDate(text, true, 'DD-MM-YYYY'),
  },
  {
    title: 'End Date',
    dataIndex: 'endDate',
    key: 'endDate',
    render: (text) => formatDate(text, true, 'DD-MM-YYYY'),
  },
];
const expenseColumns = [
  {
    title: 'Employee',
    dataIndex: 'employeeName',
    key: 'employeeName',
    render: (text, record) => (
      <Link
        to={{
          pathname: `/employees/${record.employeeId}/info`,
        }}
        className="nav-link"
      >
        {text}
      </Link>
    ),
  },
  {
    title: 'Expense Sheet Code',
    dataIndex: 'id',
    key: 'id',
    render: (text) => `00${text}`,
  },
  {
    title: 'Project',
    dataIndex: 'projectName',
    key: 'projectName',
    render: (text, record) => (
      <Link
        to={{
          pathname: `/projects/${record.id}/info`,
        }}
        className="nav-link"
      >
        {text}
      </Link>
    ),
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    render: (text) => <Tag_s text={text} />,
  },
];

const FYCloseModal = ({ visible, close, callBack }) => {
  const [loading, setLoading] = useState(true);
  const [closeData, setCloseData] = useState([{
    title: 'Instruction',
    key: 0,
    content: (
      <div className='instructions-fy'>
        <Title level={4}>
          Closing Financial Year{' '}
          {formatDate(visible.startDate, true, 'DD-MM-YYYY')}-
          {formatDate(visible.endDate, true, 'DD-MM-YYYY')}
        </Title>
        <Paragraph>
            <ul>
              <li>Once FY is locked, undo is not possible</li>
              <li>All project ending in closing FY will also be closed </li>
              <li>All pending timesheet (submitted) requests will be rejected or freezed as per global settings </li>
              <li>All pending leave (submitted) requests will be rejected or freezed as per global settings </li>
              <li>All pending expsense (submitted) request will be rejected or freezed as per global settings </li>
              <li>Leave requests spanning across closing fananical year will be broken down in to two requests</li>
              <li>Employment contracts ending in closing Fy will be closed</li>
            </ul>
        </Paragraph>
      </div>
    ),
  },{}]);
  const [steps, setSteps] = useState(0);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      message.loading({ content: 'Getting Information', key: 1 }, 0);
      let { success, data } = await closingFY(visible.id);
      message.warning(
        { content: 'Please Read The Action Carefully', key: 1 },
        5
      );
      setLoading(false);
      if (success) {
        let createSteps = [];
        let {
          projects = [],
          milestones = [],
          timesheets = [],
          contracts = [],
          expenseSheets = [],
          leaveRequestBalances = '',
          leaveRequests = [],
        } = data;
        // setCloseData(stepsInitial)

        createSteps[0] = {
          title: 'Instruction',
          key: 0,
          content: (
            <div className='instructions-fy'>
              <Title level={4}>
                Closing Financial Year{' '}
                {formatDate(visible.startDate, true, 'DD-MM-YYYY')}-
                {formatDate(visible.endDate, true, 'DD-MM-YYYY')}
              </Title>
              <Paragraph>
                  <ul>
                    <li>Once FY is locked, undo is not possible</li>
                    <li>All project ending in closing FY will also be closed </li>
                    <li>All pending timesheet (submitted) requests will be rejected or freezed as per global settings </li>
                    <li>All pending leave (submitted) requests will be rejected or freezed as per global settings </li>
                    <li>All pending expsense (submitted) request will be rejected or freezed as per global settings </li>
                    <li>Leave requests spanning across closing fananical year will be broken down in to two requests</li>
                    <li>Employment contracts ending in closing Fy will be closed</li>
                  </ul>
              </Paragraph>
            </div>
          ),
        };

        createSteps[1] = {
          title: 'Project',
          key: 1,
          content: (
            <ATable
              rowKey="id"
              sticky={true}
              scroll={{ y: 'calc(100vh - 235px)' }}
              columns={projectColumns}
              dataSource={projects}
              pagination={false}
            />
          ),
        };

        createSteps[2] = {
          title: 'Milestone',
          key: 2,
          content: (
            <ATable
              rowKey="id"
              sticky={true}
              scroll={{ y: 'calc(100vh - 235px)' }}
              columns={milestoneColumns}
              dataSource={milestones}
              pagination={false}
            />
          ),
        };

        createSteps[3] = {
          title: 'Timesheet',
          key: 3,
          content: (
            <ATable
              rowKey="id"
              sticky={true}
              scroll={{ y: 'calc(100vh - 235px)' }}
              columns={timesheetColumns}
              dataSource={timesheets}
              pagination={false}
            />
          ),
        };

        createSteps[4] = {
          title: 'Contracts',
          key: 4,
          content: (
            <ATable
              rowKey="id"
              sticky={true}
              scroll={{ y: 'calc(100vh - 235px)' }}
              columns={contractColumns}
              dataSource={contracts}
              pagination={false}
            />
          ),
        };

        createSteps[5] = {
          title: 'Leave',
          key: 5,
          content: (
            <ATable
              rowKey="id"
              sticky={true}
              scroll={{ y: 'calc(100vh - 235px)' }}
              columns={leaveColumns}
              dataSource={leaveRequests}
              pagination={false}
            />
          ),
        };

        createSteps[6] = {
          title: 'Expense',
          key: 6,
          content: (
            <ATable
              rowKey="id"
              sticky={true}
              scroll={{ y: 'calc(100vh - 235px)' }}
              columns={expenseColumns}
              dataSource={expenseSheets}
              pagination={false}
            />
          ),
        };

        setCloseData(createSteps);
      }
    } catch {
      console.log('this action cant be perform');
    }
  };

  const onOkay = () => {
    let confirmModal = Modal.confirm({
      width: 400,
      title: "This Action Can't be Undo",
      icon: <ExclamationCircleOutlined color="red" />,
      content: 'Are you Sure You Want To Lock This Year?',
      onOk: async () => {
        try {
          setLoading(true);
          let { success } = await closingFY(visible.id, '?confirm=true');
          setLoading(false);
          if (success) {
            // let newData = [...data];
            // newData[index]['closed'] = true;
            // setData([...newData]);
          }
        } catch {
          setLoading(false);
          confirmModal.destroy();
        }
      },
      onCancel: () => {
        confirmModal.destroy();
      },
    });
  };
  // const items = closeData.map(({title, key}) => ({ key: key, title: title }));

  let cond1 = steps === closeData.length - 1;
  let cond2 = steps > 0;
  return (
    <Modal
      title={
        <span>
          <ExclamationCircleOutlined /> Do you wish to close "{visible.label}"{' '}
          <b>
            ({formatDate(visible.startDate, true, 'DD-MM-YYYY')}) - (
            {formatDate(visible.endDate, true, 'DD-MM-YYYY')})
          </b>
        </span>
      }
      visible={visible}
      okButtonProps={{ danger: cond1, loading }}
      cancelButtonProps={{ loading }}
      okText={cond1 ? 'CLOSE FY' : 'Next'}
      cancelText={cond2 ? 'Prev' : 'Cancel'}
      onOk={() => {
        if (cond1) {
          onOkay();
        } else {
          setSteps(steps + 1);
        }
      }}
      onCancel={() => {
        if (cond2) {
          setSteps(steps - 1);
        } else {
          close();
        }
      }}
      className="fy-modal"
      // onCancel={close}
    >
        <div>
          <Steps current={steps} items={stepsInitial} size="small">
            {closeData.map((item, index) => (
              <Step key={index} title={item.title} />
            ))}
          </Steps>
        </div>
        <div className="steps-content">
          {closeData?.[steps]?.content && closeData[steps].content}
        </div>
        <div style={{margin: 'auto', width:1}}>
          <Spin spinning={loading} size="large"/>
        </div>
    </Modal>
  );
};

export default FYCloseModal;
