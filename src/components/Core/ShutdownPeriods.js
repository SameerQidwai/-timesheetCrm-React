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
    getData();
  }, []);  


  useEffect(() => {
    if ((visible !== true) && (visible !== false)) {
      let data = {
        startDate : formatDate(visible.startDate),
        endDate : formatDate(visible.endDate)
      }
      form.setFieldsValue({ projectShutdown: data })
    }
  }, [visible]);

  const getData = () => {
    getShutPeriods(props.id).then(res=>{
      if(res.success){
          setData(res.data)
      }
    }) 
  }

  const close = () =>{
    form.resetFields();
    setVisible(false)
  }

  const onFinish =(values)=>{
    let {projectShutdown} = values
    let shutdownPeriod = {
      startDate: formatDate(projectShutdown["startDate"], true),
      endDate: formatDate(projectShutdown["endDate"], true)
  }
  if (visible?.id) {
    editShutDown( visible?.id, shutdownPeriod);
  } else{
    addShutDown(shutdownPeriod);
  }
}

const addShutDown = (shutdownPeriodData) =>{
  addShutPeriod(props.id, shutdownPeriodData).then(res=>{
    if(res.success){
      callBack(res.data)
    } else{
      console.log("err", res);
    }
  })
}

const editShutDown = (eleId, data) =>{
  editShutPeriod(props.id, eleId, data).then(res=>{
    if (res.success){
      callBack(res.data, visible?.index);
    } else {
      console.log("err",res)
    }
  })
}

const handleDelete = (id, index) => {
  const { history } = props;
  const url = `/projects/${props.id}/shutdownPeriods`;
  generalDelete(history, url, id, index, [], data).then((res) => {
    if (res.success) {
      setData(res.data);
    }
  });
}

const callBack = (rowData, index) => {
  let periodData = data;
  if (index >= 0) {
    let findIndex = periodData.findIndex(el=> el.id === rowData.id)
    periodData[findIndex] = rowData;
  } else {
    periodData = [...periodData, rowData]
  }
  
  setData([...periodData]);  
  form.resetFields();
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
        title={`ShutDown Period`}
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