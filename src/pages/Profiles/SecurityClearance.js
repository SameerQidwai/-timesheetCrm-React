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
            onChange: (value) => {
                if (value){
                    fields[1].rangeMin= true
                    fields[4].rangeMin= true
                    fields[5].rangeMin= true

                    fields[3].rules= [ { required: true, message: "Date Granted is required", }, ]
                    fields[6].rules= [ { required: true, message: "Expiry Date is required", }, ]
                    fields[7].rules= [ { required: true, message: "Current Sponsor is required", }, ]

                }else{
                    fields[1].rangeMin= false
                    fields[4].rangeMin= false
                    fields[5].rangeMin= false

                    fields[3].rules = [{required: false, message: ''}]
                    fields[6].rules = [{required: false, message: ''}]
                    fields[7].rules = [{required: false, message: ''}]
                }
                setFields([...fields])
            }
        },
        {
            object: "security",
            fieldCol: 12,
            key: "clearanceGrantedDate",
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
            type: "DatePicker",
            fieldStyle: { width: "100%" },
            itemStyle: { marginBottom: 10 },
        },
        {
            object: "security",
            fieldCol: 12,
            key: "clearanceSponsorId",
            size: "small",
            type: "Select",
            labelAlign: "right",
            itemStyle: { marginBottom: 10 },
        },
    ])

    useEffect(() => {
        form.setFieldsValue({security: props.data})
    }, [])

    const onFinish = (value) =>{
        const { security } = value
        console.log(security.address);
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
            <Button type="primary" htmlType="submit" style={{margin: '20px 15px 0 auto'}}> Submit </Button>
        </Form>
    )
}

export default SecurityClearance