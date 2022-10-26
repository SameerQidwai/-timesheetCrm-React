import React, { Component } from "react";
import {  Menu, Button, Dropdown, Table, Tag, Popconfirm, Modal, Upload, Empty, Col, Select, Row, Typography, Tooltip } from "antd";
import { SettingOutlined, PaperClipOutlined, DeleteOutlined, ExclamationCircleOutlined, CheckCircleOutlined } from "@ant-design/icons"; //Icons
import { Link } from 'react-router-dom'


import { formatDate, formatCurrency, localStore, thumbUrl, Api, STATUS_COLOR, R_STATUS } from "../../service/constant";
import { tableSorter } from "../../components/Core/Table/TableFilter";
import CertificatePdf from "./Modal/CertifcatePdf";
import { getManageProjects } from "../../service/constant-Apis";
import { getApprovalMilestones, milestoneActions, milestoneUplaodDelete, milestoneUpload } from "../../service/Milestone-Apis";
import { addFiles } from "../../service/Attachment-Apis";
import './styles.css'


class MileCertificate extends Component {
    constructor(props) {
        super(props);

        this.state = {
          infoModal: false,
          data: [{ project: 'dummy', milestoneId: 0}],
          sMile: false,
          sIndex: false,
          desc: {
            title: '',
            organization: { name: '' },
            value: '',
            startDate: '',
            endDate: '',
          },
          permissions: {},
          loading: false,
          fileList: [],
          printing: false,
          PROJECTS: [],
          sTMilestones: {milestones: [], keys:[] },
          columns: [
            {
              title: 'Project',
              dataIndex: 'projectName',
              key: 'projectName',
            //   width: '30%',
            className: 'project-column',
              render: (text, record, index) => {
                const { permissions } = this.state;
                return (
                  <Row gutter={[0, 5]} style={{ minHeight: 45.84 }}>
                    <Col span={22}>
                      <Link
                        to={{
                          pathname: `projects/${record.projectId}/info`,
                        }}
                        className="nav-link"
                      >
                        {text}
                      </Link>
                    </Col>
                    {record.fileName && (
                      <Col span={12}>
                        <Row gutter={10}>
                          <Col>
                            <a
                              href={`${Api}/files/${record.fileName}`}
                              download={record.fileName}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <PaperClipOutlined />
                              Certificate
                            </a>
                          </Col>
                          <Col>
                            <Popconfirm
                              title={'Do You Want To Delete Certificate?'}
                              onConfirm={() =>
                                this.OutcomeAction('delete-certificate', record.milestoneId)
                              }
                              okText="Yes"
                              cancelText="No"
                            >
                              <DeleteOutlined
                                className="milestone-delete"
                                disabled={
                                    record.isApproved === 'AP' ||
                                    !permissions['APPROVAL'] ||
                                    !record.phase === true
                                }
                              />
                            </Popconfirm>
                          </Col>
                        </Row>
                      </Col>
                    )}
                  </Row>
                );
              },
              ...tableSorter('projectName', 'string'),
            },
            {
              title: 'Miletsone',
              dataIndex: 'milestoneName',
              key: 'milestoneName',
              align: 'center',
              render: (text, record) => (
                <Link
                  to={{
                    pathname: `projects/${record.projectId}/milestones/${record.milestoneId}/resources`,
                  }}
                  className="nav-link"
                >
                  {text}
                </Link>
              ),
              ...tableSorter('milestoneName', 'string'),
            },
            {
              title: 'Start Date',
              dataIndex: 'startDate',
              key: 'startDate',
              align: 'center',
              render: (record) => formatDate(record, true, true),
              ...tableSorter('startDate', 'date'),
            },
            {
              title: 'End Date',
              dataIndex: 'endDate',
              key: 'endDate',
              align: 'center',
              render: (record) => formatDate(record, true, true),
              ...tableSorter('endDate', 'date'),
            },
            {
              title: 'Status',
              dataIndex: 'isApproved',
              key: 'isApproved',
              align: 'center',
              render: (text) => {
                let status = text=== '' ? 'CM':text
                  return <Tag color={STATUS_COLOR[status]}> {R_STATUS[status]}  </Tag>
              },
              ...tableSorter('isApproved', 'string', true),
            },
            {
              title: '...',
              key: 'action',
              align: 'center',
              width: '1%',
              render: (value, record, index) => {
                const { permissions, basic } = this.state;
                return (
                  <Dropdown
                    overlay={
                      <Menu>
                        <Menu.Item
                          key="Export"
                          // disabled={}
                          onClick={() =>
                            this.setState({
                              printing: true,
                              sMile: record.milestoneId,
                              sIndex: index,
                            })
                          }
                        >
                          Export
                        </Menu.Item>
                        <Menu.Item
                          key="Upload"
                          disabled={record.isApproved !== 'SB' || !record.phase === true}
                          onClick={() =>
                            this.setState({
                              infoModal: true,
                              sMile: record.milestoneId,
                              sIndex: index,
                            })
                          }
                        >
                          Upload
                        </Menu.Item>
                      </Menu>
                    }
                  >
                    <Button size="small">
                      <SettingOutlined />
                    </Button>
                  </Dropdown>
                );
              },
            },
          ],
        };
    }

