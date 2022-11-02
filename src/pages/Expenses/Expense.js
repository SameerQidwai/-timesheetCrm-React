import React, { useEffect, useState } from 'react'
import { Button, Checkbox, Col, Dropdown, Menu, Popconfirm, Popover, Row, Table, Typography, Upload } from 'antd';
import { SettingOutlined, PlusSquareOutlined, } from '@ant-design/icons'; //Icons
import InfoModal from './Modals/InfoModal';
import { Api, formatDate, localStore } from '../../service/constant';
import { delExpense, getListOfExpenses } from '../../service/expense-Apis';
import { generalDelete } from "../../service/delete-Api's";
import { tableSorter } from '../../components/Core/Table/TableFilter';
  

const {Text, Title} = Typography;
const Expense = (props) => {

    
  const [openModal, setOpenModal] = useState(false);
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
      align: 'center',
      ...tableSorter('date', 'date'),
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      align: 'center',
      ...tableSorter('amount', 'number'),
    },
    // {
    //   title: 'Files',
    //   dataIndex: 'attachments',
    //   align: 'center',
    //   render: (files, records, index) => {
    //      files = files.map(el=>{el.url = `${Api}/files/${el.uid}`; return el})
    //     let display = files.length
    //     return display ? <Popover
    //       title={`00${records.id}`}
    //       destroyTooltipOnHide
    //       overlayStyle={{maxWidth: 300}}
    //       trigger="hover"
    //       content={<div>
    //          <Upload
    //             listType="text"
    //             maxCount={4}
    //             fileList={files}
    //             disabled
    //           />
    //       </div>}
    //     >
    //       <Text underline italic>View</Text>
    //     </Popover>: null
    //   }
    // },
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
                disabled={record.isInSheet}
                className="pop-confirm-menu"
              >
                <Popconfirm
                  disabled={record.isInSheet}
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
      let findIndex = expenseData.findIndex(el=> el.id === data.id)
      exp[findIndex] = data;
    } else {
      exp = [...expenseData, data]
    }
    setExpenseData([...exp]);
    setOpenModal(false);
  }
      
  const closeModal = () => {
  setOpenModal(false);
  }

  const handleDelete = (id, index) => {
    const url = '/expenses';
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
              
    {openModal&&<InfoModal
      visible={openModal}
      close={closeModal}
      callBack={callBack}
    />}
  </>
  )
}

export default Expense