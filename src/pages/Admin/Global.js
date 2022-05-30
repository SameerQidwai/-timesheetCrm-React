import React, { useEffect, useState } from 'react'
import { Row, Button, Space, Popconfirm, Divider, Form } from "antd";
import { getSettings, getVariables, upadteSettings, upadteVariables } from "../../service/global-apis"
import FormItems from "../../components/Core/Forms/FormItems";
import { getleaveRequestTypes, getStates } from '../../service/constant-Apis';
import { STATES } from '../../service/constant';

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
        object: "GST",
        fieldCol: 3,
        key: "value",
        size: "small",
        shape: '%',
        type: "InputNumber",
    },
    {
        object: "GST",
        fieldCol: 5,
        key: "startDate",
        size: "small",
        shape: '%',
        type: "DatePicker",
    },
    {
        object: "GST",
        fieldCol: 5,
        key: "endDate",
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
        object: "Superannuation",
        fieldCol: 3,
        key: "value",
        size: "small",
        shape: '%',
        type: "InputNumber",
    },
    {
        object: "Superannuation",
        fieldCol: 5,
        key: "startDate",
        size: "small",
        shape: '%',
        type: "DatePicker",
    },
    {
        object: "Superannuation",
        fieldCol: 5,
        key: "endDate",
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
            object: "settings",
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
            object: "settings",
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
            object: "settings",
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
        // getApi()
        fetchAll()
        // addStateFields() 
    }, [])

    const fetchAll = ()=>{
        Promise.all([getStates(), getleaveRequestTypes(), getSettings(), getVariables()]).then(res=>{
            if(res[2].success){
                form.setFieldsValue({settings: res[2].data, ...res[3].data});
            }
            let states = res[0].success ? res[0].data : []
            let leavetypes = res[1].success ? res[1].data : []
            addStateFields([...states, ...leavetypes]) 
        })
        .catch(err => console.log(err))
    }

    const stateFileds = (key) =>{
        return [{
            fieldCol: 4,
            Placeholder: STATES[key]?? key,
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
            key: "startDate",
            size: "small",
            shape: '%',
            type: "DatePicker",
        },
        {
            object: key,
            fieldCol: 10,
            key: "endDate",
            size: "small",
            shape: '%',
            type: "DatePicker",
        },]
    }

    const addStateFields = (lables) =>{
        let newFields = []
        for (const {label} of lables) {
            newFields.push(...stateFileds(label))
        }

        if (lables.length>0){
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
        const settings = childData.settings
        delete childData.settings
        let variable = {}
        Object.entries(childData).map( ([key, val]) => {
            if (val.value){
                variable = {...val, name: key}
            }
          });
        Promise.all([upadteSettings(settings), upadteVariables(variable)]).then(res=>{
            form.setFieldsValue({settings: res[0].data})
        })
        .catch(err => console.log(err))
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
