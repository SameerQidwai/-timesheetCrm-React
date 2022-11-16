import { Button, Checkbox, Col, Form, Modal, Row, Table, Typography, Upload } from 'antd'
import { PlusOutlined } from "@ant-design/icons"; //Icons
import React, { useEffect, useState } from 'react'
import { formatCurrency, formatDate, formatFloat, localStore } from '../../../service/constant';
import FormItems from '../../../components/Core/Forms/FormItems';
import { getProjects, getUserProjects } from '../../../service/constant-Apis';
// import { expensesData as dummyExpensesData } from '../../DummyData';
import { addExpenseInSheet, addExpenseSheet, editExpenseSheet, manageExpenseSheet } from '../../../service/expenseSheet-Apis';
import { addFiles, getAttachments } from '../../../service/Attachment-Apis';
import { tableSorter } from '../../../components/Core/Table/TableFilter';
const {Text, Title} = Typography;

const ExpenseSheetModal = ({ visible, close, expenses, callBack, adminView }) => {
  let editDisabled = ['AP', 'SB'].includes(visible.status)

  const [form] = Form.useForm();
  const [filteredExpenses, setfilteredExpenses] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [progress, setProgress] = useState();
  const [permission, setPermission] = useState({});
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
      disabled: adminView || editDisabled,  
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
      disabled: adminView || editDisabled,  
      object: "basic",
      fieldCol: 12,
      key:  adminView ? "projectName" : "projectId" , // when-api change it to projectId
      size: "small",
      initialValue: null,
      data: [],
      type: adminView ? "Input" : "Select",
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
        ...tableSorter('id', 'number'),
      },
      {
        title: 'Type',
        dataIndex: 'expenseTypeName',
        ...tableSorter('expenseTypeName', 'string'),
      },
      {
        title: 'Date',
        dataIndex: 'date', // when-api change it to [date,name] or dateName
        render: (text)=> formatDate(text, true , true),
        ...tableSorter('date', 'date'),
      },
      {
        title: 'Project',
        dataIndex: 'projectName', // when-api change it to [date,name] or dateName
        ...tableSorter('projectName', 'string'),
      },
      {
        title: 'Amount',
        dataIndex: 'amount',
        render: (text) => formatCurrency(text),
        ...tableSorter('amount', 'number'),
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
      // {
      //     title: 'b',
      //     dataIndex: 'isBillable',
      //     render: (value) => (
      //         <Checkbox defaultChecked={false} checked={value}/>
      //     )
      // },
  ];  

  useEffect(() => {
    if (visible !== true) {
      form.setFieldsValue({ basic: visible })
    }
    getData()

  },[]);

  const getData = () => {
    const { id, permissions = ''} = localStore();
		const { EXPENSES = {}} = JSON.parse(permissions)
		setPermission(EXPENSES);		
    Promise.all([!adminView && getUserProjects(id, 'O', 0),  visible !== true && getAttachments('ESH', visible.id)]).then((res) => {
        let basic = basicFields
        basic[3].data = res[0]?.success ? res[0].data : []
        setBasicFields([...basic]); 
        setFileList(res[1]?.success ? res[1].fileList : [])

        if (adminView) {
        setfilteredExpenses(visible?.expenseSheetExpenses)
        setSelectedRowKeys(visible?.expenseSheetExpensesIds)
      } else {
        selectedProjectExpenses(visible?.projectId)
      }

    })
  }
  
  // for filter expense according to project
  const selectedProjectExpenses = (selectedProject) => {
    let projectId = selectedProject
    let codes = visible?.expenseSheetExpensesIds ?? []
    let filteredProject =  expenses

    // console.log("backupExpenses", backupExpenses);
    if (selectedProject){
      filteredProject = expenses?.filter((ele) => {
        return ele.projectId == projectId;
      });
    }
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
    preserveSelectedRowKeys: false,
    getCheckboxProps: ()=> ({disabled:editDisabled})
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
    if (!adminView){
      editExpenseSheet(visible.id, data).then(res=>{
        if (res.success){
          callBack(res.data, visible?.index);
        } else {
          console.log("err",res)
        }
      })
    }else{
      const {basic}= form.getFieldsValue()
      visible.isBillable = basic.isBillable
      manageExpenseSheet(visible.id, data).then(res=>{
        if (res.success){
          callBack(visible, visible?.index);
        } else {
          console.log("err",res)
        }
      })
    }
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
      // okButtonProps={{ htmlType: 'submit', form: 'my-form', disabled: (( (visible?.projectId === null && adminView) || (selectedRowKeys.length < 1 && !adminView)) || !permission['UPDATE'] || !permission['ADD'])}}
      okButtonProps={{ htmlType: 'submit', form: 'my-form', disabled: ((visible?.projectId === null && adminView) || (!adminView && ((selectedRowKeys.length < 1 ) || editDisabled || (visible && !permission['UPDATE']) || (!visible && !permission['ADD']))))}}
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
              summary={(data) => {
                console.log(selectedRowKeys)
                let amount = 0;
                let billableAmount = 0;
                let reimbursedAmount = 0;
                data.forEach((row) => {
                  if (selectedRowKeys.includes(row.id)){
                    // console.log(row.amount)
                    amount += parseFloat(row.amount ?? 0);
                    billableAmount += row.isBillable ? parseFloat(row.amount ?? 0): 0;
                    reimbursedAmount += row.isReimbursed ? parseFloat(row.amount ?? 0): 0;
                  }
                });
                console.log(amount)
                console.log()
                return (
                  <Table.Summary fixed="bottom">
                    <Table.Summary.Row>
                      <Table.Summary.Cell index={0}></Table.Summary.Cell>
                      <Table.Summary.Cell  index={1}>Total:</Table.Summary.Cell>
                      <Table.Summary.Cell index={2}>
                        {formatCurrency(amount)}
                      </Table.Summary.Cell>
                      <Table.Summary.Cell  index={3} >Total Billable:</Table.Summary.Cell>
                      <Table.Summary.Cell index={4}>
                        {formatCurrency(billableAmount)}
                      </Table.Summary.Cell>
                      <Table.Summary.Cell  index={5}colSpan={2}>Total Reimbursable:</Table.Summary.Cell>
                      <Table.Summary.Cell index={6}>
                        {formatCurrency(reimbursedAmount)}
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={7}></Table.Summary.Cell>
                    </Table.Summary.Row>
                  </Table.Summary>
                );
              }}
              />
          </Col>
          <Col span={24}>
          <Text style={{marginTop: 10, marginBottom: 2}}>Attachments</Text>
            <Upload
              disabled = {adminView || editDisabled}  
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