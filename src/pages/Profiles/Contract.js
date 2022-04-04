import React, { useEffect, useState } from 'react'
import { Form } from 'antd';
import FormItems from '../../components/Core/Forms/FormItems'
import { getLeavePolicy } from "../../service/constant-Apis";

const PersonalContract = (props)=> {
    const [form] = Form.useForm();
    const [fields, setFields] = useState([
        {
            Placeholder: "Employment Status",
            rangeMin: true,
            fieldCol: 12,
            size: "small",
            type: "Text",
            labelAlign: "right",
            // itemStyle:{marginBottom:'10px'},
        },
        {
            Placeholder: "Payslip Email",
            fieldCol: 12,
            size: "small",
            type: "Text",
            labelAlign: "right",
            // itemStyle:{marginBottom:'10px'},
        },
        {
            object: "billing",
            fieldCol: 12,
            disabled: true,
            key: "type",
            size: "small",
            data: [
                { label: "Casual", value: 1 },
                { label: "Part Time", value: 2 },
                { label: "Full Time", value: 3 },
            ],
            type: "Select",
            rules: [ { required: true, message: "Status is Required", }, ],
            itemStyle: { marginBottom: 1 },
        },
        {
            object: "billing",
            fieldCol: 12,
            key: "payslipEmail",
            disabled: true,
            size: "small",
            type: "input",
            // rules: [
            //     {
            //         required: true,
            //         message: "Payment Email is required",
            //     },
            // ],
            itemStyle: { marginBottom: 1 },
        },
        {
            Placeholder: "Work Hours In A Week",
            rangeMin: true,
            fieldCol: 6,
            size: "small",
            type: "Text",
            labelAlign: "right",
            // itemStyle:{marginBottom:'10px'},
        },
        {
            Placeholder: "Work Days In A Week",
            rangeMin: true,
            fieldCol: 6,
            size: "small",
            type: "Text",
            labelAlign: "right",
            // itemStyle:{marginBottom:'10px'},
        },
        {
            Placeholder: "Contract Start Date",
            rangeMin: true,
            fieldCol: 12,
            size: "small",
            type: "Text",
            labelAlign: "right",
            // itemStyle:{marginBottom:'10px'},
        },
        
        {
            object: "billing",
            fieldCol: 6,
            key: "noOfHours",
            disabled: true,
            size: "small",
            type: "InputNumber",
            // shape: " Hours",
            fieldStyle: { width: "100%" },
            rules: [ { required: true, message: "Work Hours is Required", }, ],
            itemStyle: { marginBottom: 1 },
        },
        {
            object: "billing",
            fieldCol: 6,
            key: "noOfDays",
            disabled: true,
            size: "small",
            type: "InputNumber",
            // shape: " Hours",
            // data: [
            //     // { label: "Daily", value: 2 },
            //     { label: "Weekly", value: 3 },
            //     // { label: "Fortnightly", value: 4 },
            //     // { label: "Monthly", value: 5 },
            // ],
            fieldStyle: { width: "100%" },
            rules: [ { required: true, message: "Work Days are Required", }, ],
            itemStyle: { marginBottom: 10 },
        },
        {
            object: "billing",
            fieldCol: 12,
            key: "startDate",
            disabled: true,
            size: "small",
            type: "DatePicker",
            fieldStyle: { width: "100%" },
            rules: [ { required: true, message: "Start Date is Required", }, ],
            itemStyle: { marginBottom: 1 },
        },
        {
            Placeholder: "Contract End Date",
            fieldCol: 12,
            size: "small",
            type: "Text",
            labelAlign: "right",
            // itemStyle:{marginBottom:'10px'},
        },
        {
            Placeholder: "Annual Base Salary",
            rangeMin: true,
            fieldCol: 12,
            size: "small",
            type: "Text",
            labelAlign: "right",
            // itemStyle:{marginBottom:'10px'},
        },
        {
            object: "billing",
            fieldCol: 12,
            key: "endDate",
            disabled: true,
            size: "small",
            type: "DatePicker",
            fieldStyle: { width: "100%" },
            itemStyle: { marginBottom: 1 },
        },
        {
            object: "billing",
            fieldCol: 12,
            key: "remunerationAmount",
            disabled: true,
            size: "small",
            type: "InputNumber",
            shape: "$",
            fieldStyle: { width: "100%" },
            rules: [ { required: true, message: "Salary is Required", }, ],
            itemStyle: { marginBottom: 1 },
        },  
        {
            Placeholder: "Pay Frequence",
            rangeMin: true,
            fieldCol: 12,
            size: "small",
            type: "Text",
            labelAlign: "right",
            // itemStyle:{marginBottom:'10px'},
        },
        {
            Placeholder: "Leave Policy",
            rangeMin: true,
            fieldCol: 12,
            size: "small",
            type: "Text",
            labelAlign: "right",
            // itemStyle:{marginBottom:'10px'},
        },
        {
            object: "billing",
            fieldCol: 12,
            key: "payFrequency",
            disabled: true,
            size: "small",
            data: [
                { label: "Hourly", value: 1 },
                { label: "Daily", value: 2 },
                { label: "Weekly", value: 3 },
                { label: "Fortnightly", value: 4 },
                { label: "Monthly", value: 5 },
            ],
            type: "Select",
            rules: [ { required: true, message: "Payment Frequncy is required", }, ],
            itemStyle: { marginBottom: 1 },
        },
        {
            object: "billing",
            fieldCol: 12,
            key: "leaveRequestPolicyId",
            disabled: true,
            size: "small",
            data: [],
            type: "Select",
            rules: [ { required: true, message: "Policy is required", }, ],
            itemStyle: { marginBottom: 10 },
        },
        {
            Placeholder: "Comments",
            fieldCol: 24,
            size: "small",
            type: "Text",
            labelAlign: "right",
            // itemStyle:{marginBottom:'10px'},
        },
        {
            object: "billing",
            fieldCol: 24,
            key: "comments",
            disabled: true,
            size: "small",
            type: "Textarea",
            itemStyle: { marginBottom: 1 },
        },
    ]);

    useEffect(() => {
        setLeavePolicy()
        form.setFieldsValue({billing: props.data})
    }, [])

    
    const setLeavePolicy = () =>{
        getLeavePolicy().then(res=>{
            if(res.success){
                const dummy = fields
                const { type } = props.data
                dummy[17].data = res.data
                dummy[11].Placeholder = type ===1 ? "Hourly Base Salary" : "Annual Base Salary"
                setFields([...dummy])
            }
        })
    }
    return (
        <Form
            id={'my-form'}
            form={form}
            scrollToFirstError={true}
            size="small"
            layout="inline"
            style={{padding: 50, paddingTop:20}}
        >
            <FormItems FormFields={fields} />
        </Form>
    )
    
}

export default PersonalContract