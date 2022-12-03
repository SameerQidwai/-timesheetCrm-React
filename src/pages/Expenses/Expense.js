import React, { useEffect, useState } from 'react'
import { Button, Checkbox, Col, Dropdown, Menu, Popconfirm, Popover, Row, Table, Typography, Upload } from 'antd';
import { SettingOutlined, PlusSquareOutlined, CheckOutlined} from '@ant-design/icons'; //Icons
import InfoModal from './Modals/InfoModal';
import { Api, formatCurrency, formatDate, localStore } from '../../service/constant';
import { delExpense, getListOfExpenses } from '../../service/expense-Apis';
import { generalDelete } from "../../service/delete-Api's";
import { tableSorter, tableTitleFilter } from '../../components/Core/Table/TableFilter';
  
const {Text, Title} = Typography;
const Expense = (props) => {

    
  const [openModal, setOpenModal] = useState(false);
  const [expenseData, setExpenseData] = useState({data:[], filtered: []});
	const [permission, setPermission] = useState({});
    
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
      render: (text) => formatCurrency(text),
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
      title: 'Reimbursable',
      dataIndex: 'isReimbursed',
      align: 'center',
      width: '1%',
      render: (value) => (
        value && <CheckOutlined />
        // <Checkbox defaultChecked={false} checked={value} />
      ),
      ...tableSorter(`isReimbursed`, 'string'),
    },
    // {
    //   title: 'b',
    //   dataIndex: 'isBillable',
    //   align: 'center',
    //   render: (value) => (
    //     <Checkbox defaultChecked={false} checked={value} />
    //   ),
    //   ...tableSorter(`isBillable`, 'string'),
    // },
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
                disabled={record.isInSheet || !permission?.['DELETE']}
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
                {(record.status === 'AP' || record.status === 'SB') ? 'View' : 'Edit'}
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
    gettingPermissions();
  }, []);

  const getData = () => {
    getListOfExpenses().then((res) => {
      if(res?.success){
        setExpenseData({data: res?.data?? [], filtered: res?.data?? []});
      }
    })
  }

  // my work 
	const gettingPermissions = () => {
		const { id, permissions = ''} = localStore();
		const { EXPENSES = {}} = JSON.parse(permissions)
		setPermission(EXPENSES);		
  } 
  
  const callBack = (rowData, index) => {
    let {data, filtered} = expenseData;
    if (index >= 0) {
      let findIndex = data.findIndex(el=> el.id === rowData.id)
      let findFilteredIndex = filtered.findIndex(el=> el.id === rowData.id)
      data[findIndex] = rowData;
      filtered[findFilteredIndex] = rowData;
    } else {
      data = [...data, rowData]
      filtered = [...filtered, rowData]
    }
    setExpenseData({data: [...data], filtered: [...filtered]});
    setOpenModal(false);
  }
      
  const closeModal = () => {
  setOpenModal(false);
  }

  const handleDelete = (id, index) => {
    let {data, filtered} =  expenseData
    const url = '/expenses';
    const { history } = props;
    generalDelete(history, url, id, index, filtered, data).then((res) => {
      if (res.success) {
        setExpenseData({filtered: [...res.filterData], data: [...res.data]});
      }
    });
    
	}

  const generalFilter = (value) => {
    if (value) {
      value = value.replace(/\s+/g, '').toLowerCase()
      setExpenseData(prev => ({
        ...prev,
        filtered: prev.data.filter((el) => {
          return (
            `00${el.id.toString().replace(/\s+/g, '')}`.includes(value) ||
            (el.expenseTypeName &&
              el.expenseTypeName.toLowerCase().replace(/\s+/g, '').includes(value)) ||
            (el.projectName &&
              el.projectName.toLowerCase().replace(/\s+/g, '').includes(value)) ||
            (el.amount &&
              `${formatCurrency(el.amount)}`
                .toLowerCase().replace(/\s+/g, '')
                .includes(value)) ||
            (el.date &&
              `${formatDate(el.date, true, true)}`
                .toLowerCase().replace(/\s+/g, '')
                .includes(value)) 
            );
        }),
      }));
    } else {
      setExpenseData(prev => ({
        ...prev,
        filtered: prev.data,
      }));
    }
  };
  
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
        disabled={!permission['ADD']}
      >
        <PlusSquareOutlined /> Add Expense
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
          columns={columns}
          dataSource={expenseData?.filtered?? []}
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