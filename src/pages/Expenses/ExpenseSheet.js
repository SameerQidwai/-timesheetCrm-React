import React, { useState, useEffect } from 'react'
import { Button, Col, Dropdown, Menu, Modal, Popconfirm, Row, Table, Tag, Tooltip, Typography } from 'antd'
import { SettingOutlined, PlusSquareOutlined,ExclamationCircleOutlined, CheckCircleOutlined, AuditOutlined } from '@ant-design/icons'; //Icons
import ExpenseSheetModal from './Modals/ExpenseSheetModal';
import { expensesData } from './DummyData';
import { expenseSheetActions, getExpenseSheets } from '../../service/expenseSheet-Apis';
import { getListOfExpenses } from '../../service/expense-Apis';
import { generalDelete } from "../../service/delete-Api\'s";
import { dateClosed, formatCurrency, formatDate, localStore, R_STATUS, STATUS_COLOR } from '../../service/constant';
import { tableSorter, tableTitleFilter } from '../../components/Core/Table/TableFilter';
import {Tag_s} from '../../components/Core/Custom/Index';

const { Title } =  Typography

const ExpenseSheet = (props) => {
  const [selectedRows, setSelectedRows] = useState({keys: [], data: []});
  const [openModal, setOpenModal] = useState(false);
  const [expenseSheet, setExpenseSheet] = useState({data:[], filtered: []});
  const [expenses, setExpenses] =  useState([])
	const [permission, setPermission] = useState({});
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
      title: 'Employee Name',
      dataIndex: 'createdBy',
      ...tableSorter('createdBy', 'string'),
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      align: 'center',
      render:(text)=> (formatCurrency(text)),
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
      ...tableSorter('status', 'string', true, 'SB')
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
      render: (value, record, index) => {
        let disable =
          ['AP', 'SB'].includes(record.status) ||
          !permission['DELETE'] ||
          dateClosed(record.submittedAt) ||
          dateClosed(record.approvedAt) ||
          dateClosed(record.rejectedAt);
        return <Dropdown
          overlay={
            <Menu>
              <Menu.Item
                key="delete"
                danger
                disabled={disable}
                className="pop-confirm-menu"
              >
                <Popconfirm
                  disabled={disable}
                  title="Are you sure you want to delete ?"
                  onConfirm={() => handleDelete(record.id, index)}
                  okText="Yes"
                  cancelText="No"
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
                // disabled={['AP', 'SB'].includes(record.status) || !permission['UPDATE']}
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
      },
    },
  ];

  useEffect(() => {
    getData();
    gettingPermissions();
  }, []);

  const getData = () => {
    getExpenseSheets().then((res) => {
      if (res.success) {
        setExpenseSheet({data: res?.data?? [], filtered: res?.data?? []});
      }
    })
  }

  // my work 
	const gettingPermissions = () => {
		const { id, permissions} = localStore();
		const { EXPENSES = {} } = JSON.parse(permissions)
		setPermission(EXPENSES);		
  } 
  
  const handleDelete = (id, index) => {
    let {data, filtered} =  expenseSheet
    const url = '/expense-sheets';
    const { history } = props;
    generalDelete(history, url, id, index, filtered, data).then((res) => {
      if (res.success) {
        setExpenseSheet({filtered: [...res.filterData], data: [...res.data]});
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

  const callBack = (rowData, index) => {
		let {data, filtered} =  expenseSheet;
    if (index >= 0) {
			let findIndex = data.findIndex(el=> el.id === rowData.id)
      let findFilteredIndex = filtered.findIndex(el=> el.id === rowData.id)
      data[findIndex] = rowData;
      filtered[findFilteredIndex] = rowData;
		} else {
			data = [...data, rowData]
      filtered = [...filtered, rowData]
		}
    
		setExpenseSheet({data: [...data], filtered: [...filtered]});  
		setOpenModal(false);
  }

  const rowSelection = {
    selectedRowKeys: selectedRows.keys,
    onChange: onSelectChange,
    // preserveSelectedRowKeys: false,
    getCheckboxProps: (record) => ({
      disabled:
        ['AP', 'SB'].includes(record.status) ||
        dateClosed(record.submittedAt) ||
        dateClosed(record.approvedAt) ||
        dateClosed(record.rejectedAt),
    }),
  };

  const onOpenModal = (open) =>{
    //send true if you need to call expenses for expense sheet
    getListOfExpenses(true, open?.id).then(res=>{
      if (res.success){
        let data = (res.data??[]).filter(exp=>{
          if(!exp?.isInSheet?.id){
            return true
          }
        })
        setExpenses(data)
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
      okText: 'Yes',
      cancelText: 'No',
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

  const generalFilter = (value) => {
    if (value) {
      value = value.replace(/\s+/g, '').toLowerCase()
      setExpenseSheet(prev => ({
        ...prev,
        filtered: prev.data.filter((el) => {
          // console.log(el.projectName && el.projectName.toLowerCase().replace(/\s+/g, '').includes(value))
          return (
            `00${el.id.toString().replace(/\s+/g, '')}`.includes(value) ||
            (el.label &&
              el.label.toLowerCase().replace(/\s+/g, '').includes(value)) ||
            (el.projectName &&
              el.projectName.toLowerCase().replace(/\s+/g, '').includes(value)) ||
            (el.createdBy &&
              el.createdBy.toLowerCase().replace(/\s+/g, '').includes(value)) ||
            (el.status !== 'SV' &&
              R_STATUS[el.status].toLowerCase().replace(/\s+/g, '').includes(value)) ||
            (el.amount &&
              `${formatCurrency(el.amount)}`
                .toLowerCase().replace(/\s+/g, '')
                .includes(value)) ||
            (el.submittedAt &&
              `${formatDate(el.submittedAt, true, true)}`
                .toLowerCase().replace(/\s+/g, '')
                .includes(value)) 
            );
        }),
      }));
    } else {
      setExpenseSheet(prev => ({
        ...prev,
        filtered: prev.data,
      }));
    }
  };

  return (
    <>
      <Row justify='space-between'>
        <Col>
          <Title level={4}>Expense Sheets</Title>
        </Col>
        <Col>
        <Button
          type="primary"
          size="small"
          onClick={() => {
            onOpenModal(true)
          }}
          // disabled={!permission['ADD']}
            
        >
          <PlusSquareOutlined /> Add Expense Sheet
        </Button>
        </Col>  
        <Col span={24}>
          <Table
            title={() => tableTitleFilter(5, generalFilter)}
            size={'small'}
            bordered
            className='fs-small'
            pagination={{pageSize: localStore().pageSize}}
            rowKey={data=> data.id}
            rowSelection={rowSelection}
            columns={columns}
            dataSource={expenseSheet.filtered?? []}
          />
        </Col>
        <Col span={24} >
          <Row justify="end" >
            <Col>
                <Button 
                    type="primary" 
                    className={'success'}
                    disabled={ (selectedRows.checkDisable || !permission['ADD'] || selectedRows['keys']?.length<1)}
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

