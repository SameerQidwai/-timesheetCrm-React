import React, { useEffect, useState } from 'react'
import { Row, Button, Space, Popconfirm, Divider, Form } from "antd";
import { getSettings, upadteSettings } from "../../service/global-apis"
import FormItems from "../../components/Core/Forms/FormItems";

let states = ['ACT','NSW','VIC','QLD','SA','WA','NT','TSA']

function GlobalVars(props) {
    const [form] = Form.useForm();
    const [rateFields, setRateFields] = useState([
    {
        fieldCol: 6,
        Placeholder: "Rate",
        type: "Title",
        mode: 4,
        fieldStyle:{textAlign: 'right'},
        style: { textDecoration: "underline" },
    },
    {
        fieldCol: 5,
        Placeholder: "Start Date",
        type: "Title",
        mode: 4,
        fieldStyle:{textAlign: 'center'}, 
        style: { textDecoration: "underline" },
    },
    {
        fieldCol: 5,
        Placeholder: "Finish Date",
        type: "Title",
        mode: 4,
        fieldStyle:{textAlign: 'center'}, 
        style: { textDecoration: "underline" },
    },
    {
        fieldCol: 24,
        Placeholder: "Sale Tax",
        type: "Title",
        mode: 4,
        style: { textDecoration: "underline" },
    },
    {
        fieldCol: 4,
        Placeholder: "GST:",
        type: "Text",
        itemStyle:{textAlign: 'center'}, 
    },
    {
        object: "gst",
        fieldCol: 3,
        key: "value",
        size: "small",
        shape: '%',
        type: "InputNumber",
    },
    {
        object: "gst",
        fieldCol: 5,
        key: "date",
        size: "small",
        shape: '%',
        type: "DatePicker",
    },
    {
        object: "gst",
        fieldCol: 4,
        key: "finish",
        size: "small",
        shape: '%',
        type: "DatePicker",
    },
    {
        fieldCol: 24,
        Placeholder: "on Cost Rate",
        type: "Title",
        mode: 4,
        style: { textDecoration: "underline" },
    },
    {
        fieldCol: 4,
        Placeholder: "Superannuation:",
        type: "Text",
        itemStyle:{textAlign: 'center'}, 
    },
    {
        object: "superannuation",
        fieldCol: 3,
        key: "value",
        size: "small",
        shape: '%',
        type: "InputNumber",
    },
    {
        object: "superannuation",
        fieldCol: 5,
        key: "date",
        size: "small",
        shape: '%',
        type: "DatePicker",
    },
    {
        object: "superannuation",
        fieldCol: 4,
        key: "finish",
        size: "small",
        shape: '%',
        type: "DatePicker",
    },
    {
        fieldCol: 24,
        Placeholder: "Payroll Tax",
        type: "Text",
        itemStyle:{paddingLeft: '5%'}, 
    }, 
    ])

    const otherFields = [
        {
            // object:'global',
            fieldCol: 24,
            Placeholder: "General Settings",
            type: "Title",
            mode: 4,
            style: { textDecoration: "underline" },
        },
        {
            fieldCol: 4, // this is only label 1
            size: "small",
            Placeholder: "Records Per Page",
            type: "Text",
            labelAlign: "right",
        },
        {
            object: "global",
            fieldCol: 20,
            key: "recordsPerPage",
            size: "small",
            // rules:[{ required: true, message: 'Insert your Password Please' }],
            type: "InputNumber",
            labelCol: { span: 4 },
            labelAlign: "right",
            itemStyle: { marginBottom: 20 },
            // hidden: false
        },
        {
            fieldCol: 4, // this is only label 1
            size: "small",
            Placeholder: "Display Email",
            rangeMin: true,
            type: "Text",
            labelAlign: "left",
        },
        {
            object: "global",
            fieldCol: 20,
            key: "displayEmail",
            Placeholder: "Display Name In Email",
            size: "small",
            // rules:[{ required: true, message: 'Insert your Password Please' }],
            type: "input",
            labelCol: { span: 3 },
            labelAlign: "right",
            itemStyle: { marginBottom: 20 },
            // hidden: false
        },
        {
            fieldCol: 4, // this is only label 1
            size: "small",
            Placeholder: "From Email",
            rangeMin: true,
            type: "Text",
            labelAlign: "left",
        },
        {
            object: "global",
            fieldCol: 20,
            key: "fromEmail",
            Placeholder: "From Email Address",
            size: "small",
            // rules:[{ required: true, message: 'Insert your Password Please' }],
            type: "input",
            labelCol: { span: 3 },
            labelAlign: "right",
            itemStyle: { marginBottom: 20 },
            // hidden: false
        },
        {
            fieldCol: 20,
            mode: "horizontal",
            type: "Divider",
            itemStyle: { padding: "0px", margin: "0px" },
            itemStyle: { marginBottom: 20 },
            // hidden: false
        },
    ]

    useEffect(() => {
        getApi()
        addStateFields() 
    }, [])

    const stateFileds = (key) =>{
        return [{
            fieldCol: 4,
            Placeholder: key,
            type: "Text",
            itemStyle:{textAlign: 'right', paddingRight: '15%', marginBottom: 10}, 
        },
        {
            object: key,
            fieldCol: 3,
            key: "value",
            size: "small",
            shape: '%',
            type: "InputNumber",
        },
        {
            object: key,
            fieldCol: 5,
            key: "date",
            size: "small",
            shape: '%',
            type: "DatePicker",
        },
        {
            object: key,
            fieldCol: 10,
            key: "finish",
            size: "small",
            shape: '%',
            type: "DatePicker",
        },]
    }

    const getApi = () =>{
        getSettings().then(res=>{
            if(res.success){
                form.setFieldsValue({global: res.data});
            }
        })
    }

    const addStateFields = () =>{
        let newFields = []
        for (const state of states) {
            newFields.push(...stateFileds(state))
        }

        if (states.length>0){
            setRateFields(prevFields => {
                return [
                    ...prevFields,
                    ...newFields,
                    {
                        fieldCol: 20,
                        mode: "horizontal",
                        type: "Divider",
                        itemStyle: { padding: "0px", margin: "0px" },
                        // hidden: false
                    }
                ]
            })
        }
    }

    const onFinish = (childData) =>{
        delete childData['undefined']
        // const value = childData.global
        const variable = childData
        console.log(variable);
        upadteSettings(variable).then(res=>{
            if(res.success){
                // localStorage.setItem('pageSize', res.data.recordsPerPage)
            }
        })
    }

    return (
        <>
        <Form
            id={'my-form'}
            form={form}
            scrollToFirstError={true}
            onFinish={onFinish}
            size="small"
            layout="inline"
            style={{padding: '20px 50px 20px 50px'}}
        >
            <FormItems FormFields={rateFields} /> 
            {/* Globa; Rate and Variables commented */}
            <FormItems FormFields={otherFields} />
        </Form>
        <Row justify="end">
            <Space size="large">
                <Popconfirm
                    placement="bottom"
                    title="Are you sure want to save new Settings?"
                    onConfirm={()=>form.submit()}
                    okText="Yes"
                    cancelText="No"
                >
                    <Button type="primary" size="small">
                        Save
                    </Button>
                </Popconfirm>
                <Button size="small" onClick={()=>form.resetFields()}>
                    Cancel
                </Button>
            </Space>
        </Row>
        </>
    )
}

export default GlobalVars
