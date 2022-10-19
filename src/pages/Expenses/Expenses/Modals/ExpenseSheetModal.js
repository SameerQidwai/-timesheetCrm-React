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
import { expensesData as dummyExpensesData } from '../../DummyData';
const {Text} = Typography;

const ExpenseSheetModal = ({ visible, close, expenses, callBack }) => {
  
  const [form] = Form.useForm();
  const [expensesData, setExpensesData] = useState(expenses);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  
  useEffect(() => {
    gettingProject();
    if (visible !== true) {
        form.setFieldsValue({ basic: visible })
    }
    if (!expenses) {
      setExpensesData(dummyExpensesData)
    }
},[]);
  
  // for filter expense according to project
  const selectedProjectExpenses = (ind) => {
    let backupExpenses = expenses?? dummyExpensesData
    let filteredProject = backupExpenses?.filter((ele) => {
      return ele.projectId == ind;
    });
    setExpensesData(ind? filteredProject: backupExpenses);
  }
  
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
      rangeMin: true,
      fieldCol: 12,
      size: "small",
      type: "Text",
      // itemStyle:{marginBottom:'10px'},
  },
  {
      object: "basic",
      fieldCol: 12,
      key: "title",
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
      key: "project", // when-api change it to projectId
      size: "small",
      rules:[{ required: true, message: 'Project is Required' }],
      data: [],
      // customValue: (value, option) => option, // when-api remove this
      type: "Select",
      onChange: (ind)=>{selectedProjectExpenses(ind)}
  },
  ]);
  
  // table columns
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
          dataIndex: 'reimbursed',
          render: (value) => (
              <Checkbox defaultChecked={false} checked={value}/>
          )
      },
      {
          title: 'b',
          dataIndex: 'billable',
          render: (value) => (
              <Checkbox defaultChecked={false} checked={value}/>
          )
      },
  ];  

  // for filter table 
  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };
  console.log('selectedRowKeys changed: ', selectedRowKeys);

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

  // for get all project 
  const gettingProject = () => {
    getProjects().then((res) => {
        if (res.success) {
            let basic = basicFields
            basic[3].data = res.data
            setBasicFields([...basic]); 
        }
        
    })
  }

  const onSubmit = (value) => {
    console.log("value-->", value);

  }
  const onFinish = (value) => {
    console.log('value-->', value);
    
    let { basic } = value;
    basic.code = 'AR389'; // when-api remove this
    basic.projectId = basic.project // when-api remove this
    basic.expenseCode = selectedRowKeys
    console.log('dasic-->', basic);
    callBack(basic);

}


  return (
    <Modal
        title={visible !== true ? "Edit Expense Sheet" : "Add Expense Sheet"}
        visible={visible}
        width={850}
        onCancel={close}
        okText={"Save"}
        okButtonProps={{ htmlType: 'submit', form: 'my-form' }}
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
                <FormItems FormFields={basicFields} />
        </Form>
                <Col span={24}>
                    <Table
                    rowKey={data=> data.id}
                    rowSelection={rowSelection}
                    columns={columns}
                    dataSource={expensesData}
                    // onChange={onChange} 
                    />
                </Col>
    </Modal>
  )
}

export default ExpenseSheetModal