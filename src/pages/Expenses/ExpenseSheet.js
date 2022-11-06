import React, { useState, useEffect } from 'react'
import { Button, Col, Dropdown, Menu, Modal, Popconfirm, Row, Table, Tag, Tooltip, Typography } from 'antd'
import { SettingOutlined, PlusSquareOutlined,ExclamationCircleOutlined, CheckCircleOutlined, AuditOutlined } from '@ant-design/icons'; //Icons
import ExpenseSheetModal from './Modals/ExpenseSheetModal';
import { expensesData } from './DummyData';
import { expenseSheetActions, getExpenseSheets } from '../../service/expenseSheet-Apis';
import { getListOfExpenses } from '../../service/expense-Apis';
import { generalDelete } from "../../service/delete-Api\'s";
import { formatDate, localStore, R_STATUS, STATUS_COLOR } from '../../service/constant';
import { tableSorter } from '../../components/Core/Table/TableFilter';
import {Tag_s} from '../../components/Core/Custom/Index';

const { Title } =  Typography

const ExpenseSheet = (props) => {
  const [selectedRows, setSelectedRows] = useState({keys: [], data: []});
  const [openModal, setOpenModal] = useState(false);
  const [expenseSheet, setExpenseSheet] = useState([]);
  const [expenses, setExpenses] =  useState([])
  // const [disableSubmit, setDisableSubmit] = useState(true);

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
      render: (text, record) => (
        <div>
          <Tag_s text={text} />{' '}
          {record.notes && (
            <Tooltip title={record.notes} placement="top" destroyTooltipOnHide>
              <AuditOutlined />
            </Tooltip>
          )}
        </div>
      ),
      ...tableSorter('status', 'string'),
    },
    {
      title: 'Submited At',
      dataIndex: 'submittedAt',
      align: 'center',
      render: (text)=> formatDate(text, true, true),
      ...tableSorter('date', 'date'),
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
                disabled={['AP', 'SB'].includes(record.status)}
                className="pop-confirm-menu"
              >
                <Popconfirm
                  disabled={['AP', 'SB'].includes(record.status)}
                  title="Are you sure you want to delete"
                  onConfirm={() => handleDelete(record.id, index)}
                >
                  <div> Delete </div>
                </Popconfirm>
              </Menu.Item>
              <Menu.Item
                key="edit"
                onClick={() =>
                  onOpenModal({...record,index})
                  // this.setState({
                  //   openModal: true,
                    
                  // })
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

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    getExpenseSheets().then((res) => {
      if (res.success) {
        setExpenseSheet(res.data);
      }
    })
  }

  const handleDelete = (id, index) => {
    const url = '/expense-sheets';
    const { history } = props;
    generalDelete(history, url, id, index, expenseSheet).then((res) => {
      if (res.success) {
        setExpenseSheet([...res.filterData]);
      }
    });
    
	}
  
  const onSelectChange = (newSelectedRowKeys, selectedRow) => {
    let checkDisable = false;
    selectedRow.forEach(el=>{
      if(el.status !== 'SV' && el.status !== 'RJ'){
        checkDisable = true
      }
    })
    
    // setDisableSubmit(checkDisable);
    setSelectedRows({keys:newSelectedRowKeys, data: selectedRow, checkDisable});
  };

  const closeModal = () => {
    setOpenModal(false);
  }

  const callBack = (data, index) => {
		let exp = expenseSheet;
    if (index >= 0) {
			exp[index] = data; 
		} else {
			exp = [...expenseSheet, data]
		}
    
		setExpenseSheet([...exp]);  
		setOpenModal(false);
  }

  const rowSelection = {
    selectedRowKeys: selectedRows.keys,
    onChange: onSelectChange,
    // preserveSelectedRowKeys: false,
    getCheckboxProps: (record)=> ({disabled: ['AP', 'SB'].includes(record.status) })
  };

  const onOpenModal = (open) =>{
    //send true if you need to call expenses for expense sheet
    getListOfExpenses(true, open?.id).then(res=>{
      if (res.success){
        setExpenses(res.data)
      }
      setOpenModal(open)
    })
  }

  const multiAction = ()=> {
    const {data =[] } = selectedRows
    let length = data.length
    let content = <div>{ 
      data.map(({label, projectName, projectType}, index) =>(
            <div key={index}>
                {label}{length -1 > index && ','  }  
            </div> 
        )) 
    }</div>
    const modal = Modal.confirm({
      title: `Do you wish to submit sheet${length >1 ? 's': ''} for`,
      icon: <CheckCircleOutlined />,
      content: content,
      // okButtonProps: {danger: stage === 'unapprove'??true},
      okText: 'Okay',
      cancelText: 'Cancel',
      onOk:()=>{
        //   this.actionTimeSheet(stage) 
          OutcomeAction()
          modal.destroy();
      }
    });
  }

  const OutcomeAction = () =>{
    const {keys =[] } = selectedRows
    let obj={sheets: keys}
    expenseSheetActions(`/submitMany`, obj).then(res=>{
        if (res.success){
            // data[index]['isApproved'] = true
            setSelectedRows({keys: [], data: []})              
            getData()
        }
    })
  }

  return (
    <>
      <Row justify='space-between'>
        <Col>
          <Title level={4}>Expenses Sheets</Title>
        </Col>
        <Col>
        <Button
          type="primary"
          size="small"
          onClick={() => {
            onOpenModal(true)
          }}
          // disabled={!permissions['ADD']}
        >
          <PlusSquareOutlined /> Add Expense Sheet
        </Button>
        </Col>  
        <Col span={24}>
          <Table
            size={'small'}
            bordered
            className='fs-small'
            pagination={{pageSize: localStore().pageSize}}
            rowKey={data=> data.id}
            rowSelection={rowSelection}
            columns={columns}
            dataSource={expenseSheet}
          />
        </Col>
        <Col span={24} >
          <Row justify="end" >
            <Col>
                <Button 
                    type="primary" 
                    className={'success'}
                    disabled={ (selectedRows.checkDisable || selectedRows['keys']?.length<1)}
                    // disabled={ sRequest.keys.length<1 || !permissions['APPROVAL'] || sRequest.cantReject}
                    onClick={()=>multiAction()}
                > 
                    Submit
                </Button>
            </Col>
          </Row>
        </Col>
      
      </Row>
      {/* {openModal&&<InfoModal
        visible={openModal}
        close={closeModal}
        callBack={callBack}
      />} */}
      {openModal&&<ExpenseSheetModal
        visible={openModal}
        close={closeModal}
        callBack={callBack}
        expenses={expenses}
      />}
    </>
  )
}

export default ExpenseSheet

