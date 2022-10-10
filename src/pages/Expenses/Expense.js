import { Button, Col, Row, Table } from 'antd'
import {
  DownOutlined,
  SettingOutlined,
  PlusSquareOutlined,
  FilterOutlined,
} from '@ant-design/icons'; //Icons
import Title from 'antd/lib/typography/Title'
import React from 'react'
import { useState } from 'react';
import InfoModal from './InfoModal';

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
    dataIndex: 'project',
    sorter: {
      compare: (a, b) => a.project - b.project,
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
];

const data = [
  {
    key: '1',
    code: 'John Brown',
    title: 98,
    project: 60,
    amount: 70,
    status: "saved",
      submittedAt: "12-05-2022"

  },
  {
    key: '2',
    code: 'Jim Green',
    title: 98,
    project: 66,
    amount: 89,
    status: "saved",
    submittedAt: "12-05-2022"
    },
  {
    key: '3',
    code: 'Joe Black',
    title: 98,
    project: 90,
    amount: 70,
    status: "saved",
    submittedAt: "12-05-2022"
    },
  {
    key: '4',
    code: 'Jim Red',
    title: 88,
    project: 99,
    amount: 89,
    status: "saved",
    submittedAt: "12-05-2022"
    },
];

const Expense = () => {

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [openModal, setOpenModal] = useState(false);

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
          <PlusSquareOutlined /> Add Expense
        </Button>
        </Col>  
        <Col span={24}>
          <Table rowSelection={rowSelection} columns={columns} dataSource={data}
          onChange={onChange} 
          />
        </Col>
      </Row>
      <InfoModal
        visible={openModal}
        close={closeModal}
        
            // editLead={editLead}
            // close={this.closeModal}
            // callBack={this.callBack}
          />
    </>
  )
}

export default Expense