    componentDidMount = ()=>{
        this.fetchAll()
        
    }
    fetchAll = () =>{
        Promise.all([ getManageProjects('PROJECTS'), getApprovalMilestones() ])
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
      getApprovalMilestones(value).then(res=>{
            if (res.success){
                this.setState({
                    data: res.data,
                    sTMilestones: {
                        milestones: [],
                        keys: []
                    }
                })
            }
        })
    }

    uploading = () =>{
        const { sMile, data, sIndex, fileList } = this.state 
        milestoneUpload(sMile, {fileId: fileList[0].fileId}).then(res=>{
            console.log(fileList[0],fileList[0].uniqueName);
            if (res.success){
                data[sIndex]['fileName'] = fileList[0].uid
                this.setState({
                    data: [...data],
                    infoModal: false, 
                    sMile: false, 
                    sIndex: false,
                    fileList : []
                })
            }
        })
    }

    OutcomeAction = (action, id) =>{
        if (action === 'delete-certificate'){
          milestoneUplaodDelete(id).then(res=>{
            if (res.success){
              // data[index]['isApproved'] = true
              this.getProjects()
            }
          })
        }else{
          let { data, sTMilestones } = this.state
          let {keys} = sTMilestones
          let obj = {milestones: keys}
          milestoneActions(`/${action}`, obj).then(res=>{
              if (res.success){
                  // data[index]['isApproved'] = true
                  this.getProjects()
              }
          })
        }
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
    multiAction = (stage)=> {
        const {milestones } = this.state.sTMilestones
        let length = milestones.length
        let content = <div>{ 
            milestones.map(({projectName, milestoneName, projectType}, index) =>(
                <div key={index}>
                    {projectName}{` (${milestoneName})` }{length -1 > index && ','  }  
                </div> 
            )) 
        }</div>
        const modal = Modal.confirm({
          title: `Do you wish to ${stage} Certificate${length >1 ? 's': ''} for`,
          icon: stage=== 'unapprove' ? <ExclamationCircleOutlined /> : <CheckCircleOutlined />,
          content: content,
          okButtonProps: {danger: stage === 'unapprove'??true},
          okText: 'Okay',
          cancelText: 'Cancel',
          onOk:()=>{
            //   this.actionTimeSheet(stage) 
              this.OutcomeAction(stage)
              modal.destroy();
          }
        });
    }

    milestoneSelect = (selectedRowKeys, selectedRows)=>{
        let cantApprove = false, cantSubmit = false, cantUnapprove = false
        selectedRows.forEach(el =>{
            if (el.isApproved !== ''){
                cantSubmit = true
            }
            if(el.isApproved !== 'SB'){
                cantApprove = true
            }
            if(el.isApproved !== 'AP'){
                cantUnapprove = true
            }
        })
        this.setState({
            sTMilestones: {
                milestones: selectedRows,
                keys: selectedRowKeys,
                cantApprove, 
                cantSubmit,
                cantUnapprove
            }
        })
    }
    

    render() {
        const { desc, infoModal, data, sMile, permissions, loading, columns, fileList, printing, PROJECTS, sTMilestones } = this.state;
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
                    rowSelection={{ //multiple select commented
                        selectedRowKeys: sTMilestones.keys,
                        onChange:(selectedRowKeys, selectedRows)=>{this.milestoneSelect(selectedRowKeys, selectedRows )},
                        getCheckboxProps: (record) => ({                                                         //checking if project is close
                            // disabled: record.isApproved === 'AP' || record.phase===false, 
                            disabled: (!permissions['UNAPPROVAL'] && record.isApproved === 'AP') || (record.phase===false),
                            // Column configuration not to be checked
                          })
                    }}
                    columns={columns}
                    dataSource={data}
                    size="small"
                    className='fs-small'
                />
                <Row justify="end" gutter={[20,200]}>
                    <Col>
                        <Button 
                            type="primary" 
                            disabled={!permissions['UPDATE'] ||sTMilestones.keys.length<1 || sTMilestones.cantSubmit}
                            onClick={()=> this.multiAction('Submit') }
                        >
                            Submit
                        </Button>
                    </Col>
                    <Col>
                        <Button
                            className={'success'}
                            disabled={ !permissions['APPROVAL'] || sTMilestones.keys.length<1 || sTMilestones.cantApprove}
                            onClick={()=> this.multiAction('approve')}
                        >
                            Approve
                        </Button>
                    </Col>
                    <Col>
                        <Button
                            className={'not-success'}
                            disabled={ !permissions['UNAPPROVAL'] || sTMilestones.keys.length<1 || sTMilestones.cantUnapprove}
                            onClick={()=> this.multiAction('unapprove')}
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
                    onCancel={()=> this.setState({infoModal: false, sMile: false, sIndex: false, loading: false, fileList : []})}
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
