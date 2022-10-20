import React, { Component } from "react";
import {  Menu, Button, Dropdown, Table, Tag, Popconfirm, Modal, Upload, Empty, Col, Select, Row, Typography, Tooltip } from "antd";
import { SettingOutlined, PaperClipOutlined } from "@ant-design/icons"; //Icons
import { Link } from 'react-router-dom'


import { formatDate, formatCurrency, localStore, thumbUrl, Api } from "../../service/constant";
import { tableSorter } from "../../components/Core/Table/TableFilter";
import CertificatePdf from "./Modal/CertifcatePdf";
import { getManageProjects } from "../../service/constant-Apis";
import { milestoneActions, milestoneUpload } from "../../service/Milestone-Apis";
import { addFiles } from "../../service/Attachment-Apis";


class MileCertificate extends Component {
    constructor(props) {
        super(props);

        this.state = {
            infoModal: false,
            data: [{project: 'dummy'}],
            sMile: false,
            sIndex: false,
            desc: {title: '', organization: {name: ''}, value: '', startDate: '', endDate: ''},
            permissions: {},
            loading: false,
            fileList:[],
            printing: false,
            PROJECTS: [],
            columns: [
                {
                    title: "Project",
                    dataIndex: "projectName",
                    key: "projectName",
                    render:(text, record) => (
                        <Link
                            to={{
                                pathname:  `projects/${record.projectId}/info`,
                            }}
                            className="nav-link"
                        >
                            {text}
                        </Link>
                    ),
                    ...tableSorter('projectName', 'string'),
                },
                {
                    title: "Miletsone",
                    dataIndex: "milestoneName",
                    key: "milestoneName",
                    render:(text, record) => (
                        <Link
                            to={{
                                pathname:  `projects/${record.projectId}/milestones/${record.milestoneId}/resources`,
                            }}
                            className="nav-link"
                        >
                            {text}
                        </Link>
                    ),
                    ...tableSorter('milestoneName', 'string'),
                },
                {
                    title: "Start Date",
                    dataIndex: "startDate",
                    key: "startDate",
                    render: (record) =>(formatDate(record, true, true)),
                    ...tableSorter('startDate', 'date'),
                },
                {
                    title: "End Date",
                    dataIndex: "endDate",
                    key: "endDate",
                    render: (record) =>(formatDate(record, true, true)),
                    ...tableSorter('endDate', 'date'),
                },
                {
                    title: "Status",
                    dataIndex: "isApproved",
                    key: "isApproved",
                    render: (record) =>  record&&<Tag color={ 'green'} > APPROVED </Tag>,
                    ...tableSorter('isApproved', 'string', true),
                    
                },
                {
                    title: "Certificate",
                    dataIndex: "fileName",
                    key: "fileName",
                    render: (record) =>  record && <a   
                        href={`${Api}/files/${record}`}
                        download={record}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <PaperClipOutlined />
                        Certificate
                    </a>,
                    
                },
                {
                    title: "...",
                    key: "action",
                    align: "center",
                    width: '1%',
                    render: (value, record, index) => {
                        const { permissions, basic } = this.state
                        return <Dropdown
                            overlay={
                                <Menu>
                                    <Menu.Item
                                        key="Export"
                                        // disabled={}
                                        onClick={()=> this.setState ({printing: true, sMile: record.milestoneId, sIndex: index})}
                                    >
                                        Export
                                    </Menu.Item>
                                    <Menu.Item
                                        key="Upload"
                                        disabled={record.isApproved || !record.phase===true  }
                                        onClick={()=> this.setState({ infoModal: true, sMile: record.milestoneId, sIndex: index, })}
                                    >
                                        Upload
                                    </Menu.Item>
                                    <Menu.Item 
                                            key="Open"
                                            disabled={record.isApproved || !permissions['APPROVAL']|| !record.phase===true}
                                            style={{color: '#6fac45'}}
                                            className="pop-confirm-menu"
                                        >
                                            <Popconfirm 
                                                disabled={record.isApproved || !permissions['APPROVAL']|| !record.phase===true}
                                                title={'Do You Want To Approve this Project?'} 
                                                onConfirm={() => this.OutcomeAction(record.milestoneId, 'approve', index)}
                                                okText="Yes"
                                                cancelText="No" 
                                            >
                                                <div>Approve</div>
                                            </Popconfirm>
                                        </Menu.Item>
                                </Menu>
                            }
                        >
                            <Button size="small">
                                <SettingOutlined />
                            </Button>
                        </Dropdown>
                    },
                },
            ],
        };
    }

