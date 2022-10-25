import { Button, Col, Dropdown, Menu, Popconfirm, Row, Table } from 'antd'
import {
  DownOutlined,
  SettingOutlined,
  PlusSquareOutlined,
  FilterOutlined,
} from '@ant-design/icons'; //Icons
import Title from 'antd/lib/typography/Title'
import React from 'react'
import { useState } from 'react';
import InfoModal from './Modals/InfoModal';
import ExpenseSheetModal from './Expenses/Modals/ExpenseSheetModal';
import { expensesData } from './DummyData';
import { useEffect } from 'react';
import { getExpenseSheets } from '../../service/expenseSheet-Apis';
import { getListOfExpenses } from '../../service/expense-Apis';
import { generalDelete } from '../../service/delete-Api\'s';


const ExpenseSheet = (props) => {

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [expenseSheet, setExpenseSheet] = useState([]);
  const [expenses, setExpenses] =  useState([])

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    getExpenseSheets().then((res) => {
      if (res.success) {
        console.log("res->",res.data)
        setExpenseSheet(res.data);
      }
    })
  }

  const handleDelete = (id, index) => {
    const url = '/expense-sheets';
    // const { data, filterData } = this.state;
    const { history } = props;
    generalDelete(history, url, id, index, expenseSheet).then((res) => {
      if (res.success) {
        setExpenseSheet([...res.filterData]);
      }
    });
    
	}

  const columns = [
    {
      title: 'Code',
      dataIndex: 'id',
      render: (text)=> `00${text}`, 
    },
    {
      title: 'Title',
      dataIndex: 'label',
    },
    {
      title: 'Project',
      dataIndex: 'projectName',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
    },
    {
      title: 'Status',
      dataIndex: 'status',
    },
    {
      title: 'Submited At',
      dataIndex: 'submittedAt',
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
  
  const onChange = (pagination, filters, sorter, extra) => {
    console.log('params', pagination, filters, sorter, extra);
  };

  const onSelectChange = (newSelectedRowKeys) => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  // modals 
  const closeModal = () => {
    setOpenModal(false);
  }

  const callBack = (data, index) => {
		let exp = expenseSheet;
    if (index >= 0) {
			exp[index] = data; 
		} else {
			data.id = expenseSheet.length + 1; // when-api remove this
			exp = [...expenseSheet, data]
		}
    
		setExpenseSheet([...exp]);  
		setOpenModal(false);
  }

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const onOpenModal = (open) =>{
    getListOfExpenses().then(res=>{
      if (res.success){
        setExpenses(res.data)
      }
      setOpenModal(open)
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
            rowKey={data=> data.id}
            rowSelection={rowSelection}
            columns={columns}
            dataSource={expenseSheet}
            onChange={onChange} 
          />
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
