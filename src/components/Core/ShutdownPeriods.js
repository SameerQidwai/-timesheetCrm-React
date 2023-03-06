import React, { useState, useEffect } from 'react'
import { Button, Col, Dropdown, Menu, Modal, Popconfirm, Row, Table, Tag, Tooltip, Typography, Form, } from 'antd'
import { SettingOutlined, PlusSquareOutlined} from '@ant-design/icons'; //Icons
import { generalDelete } from '../../service/delete-Api\'s';
import { formatDate } from '../../service/constant';
import { tableSorter } from './Table/TableFilter';
import { addShutPeriod, delShutPeriod, editShutPeriod, getShutPeriods } from '../../service/projects';
import Title from 'antd/lib/skeleton/Title';
import FormItems from './Forms/FormItems';

const ShutdownPeriods=(props)=>{
  const [data, setData] = useState([])
  const [visible, setVisible] = useState(false)
  const [form] = Form.useForm();
  const columns = [
    {
      title: 'Start Date',
      dataIndex: 'startDate',
      align: 'center',
      render: (text)=> formatDate(text, true, true),
      ...tableSorter('date', 'date'),
    },
    {
      title: 'End Date',
      dataIndex: 'endDate',
      align: 'center',
      render: (text)=> formatDate(text, true, true),
      ...tableSorter('date', 'date'),
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
                className="pop-confirm-menu"
              >
                <Popconfirm
                  title="Are you sure you want to delete ?"
                  onConfirm={() => handleDelete(record.id, index)}
                  okText="Yes"
                  cancelText="No"
                >
                  <div> Delete </div>
                </Popconfirm>
              </Menu.Item>
              <Menu.Item
                key="edit"
                onClick={() =>
                  setVisible({...record,index})
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

  const FormFields = [
    {
      Placeholder: "Start Date",
      rangeMin: true,
      fieldCol: 12,
      size: "small",
      type: "Text",
    },
    {
      Placeholder: "End Date",
      rangeMin: true,
      fieldCol: 12,
      size: "small",
      type: "Text",
    },
    {
        object: "projectShutdown",
        fieldCol: 12,
        key: "startDate", // when-api change it to projectId
        size: "small",
        rules:[{ required: true, message: 'Start Date is Required' }],
        data: [],
        type: "DatePicker",
    },
    {
        object: "projectShutdown",
        fieldCol: 12,
        key: "endDate", // when-api change it to projectId
        size: "small",
        rules:[{ required: true, message: 'End Date is Required' }],
        data: [],
        type: "DatePicker",
    },
  ]

  useEffect(() => {
    if (visible !== true) {
      form.setFieldsValue({ basic: visible })
    }
    getData();
  }, []);

  const getData = () => {
    getShutPeriods(props.id).then(res=>{
      if(res.success){
          setData(res.data)
      }
    }) 
  }

  const close = () =>{
    setVisible(false)
  }

  const onFinish =(values)=>{
    let {projectShutdown} = values
    let shutdownPeriod = {
      startDate: formatDate(projectShutdown["startDate"], true),
      endDate: formatDate(projectShutdown["endDate"], true)
  }
  console.log("shutDown->",shutdownPeriod);

  if (props?.visible?.id) {
    editShutDown(props.visible?.id, shutdownPeriod);
  }
  addShutDown(shutdownPeriod);
}

const addShutDown = (data) =>{
  addShutPeriod(props.id, data).then(res=>{
    if(res.success){
      setData([...data, res.data])
      setVisible(false);
    }
  })
}

const editShutDown = (eleId, data) =>{
  editShutPeriod(props.id, eleId, data).then(res=>{
    if (res.success){
      callBack(res.data, eleId);
    } else {
      console.log("err",res)
    }
  })
}

const handleDelete = (id, index) => {
  // let {data, filtered} =  expenseSheet
    // const url = '/expense-sheets';
    const { history } = props;
    const url = `/projects/${props.id}/shutdownPeriods`;
    generalDelete(history, url, id, index, [], data).then((res) => {
      if (res.success) {
        setData(res.data);
      }
    });
  
  // delShutPeriod(props.id, id).then((res) => {
  //   if (res.success) {
  //     setData([...res.data]);
  //   }
  // });
}

const callBack = (rowData, index) => {
  // let {data, filtered} =  expenseSheet;
  if (index >= 0) {
    let findIndex = data.findIndex(el=> el.id === rowData.id)
    // let findFilteredIndex = filtered.findIndex(el=> el.id === rowData.id)
    data[findIndex] = rowData;
    // filtered[findFilteredIndex] = rowData;
  } else {
    data = [...data, rowData]
    // filtered = [...filtered, rowData]
  }
  
  setData({data: [...data]});  
  setVisible(false);
}

  return (
    <Row justify='space-between'>
      <Col>
          <Title level={4}>Project Shutdown Periods</Title>
        </Col>
        <Col>
        <Button
          type="primary"
          size="small"
          onClick={() => {
            setVisible(true)
          }}            
        >
          <PlusSquareOutlined /> Add Period
        </Button>
        </Col>  
      <Col span={24}>
        <Table
          // title={() => tableTitleFilter(5, generalFilter)}
          size={'small'}
          bordered
          className='fs-small'
          rowKey={data=> data.id}
          columns={columns}
          dataSource={data}
        />
      </Col>
      <Modal
        title={`Expense Sheet`}
        visible={visible}
        width={900}
        onCancel={close}
        okText={"Save"}
        // adminView Prop add
        // okButtonProps={{ htmlType: 'submit', form: 'my-form', disabled: (( (visible?.projectId === null && adminView) || (selectedRowKeys.length < 1 && !adminView)) || !permission['UPDATE'] || !permission['ADD'])}}
        okButtonProps={{ htmlType: 'submit', form: 'my-form'}}
      >
      <Form
          id={'my-form'}
          form={form}
          // ref={formRef}
          onFinish={onFinish}
          scrollToFirstError={true}
          size="small"
          layout="inline"
      >
          <FormItems FormFields={FormFields} />  
      </Form>
      </Modal>
    </Row>
  )
}

export default ShutdownPeriods