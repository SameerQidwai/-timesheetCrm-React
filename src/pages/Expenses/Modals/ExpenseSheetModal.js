import { Button, Checkbox, Col, Form, Modal, Row, Table, Typography, Upload } from 'antd'
import { PlusOutlined } from "@ant-design/icons"; //Icons
import React, { useEffect, useState } from 'react'
import { formatDate, localStore } from '../../../service/constant';
import FormItems from '../../../components/Core/Forms/FormItems';
import { getProjects } from '../../../service/constant-Apis';
// import { expensesData as dummyExpensesData } from '../../DummyData';
import { addExpenseInSheet, addExpenseSheet, editExpenseSheet } from '../../../service/expenseSheet-Apis';
import { addFiles } from '../../../service/Attachment-Apis';
const {Text, Title} = Typography;

const ExpenseSheetModal = ({ visible, close, expenses, callBack, adminView }) => {
  

  const [form] = Form.useForm();
  const [filteredExpenses, setfilteredExpenses] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [progress, setProgress] = useState();
  const [fileList, setFileList] = useState([]);
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
      disabled: adminView,  
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
      disabled: adminView,  
      object: "basic",
      fieldCol: 12,
      key: "projectId", // when-api change it to projectId
      size: "small",
      initialValue: null,
      data: [],
      type: "Select",
    onChange: (projectId) => { selectedProjectExpenses(projectId) }
  },
  {
      disabled : visible?.projectId === null,  
      object: "basic",
      fieldCol: 1,
      key: "isBillable",
      size: "small",
      initialValue: undefined,
      type: "Checkbox",
      valuePropName: "checked",
      itemStyle:{marginTop:'10px', display : adminView ?? 'none' },
  },
    {
      
      Placeholder: "Billable",
      // rangeMin: true,
      fieldCol: 5,
      size: "small",
      type: "Text",
      itemStyle:{marginTop:'10px', display : adminView ?? 'none'},
  },
  ]);
  
  // table columns
  const columns = [
      {
        title: 'Code',
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
        title: 'Date',
          dataIndex: 'date', // when-api change it to [date,name] or dateName
        render: (text)=> formatDate(text, true , true),
        sorter: {
          compare: (a, b) => a.date - b.date,
          multiple: 2,
        },
      },
      {
        title: 'Amount',
        dataIndex: 'amount',
        sorter: {
          compare: (a, b) => a.amount - b.amount,
          multiple: 1,
        },
      },
      {
        title: 'Files',
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
      let {attachments = []} = visible
      form.setFieldsValue({ basic: visible })
      setFileList(attachments)
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
      if (adminView) {
        setfilteredExpenses(visible?.expenseSheetExpenses)
      } else {
        selectedProjectExpenses(visible?.projectId)
      }

    })
  }
  
  // for filter expense according to project
  const selectedProjectExpenses = (selectedProject) => {
    let projectId = selectedProject
    let codes = visible?.expenseSheetExpensesIds ?? []
    let backupExpenses =  expenses

    // console.log("backupExpenses", backupExpenses);
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
    let { basic } = value;
    basic.attachments = fileList.map((file, index) => {
        return file.fileId;
    });
    basic.expenseSheetExpenses = selectedRowKeys
    // basic.attachments= []
    if (visible?.id){
      editSheet(visible.id, basic)
    }else{
      addSheet(basic)
    }
}

  const addSheet = (data) => {
    addExpenseSheet(data).then(res=>{
      if (res.success){
        callBack(res.data);
     } else{
      console.log("err",res)
    
     }
    
    })
  }

  const editSheet=(id, data)=>{
    editExpenseSheet(visible.id, data).then(res=>{
      if (res.success){
        callBack(res.data, visible?.index);
      } else {
      console.log("err",res)
    }
    })
  }

  const handleUpload = async option=>{
    const { onSuccess, onError, file, onProgress } = option;
    const formData = new FormData();
    const  config = {
        headers: {"content-type": "multipart/form-data"},
        onUploadProgress: event =>{
            const percent = Math.floor((event.loaded / event.total) * 100);
            // this.setState({progress: percent});
            setProgress(percent);
            if (percent === 100) {
            //   setTimeout(() => this.setState({progres: 0}), 1000);
              setTimeout(() => setProgress(0), 1000);
            }
            onProgress({ percent: (event.loaded / event.total) * 100 });
          }
        }
        formData.append('files', file)
        addFiles(formData, config).then((res,err)=>{
            if (res.success){
                onSuccess("Ok");
                setFileList([...fileList, res.file])
                    // fileIds: [fileIds, res.file.fileId]
                // })
            }else{
                console.log("Eroor: ", err);
                const error = new Error("Some error");
                onError({ err });
            }
        })
  }

  const onRemove = (file) => {
    const index = fileList.indexOf(file);
    fileList.splice(index, 1);
    setFileList([...fileList]);

  }

  return (
    <Modal
      title={`${adminView ? "Approve" : visible === true ? "Add" : "Edit"} Expense Sheet`}
      visible={visible}
      width={850}
      onCancel={close}
      okText={"Save"}
      // adminView Prop add
      okButtonProps={{ htmlType: 'submit', form: 'my-form', disabled: (visible?.projectId === null && adminView) || (selectedRowKeys.length < 1 && !adminView)}}
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
        <Row gutter={[0, 20]}>
          {/* need change  */}
          <Col span={24} style={{display:"flex", flexWrap:"wrap"}}>
              <FormItems FormFields={basicFields} />         
          </Col>
          <Col span={24}>
              <Table
              size={'small'}
              bordered
              className='fs-small'
              // pagination={{pageSize: localStore().pageSize}}
              pagination={false}
              rowKey={data => data.id}
              scroll={{
                // x: 1500,
                y: 250,
              }}
        // adminView Prop add
              rowSelection={!visible.adminView && rowSelection}
              columns={columns}
              dataSource={filteredExpenses}
              
              // onChange={onChange} 
              />
          </Col>
          <Col span={24}>
          <Text style={{marginTop: 10, marginBottom: 2}}>Attachments</Text>
            <Upload
              disabled = {adminView}  
              customRequest={handleUpload}
              // listType="picture"
              listType="picture-card"
              maxCount={4}
              fileList={fileList}
              onRemove= {onRemove}
              // disabled={readOnly}
          >
              {fileList.length < 4 &&
                  <div style={{marginTop: 10}} >
                      <PlusOutlined />
                      <div style={{ marginTop: 8 }}>Upload</div>
                  </div>
              }
          </Upload>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}

export default ExpenseSheetModal