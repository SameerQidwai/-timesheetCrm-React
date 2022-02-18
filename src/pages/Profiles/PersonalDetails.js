import React, { useEffect, useState } from 'react'
import { Button, Form } from 'antd';
import FormItems from '../../components/Core/FormItems'
import { getStates } from '../../service/constant-Apis';

const PersonalDetails= (props) => {
    const [form] = Form.useForm();
    const [fields, setFields] = useState([
        {
            fieldCol: 12, // this is only label 1
            size: "small",
            Placeholder: "Contact person Code",
            rangeMin: true,
            type: "Text",
            labelAlign: "left",
        },
        {
            Placeholder: "Date Of Birth",
            fieldCol: 12,
            size: "small",
            type: "Text",
            labelAlign: "right",
            // itemStyle:{marginBottom:'10px'},
            // itemStyle: { marginBottom: 20 },
        },
        {
            object: "basic", //this is field 3
            fieldCol: 12,
            key: "cpCode",
            size: "small",
            readOnly: true,
            rules:[{ required: true, message: 'Select Contact Person !!' }],
            type: "Input",
            labelAlign: "left",
            itemStyle: { marginBottom: 20 },
        },
        {
            object: "basic",
            disabled: true,
            fieldCol: 12,
            key: "dateOfBirth",
            size: "small",
            // rules:[{ required: true }],
            type: "DatePicker",
            fieldStyle: { width: "100%" },
            itemStyle: { marginBottom: 20 },
        },
        {
            fieldCol: 12, // this is only label 5
            size: "small",
            Placeholder: "First Name",
            disabled: false,
            // rules:[{ required: true }],
            type: "Text",
            labelAlign: "left",
        },
        {
            Placeholder: "Last Name",
            fieldCol: 12, // this is only label 8
            size: "small",
            disabled: false,
            // rules:[{ required: true }],
            type: "Text",
            labelAlign: "left",
        },
        {
            object: "basic",
            readOnly: true, //this is field 7
            fieldCol: 12,
            key: "firstName",
            size: "small",
            // rules:[{ required: true }],
            type: "Input",
            labelAlign: "left",
            disabled: false,
            itemStyle: { marginBottom: 20 },
        },
        {
            object: "basic",
            readOnly: true, //this is field 9
            fieldCol: 12,
            key: "lastName",
            size: "small",
            // rules:[{ required: true }],
            type: "Input",
            labelAlign: "left",
            disabled: false,
            // rules: [
            //     {
            //         required: true,
            //         message: "Last Name is required",
            //     },
            // ],
            itemStyle: { marginBottom:20 },
        },
        {
            Placeholder: "Phone",
            fieldCol: 12,
            size: "small",
            type: "Text",
            labelAlign: "right",
            // itemStyle:{marginBottom:'1020'},
        },
        {
            fieldCol: 12, // this is only label 4
            size: "small",
            Placeholder: "Email",
            disabled: false,
            type: "Text",
            labelAlign: "left",
        },
        {
            object: "basic",
            readOnly: true,
            fieldCol: 12,
            key: "phoneNumber",
            size: "small",
            type: "input",
            itemStyle: { marginBottom: 20 },
        },
        {
            object: "basic",
            readOnly: true, //this is field 6
            fieldCol: 12,
            key: "email",
            size: "small",
            type: "Input",
            disabled: false,
            itemStyle: { marginBottom: 20 },
        },
        {
            Placeholder: "Gender",
            fieldCol: 12,
            size: "small",
            type: "Text",
            labelAlign: "right",
            // itemStyle:{marginBottom:'1020'},
        },
        {
            Placeholder: "State",
            fieldCol: 12,
            size: "small",
            type: "Text",
            labelAlign: "right",
            // itemStyle:{marginBottom:'1020'},
        },
        {
            object: "basic",
            readOnly: true,
            fieldCol: 12,
            key: "gender",
            size: "small",
            data: [
                { label: "Male", value: "M" },
                { label: "Female", value: "F" },
                { label: "Other", value: "O" },
            ],
            itemStyle: { marginBottom: 20 },
            // rules:[{ required: true }],
            type: "Select",
            disabled: true,
            // mode: "button",
            // shape: "solid",
        },
        {
            object: "basic",
            readOnly: true,
            fieldCol: 12,
            key: "stateId",
            size: "small",
            // rules:[{ required: true }],
            type: "Select",
            disabled: true,
            data: [],
            itemStyle: { marginBottom: 20 },
        },
        {
            Placeholder: "Address",
            fieldCol: 24,
            size: "small",
            type: "Text",
            labelAlign: "right",
        },
        {
            object: "basic",
            fieldCol: 24,
            key: "address",
            size: "small",
            // rules:[{ required: true }],
            type: "Input",
            itemStyle: { marginBottom: 30 },
        },
    ])

    useEffect(() => {
        setStates()
        form.setFieldsValue({basic: props.data})
    }, [])

    const setStates = () =>{
        getStates().then(res=>{
            if(res.success){
                const updatefields = fields.map(el=>{
                    if(el.key === 'stateId'){
                        return{...el, data: res.data}
                    }
                    return el
                })
                setFields(updatefields)
            }
        })
    } 
    const onFinish = (value) =>{
        const { basic } = value
        console.log(basic.address);
    }

    return (
        <Form
            id={'my-form'}
            form={form}
            scrollToFirstError={true}
            size="small"
            layout="inline"
            style={{padding: 50, paddingTop:20}}
            onFinish={onFinish}
        >
            <FormItems FormFields={fields} />
            <Button type="primary" htmlType="submit" style={{margin: '0 15px 0 auto'}}> Submit </Button>
        </Form>
    )
    
}

export default PersonalDetails