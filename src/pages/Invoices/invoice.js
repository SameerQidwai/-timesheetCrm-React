import React, { useState, useEffect } from 'react';
import {
  Row,
  Col,
  Typography,
  Input,
  Button,
  Form,
  Dropdown,
  Menu,
  Popconfirm,
} from 'antd';
import { PlusSquareOutlined, SettingOutlined } from '@ant-design/icons'; //Icons
import { actionInvoice, getInvoices } from '../../service/invoice-Apis';
import ATable from '../../components/Core/Table/TableFilter';
import { formatDate } from '../../service/constant';
import InvoiceModal from './Modals/InvoiceModal';

const Invoice = (props) => {
  const [data, setData] = useState([]);
  const [modal, setOpenModal] = useState(false);
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
      dataIndex: ['organization', 'name'],
      key: 'organization',
    },
    {
      title: 'Project',
      dataIndex: ['project', 'name'],
      key: 'project',
    },
    {
      title: 'Date',
      dataIndex: 'issueDate',
      key: 'issueDate',
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
    {
      title: '...',
      dataIndex: 'invoiceId',
      key: 'action',
      align: 'center',
      width: '1%',
      render: (value, record, index) => (
        <Dropdown
          overlay={
            <Menu>
              {(record.status === 'DRAFT' ) && <Menu.Item
                key="delete"
                danger
                className="pop-confirm-menu"
              >
                <Popconfirm
                  title="Are you sure you want to delete this invoice?"
                  onConfirm={() => handleActions(record.invoiceId, 'DELETED')}
                  okText="Yes"
                  cancelText="No"
                >
                  <div> Delete </div>
                </Popconfirm>
              </Menu.Item>}
              {record.status === 'DRAFT' && <Menu.Item
                key="delete"
                // danger
                className="pop-confirm-menu"
              >
                <Popconfirm
                  title="Are you sure you want to Authorised"
                  onConfirm={() => handleActions(record.invoiceId, 'AUTHORISED')}
                  okText="Yes"
                  cancelText="No"
                >
                  <div> Authorised </div>
                </Popconfirm>
              </Menu.Item>}
              {record.status === 'AUTHORISED' && <Menu.Item
                key="delete"
                danger
                className="pop-confirm-menu"
              >
                <Popconfirm
                  title="Are you sure you want to void this invoice?"
                  onConfirm={() => handleActions(record.invoiceId, 'VOIDED')}
                  okText="Yes"
                  cancelText="No"
                >
                  <div> Voided </div>
                </Popconfirm>
              </Menu.Item>}
              {/* {(record.status !== 'DELETE' && record.status !== 'VOIDED') && <Menu.Item
                key="delete"
                // danger
                className="pop-confirm-menu"
              >
                <Popconfirm
                  title="Are you sure you want to void this invoice?"
                  onConfirm={() => handleActions(record.invoiceId, 'Send_Email')}
                  okText="Yes"
                  cancelText="No"
                >
                  <div> Send Email </div>
                </Popconfirm>
              </Menu.Item>} */}
              <Menu.Item
                key="edit"
                onClick={() => {
                  setOpenModal({
                    id: value,
                    rowIndex: index,
                  });
                }}
                // disabled={this.state && !this.state.permissions['UPDATE']}
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
    getInvoices().then((res) => {
      if (res.success) {
        setData(res.data);
        setOpenModal(false)
      }
    });
  };

  const handleActions = (id, action) =>{
    actionInvoice(id, action).then((res) => {
      if (res.success) {
        if (action !== 'Send_Email'){
          getData()
        }
      }
    });
  }

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
      {modal && (
        <InvoiceModal
          visible={modal}
          close={() => setOpenModal(false)}
          callBack={() => getData()}
        />
      )}
    </Row>
  );
};

export default Invoice;
