import React, { Component } from "react";
import { Row, Col, Table, Button, Select, Typography, Popconfirm, DatePicker, Space, Tag, Tooltip} from "antd";
import { DownloadOutlined, SaveOutlined } from "@ant-design/icons"; //Icons
import moment from "moment";
import AttachModal from "./Modals/AttachModal";
import {  getList, reviewTimeSheet  } from "../../service/timesheet"
import { getUserProjects } from "../../service/constant-Apis";
import { localStore } from "../../service/constant";

import "../styles/table.css";
import TimeSheetPDF from "./Modals/TimeSheetPDF";

const { Title } = Typography;
//inTable insert

class TimeSheetProject extends Component {
    constructor() {
        super();
        this.state = {
            isAttach: false,
            sheetDates: {
                startDate: moment().startOf("month"), 
                endDate: moment().endOf("month"),
                cMonth: moment().format('MM-YYYY')
            },
            timeObj: false,
            eData: [],
            sUser: null,
            loginId: null,
            data: [ ],
            sProject: {},
            permissions: {},
            canApprove: false,
            projects: [],
       
            columns : [
                {
                    title: "Employee",
                    dataIndex: "employee",
                    key: "employee",
                    fixed: "left",
                    width: 300,
                    render: (value, record, index) => (
                        <Row gutter={[0, 10]}>
                            <Col span={24}>
                                <Row justify="space-between">
                                    <Col> {value} </Col>
                                     <Col> 
                                        <DownloadOutlined onClick={()=>{this.exporPDF(record.projectEntryId, index)}}/>
                                        <SaveOutlined onClick={()=>{this.openAttachModal(record, index)} } style={{color: '#1890ff', marginLeft:10}}/>
                                    </Col>
                                </Row>
                            </Col>
                            {(record.status === 'SB' && (record.isManaged || this.state && this.state.canApprove)) &&
                            <Col sapn={12}>
                                <Space >
                                    <Popconfirm
                                        title={`You want to Approve ${value}'s timesheet?`}
                                        onConfirm={()=>{this.reviewTimeSheet(record.projectEntryId, 'approve', index, 'AP')}}
                                    >
                                        <Button style={{backgroundColor: "#4CAF50"}} size="small" type="primary"> Approve </Button>
                                    </Popconfirm>
                                    <Popconfirm
                                        title={`You want to Reject ${value}'s timesheet?`}
                                        onConfirm={()=>{this.reviewTimeSheet(record.projectEntryId, 'reject', index, 'RJ')}}
                                    >
                                        <Button danger  size="small" type="primary"> Reject </Button>
                                    </Popconfirm>
                                </Space>
                            </Col>}
                            <Col span={4} style={{marginLeft:'auto', marginRight: 20}}>
                                {record.status === 'SB' &&<Tag color="cyan"> Submitted </Tag>}
                                {record.status === 'AP' &&<Tag color="green"> Approved </Tag>}
                                {record.status === 'RJ' &&<Tag color="red"> Rejected </Tag>}
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
        Promise.all([ getUserProjects() ])
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
                projects: res[0].success? res[0].data : [],
                canApprove: TIMESHEETS['APPROVAL'] && TIMESHEETS['APPROVAL']['ANY'],
                loginId,
            },()=>{
                this.columns() 
                if(this.state.sUser){
                    this.getSheet()
                }
            })
            
        })
        .catch(e => {
            console.log(e);
        })
    }

    getSheet = () =>{
        const { sUser, sheetDates } = this.state
        const { startDate, endDate } = sheetDates
        if(sUser){
            getList({userId: sUser, startDate: startDate.format('DD-MM-YYYY'), endDate: endDate.format('DD-MM-YYYY')}).then(res=>{
                this.setState({
                    timesheet: res.success ? res.data: {},
                    data: (res.success && res.data) ? res.data.projects: []
                })
            })
        }
        this.columns()
    }

    columns = () =>{
        const { startDate, endDate } = this.state.sheetDates
        let { columns, permissions }  = this.state
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
                    {return <Tooltip title={`Note: ${value['notes'] ?? ''}`}><Row style={{ border: "1px solid" }}>
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
        const { sUser } = this.state
        const query= { pEntryId: id, userId: sUser, startDate: startDate.format('DD-MM-YYYY'), endDate: endDate.format('DD-MM-YYYY') }
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

    openAttachModal = (record, index) =>{
        const timeObj= {
            projectEntryId: record.projectEntryId,
            projectId: record.projectId,
            notes: record.notes,
            project: record.project,
            status: record.status,
            rowIndex: index
        }
        this.setState({ timeObj, isAttach: true })
    }

    exporPDF = (entryId) =>{
        this.setState({
            eData: entryId,
            isDownload: true
        })   
    }

    summaryFooter = (data) =>{
        const { columns } = this.state
        if(data.length>0)
        return (
            <Table.Summary.Row>
                {columns.map(({key})=>{
                    let value = 0
                    data.map((rowData, index) =>{
                        if(key !== 'project' ){
                            if(key === 'totalHours'){
                                value += data[index]['totalHours'] ?? 0
                            }else{
                                value += (rowData[key] ? rowData[key]['actualHours'] :0)
                            }
                        }
                    })
                    if(key === 'project'){
                        return <Table.Summary.Cell>Total Work In A day </Table.Summary.Cell>
                    }else{
                        return <Table.Summary.Cell align="center">{value && value.toFixed(2)}</Table.Summary.Cell>
                    }
                })}
        </Table.Summary.Row>)
    }

    render() {
        const {  data,   columns,  timeObj,  projects, sProject, isAttach, isDownload, eData } = this.state
        return (
            <>
                <Row >
                    <Col span={8}>
                        <Title>Timesheet</Title>
                    </Col>
                    <Col span={5} >
                        <Select
                            placeholder="Select Project"
                            style={{ width: 200 }}
                            options={projects}
                            value={sProject.value}           
                            optionFilterProp="label"
                            filterOption={
                                (input, option) =>
                                    option.label
                                        .toLowerCase()
                                        .indexOf(input.toLowerCase()) >= 0
                            }
                            onSelect={(value, option)=>{
                                this.setState({
                                    sProject: option
                                })
                            }}
                        />
                    </Col>
                    <Col span={5}>
                        <DatePicker
                            size="large"
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
                    size="small"
                    className="timeSheet-table"
                    scroll={{
                        // x: "calc(700px + 100%)",
                        x: "'max-content'",
                    }}
                    bordered
                    pagination={false}
                    rowKey={data=>data.projectId}
                    columns={columns}
                    dataSource={data}
                    summary={ columnData => this.summaryFooter(columnData)}
                />
                {isAttach && (
                    <AttachModal
                        visible={isAttach}
                        timeObj={timeObj}
                        close={()=>this.setState({isAttach: false, timeObj: false})}
                    />
                )}
                {isDownload && (
                    <TimeSheetPDF
                        projectEntryId={eData}
                        close={()=>this.setState({isDownload: false})}
                    />
                )}
            </>
        );
    }
}

export default TimeSheetProject;
