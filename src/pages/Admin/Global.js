import React, { useEffect, useState } from 'react'
import { Row, Button, Space, Popconfirm, Divider, Form } from "antd";
import { getSettings, getVariables, upadteSettings, upadteVariables } from "../../service/global-apis"
import FormItems from "../../components/Core/Forms/FormItems";
import { getleaveRequestTypes, getStates } from '../../service/constant-Apis';
import { formatDate, STATES } from '../../service/constant';
import GlobalHistory from './GlobalVars/Modals/GlobalHistory';

function GlobalVars(item) {
    const [form] = Form.useForm();
    const [openHistory, setOpenHistory] = useState(false)
    const [formValues, setFormValues] = useState({settings: {}, variables: {}})
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
            fieldCol: 6,
            Placeholder: "Finish Date",
            type: "Title",
            mode: 4,
            fieldStyle:{textAlign: 'center'}, 
            style: { textDecoration: "underline" },
        },
        {
            fieldCol: 4,
            Placeholder: "Action",
            type: "Title",
            mode: 4,
            // fieldStyle:{textAlign: 'right'}, 
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
            itemStyle:{textAlign: 'right', paddingRight: '15%'}, 
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
            rules:[
                ({ getFieldValue }) => ({
                    validator(_, date) {
                        const {value} = getFieldValue('GST') ?? {}
                        if (value){
                            if(!date){
                                return Promise.reject(new Error('Start Date is Required!!'))
                            }else{
                                return Promise.resolve();
                            }
                        }
                        return Promise.resolve();
                    },
                }),
            ]
        },
        {
            object: "GST",
            fieldCol: 5,
            key: "endDate",
            size: "small",
            shape: '%',
            type: "DatePicker",
            rules:[
                ({ getFieldValue }) => ({
                    validator(_, date) {
                        const {value} = getFieldValue('GST') ?? {}
                        if (value){
                            if(!date){
                                return Promise.reject(new Error('End Date is Required!!'))
                            }else{
                                return Promise.resolve();
                            }
                        }
                        return Promise.resolve();
                    },
                }),
            ]
        },
        {
            fieldCol: 4,
            Placeholder: <a>History</a>,
            type: "Text",
            itemStyle:{textAlign: ''},
            onClick:()=>{
                setOpenHistory('GST')
            }
        },
        {
            fieldCol: 4,
            Placeholder: "Income Tax:",
            type: "Text",
            itemStyle:{textAlign: 'right', paddingRight: '15%'}, 
        },
        {
            object: "income_tax",
            fieldCol: 3,
            key: "value",
            size: "small",
            shape: '%',
            type: "InputNumber",
        },
        {
            object: "income_tax",
            fieldCol: 5,
            key: "startDate",
            size: "small",
            shape: '%',
            type: "DatePicker",
            rules:[
                ({ getFieldValue }) => ({
                    validator(_, date) {
                        const {value} = getFieldValue('GST') ?? {}
                        if (value){
                            if(!date){
                                return Promise.reject(new Error('Start Date is Required!!'))
                            }else{
                                return Promise.resolve();
                            }
                        }
                        return Promise.resolve();
                    },
                }),
            ]
        },
        {
            object: "income_tax",
            fieldCol: 5,
            key: "endDate",
            size: "small",
            shape: '%',
            type: "DatePicker",
            rules:[
                ({ getFieldValue }) => ({
                    validator(_, date) {
                        const {value} = getFieldValue('GST') ?? {}
                        if (value){
                            if(!date){
                                return Promise.reject(new Error('End Date is Required!!'))
                            }else{
                                return Promise.resolve();
                            }
                        }
                        return Promise.resolve();
                    },
                }),
            ]
        },
        {
            fieldCol: 4,
            type: "Text",
            Placeholder: <a>History</a>,
            itemStyle:{textAlign: ''},
            onClick:()=>{
                setOpenHistory('income_tax')
            }
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
            itemStyle:{textAlign: 'right', paddingRight: '15%', marginBottom: 10}, 
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
            rules:[
                ({ getFieldValue }) => ({
                    validator(_, date) {
                        const {value} = getFieldValue('Superannuation') ?? {}
                        if (value){
                            if(!date){
                                return Promise.reject(new Error('Start Date is Required!!'))
                            }else{
                                return Promise.resolve();
                            }
                        }
                        return Promise.resolve();
                    },
                }),
            ]
        },
        {
            object: "Superannuation",
            fieldCol: 5,
            key: "endDate",
            size: "small",
            shape: '%',
            type: "DatePicker",
            rules:[
                ({ getFieldValue }) => ({
                    validator(_, date) {
                        const {value} = getFieldValue('Superannuation') ?? {}
                        if (value){
                            if(!date){
                                return Promise.reject(new Error('End Date is Required!!'))
                            }else{
                                return Promise.resolve();
                            }
                        }
                        return Promise.resolve();
                    },
                }),
            ]
        },
        {
            fieldCol: 4,
            type: "Text",
            Placeholder: <a>History</a>,
            itemStyle:{textAlign: ''},
            onClick:()=>{
                setOpenHistory('Superannuation')
            }
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
            fieldCol: 7, // this is only label 1
            size: "small",
            Placeholder: "Records Per Page",
            type: "Text",
            labelAlign: "right",
        },
        {
            object: "settings",
            fieldCol: 12,
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
            fieldCol: 7, // this is only label 1
            size: "small",
            Placeholder: "Display Email",
            rangeMin: true,
            type: "Text",
            labelAlign: "left",
        },
        {
            object: "settings",
            fieldCol: 12,
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
            fieldCol: 7, // this is only label 1
            size: "small",
            Placeholder: "From Email",
            rangeMin: true,
            type: "Text",
            labelAlign: "left",
        },
        {
            object: "settings",
            fieldCol: 12,
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
            fieldCol: 7, // this is only label 1
            size: "small",
            Placeholder: "Auto Reject Submitted Requests On FY Closing",
            rangeMin: true,
            type: "Text",
            labelAlign: "left",
        },
        {
            object: "settings",
            // fieldCol: ,
            valuePropName:"checked",
            key: "autoRejectFY",
            // Placeholder: "Display Name In Email",
            size: "small",
            // rules:[{ required: true, message: 'Insert your Password Please' }],
            type: "Switch",
            // labelCol: { span: 3 },
            labelAlign: "right",
            // itemStyle: { marginBottom: 20 },
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
    }, [])

    const fetchAll = ()=>{
        Promise.all([getStates(), getleaveRequestTypes(), getSettings(), getVariables()]).then(res=>{
            if(res[2].success){
                form.setFieldsValue({settings: res[2].data, ...res[3].data});
            }
            let workCover = {value: 'workCover', label:'WorkCover'}
            let publicHolidays = {value: 'publicHoildays', label:'Public Holidays'}
            let states = res[0].success ? res[0].data : []
            let leavetypes = res[1].success ? res[1].data : []
            setFormValues({settings: res[2].data, variable: res[3].data})
            addGlobalFields([ workCover, ...leavetypes, publicHolidays], states)
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
            rules:[
                ({ getFieldValue }) => ({
                    validator(_, date) {
                        const {value} = getFieldValue(key) ?? {}
                        if (value){
                            if(!date){
                                return Promise.reject(new Error('Start Date is Required!!'))
                            }else{
                                return Promise.resolve();
                            }
                        }
                        return Promise.resolve();
                    },
                }),
            ]
        },
        {
            object: key,
            fieldCol: 5,
            key: "endDate",
            size: "small",
            shape: '%',
            type: "DatePicker",
            rules:[
                ({ getFieldValue }) => ({
                    validator(_, date) {
                        const {value} = getFieldValue(key) ?? {}
                        if (value){
                            if(!date){
                                return Promise.reject(new Error('End Date is Required!!'))
                            }else{
                                return Promise.resolve();
                            }
                        }
                        return Promise.resolve();
                    },
                }),
            ]
        },
        {
            object: key,
            fieldCol: 4,
            Placeholder: <a>History</a>,
            size: "small",
            type: "Text",
            itemStyle:{textAlign: ''},
            onClick:()=>{
                setOpenHistory(key)
            }
        }
    ]
    }

    const addGlobalFields = (lables, states) =>{
        let newFields = []
        let stateFields = []
        for (const {label} of lables) {
            newFields.push(...stateFileds(label))
        }
        for (const {label} of states) {
            stateFields.push(...stateFileds(label))
        }

        if (lables.length>0){
            setRateFields(prevFields => {
                return [
                    ...prevFields,
                    ...newFields,
                    {
                        fieldCol: 24,
                        Placeholder: "Payroll Tax",
                        type: "Title",
                        mode: 5,
                        itemStyle:{paddingLeft: '5%'}, 
                        style: { textDecoration: "underline" },
                    },
                    ...stateFields,
                    {
                        fieldCol: 12,
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
        // let variable = {}
        let variable = []
        Object.entries(childData).map( ([key, val]) => {
            if (val.value !== undefined && val.value !== null){
                // variable = {...val, name: key}
                variable.push({
                    ...val, 
                    name: key,
                    startDate: formatDate(val.startDate, true),
                    endDate: formatDate(val.endDate, true),
                })
            }
          });
        Promise.all([upadteSettings(settings), upadteVariables({variables: variable})]).then(res=>{
            let settings = res[0].success ? res[0].data : formValues.settings
            let variables = res[1].success ? res[1].data : formValues.variables
            form.setFieldsValue({settings: settings, ...variables});
            // form.setFieldsValue({settings: res[0].data})
        })
        .catch(err => console.log(err))
    }

    const onHistoryClose =() =>{
        setOpenHistory(false)
        fetchAll()
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
        {openHistory&&<GlobalHistory
            visible={openHistory}
            onClose={()=>onHistoryClose()}
        />}
        </>
    )
}

export default GlobalVars
