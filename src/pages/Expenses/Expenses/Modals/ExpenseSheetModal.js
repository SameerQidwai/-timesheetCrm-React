import { Button, Checkbox, Col, Form, Modal, Row, Table, Typography } from 'antd'
import Title from 'antd/lib/typography/Title';
import React, { useEffect, useState } from 'react'
import {
    DownOutlined,
    SettingOutlined,
    PlusSquareOutlined,
    FilterOutlined,
} from '@ant-design/icons';
import { formatDate } from '../../../../service/constant';
import FormItems from '../../../../components/Core/Forms/FormItems';
import { getProjects } from '../../../../service/constant-Apis';
// import { expensesData as dummyExpensesData } from '../../DummyData';
import { getListOfExpenses } from '../../../../service/expense-Apis';
import { addExpenseInSheet, addExpenseSheet, editExpenseSheet } from '../../../../service/expenseSheet-Apis';
const {Text} = Typography;

const ExpenseSheetModal = ({ visible, close, expenses, callBack }) => {
  
  const [form] = Form.useForm();
  const [filteredExpenses, setfilteredExpenses] = useState();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  // fields of form
  const [basicFields, setBasicFields] = useState([
  {
      Placeholder: "Title",
      rangeMin: true,
      fieldCol: 12,
      size: "small",
      type: "Text",
      // itemStyle:{marginBottom:'10px'},
  },
  {
      Placeholder: "Project",
      // rangeMin: true,
      fieldCol: 12,
      size: "small",
      type: "Text",
      // itemStyle:{marginBottom:'10px'},
  },
  {
      object: "basic",
      fieldCol: 12,
      key: "label",
      size: "small",
      rules: [{ required: true, message: 'Title is Required' }],
      type: "Input",
      // onChange: (value) => {
      //   console.log("value-->", value);
      //   console.log("form--->",form.getFieldValue());
      // }

  },
  {
      object: "basic",
      fieldCol: 12,
      key: "projectId", // when-api change it to projectId
      size: "small",
      data: [],
      type: "Select",
    onChange: (projectId) => { selectedProjectExpenses(projectId) }
  },
  ]);
  
  // table columns
  const columns = [
      {
        title: 'CODE',
        dataIndex: 'id',
        render: (text)=> `00${text}`, 
      },
      {
        title: 'TYPE',
        dataIndex: 'expenseTypeName',
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
      //   sorter: {
      //     compare: (a, b) => a.files - b.files,
      //     multiple: 1,
      //   },
      render: () => (
          <Text>View</Text>
      )
      },
      {
          title: 'i',
          dataIndex: 'isReimbursed',
          render: (value) => (
              <Checkbox defaultChecked={false} checked={value}  />
          )
      },
      {
          title: 'b',
          dataIndex: 'isBillable',
          render: (value) => (
              <Checkbox defaultChecked={false} checked={value}/>
          )
      },
  ];  

  useEffect(() => {
    if (visible !== true) {
      form.setFieldsValue({ basic: visible })
    }
    getData()

  },[]);

  const getData = () => {
    getProjects().then((res) => {
      if (res?.success) {
        let basic = basicFields
        basic[3].data = res?.data
        setBasicFields([...basic]); 
      }
      selectedProjectExpenses(visible?.projectId)
    })
  }
  
  // for filter expense according to project
  const selectedProjectExpenses = (selectedProject) => {
    let projectId = selectedProject
    let codes = visible?.expenseSheetExpenses ?? []
    let backupExpenses = expenses
    let filteredProject = backupExpenses?.filter((ele) => {
      return ele.projectId == projectId;
    });
    setfilteredExpenses([...filteredProject]); 
    setSelectedRowKeys(codes)
  }

  // for filter table 
  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    preserveSelectedRowKeys: false
  }; 


  const onFinish = (value) => {
    console.log('value-->', value , visible);
    let { basic } = value;
    basic.expenseSheetExpenses = selectedRowKeys
    if (visible?.id){
      editSheet(visible.id, basic)
    }else{
      addSheet(basic)
    }
}

  const addSheet = (data) => {
    console.log("data->", data)
    // addExpenseSheet(data).then(res=>{
    //   if (res.success){
        // callBack(res.data);
     // } else{
      // console.log("err",res)
    // 
    //  }
    
    // })
    callBack(data); //remove apter integration of api
  }

  const editSheet=(id, data)=>{
    // editExpenseSheet(visible.id, data).then(res=>{
    //   if (res.success){
      // callBack(res.data, visible?.index);
    //   } else {
      // console.log("err",res)
    // }
    // })
    callBack(data,visible?.index);
  }


  return (
    <Modal
        title={visible !== true ? "Edit Expense Sheet" : "Add Expense Sheet"}
        visible={visible}
        width={850}
        onCancel={close}
      okText={"Save"}
      // adminView Prop add
        okButtonProps={ visible.adminView ? { style: { display: 'none' } } : { htmlType: 'submit', form: 'my-form' }}
    >
      <Row gutter={[0,20]}>
        <Col span={24}>
          <Form
              id={'my-form'}
              form={form}
              // ref={formRef}
              onFinish={onFinish}
              scrollToFirstError={true}
              size="small"
              layout="inline"
          >
                  <FormItems FormFields={basicFields} />
          </Form>
        </Col>
        <Col span={24}>
            <Table
            rowKey={data => data.id}
      // adminView Prop add
            rowSelection={visible.adminView ? '': rowSelection}
            columns={columns}
            dataSource={filteredExpenses}
            // onChange={onChange} 
            />
        </Col>
      </Row>
    </Modal>
  )
}

export default ExpenseSheetModal