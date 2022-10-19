import { Button, Checkbox, Col, Dropdown, Menu, Popconfirm, Row, Table, Typography } from 'antd';
import Title from 'antd/lib/typography/Title';
import React from 'react'
import {
    DownOutlined,
    SettingOutlined,
    PlusSquareOutlined,
    FilterOutlined,
} from '@ant-design/icons'; //Icons
import { useState } from 'react';
import InfoModal from './Modals/InfoModal';
import { formatDate } from '../../../service/constant';
import ExpenseSheetModal from './Modals/ExpenseSheetModal';
import { expensesData } from '../DummyData';
  

const {Text} = Typography;
const Expense = () => {

    
  const [openModal, setOpenModal] = useState(false);
  const [openExpenseModal, setOpenExpenseModal] = useState(false);
  const [expenseData, setExpenseData] = useState(expensesData);

    
  const columns = [
    {
      title: 'CODE',
      dataIndex: 'code',
      sorter: {
        compare: (a, b) => a.code - b.code,
        multiple: 4,
      },
    },
    {
      title: 'TYPE',
      dataIndex: 'type',
      sorter: {
        compare: (a, b) => a.type - b.type,
        multiple: 3,
      },
    },
    {
      title: 'DATE',
      dataIndex: 'date', // when-api change it to [date,name] or dateName
      render: (text) => formatDate(text, true, true),
      sorter: {
        compare: (a, b) => a.date - b.date,
        multiple: 2,
      },
    },
    {
      title: 'AMOUNT',
      dataIndex: 'amount',
      sorter: {
        compare: (a, b) => a.amount - b.amount,
        multiple: 1,
      },
    },
    {
      title: 'FILES',
      dataIndex: 'files',
      //   sorter: {
      //     compare: (a, b) => a.files - b.files,
      //     multiple: 1,
      //   },
      render: () => (
        <Text>View</Text>
      )
    },
    {
      title: 'i',
      dataIndex: 'reimbursed',
      render: (value) => (
        <Checkbox defaultChecked={false} checked={value} />
      )
    },
    {
      title: 'b',
      dataIndex: 'billable',
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
                //   onConfirm={() => handleDelete(record.id, index)}
                >
                  <div> Delete </div>
                </Popconfirm>
              </Menu.Item>
              <Menu.Item
                key="edit"
              // onClick={() =>
              //   setOpenModal({...record,index})
                
              //   // this.setState({
              //   //   openModal: true,
                        
              //   // })
              // }
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

  const callBack = (data, index) => {
    let exp = expenseData;
    if (index >= 0) {
      exp[index] = data;
    } else {
      data.id = expenseData.length + 1; // when-api remove this
      exp = [...expenseData, data]
    }
    setExpenseData([...exp]);
    setOpenModal(false);
  }
  
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
          rowKey={data=> data.id}
        //   rowSelection={rowSelection}
          columns={columns}
          dataSource={expenseData}
        // onChange={onChange} 
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