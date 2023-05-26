import React, { useEffect, useState } from 'react'
import { DatePicker, Form, Modal, Typography, Upload } from 'antd'
import { PlusOutlined } from "@ant-design/icons"; //Icons
import FormItems from '../../../components/Core/Forms/FormItems'

import { getUserProjects } from '../../../service/constant-Apis'
import { addFiles, getAttachments } from '../../../service/Attachment-Apis'
import { Api, formatDate, localStore } from '../../../service/constant'
import { addExpense, editExpense } from '../../../service/expense-Apis'
import { getListAlt as getExpenseTypeList } from '../../../service/expenseType-Apis';
import ATable from '../../../components/Core/Table/TableFilter';

const { Text } = Typography


const InfoModal = ({ visible, close, callBack }) => {
    const [form] = Form.useForm();
    const [fields, setFields] = useState([
        {
            Placeholder: "Organization Name",
            rangeMin: true,
            fieldCol: 12,
            size: "small",
            type: "Text",
            // itemStyle:{marginBottom:'10px'},
        },
        {
            Placeholder: "Reference",
            // rangeMin: true,
            fieldCol: 12,
            size: "small",
            type: "Text",
            // itemStyle:{marginBottom:'10px'},
        },
        {
            object: "basic",
            fieldCol: 12,
            key: "organizaionId",
            size: "small",
            rules:[{ required: true, message: 'type is Required' }],
            data: [],
            type: "Select",
        },
        {
            object: "basic",
            fieldCol: 12,
            key: "reference", 
            size: "small",
            rules:[{ required: true, message: 'type is Required' }],
            initialValue: null,
            type: "Input",
        },
        {
            Placeholder: "Issue Date",
            rangeMin: true,
            fieldCol: 12,
            size: "small",
            type: "Text",
            // itemStyle:{marginBottom:'10px'},
        },
        {
            Placeholder: "Due Date",
            rangeMin: true,
            fieldCol: 12,
            size: "small",
            type: "Text",
            // itemStyle:{marginBottom:'10px'},
        },
        {
            object: "basic",
            fieldCol: 12,
            key: "issue_date", // when-api change it to projectId
            size: "small",
            rules:[{ required: true, message: 'Date is Required' }],
            // customValue: (value, option) => option, // when-api remove this
            type: "DatePicker",
            fieldStyle:{width: '100%'}
        },
        {
            object: "basic",
            fieldCol: 12,
            key: "due_date", // when-api change it to projectId
            size: "small",
            rules:[{ required: true, message: 'Date is Required' }],
            // customValue: (value, option) => option, // when-api remove this
            type: "DatePicker",
            fieldStyle:{width: '100%'}
        },
        {
            Placeholder: "Milestone",
            // rangeMin: true,
            fieldCol: 12,
            size: "small",
            type: "Text",
            // itemStyle:{marginBottom:'10px'},
        },
        {
            Placeholder: "Months",
            // rangeMin: true,
            fieldCol: 12,
            size: "small",
            type: "Text",
            // itemStyle:{marginBottom:'10px'},
        },
        {
            object: "basic",
            fieldCol: 12,
            key: "milestoneId",
            size: "small",
            rules:[{ required: true, message: 'type is Required' }],
            data: [],
            type: "Select",
            onChnage: ()=>{getEntries}
        },
        {
            object: "basic",
            fieldCol: 12,
            key: "months", // when-api change it to projectId
            mode: 'month',
            size: "small",
            rules:[{ required: true, message: 'Month Are Required' }],
            // customValue: (value, option) => option, // when-api remove this
            type: "RangePicker",
            onChnage: ()=>{getEntries}
        },
        {
            Placeholder: "Invoice Number",
            // rangeMin: true,
            fieldCol: 12,
            size: "small",
            type: "Text",
            // itemStyle:{marginBottom:'10px'},
        },
        {
            object: "basic",
            fieldCol: 12,
            key: "invoice_number", 
            disabled: true,
            size: "small",
            type: "Input",
        },
    ]
        
    );

    useEffect(() => {
        getData();
        if (visible !== true) {
            visible.date = formatDate(visible.date)
            form.setFieldsValue({ basic: visible })
        }
    }, []);
    // on submit 
    const onFinish = (data) => {
        
    }
    
    const getData = () => {
        Promise.all([]).then((res) => {
        })
    }

    const getEntries = () =>{
        let {milestoneId, months} =form.getFieldsValue().basic
        console.log(milestoneId, months)
    }



  return (
      <Modal
          title={visible !== true ? "Edit Invoice" : "Add Invoice"}
          visible={visible}
          width={650}
          onCancel={close}
          okText={"Save"}
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
            <FormItems FormFields={fields} />
          </Form>
          <ATable
            rowKey='id'
            data={[]}
            column={[]}
          />
      </Modal>
  )
}

export default InfoModal