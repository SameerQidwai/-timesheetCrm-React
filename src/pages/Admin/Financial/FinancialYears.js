import React, { useEffect, useState } from 'react'
import { Button, Col, Collapse, Descriptions, Dropdown, Menu, Modal, Popconfirm, Row, Table, Typography, message,  } from "antd";
// import { formatDate } from '../../service/constant';
import { ExclamationCircleOutlined, SettingOutlined } from "@ant-design/icons"; //Icons
import { localStore, formatDate } from '../../../service/constant';
import { closingFY, getAllFY, revertFY } from '../../../service/financial-year-apis';
import FYModal from './Modals/FYModal';
import { tableSorter } from '../../../components/Core/Table/TableFilter';
import { Tag_s } from '../../../components/Core/Custom/Index';
import moment from 'moment'
import './styles.css'
import FYCloseModal from './Modals/FYCloseModal';
import { generalDelete } from '../../../service/delete-Api\'s';

const {Paragraph} = Typography
const {Panel} = Collapse
const {Item} = Descriptions


function FinancialYears(props) {
    // const [form] = Form.useForm();
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [visibleModal, setVisibleModal] = useState(false)
  const [visibleConfirm, setVisibleConfirm] = useState(false)
  const [lastFY, setLastFY] = useState({ created: 0, closed: null})
  const [disableDates, setDisabledDates] =useState({startDate:null, endDate:null})
  
    const columns = [
      // {
      //     title: "Created AT",
      //     dataIndex: "createdby",
      //     key: "label",
      //     ...tableSorter('label', 'string')
      // }, 
      // {
      //     title: "Created By",
      //     dataIndex: "createdby",
      //     key: "label",
      //     ...tableSorter('label', 'string')
      // }, 
      {
          title: "Name",
          dataIndex: "label",
          key: "label",
          ...tableSorter('label', 'string')
      }, 
      {
          title: "Start Date",
          dataIndex: "startDate",
          key: "startDate",
            render: (record) => formatDate(record, true, true),
          ...tableSorter('startDate', 'date')
      },
      {
          title: "End Date",
          dataIndex: "endDate",
          key: "endDate",
            render: (record) => formatDate(record, true, true),
          ...tableSorter('endDate', 'date')
      },
      // {
      //     title: "Lock By",
      //     dataIndex: "lockBy",
      //     key: "LockBy",
      //     ...tableSorter('lockDate', 'string')
      // },
      {
          title: "Locked",
          dataIndex: "closed",
          key: "closed",
            render: (record) => <Tag_s
            text={`${!record}`}
            objName="O_PHASE"
            colorName="O_PHASE_COLORS"
          />,
          // ...tableSorter('label', 'string')
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
                    key="edit"
                    disabled={record.closed}
                    onClick={() => {
                      openModal(record, index)
                    }}
                  >
                    Edit
                  </Menu.Item>
                  { lastFY.created === record.id && <Menu.Item
                    key="delete"
                    danger
                    className="pop-confirm-menu"
                    disabled={record.closed}
                  >
                    <Popconfirm
                      title="Are you sure you want to delete ?"
                      onConfirm={() => handleDelete(record.id, index)}
                      okText="Yes"
                      cancelText="No"
                      disabled={record.closed}
                    >
                      <div> Delete </div>
                    </Popconfirm>
                  </Menu.Item>}
                  <Menu.Item 
                    disabled={record.closed}
                    key="Closing" 
                    // onClick={()=>{onConfirm(record, index)}}
                    onClick={()=>{setVisibleConfirm({...record, index})}}
                  >
                      Close
                  </Menu.Item>
                  { lastFY.closed === record.id && <Menu.Item
                    key="delete"
                    danger
                    className="pop-confirm-menu"
                  >
                    <Popconfirm
                      title="Are you sure you want to delete ?"
                      onConfirm={() => revert(record.id)}
                      okText="Yes"
                      cancelText="No"
                    >
                      <div> Revert </div>
                    </Popconfirm>
                  </Menu.Item>}
                </Menu>
              }
            >
              <Button size="small">
                <SettingOutlined />
              </Button>
            </Dropdown>
          ),
        },
    ]

    useEffect(() => {
      getData()
    }, [])

    const getData = async() =>{
      let {success, data} = await getAllFY()
        if (success){
          let highestEndDate =null
          let highestEndDateId= 0
          let highestClosedId = null
          data.forEach(({id, endDate, closed}) => {
            if (!highestEndDate || highestEndDate.isBefore(endDate)){
              highestEndDate= moment(endDate) 
              highestEndDateId = id
              if(closed){
                highestClosedId =id
              }
            }
          });
          setLastFY({created: highestEndDateId, closed: highestClosedId})
          setData(data)
        }
    }
    
    const onFYAddAndUpdate = (newEntry, rowIndex) =>{
      getData()
      setVisibleModal(false)
    }

    const handleDelete = (id, index) => {
      const url = `/financial-years/`;
      generalDelete({}, url, id, index, [], data).then((res) => {
        if (res.success) {
          setData(res.data);
        }
      });
    }

    const onConfirm = async(record, index) => {
      let info = {}
      try{
        message.loading({ content: 'Getting Information', key: record.id}, 0);
        let {success, data} = await closingFY(record.id)
        message.warning({ content: 'Please Read The Action Carefully', key: record.id}, 5);
        if (success){
          info = data
        }
      }catch{
        console.log('this action cant be perform')
      }
      let {
        projects = [],
        milestones = [],
        timesheets = [],
        contracts = [],
        expenseSheets = [],
        leaveRequestBalances = '',
        leaveRequests = [],
      } = info;

      let modal = Modal.confirm({
        width: 800,
        className: "fy-modal",
        title: (
          <span>
            Do you wish to close "{record.label}"{' '}
            <b>
              {moment(record.startDate).format('DD-MM-YYYY')} - $
              {moment(record.endDate).format('DD-MM-YYYY')}
            </b>
          </span>
        ),
        icon: <ExclamationCircleOutlined />,
        content: (
          <span>
            <Collapse bordered={false} defaultActiveKey={['projects']} style={{backgroundColor: 'white'}}>
              <Panel header={<b>- Closing Projects</b>} key="projects">
                {projects.length ? (
                  projects.map(({ id, title, startDate, endDate }) => {
                    return <Paragraph key={id}>
                        Title: <b>{title}</b>
                        <Paragraph>
                          <Row justify="space-around">
                            <Col>Code: 00{id}</Col>
                            <Col>Start Date: {startDate}</Col>
                            <Col>End Date: {endDate}</Col>
                          </Row>
                        </Paragraph>
                    </Paragraph>
                  })
                ) : (
                  <div>No Project</div>
                )}
              </Panel>
              <Panel header={<b>- Closing Milestone</b>} key="milestones">
                {milestones.length ? (
                  milestones.map(({ id, title, startDate, endDate, projectName }) => {
                    return <Paragraph key={id}>
                        Title: <b>{title}</b>
                        <Paragraph>
                          <Row justify="space-around">
                            <Col>Code: 00{id}</Col>
                            <Col>Project Name: {projectName}</Col>
                            <Col>Start Date: {startDate}</Col>
                            <Col>End Date: {endDate}</Col>
                          </Row>
                        </Paragraph>
                    </Paragraph>
                  })
                ) : (
                  <div>No Milestones</div>
                )}
              </Panel>
              <Panel header={<b>- Timesheet</b>} key="timesheets">
                {timesheets.length ? (
                  <div>
                  {timesheets.map(({ id, employeeName, startDate, status, projectName }) => {
                    return <Paragraph key={id}>
                        Employee: <b>{employeeName}</b>
                        <Paragraph>
                          <Row justify="space-around">
                            <Col>Project Name: {projectName}</Col>
                            <Col>Month: {formatDate(startDate).format('MMM')}</Col>
                            <Col>Status: {status}</Col>
                          </Row>
                        </Paragraph>
                    </Paragraph>
                  })}
                  </div>
                ) : (
                  <div>No Milestones</div>
                )}
              </Panel>
              <Panel header={<b>- Ending Contract</b>} key="contracts">
                {contracts.length ? (
                <div>
                  {contracts.map(({ id, name, startDate, endDate }) => {
                    return <Paragraph key={id}>
                        Employee: <b>{name}</b>
                        <Paragraph>
                          <Row justify="space-around">
                            <Col>Code: 00{id}</Col>
                            <Col>Start Date: {startDate}</Col>
                            <Col>End Date: {endDate}</Col>
                          </Row>
                        </Paragraph>
                    </Paragraph>
                  })}
                  </div>
                ) : (
                  <div>No Contracts</div>
                )}
              </Panel>
              <Panel
                header={
                  <div>
                    <b>- Leave Request Spanning Found</b>
                    <br />
                    Leave Requests spanning to next financial year would be
                    broken down into two request
                  </div>
                }
                key="leaverequest"
              >
                {leaveRequests.length ? (
                  <div>
                  {leaveRequests.map(({ id, employeeName, startDate, projectName, endDate, status }) => {
                    return <Paragraph key={id}>
                        Submitted By: <b>{employeeName}</b>
                        <Paragraph>
                          <Row justify="space-around">
                          <Col>Project Name: {projectName}</Col>
                            <Col>Start Date: {startDate}</Col>
                            <Col>End Date: {endDate}</Col>
                            <Col>Status: {status}</Col>
                            {/* <Col>End Date: {endDate}</Col> */}
                          </Row>
                        </Paragraph>
                    </Paragraph>
                  })}
                  </div>
                ) : (
                  <div>No Leave Requests</div>
                )}
              </Panel>
            <Panel header={<b>- Expenses</b>} key="expense">
                {expenseSheets.length ? (
                  expenseSheets.map(({ id, employeeName, projectName, status }) => {
                    return <Paragraph key={id}>
                        Employee: <b>{employeeName}</b>
                        <Paragraph>
                          <Row justify="space-around">
                            <Col>Code: 00{id}</Col>
                            <Col>Project Name: {projectName}</Col>
                            <Col>Status: {status}</Col>
                          </Row>
                        </Paragraph>
                    </Paragraph>
                  })
                ) : (
                  <div>No Contracts</div>
                )}
              </Panel>
            </Collapse>
            <Paragraph>
              <b>- Leave Balances</b>
              <Paragraph>
                <ul><li>{leaveRequestBalances}</li></ul>
              </Paragraph>
          </Paragraph>
          </span>
        ),
        // okButtonProps: { danger: stage === 'Delete' ?? true },
        okButtonProps: {
          htmlType: 'submit',
          form: 'my-form',
          loading,
        },
        okText: 'Yes',
        cancelText: 'No',
        onOk: async () => {
          onOkay(record, index)
        },
        onCancel: () => {
          modal.destroy();
        },
      });
    };

    const onOkay =(record, index)=>{
      let confirmModal = Modal.confirm({
        width: 400,
        title: "This Action Can't be Undo",
        icon: <ExclamationCircleOutlined color='red'/>,
        content: "Are you Sure You Want To Lock This Year?",
        onOk: async () => {
          try {
            setLoading(true);
            let { success } = await closingFY(record.id, '?confirm=true');
            setLoading(false);
            if (success) {
              let newData = [...data];
              newData[index]['closed'] = true;
              setData([...newData]);
            }
          } catch {
            setLoading(false);
            confirmModal.destroy();
          }
        },
        onCancel: () => {
          confirmModal.destroy();
        },
      })
    }

    const revert = (fyId) =>{
      revertFY(fyId).then(res=>{
        if(res.success){
          // window.location.reload();
        }
      })
    }

    const openModal = (record, rowIndex) =>{
      let tempData = [...data]
      let startDate = null
      let endDate = null

      //checking if new record was created there any redcord created before this
      if (record===true){
        if (tempData.length>0){
          moment.max(tempData?.map((obj) => {
            startDate = obj.startDate
            endDate = obj.endDate
            return moment(obj.endDate)
          }))
        }
       
      }else if (rowIndex>=0){ // this is to get startDate and endDate if 
        if (tempData.length>0){ // any Financial year get edit to stop overlapping
          let lastDates = {
            start: formatDate(tempData[rowIndex].startDate).subtract(1, "days"),
            end: formatDate(tempData[rowIndex].endDate).add(1, "days")
          }
          tempData.forEach((obj) => { 
            //checking if before this finanacial year was exist
            if (lastDates.start.isSame(obj.endDate, 'days')){
              startDate = obj.endDate
            }
            // checking if after this finanacial year was exist
            if (lastDates.end.isSame(obj.startDate, 'days')){
              endDate = obj.startDate
            }
          })
        }
      }

      setDisabledDates({
        startDate: startDate ? formatDate(startDate): null,
        endDate: startDate?endDate? formatDate(endDate): moment().add(10, "years"): null
      })
      setVisibleModal(record===true ? true: { ...record, rowIndex })
    }

    return (
      <Row justify="end" gutter={[0, 10]}>
        <Col>
          <Button 
            size="small" 
            type="primary"
            onClick={()=>openModal(true)}
            >Create FY</Button>
        </Col>
        <Col span={24}>
          <Table
              // title={()=>tableTitleFilter(5, this.generalFilter)}
              rowKey={(data) => data.id}
              bordered
              pagination={{pageSize: localStore().pageSize}}
              columns={columns}
              dataSource={data}
              size="small"
              className='fs-small'
              />
        </Col>
        {visibleModal&& <FYModal //visible true means to add new
          visible={visibleModal} // visble anydata means to edit this
          close={()=>setVisibleModal(false)}
          disableDates={disableDates}
          callBack={onFYAddAndUpdate}
        />}
        {visibleConfirm&& <FYCloseModal //visible true means to add new
          visible={visibleConfirm} // visble anydata means to edit this
          close={()=>setVisibleConfirm(false)}
          // callBack={onFYAddAndUpdate}
        />}
      </Row>
    )
  }

export default FinancialYears

          // <Paragraph>
          //     <b>- Leave Request Spanning Found</b><br/>
          //     Leave Requests spanning to next financial year would be broken down into two request,
          //     <Paragraph>
          //       <ul><li>Mustafa Syed</li></ul>
          //       <ul><li>Sameer Ahmed</li></ul>
          //     </Paragraph>
          // </Paragraph>
          // <Paragraph>
          //     <b>- Closing Projects</b>
          //     <Paragraph>
          //       <ul> <li>Non-Project Hours</li></ul>
          //       <ul> <li>SA - Strategic Design / Business Process EL2</li></ul>
          //       <ul> <li>AHQ - CALL RFQTS 9335 BUSICT ERP Program Schedule Manager</li></ul>
          //       will be closed
          //     </Paragraph>
          // </Paragraph>
          // <Paragraph>
          //     <b>- Leave Balances</b>
          //     <Paragraph>
          //       <ul><li>Leave Balanace will be closed for all employees</li></ul>
          //     </Paragraph>
          // </Paragraph>