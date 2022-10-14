import { Button, Checkbox, Col, Dropdown, Menu, Popconfirm, Row, Table } from 'antd';
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
  
const Expense = () => {

    // dummy data
    const data = [
        {
            id: '1',
            code: 'AR390',
            type: 'abc',
            date: new Date(),
            amount: 70,
            files: "saved",
            i: '',
            b: ''
        },
        {
            id: '2',
            code: 'AR390',
            type: 'abc',
            date: new Date(),
            amount: 70,
            files: "saved",
            i: 'checked',
            b: ''
        },
        {
            id: '3',
            code: 'AR390',
            type: 'abc',
            date: new Date(),
            amount: 70,
            files: "saved",
            i: 'checked',
            b: ''
        },
        {
            id: '4',
            code: 'AR390',
            type: 'abc',
            date: new Date(),
            amount: 70,
            files: "saved",
            i: 'checked',
            b: ''
        },
    ];
    
  const [openModal, setOpenModal] = useState(false);
  const [expenseData, setExpenseData] = useState(data);

    
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
          render: (text)=> formatDate(text, true , true),
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
          sorter: {
            compare: (a, b) => a.files - b.files,
            multiple: 1,
          },
        },
        {
            title: 'i',
            dataIndex: 'i',
            render: () => (
                <Checkbox defaultChecked={false} />
            )
        },
        {
            title: 'b',
            dataIndex: 'b',
            render: () => (
                <Checkbox defaultChecked={false} />
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

    const closeModal = () => {
    setOpenModal(false);
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
    {openModal&&<InfoModal
      visible={openModal}
      close={closeModal}
    //   callBack={callBack}
    />}
  </>
  )
}

export default Expense