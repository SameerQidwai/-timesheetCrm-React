import React, { useEffect, useState } from 'react';
import { Modal, Steps, message, Spin, Typography, Col, Row } from 'antd';
import { formatDate } from '../../../../service/constant';
import { closingFY } from '../../../../service/financial-year-apis';
import { ExclamationCircleOutlined } from '@ant-design/icons'; //Icons
import '../styles.css';
import { Link } from 'react-router-dom';
import { Tag_s } from '../../../../components/Core/Custom/Index';
import ATable from '../../../../components/Core/Table/TableFilter';
const { Step } = Steps;
const { Title, Paragraph } = Typography;

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
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    render: (text) => <Tag_s text={text}/>,
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
  const [closeData, setCloseData] = useState([
    {
      title: 'Instruction',
      key: 0,
      content: (
        <div className="instructions-fy">
          <Title level={4}>
            Closing Financial Year
            {formatDate(visible.startDate, true, 'DD-MM-YYYY')}-
            {formatDate(visible.endDate, true, 'DD-MM-YYYY')}
          </Title>
          <Paragraph>
            <ul>
              <li>
                In Timewize, you may 'lock’ a financial year or reporting period
                after you have completed reconciliations for that period. This
                ensures the integrity of your data by preventing further changes
                or entries in that period.
              </li>
              <li>
                This process involves a scan of all entries to determine which
                should be closed or frozen within the closing financial period.
              </li>
              <li>
                Before completing the closure, review the "Auto reject
                'Submitted' requests on FY Closing" setting in your Timewize
                Admin Control Panel.
              </li>
              <li>
                In the following steps, we will explain the impacts of the
                financial period closure in more detail, allowing you to make
                necessary adjustments.
              </li>
              <li>
                At the end of the process and before you confirm the financial
                period closure, Timewize will show you a final summary of all
                changes that will be made following your adjustments.
              </li>
              <li className="ps-note">
                <b>Please note:</b>
                <span>
                  Once complete, closing the financial period <b>cannot</b> be undone.
                </span>
              </li>
            </ul>
          </Paragraph>
        </div>
      ),
    },
    {},
  ]);
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

        createSteps[0] = closeData[0];

        createSteps[1] = {
          title: 'Project',
          key: 1,
          content: (
            <Row>
              <Col span={18}>
                <Paragraph>
                  <ul>
                    <li>
                      The status of the following “Open” Projects with an End
                      Date in the closing financial period will be changed to
                      “Closed”.
                    </li>
                    <li>
                      Users will <b>not</b> be able to create new Projects with
                      Start and End dates within the closed financial period.
                      <ul>
                        <li>
                          Make sure any projects that started the closing
                          financial period for which work will continue in the
                          new financial period have been created
                        </li>
                      </ul>
                    </li>
                    <li>
                      Users will <b>not</b> be able to edit financial
                      information about Projects within the financial period
                      once closed.
                    </li>
                    <li>
                      When you close the financial period, Timewize will make
                      the following changes. Please make adjustments as
                      necessary. You will have a chance to review the impacts
                      once you’ve made your adjustments in the final step.
                    </li>
                  </ul>
                </Paragraph>
              </Col>
              <Col span={24}>
                <ATable
                  rowKey="id"
                  sticky={true}
                  scroll={{ y: 'calc(100vh - 235px)' }}
                  columns={projectColumns}
                  dataSource={projects}
                  pagination={false}
                />
              </Col>
            </Row>
          ),
        };

        createSteps[2] = {
          title: 'Milestone',
          key: 2,
          content: (
            <Row>
              <Col span={18}>
                <Paragraph>
                  <ul>
                    <li>
                      The status of the following “Open” Milestones with an End
                      Date in the closing financial period will be changed to
                      “Closed”.
                    </li>
                    <li>
                      When you close the financial period, Timewize will make
                      the following changes. Please make adjustments as
                      necessary. You will have a chance to review the impacts
                      once you’ve made your adjustments in the final step.
                    </li>
                  </ul>
                </Paragraph>
              </Col>
              <Col span={24}>
                <ATable
                  rowKey="id"
                  sticky={true}
                  scroll={{ y: 'calc(100vh - 235px)' }}
                  columns={milestoneColumns}
                  dataSource={milestones}
                  pagination={false}
                />
              </Col>
            </Row>
          ),
        };

        createSteps[3] = {
          title: 'Timesheet',
          key: 3,
          content: (
            <Row>
              <Col span={18}>
                <Paragraph>
                  <ul>
                    <li>
                      All timesheets within the period with the status
                      “Submitted” will be frozen or changed to “Rejected” in
                      accordance with the “Auto reject” setting in the Admin
                      Control Panel.
                    </li>
                    <li>
                      Users may still upload documents to or export timesheets
                      from a closed financial period.
                    </li>
                    <li>
                      Users will <b>not</b> be able to create or edit timesheets
                      in the financial period once closed.
                    </li>
                    <li>
                      When you close the financial period, Timewize will make
                      the following changes. Please make adjustments as
                      necessary. You will have a chance to review the impacts
                      once you’ve made your adjustments in the final step.
                    </li>
                  </ul>
                </Paragraph>
              </Col>
              <Col span={24}>
                <ATable
                  rowKey="id"
                  sticky={true}
                  scroll={{ y: 'calc(100vh - 235px)' }}
                  columns={timesheetColumns}
                  dataSource={timesheets}
                  pagination={false}
                />
              </Col>
            </Row>
          ),
        };

        createSteps[4] = {
          title: 'Contracts',
          key: 4,
          content: (
            <Row>
              <Col span={18}>
                <Paragraph>
                  <ul>
                    <li>
                      The status of “Open” Employment Contracts with an End Date
                      in the designated financial period will be changed to
                      “Closed”.
                    </li>
                    <li>
                      Users will <b>not</b> be able to create or edit “Closed”
                      contracts with Start and End dates within the financial
                      period once closed.
                    </li>
                    <li>
                      When you close the financial period, Timewize will make
                      the following changes. Please make adjustments as
                      necessary. You will have a chance to review the impacts
                      once you’ve made your adjustments in the final step.
                    </li>
                  </ul>
                </Paragraph>
              </Col>
              <Col span={24}>
                <ATable
                  rowKey="id"
                  sticky={true}
                  scroll={{ y: 'calc(100vh - 235px)' }}
                  columns={contractColumns}
                  dataSource={contracts}
                  pagination={false}
                />
              </Col>
            </Row>
          ),
        };

        createSteps[5] = {
          title: 'Leave',
          key: 5,
          content: (
            <Row>
              <Col span={18}>
                <Paragraph>
                  <ul>
                    <li>
                      All pending leave requests with the status “Submitted”
                      will be frozen or changed to “Rejected” in accordance with
                      the “Auto reject” setting in the Admin Control Panel.
                    </li>
                    <li>
                      If a leave request with the status “Submitted” spans the
                      closing financial period and an open financial year, it
                      will be split into two requests:
                      <ul>
                        <li>
                          The request in the closing financial period will be
                          rejected or frozen as per the “Auto reject” setting in
                          the Admin Control Panel.
                        </li>
                        <li>
                          The request in the open financial period will keep the
                          status “Submitted”.
                        </li>
                      </ul>
                    </li>
                    <li>
                      Users will <b>not</b> be able to create or edit leave requests in
                      the financial period once closed.
                    </li>
                    <li>
                      When you close the financial period, Timewize will make
                      the following changes. Please make adjustments as
                      necessary. You will have a chance to review all changes
                      once you’ve made your adjustments in the final step.
                    </li>
                  </ul>
                </Paragraph>
              </Col>
              <Col span={24}>
                <ATable
                  rowKey="id"
                  sticky={true}
                  scroll={{ y: 'calc(100vh - 235px)' }}
                  columns={leaveColumns}
                  dataSource={leaveRequests}
                  pagination={false}
                />
              </Col>
            </Row>
          ),
        };

        createSteps[6] = {
          title: 'Expense',
          key: 6,
          content: (
            <Row>
              <Col span={18}>
                <Paragraph>
                  <ul>
                    <li>
                      All pending Expense Sheets within the period with the
                      status “Submitted” will be rejected or frozen as per the
                      “Auto reject” setting in the Admin Control Panel.
                    </li>
                    <li>
                      Expense Items (the entries that users group together and
                      submit as an Expense Sheet) will <b>not</b> be affected.
                    </li>
                    <li>
                      Users will <b>not</b> be able to create or edit Expense
                      Sheets in the financial period once closed.
                    </li>
                    <li>
                      When you close the financial period, Timewize will make
                      the following changes. Please make adjustments as
                      necessary. You will have a chance to review all changes
                      once you’ve made your adjustments in the final step.
                    </li>
                  </ul>
                </Paragraph>
              </Col>
              <Col span={24}>
                <ATable
                  rowKey="id"
                  sticky={true}
                  scroll={{ y: 'calc(100vh - 235px)' }}
                  columns={expenseColumns}
                  dataSource={expenseSheets}
                  pagination={false}
                />
              </Col>
            </Row>
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
          <ExclamationCircleOutlined /> Do you wish to close "{visible.label}"
          <b>
            ({formatDate(visible.startDate, true, 'DD-MM-YYYY')}) - (
            {formatDate(visible.endDate, true, 'DD-MM-YYYY')})
          </b>
        </span>
      }
      visible={visible}
      okButtonProps={{ danger: cond1, loading }}
      cancelButtonProps={{ loading, id: 'discardButton' }}
      okText={cond1 ? 'CLOSE FY' : 'Next'}
      cancelText={cond2 ? 'Prev' : 'Cancel'}
      onOk={() => {
        if (cond1) {
          onOkay();
        } else {
          let calll = document?.getElementsByClassName('ant-modal-body')?.[0]?.scrollTo(0, 0)
          calll = document?.getElementsByClassName('ant-table-body')?.[0]?.scrollTo(0, 0)
          setSteps(steps + 1);
        }
      }}
      onCancel={(e) => {
        if (e.currentTarget.id === 'discardButton') {
          if (cond2) {
            let calll = document?.getElementsByClassName('ant-modal-body')[0]?.scrollTo(0, 0)
            calll = document?.getElementsByClassName('ant-table-body')[0]?.scrollTo(0, 0)
            setSteps(steps - 1);
          } else {
            close();
          }
        } else {
          close();
        }
      }}
      className="fy-modal"
      destroyOnClose
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
      <div style={{ margin: 'auto', width: 1 }}>
        <Spin spinning={loading} size="large" />
      </div>
    </Modal>
  );
};

export default FYCloseModal;