    componentDidMount = ()=>{
        this.fetchAll()
        
    }
    fetchAll = () =>{
        Promise.all([ getManageProjects('PROJECTS'), milestoneActions('/approvals') ])
        .then(res => {
            const { permissions } = localStore()
            const { TIMESHEETS } = JSON.parse(permissions)
            this.setState({
                PROJECTS: res[0].success? res[0].data : [],
                data: res[1].success? res[1].data : [],
                permissions: TIMESHEETS ?? {},
            })
            
        })
        .catch(e => {
            console.log(e);
        })
    }

    getProjects= (value)=>{
        let crud = `/approvals${value? ('?projectId=' + value ): ''}`
        milestoneActions(crud).then(res=>{
            if (res.success){
                this.setState({data: res.data})
            }
        })
    }

    uploading = () =>{
        const { sMile, data, sIndex, fileList } = this.state 
        console.log(fileList);
        milestoneUpload(sMile, {fileId: fileList[0].fileId}).then(res=>{
            console.log(fileList[0],fileList[0].uniqueName);
            if (res.success){
                data[sIndex]['fileName'] = fileList[0].uid
                this.setState({data: [...data], infoModal: false, sMile: false, sIndex: false})
            }
        })
    }

    OutcomeAction = (id, action, index) =>{
        let { data } = this.state
        let crud = `/${id}/${action}`
        milestoneActions(crud).then(res=>{
            if (res.success){
                data[index]['isApproved'] = true
                this.setState({data: [...data]})
            }
        })
    }

    handleUpload = option =>{
        const { file } = option
        this.setState({loading: true})
        const formData = new FormData();
        formData.append('files', file)
        addFiles(formData).then((res,err)=>{
            if (res.success){
                this.setState({
                    fileList: [res.file],
                    loading: false
                })
            }else{
                this.setState({loading: false})
                console.log("Eroor: ", err);
                const error = new Error("Some error");
            }
        })
    }
    

    render() {
        const { desc, infoModal, data, sMile, permissions, loading, columns, fileList, printing, PROJECTS } = this.state;
        return (
            <>  
            <Row >
                <Col>
                    <Typography.Title level={3}>Milestone Approval</Typography.Title>
                </Col>
                <Col offset={5}>
                    <Select
                        placeholder="Select Project"
                        style={{ width: 300 }}
                        allowClear
                        options={PROJECTS}
                        showSearch
                        optionFilterProp={["label", "value"]}
                        filterOption={
                            (input, option) =>{
                                const label = option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                const value = option.value.toString().toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    return label || value
                            }
                        }
                        onChange={(value, option)=>{ this.getProjects(value) }}
                    />
                </Col>
            </Row>
                <Table
                    bordered
                    pagination={{pageSize: localStore().pageSize}}
                    rowKey={(data) => data.milestoneId}
                    columns={columns}
                    dataSource={data}
                    size="small"
                    className='fs-small'
                />
                <Row justify="end" gutter={[20,200]}>
                    <Col>
                        <Button
                            className={'success'}
                            // disabled={ sTimesheet.keys.length<1 || !permissions['APPROVAL'] || sTimesheet.cantApprove}
                            onClick={()=> this.multiAction('Approve')}
                        >
                            Approve
                        </Button>
                    </Col>
                    <Col>
                        <Button
                            className={'not-success'}
                            // disabled={ sTimesheet.keys.length<1 || !permissions['UNAPPROVAL'] || sTimesheet.cantUnapprove}
                            onClick={()=> this.multiAction('Unapprove')}
                        >
                            Unapprove
                        </Button>
                    </Col>
                </Row>
                <Modal
                    title={'Upload Certifiate'}
                    maskClosable={false}
                    centered
                    visible={infoModal}
                    onOk={this.uploading}
                    okButtonProps={ {disabled: fileList.length === 0} }
                    okText={'Upload'}
                    onCancel={()=> this.setState({infoModal: false, sMile: false, sIndex: false, loading: false})}
                    width={540}
                    confirmLoading={loading}
                    destroyOnClose
                >  
                <div>
                    <Upload.Dragger
                        name= "file"
                        multiple={false}
                        maxCount={1}
                        listType= "picture"
                        className="upload-list-inline"
                        customRequest={this.handleUpload}
                        onRemove= {()=>this.setState({fileList : []})}
                        fileList={fileList}
                    >
                        <Empty image={fileList.length > 0 ? Empty.PRESENTED_IMAGE_DEFAULT: Empty.PRESENTED_IMAGE_SIMPLE}
                            description={ <p className="import-empty">Click or drag file to this area to upload</p> }
                        />
                    </Upload.Dragger>
                </div>
            </Modal>
            {printing && <CertificatePdf
                mileId={sMile}
                close={()=>this.setState ({printing: false, sMile: false})}

            />}
            </>
        );
    }
}

export default MileCertificate;
