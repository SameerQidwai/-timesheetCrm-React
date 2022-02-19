import React, { useEffect, useState } from 'react'
import { Button, Form } from 'antd';
import FormItems from '../../components/Core/FormItems'


const SecurityClearance = (props) =>{
    const [form] = Form.useForm();
    const [fields, setFields] = useState([
        {
            Placeholder: "Clearance Level",
            fieldCol: 12,
            size: "small",
            type: "Text",
            labelAlign: "right",
        },
        {
            Placeholder: "Date Granted",
            fieldCol: 12,
            size: "small",
            type: "Text",
            labelAlign: "right",
        },
        {
            object: "security",
            fieldCol: 12,
            key: "clearanceLevel",
            disabled: true,
            size: "small",
            data: [
                { label: "BV - Baseline Vetting", value: "BV" },
                { label: "NV1 - Negative Vetting 1", value: "NV1" },
                { label: "NV2 - Negative Vetting 2", value: "NV2" },
                { label: "PV - Positive Vetting", value: "PV" },
                { label: "No clearance", value: "NC" },
            ],
            type: "Select",
            itemStyle: { marginBottom: 10 },
        },
        {
            object: "security",
            fieldCol: 12,
            key: "clearanceGrantedDate",
            disabled: true,
            size: "small",
            type: "DatePicker",
            fieldStyle: { width: "100%" },
            itemStyle: { marginBottom: 10 },
        },
        {
            Placeholder: "Expiry Date",
            fieldCol: 12,
            size: "small",
            type: "Text",
            labelAlign: "right",
        },
        {
            Placeholder: "Current Sponsor",
            fieldCol: 12,
            size: "small",
            type: "Text",
            labelAlign: "right",
        },
        {
            object: "security",
            fieldCol: 12,
            key: "clearanceExpiryDate",
            size: "small",
            disabled: true,
            type: "DatePicker",
            fieldStyle: { width: "100%" },
            itemStyle: { marginBottom: 10 },
        },
        {
            object: "security",
            fieldCol: 12,
            key: "clearanceSponsorId",
            disabled: true,
            size: "small",
            type: "Select",
            labelAlign: "right",
            itemStyle: { marginBottom: 10 },
        },
    ])

    useEffect(() => {
        form.setFieldsValue({security: props.data})
    }, [])


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

export default SecurityClearance