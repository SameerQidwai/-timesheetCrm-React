import React, { useEffect, useState } from 'react'
import { DatePicker, Form, Modal, Typography, Upload } from 'antd'
import { PlusOutlined } from "@ant-design/icons"; //Icons
import FormItems from '../../../components/Core/Forms/FormItems'

import { getUserProjects } from '../../../service/constant-Apis'
import { addFiles, getAttachments } from '../../../service/Attachment-Apis'
import { Api, formatDate, localStore } from '../../../service/constant'
import { addExpense, editExpense } from '../../../service/expense-Apis'
import { getListAlt as getExpenseTypeList } from '../../../service/expenseType-Apis';

const { Text } = Typography


const InfoModal = ({ visible, close, callBack }) => {
    let editDisabled = ['AP', 'SB'].includes(visible.status)

    const [fileList, setFileList] = useState([]);
    const [progress, setProgress] = useState();
    const [permission, setPermission] = useState({});
    const [form] = Form.useForm();

    // console.log("fileList", fileList);
    // fields 
    const [basicFields, setBasicFields] = useState([
        {
            Placeholder: "Expense Type",
            rangeMin: true,
            fieldCol: 12,
            size: "small",
            type: "Text",
            // itemStyle:{marginBottom:'10px'},
        },
        {
            Placeholder: "Date",
            rangeMin: true,
            fieldCol: 12,
            size: "small",
            type: "Text",
            // itemStyle:{marginBottom:'10px'},
        },
        {
            object: "basic",
            fieldCol: 12,
            key: "expenseTypeId", // when-api change it to projectId
            disabled: editDisabled,
            size: "small",
            rules:[{ required: true, message: 'type is Required' }],
            data: [],
            // customValue: (value, option) => option, // when-api remove this
            type: "Select",
        },
        {
            object: "basic",
            fieldCol: 12,
            key: "date", // when-api change it to projectId
            disabled: editDisabled,
            size: "small",
            rules:[{ required: true, message: 'Date is Required' }],
            data: [],
            // customValue: (value, option) => option, // when-api remove this
            type: "DatePicker",
            fieldStyle:{width: '100%'}
        },
        {
            Placeholder: "Amount",
            rangeMin: true,
            fieldCol: 24,
            size: "small",
            type: "Text",
            // itemStyle:{marginBottom:'10px'},
        },
        {
            object: "basic",
            fieldCol: 12,
            key: "amount",
            disabled: editDisabled,
            size: "small",
            shape:"$",
            rules: [{ required: true, message: 'Amount is Required' }],
            type: "InputNumber",
        },
        {
            object: "basic",
            fieldCol: 1,
            key: "isReimbursed",
            disabled: editDisabled,
            size: "small",
            initialValue: false,
            type: "Checkbox",
            valuePropName: "checked"
            // name:"reimbursed",
            // value:"reimbursed"
            // checked: []
        },
        {
            Placeholder: "Reimbursable",
            // rangeMin: true,
            fieldCol: 5,
            size: "small",
            type: "Text",
            // itemStyle:{marginBottom:'10px'},
        },
        {
            object: "basic",
            fieldCol: 1,
            key: "isBillable",
            initialValue: false,
            disabled: editDisabled,
            size: "small",
            type: "Checkbox",
            valuePropName: "checked"
            // name:"billable",
            // value: "billable"
            // checked: []
        },
        {
            Placeholder: "Billable",
            // rangeMin: true,
            fieldCol: 5,
            size: "small",
            type: "Text",
            // itemStyle:{marginBottom:'10px'},
        },
        {
            Placeholder: "Project",
            // rangeMin: true,
            fieldCol: 24,
            size: "small",
            type: "Text",
            // itemStyle:{marginBottom:'10px'},
        },
        {
            object: "basic",
            fieldCol: 12,
            key: "projectId", 
            disabled: visible.isInSheet,
            size: "small",
            initialValue: null,
            // rules:[{ required: true, message: 'Project is Required' }],
            data: [],
            type: "Select",
        },
        {
            Placeholder: "Notes",
            // rangeMin: true,
            fieldCol: 24,
            size: "small",
            type: "Text",
            // itemStyle:{marginBottom:'10px'},
        },
        {
            object: "basic",
            fieldCol: 24,
            key: "notes", 
            initialValue: null,
            disabled: editDisabled,
            size: "small",
            type: "Textarea",
            rows: 5,
            placeholder: "Note"
        },
    ]
        
    );

    useEffect(() => {
        getData();
        gettingPermissions()
        if (visible !== true) {
            visible.date = formatDate(visible.date)
            form.setFieldsValue({ basic: visible })
        }
    }, []);
    const gettingPermissions = () => {
		const { id, permissions = ''} = localStore();
		const { EXPENSES = {}} = JSON.parse(permissions)
		setPermission(EXPENSES);		
  } 

    // on submit 
    const onFinish = (data) => {

        let { basic } = data;
        basic.attachments = fileList.map((file, index) => {
            return file.fileId;
        });
        if (visible === true) {
            addExpense(basic).then((res) => {
                if (res.success) {
                    callBack(res.data);
                } else {
                    console.log("err",res)
                }
            })
        } else {
            //for some reason projectId key was being removed if it is undefined
            basic.projectId = basic.projectId ?? null
            editExpense(visible.id,basic).then((res) => { 
                if (res.success) {
                    callBack(res.data, visible?.index);
                } else {
                    console.log("err",res)
                }
            })
        }        
    }

    const getData = () => {
        const { id, permissions = ''} = localStore();
		const { EXPENSES = {}} = JSON.parse(permissions)
		setPermission(EXPENSES);		
        Promise.all([getUserProjects(id, 'O', 0), getExpenseTypeList(), visible !== true && getAttachments('EXP', visible.id)]).then((res) => {
            let basic = basicFields
            basic[11].data = res[0].success ? res[0].data : []
            basic[2].data = res[1].success ? res[1].data : []
            setBasicFields([...basic]); 
            setFileList(res[2]?.success ? res[2].fileList : [])
        })
    }


    ///////

    //File
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
          title={visible !== true ? "Edit Expense" : "Add Expense"}
          visible={visible}
          width={650}
          onCancel={close}
          okText={"Save"}
          okButtonProps={{ htmlType: 'submit', form: 'my-form', disabled: editDisabled || !permission['UPDATE'] || !permission['ADD'] }}
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
              <Text style={{marginTop: 10, marginBottom: 2}}>Attachments</Text>
                <Upload
                    customRequest={handleUpload}
                    // listType="picture"
                    listType="picture-card"
                    maxCount={4}
                    fileList={fileList}
                    onRemove= {onRemove}
                    disabled={editDisabled}
                >
                    {fileList.length < 4 &&
                        <div style={{marginTop: 10}} >
                            <PlusOutlined />
                            <div style={{ marginTop: 8 }}>Upload</div>
                        </div>
                    }
                </Upload>
                        
          </Form>
      </Modal>
  )
}

export default InfoModal