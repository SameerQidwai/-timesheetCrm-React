import React, { Component } from "react";
import { Row, Col, Table, Button, Select, Typography, Modal, DatePicker, Space, Tag, Tooltip, Input, Form} from "antd";
import { DownloadOutlined, SaveOutlined, ExclamationCircleOutlined, PaperClipOutlined, CheckCircleOutlined } from "@ant-design/icons"; //Icons
import moment from "moment";
import AttachModal from "./Modals/AttachModal";
import {  getList, reviewTimeSheet, getMilestones, getUsersTimesheet  } from "../../service/timesheet"
import { Api, localStore, R_STATUS, STATUS_COLOR } from "../../service/constant";

import "../styles/table.css";
import "../styles/button.css";
import TimeSheetPDF from "./Modals/TimeSheetPDF";

const { Title, Link, Text } = Typography;
//inTable insert

let modal = ""

class TimeSheetProject extends Component {
    constructor() {
        super();
        this.state = {
            isAttach: false,
            sheetDates: {
                startDate: moment().startOf("month"), 
                endDate: moment().endOf("month"),
                cMonth: moment()
            },
            timeObj: false,
            eData: [],
            sMilestone: null,
            loginId: null,
            data: [ ],
            permissions: {},
            canApprove: false,
            milestones: [], // users Time Sheet
            actionNotes: '',
            sTimesheet: { // selected timesheets 
                timesheet: [], //  Timesheets Object 
                keys: [] // TimeSheets key
            },

            columns : [
                {
                    title: "Employee",
                    dataIndex: "user",
                    key: "user",
                    fixed: "left",
                    width: 300,
                    style:{height: 110},
                    render: (value, record, index) => (
                        <Row gutter={[0, 10]} style={{height: 90}}>
                            <Col span={24}>
                                <Row justify="space-between">
                                    <Col span={20}> {`${value}`} </Col>
                                     <Col style={{marginLeft: 'auto'}}> 
                                     <Tooltip 
                                            placement="top"
                                            title="Export"
                                            destroyTooltipOnHide
                                        >
                                            <DownloadOutlined onClick={()=>{this.exporPDF([record.milestoneEntryId], index)}}/>
                                        </Tooltip>
                                        <span className={record.status === 'AP' ? 'disabledanticon' : 'anticon'}>  
                                            <Tooltip 
                                                placement="top"
                                                title="Upload"
                                                destroyTooltipOnHide
                                            >
                                                <SaveOutlined disabled={record.status === 'AP'}  
                                                    onClick={()=>{this.openAttachModal(record, index)} }
                                                    style={{color: '#1890ff', marginLeft:10}}
                                                />
                                            </Tooltip>
                                        </span>
                                    </Col>
                                </Row>
                            </Col>
                            <Col span={24}>
                                <Row justify="space-between">
                                    {record.attachment &&<Col span={18}>
                                            <Link
                                                href={`${Api}/files/${record.attachment.uid}`}
                                                download={record.attachment.name}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <PaperClipOutlined /> {" "}
                                                    <Tooltip 
                                                        placement="top" 
                                                        title={record.attachment.name}
                                                        destroyTooltipOnHide
                                                    >
                                                        {`${record.attachment.name.substr(0,23)}${record.attachment.name.length>22 ?'\u2026':''}`}
                                                    </Tooltip>
                                            </Link>
                                            </Col>}
                                    <Col span={5} style={{marginLeft:'auto', marginRight: 5}}>
                                    <Tooltip 
                                        placement="top" 
                                        title={record.actionNotes}
                                        destroyTooltipOnHide
                                    >
                                        <Tag color={STATUS_COLOR[record.status]}> {R_STATUS[record.status]} </Tag>
                                    </Tooltip>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    ),
                },
                {
                    title: "Total",
                    dataIndex: "totalHours",
                    key: "totalHours",
                    fixed: "left",
                    align: "center",
                    width: 100,
                    render: (value) => (value&& value.toFixed(2))
                }
            ]
        };
    }

    componentDidMount = () => {
        this.fetchAll()
    };

