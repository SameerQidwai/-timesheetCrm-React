import React, { useState } from "react"
import { Button, Col, Empty, Row, Select, Table, Typography, Upload } from "antd"
import '../styles/import.css'
const { Title } = Typography
const { Dragger } = Upload
const entity = [
    {value: 'contact-person', last: 'In-Progress',title: 'Contact Persons', label:'Contact Person'},
    {value: 'employee', last: 'Fri 30 Sep 2022', title: 'Employees', label: 'Employee'},
    {value: 'sub-contactor', title: 'Sub Contactors', label:'Sub Contactor'},
    {value: 'organization', title: 'Organisations', label: 'Organisation'},
    {value:'opportunity', title: 'Opportunities', label: 'Opportunity'},
    {value: 'project', title: 'Projects', label: 'Project'},
]

const Columns = [
    {
        title: "Title",
        dataIndex: "title",
        key: "title",
        render: (text, record) => <div>
            <div><Title level={5}>{text}</Title></div>
            <div style={{ fontSize: 12}}>
            <div >
                <span>{record.last !== 'In-Progress' && 'last Import  at: ' + (record.last?? 'Never') + ':   '}</span>
                <span >{record.last !== 'In-Progress' && <a >Log.txt</a>}</span>
            </div>
            <div style={{ fontSize: 12}}>
                <span>{record.last !== 'In-Progress' && 'last Export at: ' + (record.last?? 'Never') + ':   '}</span>
                <span >{record.last !== 'In-Progress' && <a style={{color: 'red'}}>Log.xls</a>}</span>
            </div>

            </div>
        </div>
    },
    {
        title: "Import",
        dataIndex: 'import',
        key: "import",
        align:'center',
        render: (_, record)=><Button type="primary" shape="round" loading={record.last === 'In-Progress'} disabled={record.last !== 'In-Progress'}> Import</Button>
    },
    {
        title: "Export",
        dataIndex: 'export',
        key: "export",
        align:'center',
        render: (_, record)=><Button type="primary"shape="round" danger  disabled> Export</Button>
    },
    
]

const ImportExport = () =>{
    const [sEntity, setsEntity] = useState({value: 'contact-person', title: 'Contact Persons', label:'Contact Person'})
    const [fileList, setFileList] = useState([])
    return (
        <div>
            <Title level={4}>Import/Export</Title>
            <Table
                bordered
                rowKey={(data) => data.value}
                columns={Columns}
                dataSource={entity}
                // size="small"
                // className='fs-small'
                // showHeader={false}
                pagination={false}
            />

        </div>
    )
}
export default  ImportExport 