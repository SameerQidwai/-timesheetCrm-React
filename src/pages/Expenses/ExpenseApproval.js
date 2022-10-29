import { Button, Col, DatePicker, Dropdown, Menu, Popconfirm, Row, Select, Table, Typography } from 'antd';
import { SettingOutlined, } from '@ant-design/icons'; //Icons
import React, { useEffect, useState } from 'react'
import { getProjects } from '../../service/constant-Apis';
import { getExpenseSheets } from '../../service/expenseSheet-Apis';
import { formatDate, localStore } from '../../service/constant';
// import { expensesData as dummyExpensesData } from '../DummyData';
import ExpenseSheetModal from './Modals/ExpenseSheetModal';
import { tableSorter } from '../../components/Core/Table/TableFilter';

const { Title } = Typography

const ExpenseApproval = () => {

  // dummy text
  const data = [
    {
      id: '1',
      code: 'AR390',
      title: 'abc',
      project: {label: "defiti"},
      amount: 70,
      status: "Submitted",
      submittedAt: "12-05-2022"
  
    },
    {
      id: '2',
      code: 'AR391',
      title: 'def',
      project: {label: 'mongo'},
      amount: 89,
      status: "Rejected",
      submittedAt: "12-05-2022"
      },
    {
      id: '3',
      code: 'AR392',
      title: 'ghi',
      project: {label: "gifti"},
      amount: 70,
      status: "Submitted",
      submittedAt: "12-05-2022"
      },
    {
      id: '4',
      code: 'AR393',
      title: 'jkl',
      project: {label: 'mouse'},
      amount: 89,
      status: "Submitted",
      submittedAt: "12-05-2022"
      },
  ];

  const [projects, setProjects] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [expenseData, setExpenseData] = useState();
  const [openModal, setOpenModal] = useState(false);
  // const [adminView, setAdminView] = useState(false);
  const [disableSubmit, setDisableSubmit] = useState(true);
  const [queryRequest, setQueryRequest] = useState({
    startDate: formatDate(new Date()).startOf("month"),
    endDate: formatDate(new Date()).endOf("month")});  
  const { startDate, endDate} = queryRequest

  const columns = [
    {
      title: 'Code',
      dataIndex: 'id',
      render: (text)=> `00${text}`, 
      ...tableSorter('id', 'number'),
    
    },
    {
      title: 'Title',
      dataIndex: 'label',
      ...tableSorter('label', 'string'),
    },
    {
      title: 'Project',
      dataIndex: 'projectName',
      ...tableSorter('projectName', 'string'),
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      align: 'center',
      ...tableSorter('amount', 'number'),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      align: 'center',
      ...tableSorter('status', 'string')
    },
    {
      title: 'Submitted At',
      dataIndex: 'submittedAt',
      align: 'center',
      ...tableSorter('submittedAt', 'string')    
    },
    {
      title: '...',
      key: 'action',
      align: 'center',
      width: '1%',
      // width: '155',
      render: (value, record, index) => (
        <Dropdown
          overlay={
            <Menu>
              <Menu.Item
                key="delete"
                danger
                // disabled={!this?.state?.permissions?.['DELETE']}
                className="pop-confirm-menu"
              >
                <Popconfirm
                  title="Are you sure you want to delete"
                  // onConfirm={() => handleDelete(record.id, index)}
                >
                  <div> Delete </div>
                </Popconfirm>
              </Menu.Item>
              <Menu.Item
                key="edit"
                onClick={() =>
                  setOpenModal({...record,index,adminView : true})
                }
                // disabled={this.state && !this.state.permissions['UPDATE']}
              >
                Edit
              </Menu.Item>
              {/* <Menu.Item key="view">
                <Link
                  to={{ pathname: `/opportunities/${record.id}/info` }}
                  className="nav-link"
                >
                  View
                </Link>
              </Menu.Item> */}
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

  const onSelectChange = (newSelectedRowKeys, selectedRow) => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    let checkRejectDisable = false;
    let checkApproveDisable = false;
    selectedRow.forEach(el=>{
      if(el.status !== 'Submitted'){
        checkRejectDisable = true;
      } 
      if(el.status !== 'Rejected'){
        checkApproveDisable = true  
      } 
    })
    
    setDisableSubmit([checkRejectDisable,checkApproveDisable]);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  console.log("di",disableSubmit)
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  // for get all project 
  const gettingProject = () => {
    getProjects().then((res) => {
      if (res.success) {
        setProjects(res.data); 
      }
        
    })
  }

  const gettingExpenseSheets = () => {
    getExpenseSheets().then((res) => {
      if (res.success) {
        console.log("res->", res.data)
        setExpenseData(res.data); 
      }
    })
  }

  // modals 
  const closeModal = () => {
    setOpenModal(false);
  }

  // for filter expense according to project
  // const selectedProjectExpenses = (ind) => {
  //   let backupExpenses = data?? dummyExpensesData
  //   let filteredProject = backupExpenses?.filter((ele) => {
  //     return ele.projectId === ind;
  //   });
  //   setExpenseData(filteredProject);
  //   // setSelectedRowKeys(codes?? [])
  // }  
  
  useEffect(() => {
    gettingProject();
    gettingExpenseSheets();
  }, []);
  
  return (
    <>
    <Row justify='space-between'>
        <Col span={5}>
          <Title level={4}>Expenses Sheets Approval</Title>
        </Col>
        <Col span={3}>
        <Select
            placeholder="Select Project"
            style={{ width: 300 }}
            allowClear
            options={projects}
            showSearch
            optionFilterProp={["label", "value"]}
            filterOption={
                (input, option) =>{
                    const label = option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    const value = option.value.toString().toLowerCase().indexOf(input.toLowerCase()) >= 0
                        return label || value
                }
            }
          // onChange={(ind) => { selectedProjectExpenses(ind) }}
          onChange={(ind) => { console.log("need change") }}
        />
        </Col>  
        <Col span={6}>
        <Row justify='space-between'>      
            <Col>                  
              <DatePicker
                  // mode="month"
                  // picker="month"
                  // format="MMM-YYYY"
                  value={startDate}
                  onChange={(value)=>{
                      setQueryRequest({...queryRequest,
                          startDate: value && formatDate(value).startOf("month"),
                          // endDate: value && formatDate(value).endOf("month") 
                      }
                      //   , () => {
                      //     this.getData()
                      // }
                      )
                  }}
              />
            </Col>
            <Col>
              <DatePicker
                  // mode="month"
                  // picker="month"
                  // format="MMM-YYYY"
                  value={endDate}
                  onChange={(value)=>{
                    setQueryRequest({...queryRequest,
                          // startDate: value && formatDate(value).startOf("month"),
                          endDate: value && formatDate(value).endOf("month") 
                      }
                      //   , () => {
                      //     this.getData()
                      // }
                      )
                  }}
              />
            </Col>
        </Row>
        </Col>  
        <Col span={24}>
          <Table
            size={'small'}
            bordered
            className='fs-small'
            pagination={{pageSize: localStore().pageSize, hideOnSinglePage: true, responsive: true, size: 'small'}}
            rowKey={data=> data.id}
            rowSelection={rowSelection}
            columns={columns}
            dataSource={expenseData}
            // onChange={onChange} 
          />
      </Col>
      <Col span={24} >
        <Row justify="end" gutter={[20,200]}>
          {/* <Col span={18}>
            
          </Col> */}
            {/* <Col span={6} style={{display:"flex",flexDirection:"row",justifyContent:"space-evenly"}}> */}
            <Col >
                <Button 
                    type="primary" 
                    danger
                    disabled={ (disableSubmit[0] || selectedRowKeys.length<1)}
                    // disabled={ sRequest.keys.length<1 || !permissions['APPROVAL'] || sRequest.cantReject}
                    // onClick={()=>this.multiAction('Reject')}
                > 
                    Reject
                </Button>
            </Col>
            <Col>
                <Button
                    className={'success'}
                    disabled={ (disableSubmit[1] || selectedRowKeys.length<1)}
                    // onClick={()=> this.multiAction('Approve')}
                >
                    Approve
                </Button>
            </Col>
        </Row>
        </Col>
      </Row>
      {openModal&&<ExpenseSheetModal
        visible={openModal}
        close={closeModal}
        adminView= {true}
        // callBack={callBack}
      />}   
    </>
  )
}

export default ExpenseApproval