    fetchAll = () =>{
        Promise.all([ getMilestones() ])
        .then(res => {
            let value = 0
            const { id, permissions } = localStore()
            const loginId = parseInt(id)
            const { TIMESHEETS } = JSON.parse(permissions)

            if(res[0].success && res[0].data.length>0){
                value = res[0].data[0].value
                res[0].data.forEach(el=>{
                    if(el.value === loginId){
                        value= el.value
                    }
                }) 
            }

            this.setState({
                milestones: res[0].success? res[0].data : [],
                canApprove: TIMESHEETS['APPROVAL'] && TIMESHEETS['APPROVAL']['ANY'],
                loginId,
            },()=>{
                this.columns() 
                if(this.state.sMilestone){
                    this.getSheet()
                }
            })
            
        })
        .catch(e => {
            console.log(e);
        })
    }

    getSheet = () =>{
        const { sMilestone } = this.state
        const { startDate, endDate } = this.state.sheetDates
        if(sMilestone){
            getUsersTimesheet({mileId: sMilestone, startDate: startDate.format('DD-MM-YYYY'), endDate: endDate.format('DD-MM-YYYY')}).then(res=>{
                this.setState({
                    // timesheet: res.success ? res.data: {},
                    data: (res.success && res.data) ? res.data?? []: [],
                    sTimesheet: { // selected timesheet 
                        timesheet: [], //  Timesheet Object 
                        keys: [] // TimeSheet keys
                    },
                })
            })
        }
        this.columns()
    }

    columns = () =>{
        const { startDate, endDate } = this.state.sheetDates
        let { columns }  = this.state
        let date = undefined
        columns = [columns[0],columns[1]]
        for (let i = startDate.format('D') ; i <= endDate.format('D'); i++) {
            date = date ?? moment(startDate.format())
            columns.push({
                title: <span>
                    <div>{date.format('ddd')}</div>
                    <div> {date.format('DD MMM')} </div>
                </span>,
                heading: <span>{date.format('dddd - DD MM YYYY')}</span>,
                dataIndex: date.format('D/M'),
                key: date.format('D/M'),
                width: 200,
                editable: true,
                align: "center",
                render: (value, record, rowIndex) =>{
                    if(value){
                        let breakHours = moment.duration(value["breakHours"],'hours')
                        breakHours = breakHours && moment(moment().hours(breakHours.hours()).minutes(breakHours.minutes())).format("HH:mm")
                    {return <Tooltip title={value['notes'] && `Note: ${value['notes'] }`} ><Row style={{ border: "1px solid" }}>
                            <Col span={24}>Start Time: {value["startTime"]&& moment(value["startTime"], ["HH:mm"]).format("h:mm A")}</Col>
                            <Col span={24}>End Time: {value["endTime"] && moment(value["endTime"], ["HH:mm"]).format("h:mm A")}</Col>
                            <Col span={24}>Break: {breakHours && breakHours}</Col>
                            <Col span={24}>Total Hours: {value["actualHours"] && value["actualHours"]}</Col>
                        </Row> </Tooltip>}
                    }
                },
            })
            date = date.add(1, 'days')
        }
        this.setState({columns})
    }
  
    reviewTimeSheet = (id, stage, index, key) => {
        const { startDate, endDate } = this.state.sheetDates
        const { sMilestone } = this.state
        const query= { pEntryId: id, userId: sMilestone, startDate: startDate.format('DD-MM-YYYY'), endDate: endDate.format('DD-MM-YYYY') }
        reviewTimeSheet(query, stage).then(res=>{
            const { data } = this.state
            data[index].status= key
            if(res.success){
                this.setState({
                    data,
                })
            }
        })
    };

    actionTimeSheet = (stage, notes) => {
        const { startDate, endDate } = this.state.sheetDates
        const { keys } = this.state.sTimesheet
        const { sMilestone } = this.state
        const query= { userId: sMilestone, startDate: startDate.format('DD-MM-YYYY'), endDate: endDate.format('DD-MM-YYYY') }
        const data = {milestoneEntries: keys, note: notes}
        reviewTimeSheet(query, stage, data).then(res=>{
            this.getSheet()
        })
    };

