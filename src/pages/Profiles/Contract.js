import React, { useEffect, useState } from 'react'
import { Form, Table, Upload } from 'antd';
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import FormItems from '../../components/Core/Forms/FormItems'
import { getLeavePolicy } from "../../service/constant-Apis";
import { JOB_TYPE, formatCurrency, formatDate, localStore } from '../../service/constant';
import { tableSorter } from '../../components/Core/Table/TableFilter';

const PersonalContract = ({data: {contracts, activeContractId: activeId}})=> {
    

    const column = [
        {
            title: "Code",
            dataIndex: "id",
            key: "id",
            wdith: 115,
            render: (record) => `00${record}`,
            ...tableSorter('id', 'number', true),
        },
        {
            title: "Start Date",
            dataIndex: "startDate",
            key: "startDate",
            render:(record)=> record && formatDate(record, true, true),
            ...tableSorter('startDate', 'date'),
        },
        {
            title: "End Date",
            dataIndex: "endDate",
            key: "endDate",
            render:(record)=> record && formatDate(record, true, true),
            ...tableSorter('endDate', 'date'),
        },
        {
            title: "Employment Type",
            dataIndex: "type",
            key: "type",
            render: (record) => JOB_TYPE[record]
        },
        {
            title: "Base Remuneration",
            dataIndex: "remunerationAmount",
            key: "remunerationAmount",
            render: (record)=> `${formatCurrency(record)}`,
            ...tableSorter('remunerationAmount', 'number'),
        },
        // {
        //     title: "Rate Duration",
        //     dataIndex: "remunerationAmountPer",
        //     key: "remunerationAmountPer",
        //     render: (record)=> DURATION[record]
        // },
    ];

    

    return (
        <Table
            bordered
            pagination={{pageSize: localStore().pageSize}}
            rowKey={(record) => record.id}
            columns={column}
            onRow={(record)=>({className: record.id === activeId && 'active-contract'})}
            dataSource={contracts}
            size="small"
            className='fs-small contract-table'
            expandable={{
                defaultExpandedRowKeys:[activeId],
                expandedRowRender: record => {
                    return (
                    <ViewDetails 
                        data={record} 
                        key={record.id}
                    />)
                },
                }}
        />
    )

    
}

export default PersonalContract


function ViewDetails({data}) {
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState(data.file??[])
    const [fields, setFields] = useState([
        {
            Placeholder: "Employment Status",
            rangeMin: true,
            fieldCol: 6,
            size: "small",
            type: "Text",
            labelAlign: "right",
            // itemStyle:{marginBottom:'10px'},
        },
        {
            Placeholder: "Back Office Rate of Effort",
            rangeMin: true,
            fieldCol: 6,
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
            fieldCol: 6,
            disabled: true,
            key: "type",
            size: "small",
            data: [
                { label: "Casual", value: 1 },
                { label: "Part Time", value: 2 },
                { label: "Full Time", value: 3 },
            ],
            type: "Select",
            itemStyle: { marginBottom: 1 },
        },
        {
            object: "billing",
            fieldCol: 6,
            key: "bohPercent",
            disabled: true,
            size: "small",
            shape: "%",
            type: "InputNumber",
            fieldStyle: { width: "100%" },
            itemStyle: { marginBottom: 10 },
        },
        {
            object: "billing",
            fieldCol: 12,
            key: "payslipEmail",
            disabled: true,
            size: "small",
            type: "input",
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
            itemStyle: { marginBottom: 1 },
        },
        {
            object: "billing",
            fieldCol: 6,
            key: "noOfDays",
            disabled: true,
            size: "small",
            type: "InputNumber",
            fieldStyle: { width: "100%" },
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
        form.setFieldsValue({billing: data})
        setLeavePolicy()
    }, [])
    const setLeavePolicy = () =>{
        getLeavePolicy().then(res=>{
            if(res.success){
                const dummy = fields
                const { type } = data
                dummy[19].data = res.data
                dummy[13].Placeholder = type ===1 ? "Hourly Base Salary" : "Annual Base Salary"
                setFields([...dummy])
            }
        })
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
        <p style={{marginTop: 10, marginBottom: 2}}>Signed Contract</p>
        <Upload
            // listType="picture"
            disabled={true}
            listType="picture-card"
            maxCount={1}
            fileList={fileList}
        >
            {fileList.length < 1 &&
                <div style={{marginTop: 10}} >
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>Upload</div>
                </div>
            }
            {/* <Button icon={<UploadOutlined />} style={{marginTop: 10}} loading={imgLoading}>Upload Contract</Button> */}
        </Upload>
        </Form>
        </>
    )

};