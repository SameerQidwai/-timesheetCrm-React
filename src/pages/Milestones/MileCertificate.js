import React, { Component } from "react";
import {  Menu, Button, Dropdown, Table, Tag, Popconfirm, Modal, Upload, Empty, Typography } from "antd";
import { SettingOutlined } from "@ant-design/icons"; //Icons
import { Link } from 'react-router-dom'


import { formatDate, formatCurrency, localStore, thumbUrl } from "../../service/constant";
import { tableSorter } from "../../components/Core/Table/TableFilter";


class MileCertificate extends Component {
    constructor(props) {
        super(props);

        this.state = {
            infoModal: false,
            sMile: false,
            sIndex: false,
            desc: {title: '', organization: {name: ''}, value: '', startDate: '', endDate: ''},
            permissions: {},
            loading: false,
            fileList:[],
            columns: [
                {
                    title: "Project",
                    dataIndex: "project",
                    key: "project",
                    render:(text, record) => (
                        <Link
                            to={{
                                pathname:  `project/${record.projectId}/info`,
                            }}
                            className="nav-link"
                        >
                            {text}
                        </Link>
                    ),
                    ...tableSorter('title', 'string'),
                },
                {
                    title: "Miletsone",
                    dataIndex: "milestone",
                    key: "milestone",
                    render:(text, record) => (
                        <Link
                            to={{
                                pathname:  `milestones/${record.milestoneId}/resources`,
                            }}
                            className="nav-link"
                        >
                            {text}
                        </Link>
                    ),
                    ...tableSorter('title', 'string'),
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
                    title: "Approved Date",
                    dataIndex: "approvedDate",
                    key: "approvedDate",
                    render: (record) =>(formatDate(record, true, true)),
                    ...tableSorter('approvedDate', 'date'),
                },
                {
                    title: "Status",
                    dataIndex: "isApproved",
                    key: "isApproved",
                    align: "right",
                    render: (record) =>  <Tag color={record? 'green': 'volcano'} key={record}>
                        {record? 'APPROVED': 'REJECTED'}
                    </Tag>
                    
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
                                        disabled={!permissions['UPDATE']}
                                    >
                                        Export
                                    </Menu.Item>
                                    <Menu.Item
                                        key="Upload"
                                        disabled={!permissions['UPDATE']}
                                        onClick={()=> this.setState({infoModal: true, sMile: record.milestoneId, sIndex: index})}
                                    >
                                        Upload
                                    </Menu.Item>
                                    <Menu.SubMenu title={'Action'} key="Action">
                                        <Menu.Item 
                                            key="Open"
                                            disabled={!permissions['UPDATE']|| basic.phase===true}
                                            style={{color: '#6fac45'}}
                                            className="pop-confirm-menu"
                                        >
                                            <Popconfirm 
                                                disabled={!permissions['UPDATE']|| basic.phase===true}
                                                title={'Do You Want To Open this Project?'} 
                                                onConfirm={() => this.OutcomeAction('open')}
                                                okText="Yes"
                                                cancelText="No" 
                                            >
                                                <div>Approve</div>
                                            </Popconfirm>
                                        </Menu.Item>
                                        <Menu.Item 
                                            key="Close"
                                            disabled={!permissions['UPDATE']|| basic.phase===false}
                                            style={{color: '#c00505'}}
                                            className="pop-confirm-menu"
                                        >
                                            <Popconfirm 
                                                disabled={!permissions['UPDATE']|| basic.phase===false}
                                                title={'Do You Want To Close this Project?'} 
                                                onConfirm={() => this.OutcomeAction('close')}
                                                okText="Yes"
                                                cancelText="No" 
                                            >
                                                <div>Reject</div>
                                            </Popconfirm>
                                        </Menu.Item>
                                    </Menu.SubMenu>
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
    }

    uploading = () =>{
        this.setState({loading: true})
        const {fileList, sMile} = this.state
        const formData = new FormData();
        formData.append('file', fileList[0])
        // transfer('import', sMile, formData, true).then(res=>{
        //     if (res.success){
        //         this.setState({infoModal: false, sMile: false, sIndex: false, loading: false})
        //     }
        // }).catch(err =>{
        //     this.setState({loading: false})
        // })
    }

    handleUpload = option =>{
        const { file } = option;
        this.setState({ loading: true},()=>{
            file.thumbUrl = thumbUrl('pdf')
            this.setState({fileList: [file]},()=>{
                this.setState({ loading: true})
            })
        })
    }
    

    render() {
        const { desc, infoModal, data, sMile, permissions, loading, columns, fileList } = this.state;
        return (
            <>
                <Typography.Title level={3}>Milstone Approval</Typography.Title>
                <Table
                    bordered
                    pagination={{pageSize: localStore().pageSize}}
                    rowKey={(data) => data.id}
                    columns={columns}
                    dataSource={data}
                    size="small"
                    className='fs-small'
                />
                <Modal
                    title={'Upload Certifiate'}
                    maskClosable={false}
                    centered
                    visible={infoModal}
                    onOk={this.uploading}
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
            </>
        );
    }
}

export default MileCertificate;
