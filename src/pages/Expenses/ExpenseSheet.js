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


const ExpenseSheet = () => {

  // dummy text
  const data = [
    {
      id: '1',
      code: 'AR390',
      title: 'abc',
      // project: {label: "defiti"},
      amount: 70,
      status: "saved",
      submittedAt: "12-05-2022"
  
    },
    {
      id: '2',
      code: 'AR391',
      title: 'def',
      // project: {label: 'mongo'},
      amount: 89,
      status: "saved",
      submittedAt: "12-05-2022"
      },
    {
      id: '3',
      code: 'AR392',
      title: 'ghi',
      // project: {label: "gifti"},
      amount: 70,
      status: "saved",
      submittedAt: "12-05-2022"
      },
    {
      id: '4',
      code: 'AR393',
      title: 'jkl',
      // project: {label: 'mouse'},
      amount: 89,
      status: "saved",
      submittedAt: "12-05-2022"
      },
  ];

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [expenseData, setExpenseData] = useState(data);


	const handleDelete = (id,index) => {
		let updatedData = expenseData.filter((ele,ind) => {
			return ind != index;
		});
		setExpenseData([...updatedData]);
	}

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
      title: 'TITLE',
      dataIndex: 'title',
      sorter: {
        compare: (a, b) => a.title - b.title,
        multiple: 3,
      },
    },
    {
      title: 'PROJECT',
      dataIndex: ['project', 'label'], // when-api change it to [project,name] or projectName
      sorter: {
        compare: (a, b) => a.project?.label - b.project?.label,
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
      title: 'STATUS',
      dataIndex: 'status',
      sorter: {
        compare: (a, b) => a.status - b.status,
        multiple: 1,
      },
    },
    {
      title: 'SUBMITTED AT',
      dataIndex: 'submittedAt',
      sorter: {
        compare: (a, b) => a.submittedAt - b.submittedAt,
        multiple: 1,
      },
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
		console.log("data------>",data)
		console.log("index------>",index)
		let exp = expenseData;
    if (index >= 0) {
		console.log("index find------>",index)
			exp[index] = data; 
		} else {
			data.id = expenseData.length + 1; // when-api remove this
			exp = [...expenseData, data]
		}
    
		setExpenseData([...exp]);  
		setOpenModal(false);
  }

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    selections: [
      Table.SELECTION_ALL,
      Table.SELECTION_INVERT,
      Table.SELECTION_NONE,
      {
        key: 'odd',
        text: 'Select Odd Row',
        onSelect: (changableRowKeys) => {
          let newSelectedRowKeys = [];
          newSelectedRowKeys = changableRowKeys.filter((_, index) => {
            if (index % 2 !== 0) {
              return false;
            }

            return true;
          });
          setSelectedRowKeys(newSelectedRowKeys);
        },
      },
      {
        key: 'even',
        text: 'Select Even Row',
        onSelect: (changableRowKeys) => {
          let newSelectedRowKeys = [];
          newSelectedRowKeys = changableRowKeys.filter((_, index) => {
            if (index % 2 !== 0) {
              return true;
            }

            return false;
          });
          setSelectedRowKeys(newSelectedRowKeys);
        },
      },
    ],
  };

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
            setOpenModal(true);
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
            dataSource={expenseData}
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
      />}
    </>
  )
}

export default ExpenseSheet