    openAttachModal = (record, index) =>{
        console.log(record, index);
        let timeObj = {}
        if(index >= 0){
            timeObj = {
                milestoneEntryId: [record.milestoneEntryId],
                milestoneId: record.milestoneId,
                notes: record.notes,
                milestone: record.milestone,
                status: record.status,
                rowIndex: index
            }
        }else{
            const {keys, timesheet} = this.state.sTimesheet
            timeObj = {
                milestoneEntryId: keys,
                milestoneId: timesheet[0].milestoneId,
                notes: timesheet[0].notes,
                milestone: timesheet[0].milestone,
                status: false,
            }
        }
        this.setState({ timeObj, isAttach: true})
    }

    exporPDF = (entryIds) =>{
        console.log(entryIds);
        this.setState({
            eData:  entryIds,
            isDownload: true
        })   
    }

    summaryFooter = (data) =>{
        const { columns } = this.state
        if(data.length>0)
        return (
            <Table.Summary fixed="top">
                <Table.Summary.Row>
                    {/* //multiple select commented */}
                    <Table.Summary.Cell  index={0}> </Table.Summary.Cell> 
                    {columns.map(({key, dateObj}, kIndex)=>{
                        let value = 0
                        data.map((rowData, index) =>{
                            if(key !== 'user' ){
                                if(key === 'totalHours'){
                                    value += data[index]['totalHours'] ?? 0
                                }else{
                                    value += (rowData[key] ? rowData[key]['actualHours'] :0)
                                }
                            }
                        })
                        return key === 'user' ? <Table.Summary.Cell index={kIndex+1} key={kIndex+1}>
                            Total Work In A day  
                        </Table.Summary.Cell > 
                        : // show total and normal background if the column month is same as selected month or the key is totalHours of the month
                        <Table.Summary.Cell 
                            index={kIndex+1}
                            key={kIndex+1}
                            align="center" 
                        >
                            {value && value.toFixed(2)}
                        </Table.Summary.Cell>
                    })}
                </Table.Summary.Row>
            </Table.Summary>
        )
    }
    
    highlightRow(record) {
        // const { status } = record
        // if (status === 'SB'){
        //     return 'submitClass'
        // }else if(status === 'AP'){
        //     return 'approveClass'
        // }else if(status === 'RJ'){
        //     return 'rejectClass'        
        // }
    }

    milestoneSelect = (selectedRowKeys, selectedRows)=>{
        this.setState({
            sTimesheet: {
                timesheet: selectedRows,
                keys: selectedRowKeys,
            }
        })
    }

    onActionFinished = (notes, stage) => {
        this.actionTimeSheet(stage, notes) 
        modal.destroy();
    }

    multiAction = (stage)=> {
        const { cMonth } = this.state.sheetDates
        let content = stage !== 'Delete' ? <Row>
            <Col span="24">
                <Title level={5}>Notes</Title>
            </Col>
            <Col span="24">
                <Form  id={'my-form' } onFinish={(value)=> this.onActionFinished(value, stage)} >
                    <Form.Item noStyle name={'notes'} >
                        <Input.TextArea
                            placeholder="Enter Your Notes...."
                            autoSize={{ minRows: 3, maxRows: 10 }}
                            allowClear
                        />
                        </Form.Item>
                </Form>
            </Col>
        </Row> : ''
        modal = Modal.confirm({
          title: `${stage} Timesheet For the month of ${cMonth.format('MMM YYYY')}`,
          width: 520,
          icon: stage=== 'Reject' ? <ExclamationCircleOutlined /> : <CheckCircleOutlined />,
          content: content,
          okButtonProps: {danger: stage === 'Delete'??true, htmlType: 'submit', form: 'my-form'  },
          okText: 'Okay',
          cancelText: 'Cancel',
        });
    }

    attachCallBack = (res) =>{ 
        const {data, timeObj } = this.state
        const {rowIndex} = timeObj
        if(rowIndex >= 0 ){
            data[rowIndex].notes = res.notes
            data[rowIndex].attachment = res.attachment
            this.setState({data, isAttach: false, editTime: false, timeObj: false})
        }else{
            this.getSheet()
        }
    }

