import React, { useState, useEffect } from 'react';
import { Row, Col, Typography, Input, Button, Form } from 'antd';
import { PlusSquareOutlined } from "@ant-design/icons"; //Icons
import { createInvoice, getInvoices, toolLogin, } from '../../service/invoice-Apis';
import ATable from '../../components/Core/Table/TableFilter';
import { formatDate } from '../../service/constant';
import InvoiceModal from './Modals/InvoiceModal';

const Invoice = (props) => {
  const [data, setData] = useState([]);
  const [modal, setOpenModal] = useState([]);
  const column = [
    {
      title: 'Number',
      dataIndex: 'invoiceNumber',
      key: 'invoiceNumber',
    },
    {
      title: 'Reference',
      dataIndex: 'reference',
      key: 'reference',
    },
    {
      title: 'To',
      dataIndex: 'contact.name',
      key: 'organzation',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (text) => formatDate(text, true, true),
    },
    {
      title: 'Due',
      dataIndex: 'dueDate',
      key: 'dueDate',
      render: (text) => formatDate(text, true, true),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
  ];
  useEffect(() => {
    getInvoices().then((res) => {
      if (res.success) {
        setData(res.data);
      }
    });
  }, []);

  return (
    <Row justify="space-between" align="middle">
      <Col>
        <Typography.Title level={4}>Invoices</Typography.Title>
      </Col>
      <Col style={{ textAlign: 'end' }}>
        <Row justify="space-between" gutter={[30]}>
          {/* <Col>
            <Button
              type="default"
              size="small"
              onClick={() => this.setState({ openSearch: true })}
            >
              <FilterOutlined />
              Filter
            </Button>
          </Col> */}
          <Col>
            <Button
              type="primary"
              onClick={() => {
                setOpenModal(true);
              }}
              size="small"
            >
              <PlusSquareOutlined />
              Add Invoice
            </Button>
          </Col>
        </Row>
      </Col>
      <Col span={24}>
        <ATable rowKey="invoiceID" dataSource={data} columns={column} />
      </Col>
      {modal && <InvoiceModal
        visible={modal}
        close={()=>setOpenModal(false)}
      />}
    </Row>
  );
};

export default Invoice;
