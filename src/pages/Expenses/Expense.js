import React, { useEffect, useState } from 'react'
import { Button, Checkbox, Col, Dropdown, Menu, Popconfirm, Row, Table, Typography } from 'antd';
import { SettingOutlined, PlusSquareOutlined, } from '@ant-design/icons'; //Icons
import InfoModal from './Modals/InfoModal';
import { formatDate, localStore } from '../../service/constant';
import ExpenseSheetModal from './Modals/ExpenseSheetModal';
import { expensesData } from './DummyData';
import { delExpense, getListOfExpenses } from '../../service/expense-Apis';
import { generalDelete } from "../../service/delete-Api's";
import { tableSorter } from '../../components/Core/Table/TableFilter';
  

const {Text, Title} = Typography;
const Expense = (props) => {

    
  const [openModal, setOpenModal] = useState(false);
  const [openExpenseModal, setOpenExpenseModal] = useState(false);
  const [expenseData, setExpenseData] = useState([]);
    
  const columns = [
    {
      title: 'Code', 
      dataIndex: 'id',
      render: (text)=> `00${text}`, 
      ...tableSorter('id', 'number', true),
    },
    {
      title: 'Type',
      dataIndex: 'expenseTypeName',
      ...tableSorter('expenseTypeName', 'string'),
    },
    {
      title: 'Project',
      dataIndex: 'projectName',
      ...tableSorter('projectName', 'string'),
    },
    {
      title: 'Date',
      dataIndex: 'date',
      render: (text) => formatDate(text, true, true),
      ...tableSorter('date', 'date'),
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      ...tableSorter('id', 'number'),
    },
    {
      title: 'Files',
      dataIndex: 'files',
      render: () => (
        <Text>View</Text>
      )
    },
    {
      title: 'i',
      dataIndex: 'isReimbursed',
      render: (value) => (
        <Checkbox defaultChecked={false} checked={value} />
      )
    },
    {
      title: 'b',
      dataIndex: 'isBillable',
      render: (value) => (
        <Checkbox defaultChecked={false} checked={value} />
      )
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
                  onConfirm={() => handleDelete(record.id, index)}
                >
                  <div> Delete </div>
                </Popconfirm>
              </Menu.Item>
              <Menu.Item
                key="edit"
              onClick={() =>
                setOpenModal({...record,index})
              }
              >
                Edit
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

  useEffect(() => { 
    getData();
  }, []);

  const getData = () => {
    getListOfExpenses().then((res) => {
      if(res?.success){
        setExpenseData(res?.data?? []);
      }
    })
  }


  const callBack = (data, index) => {
    let exp = expenseData;
    if (index >= 0) {
      exp[index] = data;
    } else {
      exp = [...expenseData, data]
    }
    setExpenseData([...exp]);
    setOpenModal(false);
  }
  
  // expense sheet onsubmit
  const sheetCallBack = (data) => {
    console.log({ 'Expense seheet data': data })
    setOpenExpenseModal(false)
  }
    
  const closeModal = () => {
  setOpenModal(false);
  }

  const closeExpenseModal = () => {
      setOpenExpenseModal(false);
  }

  const handleDelete = (id, index) => {
    const url = '/expenses';
    // const { data, filterData } = this.state;
    const { history } = props;
    generalDelete(history, url, id, index, expenseData).then((res) => {
      if (res.success) {
        setExpenseData([...res.filterData]);
      }
    });
    
	}
  
  return (
    <>
    <Row justify='space-between'>
      <Col>
        <Title level={4}>Expenses</Title>
      </Col>
      <Col>
      <Button
        type="primary"
        size="small"
        onClick={() => {
          setOpenModal(true);
        }}
        // disabled={!permissions['ADD']}
      >
        <PlusSquareOutlined /> Add Expense
      </Button>
      </Col>  
      <Col span={24}>
        <Table
          size={'small'}
          bordered
          className='fs-small'
          pagination={{pageSize: localStore().pageSize}}
          rowKey={data=> data.id}
          columns={columns}
          dataSource={expenseData}
          />
        </Col>
    </Row>
        <Col style={{display:"flex",flexDirection:"row",justifyContent:"flex-end"}}>
            <Button
                type="primary"
                size="small"
                onClick={() => {
                setOpenExpenseModal(true);
                }}
                // disabled={!permissions['ADD']}
            >
                <PlusSquareOutlined /> Create Expense Sheet
            </Button>
        </Col>
              
    {openModal&&<InfoModal
      visible={openModal}
      close={closeModal}
      callBack={callBack}
    />}
    {openExpenseModal && <ExpenseSheetModal
      visible={openExpenseModal}
      expenses= {expenseData}
      close={closeExpenseModal}
      callBack={sheetCallBack}
    />
    }     
  </>
  )
}

export default Expense