    render() {
        const {  data,   columns,  timeObj,  milestones, sMilestone, isAttach, isDownload, eData, sTimesheet } = this.state
        return (
            <>
                <Row justify="space-between" >
                    <Col>
                        <Title level={3}>Approval</Title>
                    </Col>
                    <Col  >
                        <Select
                            placeholder="Select Project"
                            style={{ width: 300 }}
                            options={milestones}
                            value={sMilestone}           
                            showSearch
                            optionFilterProp={["label", "value"]}
                            filterOption={
                                (input, option) =>{
                                    const label = option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    const value = option.value.toString().toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        return label || value
                                }
                            }
                            onSelect={(value, option)=>{
                                this.setState({
                                    sMilestone: value
                                },()=>{

                                    this.getSheet()
                                })
                            }}
                        />
                    </Col>
                    <Col >
                        <DatePicker
                            mode="month"
                            picker="month"
                            format="MMM-YYYY"
                            onChange={(value)=>{
                                this.setState({
                                    sheetDates : {
                                        cMonth: value ?? moment(),
                                        startDate: moment(value ?? moment()).startOf("month"),
                                        endDate: moment(value ?? moment()).endOf("month")
                                    }
                                },()=>{

                                    this.getSheet()
                                })
                            }}
                            defaultValue={moment()}
                        />
                    </Col>
                </Row>
                <Table
                    sticky
                    size="small"
                    style={{maxHeight: 'fit-content'}}
                    className="timeSheet-table"
                    rowSelection={{ //multiple select commented
                        selectedRowKeys: sTimesheet.keys,
                        fixed:true,
                        onChange:(selectedRowKeys, selectedRows)=>{this.milestoneSelect(selectedRowKeys, selectedRows )},
                        getCheckboxProps: (record) => ({
                            disabled: record.timesheetStatus === 'SV' || record.timesheetStatus === 'AP' ||record.timesheetStatus === 'NC', // Column configuration not to be checked
                          }),
                    }}
                    scroll={{
                        // x: "calc(700px + 100%)",
                        x: "'max-content'",
                    }}
                    bordered
                    pagination={false}
                    rowKey={'milestoneEntryId'}
                    // rowClassName={(record) => this.highlightRow(record)}
                    columns={columns}
                    dataSource={[...data]}
                    summary={ columnData => this.summaryFooter(columnData)}
                />
                <Row justify="end" gutter={[20,200]}>
                    <Col>
                        <Button 
                            disabled={ sTimesheet.keys.length<1 || sTimesheet.approved|| sTimesheet.rejected}
                            onClick={()=>this.openAttachModal()}
                        >
                            Import
                        </Button>
                    </Col>
                    <Col>
                        <Button 
                            type="primary" 
                            disabled={ sTimesheet.keys.length<1}
                            onClick={()=>{this.exporPDF(sTimesheet.keys)}}
                        >
                            Export
                        </Button>
                    </Col>
                    <Col>
                        <Button 
                            type="primary" 
                            danger
                            disabled={ sTimesheet.keys.length<1 || sTimesheet.rejected}
                            onClick={()=>this.multiAction('Reject')}
                        > 
                            Reject
                        </Button>
                    </Col>
                    <Col>
                        <Button
                            className={'success'}
                            disabled={ sTimesheet.keys.length<1 || sTimesheet.approved}
                            onClick={()=> this.multiAction('Approve') }
                        >
                            Approval
                        </Button>
                    </Col>
                </Row>
                {isAttach && (
                    <AttachModal
                        visible={isAttach}
                        timeObj={timeObj}
                        callBack={this.attachCallBack}
                        close={()=>this.setState({isAttach: false, timeObj: false})}
                    />
                )}
                {isDownload && (
                    <TimeSheetPDF
                        milestoneEntryId={eData}
                        close={()=>this.setState({isDownload: false})}
                    />
                )}
            </>
        );
    }
}

export default TimeSheetProject;
