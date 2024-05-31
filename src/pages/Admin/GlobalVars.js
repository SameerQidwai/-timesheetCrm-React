import React, { useEffect, useState } from 'react'
import { Row, Button, Space, Popconfirm, Divider, Form } from "antd";
import { getSettings, upadteSettings } from "../../service/global-apis"
import FormItems from "../../components/Core/Forms/FormItems";
import { getleaveRequestTypes, getStates } from '../../service/constant-Apis';

let states = ['AB','BC','MB','NB','NL','NS','ON','PEI','QC','SK']

function GlobalVars(props) {
    const [form] = Form.useForm();
    const column = []
    const [fields, setFields] = useState([
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
        key: "rate",
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
        key: "rate",
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
            key: "rate",
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

    useEffect(() => {
        // addStateFields()
        fetchAll()
    }, [])

    const fetchAll = ()=>{
        Promise.all([getStates(), getleaveRequestTypes()]).then(res=>{
            console.log(res[1]);
        }).catch(err => console.log(err))
    }

    const addStateFields = () =>{
        let newFields = []
        for (const state of states) {
            newFields.push(...stateFileds(state))
        }

        if (states.length>0){
            setFields(prevFields => {
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

    return (
        <>
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
        <Row justify="end">
            <Space size="large">
                <Popconfirm
                    placement="bottom"
                    title="Are you sure want to save new Settings?"
                    onConfirm={() => this.submit()}
                    okText="Yes"
                    cancelText="No"
                >
                    <Button type="primary" size="small">
                        Save
                    </Button>
                </Popconfirm>
                <Button size="small" onClick={() => this.reset()}>
                    Cancel
                </Button>
            </Space>
        </Row>
        </>
    )
}

export default GlobalVars
