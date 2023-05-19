import React, { useEffect, useState } from 'react'
import { Form, Modal, Steps, Tabs, message, Row, Col, Typography, Table } from 'antd'
import { formatDate } from '../../../../service/constant';
import { closingFY } from '../../../../service/financial-year-apis';
import { ExclamationCircleOutlined } from "@ant-design/icons"; //Icons
import '../styles.css'
const {Step} = Steps
const {Paragraph} = Typography

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

const FYCloseModal = ({ visible, close, callBack }) => {
    const [loading, setLoading] = useState();
    const [closeData, setCloseData] = useState([]);
    const [steps, setSteps] = useState(0);

    useEffect(() => {
        getData();
    }, []);

    const getData = async() => {
      try{
        message.loading({ content: 'Getting Information', key: 1}, 0);
        let {success, data} = await closingFY(visible.id)
        message.warning({ content: 'Please Read The Action Carefully', key: 1}, 5);
        if (success){
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
            title: 'Project',
            key: 0,
            content: 
                <Table
                  rowKey={(data) => data.id}
                  columns={[
                    {
                      title: "Title",
                      dataIndex: "title",
                      key: "title",
                    },
                    {
                      title: "Code",
                      dataIndex: "id",
                      key: "id",
                      render: (text) => `00${text}`
                    },
                    {
                      title: "Start Date",
                      dataIndex: "startDate",
                      key: "startDate",
                    },
                    {
                      title: "End Date",
                      dataIndex: "endDate",
                      key: "endDate",
                    },
                  ]}
                  dataSource={projects.length?projects:[]}
                  size="small"
                  className='fs-small'
                  />
                  // {/* {projects.map(({ id, title, startDate, endDate }) => {
                  //   return (
                  //     <Paragraph key={id}>
                  //       Title: <b>{title}</b>
                  //       <Paragraph>
                  //         <Row justify="space-around">
                  //           <Col>Code: 00{id}</Col>
                  //           <Col>Start Date: {startDate}</Col>
                  //           <Col>End Date: {endDate}</Col>
                  //         </Row>
                  //       </Paragraph>
                  //     </Paragraph>
                  //   );
                  // })} */}
          };

          createSteps[1] = {
            title: 'Milestone',
            key: 1,
            content: 
            <Table
                  rowKey={(data) => data.id}
                  columns={[
                    {
                      title: "Title",
                      dataIndex: "title",
                      key: "title",
                    },
                    {
                      title: "Code",
                      dataIndex: "id",
                      key: "id",
                      render: (text) => `00${text}`
                    },
                    {
                      title: "Project Name",
                      dataIndex: "projectName",
                      key: "projectName",
                    },
                    {
                      title: "Start Date",
                      dataIndex: "startDate",
                      key: "startDate",
                      render: (text) => formatDate(text, true, 'DD-MM-YYYY')
                    },
                    {
                      title: "End Date",
                      dataIndex: "endDate",
                      key: "endDate",
                      render: (text) => formatDate(text, true, 'DD-MM-YYYY')
                    },
                  ]}
                  dataSource={milestones.length?milestones:[]}
                  size="small"
                  className='fs-small'
                />
            // milestones.length ? (
            //   <div>
            //   {milestones.map(({ id, title, startDate, endDate, projectName }) => {
            //     return <Paragraph key={id}>
            //         Title: <b>{title}</b>
            //         <Paragraph>
            //           <Row justify="space-around">
            //             <Col>Code: 00{id}</Col>
            //             <Col>Project Name: {projectName}</Col>
            //             <Col>Start Date: {startDate}</Col>
            //             <Col>End Date: {endDate}</Col>
            //           </Row>
            //         </Paragraph>
            //     </Paragraph>
            //   })}
            //   </div>
            // ) : (
            //   <div>No Milestones</div>
            // )
          }

          createSteps[2] = {
            title: 'Timesheet',
            key: 2,
            content: <Table
            rowKey={(data) => data.id}
            columns={[
              {
                title: "Employee",
                dataIndex: "employeeName",
                key: "employeeName",
              },
              {
                title: "Project Name",
                dataIndex: "projectName",
                key: "projectName",
              },
              {
                title: "Month",
                dataIndex: "startDate",
                key: "startDate",
                render: (text) => formatDate(text).format('MMM')
              },
              {
                title: "Status",
                dataIndex: "status",
                key: "status",
              },
            ]}
            dataSource={timesheets.length?timesheets:[]}
            size="small"
            className='fs-small'
          />
            
            // timesheets.length ? (
            //   <div>
            //   {timesheets.map(({ id, employeeName, startDate, status, projectName }) => {
            //     return <Paragraph key={id}>
            //         Employee: <b>{employeeName}</b>
            //         <Paragraph>
            //           <Row justify="space-around">
            //             <Col>Project Name: {projectName}</Col>
            //             <Col>Month: {formatDate(startDate).format('MMM')}</Col>
            //             <Col>Status: {status}</Col>
            //           </Row>
            //         </Paragraph>
            //     </Paragraph>
            //   })}
            //   </div>
            // ) : (
            //   <div>No Milestones</div>
            // )
          }

          createSteps[3] = {
            title: 'Contracts',
            key: 3,
            content: <Table
            rowKey={(data) => data.id}
            columns={[
              {
                title: "Employee",
                dataIndex: "employeeName",
                key: "employeeName",
              },
              {
                title: "code",
                dataIndex: "id",
                key: "id",
                render: (text) => `00${text}`
              },
              {
                title: "Start Date",
                dataIndex: "startDate",
                key: "startDate",
                render: (text) => formatDate(text, true, 'DD-MM-YYYY')
              },
              {
                title: "End Date",
                dataIndex: "endDate",
                key: "endDate",
                render: (text) => formatDate(text, true, 'DD-MM-YYYY')
              },
            ]}
            dataSource={contracts.length?contracts:[]}
            size="small"
            className='fs-small'
          />
            // contracts.length ? (
            //   <div>
            //     {contracts.map(({ id, name, startDate, endDate }) => {
            //       return <Paragraph key={id}>
            //           Employee: <b>{name}</b>
            //           <Paragraph>
            //             <Row justify="space-around">
            //               <Col>Code: 00{id}</Col>
            //               <Col>Start Date: {startDate}</Col>
            //               <Col>End Date: {endDate}</Col>
            //             </Row>
            //           </Paragraph>
            //       </Paragraph>
            //     })}
            //     </div>
            //   ) : (
            //     <div>No Contracts</div>
            //     )
          }

          createSteps[4] = {
            title: 'Leave',
            key: 4,
            content: <Table
            rowKey={(data) => data.id}
            columns={[
              {
                title: "Submitted By",
                dataIndex: "employeeName",
                key: "employeeName",
              },
              {
                title: "Project Name",
                dataIndex: "projectName",
                key: "projectName",
              },
              {
                title: "Start Date",
                dataIndex: "startDate",
                key: "startDate",
                render: (text) => formatDate(text, true, 'DD-MM-YYYY')
              },
              {
                title: "End Date",
                dataIndex: "endDate",
                key: "endDate",
                render: (text) => formatDate(text, true, 'DD-MM-YYYY')
              },
            ]}
            dataSource={leaveRequests.length?leaveRequests:[]}
            size="small"
            className='fs-small'
          />
            // leaveRequests.length ? (
            //   <div>
            //   {leaveRequests.map(({ id, employeeName, startDate, projectName, endDate, status }) => {
            //     return <Paragraph key={id}>
            //         Submitted By: <b>{employeeName}</b>
            //         <Paragraph>
            //           <Row justify="space-around">
            //           <Col>Project Name: {projectName}</Col>
            //             <Col>Start Date: {startDate}</Col>
            //             <Col>End Date: {endDate}</Col>
            //             <Col>Status: {status}</Col>
            //             {/* <Col>End Date: {endDate}</Col> */}
            //           </Row>
            //         </Paragraph>
            //     </Paragraph>
            //   })}
            //   </div>
            // ) : (
            //   <div>No Leave Requests</div>
            // )
          }
          setCloseData(createSteps)
        }

      }catch{
        console.log('this action cant be perform')
      }
    }

    
    const onOkay =()=>{
      let confirmModal = Modal.confirm({
        width: 400,
        title: "This Action Can't be Undo",
        icon: <ExclamationCircleOutlined color='red'/>,
        content: "Are you Sure You Want To Lock This Year?",
        onOk: async () => {
          // try {
          //   setLoading(true);
          //   let { success } = await closingFY(visible.id, '?confirm=true');
          //   setLoading(false);
          //   if (success) {
          //     let newData = [...data];
          //     newData[index]['closed'] = true;
          //     setData([...newData]);
          //   }
          // } catch {
          //   setLoading(false);
          //   confirmModal.destroy();
          // }
        },
        onCancel: () => {
          confirmModal.destroy();
        },
      })
    }
    // const items = closeData.map(({title, key}) => ({ key: key, title: title }));

    let cond1 = steps === closeData.length - 1
    let cond2 = steps > 0
    return (
      <Modal
        title={
          <span>
            <ExclamationCircleOutlined /> {' '}
            Do you wish to close "{visible.label}"{' '}
            <b>
              {formatDate(visible.startDate, true,'DD-MM-YYYY')} - 
              {formatDate(visible.endDate, true,'DD-MM-YYYY')}
            </b>
          </span>
        }
        visible={visible}
        okButtonProps={{danger: cond1}}
        okText={cond1? 'CLOSE FY': 'Next'}
        cancelText={cond2? 'Prev' : 'Cancel' }
        onOk={() => {
          if(cond1){
            onOkay()
          }else{
            setSteps(steps+1)
          }
        }}
        onCancel={() => {
          if(cond2){
            setSteps(steps-1)
          }else{
            close();
          }
        }}
        className="fy-modal"
        // onCancel={close}
      >
        <div>
          <Steps current={steps} items={stepsInitial} size="small" >
          {closeData.map((item, index) => (
            <Step key={index} title={item.title} />
          ))}
          </Steps>
        </div>
        <div className="steps-content">
          {closeData?.[steps]?.content && closeData[steps].content}
        </div>
      </Modal>
    );
}

export default FYCloseModal