import React, { useEffect, useState } from "react"
import { Button, Col, Empty, Modal, Row, Select, Table, Typography, Upload } from "antd"
import '../styles/import.css'
import { PaperClipOutlined, InboxOutlined} from "@ant-design/icons"; //Icons
import { formatDate, thumbUrl } from "../../service/constant"
import { transfer, status } from "../../service/import-export-api's";
const { Title } = Typography
const {Dragger} = Upload


const typeName = {
    'ORG': 'ORGANIZATIONS' ,
  'CPE': 'CONTACT PERSONS' ,
  'OPP': 'OPPORTUNITIES' ,
  'PRO': 'PROJECTS' ,
  'EMP': 'EMPLOYEES' ,
  'SCO': 'SUB CONTRACTORS' ,
}



const ImportExport = () =>{
    const [sEntity, setsEntity] = useState({visible: false, type: null, loading: false})
    const [logs, setLogs] = useState([])
    const [fileList, setFileList] = useState([])
    const [running, setRunning] = useState(false)

    const Columns = [
        {
            title: "Title",
            dataIndex: "type",
            key: "type",
            render: (text, record) => (
                <div>
                    <div><Title level={5}>{typeName[text]}</Title></div>
                    <div className="desc">
                    {record.importing ?
                        <span>Last Import  At: <b>In Progress </b> </span>
                    :
                        <div > 
                            <span>Last Import  At: <b>{(record.imported ? formatDate(record.lastImported, true, true): record.lastImported)}</b></span>
                            <span className="file-mr">{record.log && <a href={`http://${record.file}`} target="_blank" rel="noopener noreferrer" > <PaperClipOutlined /> {typeName[text]}_LOGS.xlsx</a>}</span>
                        </div>
                    }
                    {record.exporting ?
                        <span>Last Export  At: <b>In Progress </b></span>
                    :
                        <div >
                            <span>Last Export  At: <b>{(record.exported ? formatDate(record.lastExported, true, true): record.lastExported)}</b></span>
                            <span className="file-mr">{record.file && <a href={`http://${record.file}`} target="_blank" rel="noopener noreferrer" className="fail-link"> <PaperClipOutlined /> {typeName[text]}.xlsx</a>}</span>
                        </div>
                    }
                    </div>
                </div>
            )
        },
        {
            title: "Import",
            dataIndex: 'importing',
            key: "importing",
            align:'center',
            render: (text, record, index)=><Button 
                type="primary" 
                shape="round" 
                loading={text} 
                disabled={!text && running}
                onClick={()=>setsEntity({visible: true, type: record.type, loading: false, index})}
            > Import</Button>
        },
        {
            title: "Export",
            dataIndex: 'exporting',
            key: "exporting",
            align:'center',
            render: (text, record, index)=><Button 
                type="primary"
                shape="round" 
                danger  
                loading={text} 
                disabled={!text && running}
                onClick={()=>Exporting(record.type, index)}
            > Export</Button>
        },
        
    ]

    useEffect(() => {
        getStatus()
    }, [])

    const getStatus = () =>{
        status().then(res=>{
            if(res.success){
                renamethisfunction(res.data)
            }
        })
    }
    
    const renamethisfunction = (data) =>{
        for (let {importing, exporting} of data) {
            if (importing || exporting){
                setRunning(true)
                break;
            }
        }
        setLogs(data)
    }

    const InProrgess = (index ,running, bool) =>{
        setRunning(bool)
        let dummyLog = [...logs]
        dummyLog[index][running] = bool
        setLogs(dummyLog)
    }

    const Importing = () =>{
        setsEntity({...sEntity, loading: true})
        const formData = new FormData();
        formData.append('file', fileList[0])
        InProrgess(sEntity['index'], 'importing', true)
        transfer('import', sEntity['type'], formData, true).then(res=>{
            if (res.success){
                getStatus()
                setRunning(false)
            }
        }).catch(err =>{
            InProrgess(sEntity['index'], 'importing', false)
        })
        setsEntity({visible: false, type: null, loading: false})
        setFileList([])
    }

    const Exporting = (type, index) =>{
        InProrgess(index, 'exporting', true)
        transfer('export', type, {}).then(res=>{ 
            if (res.success){
                getStatus()
                setRunning(false)
            }
        }).catch(err =>{
            InProrgess(index, 'exporting', false)
        })
    }

    const  handleUpload = async option=>{
        const { file } = option;
        setsEntity({...sEntity, loading: true})
        file.thumbUrl = thumbUrl('xls')
        setFileList([file])
        setsEntity({...sEntity, loading: false})
    }

    return (
        <div>
            <Title level={4}>Import/Export</Title>
            <Table
                bordered
                rowKey={(data) => data.type}
                columns={Columns}
                dataSource={logs}
                showHeader={false}
                pagination={false}
            />

            <Modal
                title={'Import Data Into ' +typeName[sEntity['type']]}
                maskClosable={false}
                centered
                visible={sEntity['visible']}
                onOk={Importing}
                okText={'Import'}
                onCancel={()=> setsEntity({visible: false, type: null, loading: false})}
                width={540}
                confirmLoading={sEntity['loading']}
                destroyOnClose
            >  
                <div>
                    <Dragger 
                        name= "file"
                        multiple={false}
                        maxCount={1}
                        listType= "picture"
                        className="upload-list-inline"
                        customRequest={handleUpload}
                        onRemove= {()=>setFileList([])}
                        fileList={fileList}
                    >
                        <Empty image={fileList.length > 0 ? Empty.PRESENTED_IMAGE_DEFAULT: Empty.PRESENTED_IMAGE_SIMPLE}
                            description={ <p className="import-empty">Click or drag file to this area to upload</p> }
                        />
                        {/* </Empty> */}
                    </Dragger>
                </div>
            </Modal>

        </div>
    )
}
export default  ImportExport 