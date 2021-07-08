import React, { Component } from "react";
import { Row, Col, Table, Modal, Input, Button, Select, Typography, Popconfirm, DatePicker, Space, Tag, Tooltip} from "antd";
import { CloseCircleOutlined, DownloadOutlined, SaveOutlined, LoadingOutlined } from "@ant-design/icons"; //Icons
import moment from "moment";
import TimeModal from "./Modals/TimeModal"
import AttachModal from "./Modals/AttachModal";
import ExportToExcel from '../../components/Core/ExportToExcel'
import {  getList, reviewTimeSheet, getUsers,  } from "../../service/timesheet"
import { getProjects } from "../../service/constant-Apis";
import "../styles/table.css";
import { localStore } from "../../service/constant";

const { Title } = Typography;
//inTable insert

class TimeSheet extends Component {
    constructor() {
        super();
        this.dynamoForm = React.createRef();

        this.state = {
            isVisible: false,
            proVisible: false,
            isAttach: false,
            sheetDates: {
                startDate: moment().startOf("month"), 
                endDate: moment().endOf("month"),
                cMonth: moment().format('MM-YYYY')
            },
            timeObj: false,
            editTime: false,
            loading: false,
            eData: [],
            USERS:[],
            sUser: null,
            data: [ ],
            comments: null,
            sProject: {},
            permissions: {},
            projects: [],
            FormFields: {
                // Add new Time break and table in time-sheet
                formId: "time_form",
                justify: "center",
                FormCol: 24,
                FieldSpace: { xs: 12, sm: 16, md: 122 },
                // layout: { labelCol: { span: 8 } },
                FormLayout: "inline",
                size: "small",
                fields: [
                    {
                        object: "obj",
                        fieldCol: 8,
                        // layout: { labelCol: { span: 4 }, wrapperCol: { span: 0 } },
                        key: "start",
                        label: "Strat",
                        labelAlign: "right",
                        type: "TimePicker",
                        size: "small",
                        showTime: "hh:mm a",
                    },
                    {
                        object: "obj",
                        fieldCol: 8,
                        // layout: { labelCol: { span: 4 }, wrapperCol: { span: 0 } },
                        key: "end",
                        label: "End",
                        labelAlign: "right",
                        type: "TimePicker",
                        size: "small",
                        showTime: "hh:mm a",
                    },
                    {
                        object: "obj",
                        fieldCol: 6,
                        // labelCol: { span: 4 },
                        key: "break",
                        label: "Break",
                        labelAlign: "right",
                        type: "InputNumber",
                        size: "small",
                    },
                    {
                        object: "obj",
                        fieldCol: 24,
                        // labelCol: { span: 4 },
                        style: {
                            marginTop: "2%",
                        },
                        mode: { minRows: 1, maxRows: 3 },
                        key: "notes",
                        label: "notes",
                        labelAlign: "right",
                        type: "Textarea",
                        size: "small",
                    },
                ],
            },

            columns : [
                {
                    title: "Project",
                    dataIndex: "project",
                    key: "project",
                    fixed: "left",
                    width: 300,
                    render: (value, record, index) => (
                        <Row gutter={[0, 10]}>
                            <Col span={24}>
                                <Row justify="space-between">
                                    <Col> {value} </Col>
                                    {/* {(record.status === 'SV' || record.status === 'RJ') && */}
                                     <Col> 
                                        <DownloadOutlined onClick={()=>{this.exportData(record, index)}}/>
                                        <SaveOutlined onClick={()=>{this.openAttachModal(record, index)} } style={{color: '#1890ff', marginLeft:10}}/>
                                    </Col>
                                    {/* } */}
                                </Row>
                            </Col>
                            {this.state && this.state.sUser === parseInt(localStore().id) && (record.status === 'SV' || record.status === 'RJ') ?<Col sapn={12}>
                                <Popconfirm
                                    title={`You want to submit ${value}'s timesheet?`}
                                    onConfirm={()=>{this.reviewTimeSheet(record.projectEntryId, 'submit', index, 'SB')}}
                                >
                                    <Button style={{backgroundColor: "#4CAF50"}} size="small" type="primary"> Submit </Button>
                                </Popconfirm>
                            </Col> : 
                            (record.status === 'SB' && record.isManaged) &&
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
        // this.columns()
    };

    fetchAll = () =>{
        Promise.all([ getUsers()])
        .then(res => {
            let value = 0
            if(res[0].success && res[0].data.length>0){
                value = res[0].data[0].value
                res[0].data.forEach(el=>{
                    if(el.value ===parseInt(localStore().id)){
                        value= el.value 
                    }
                }) 
            }

            this.setState({
                USERS: res[0].success? res[0].data : [],
                sUser: value
                // USERS: res[1].success? res[1].data : [],
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

    getProjects = (value) =>{
        getProjects(value).then(res=>{
            if(res.success){
                this.setState({
                    projects: res.data
                })
            }
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
        let key = undefined
        columns = [columns[0],columns[1]]
        for (let i = startDate.format('D') ; i <= endDate.format('D'); i++) {
            date = date ?? moment(startDate.format())
            columns.push({
                title: <span>
                    <div>{date.format('ddd')}</div>
                    <div> {date.format('DD MMM')} </div>
                </span>,
                dataIndex: date.format('D/M'),
                key: date.format('D/M'),
                width: 200,
                editable: true,
                align: "center",
                render: (value, record, rowIndex) =>{
                    if(value){
                    // let duration = moment.duration(value["actualHours"],'hours')
                    // <Col span={24}>Total: {`${duration.hours()}:${duration.minutes()}`}</Col>
                    {return <Tooltip title={`Note: ${value['notes']}`}><Row style={{ border: "1px solid" }}>
                            <Col span={24}>Start Time: {value["startTime"]}</Col>
                            <Col span={24}>End Time: {value["endTime"]}</Col>
                            <Col span={24}>Break: {value["breakHours"]}</Col>
                            <Col span={24}>Total Hours: {value["actualHours"] && value["actualHours"].toFixed(2)}</Col>
                        </Row> </Tooltip>}
                    }
                },
            })
            date = date.add(1, 'days')
        }
        this.setState({columns},()=> {
            const columns = this.state.columns.map(col => { // when creating column onCell key is not render at that time and is async function so had to call it again 
                if (col.dataIndex === 'project' || col.dataIndex === 'totalHours'){
                    return col
                }
                return {
                  ...col,
                  onCell: (record: DataType, rowIndex) => ({
                    record,
                    // dataIndex: col.dataIndex,
                    onDoubleClick: (event) => {
                        // on Click Function
                        const { sUser } = this.state
                        const clickable = (record.status === 'SV' || record.status === 'RJ' || !record.status) && sUser === parseInt(localStore().id)
                        if (clickable ){
                            this.getRecord(record,rowIndex, col.dataIndex); // call function to save data in
                        }
                    },
                  }),
                };
            })
            this.setState({ columns })
        })
    }

    getRecord = (record, rowIndex, colKey) => {
        // get record in dialog box for edit
        const timeObj= {
            projectEntryId: record.projectEntryId,
            projectId: record.projectId,
            project: record.project,
            row: rowIndex,
            col: colKey 
        }
        if (record[colKey]) {
            
            let obj = {
                entryId: record[colKey].entryId,
                startTime: moment(record[colKey].startTime, "HH:mm")._isValid
                    ? moment(record[colKey].startTime, "HH:mm")
                    : null,
                endTime: moment(record[colKey].endTime, "HH:mm")._isValid
                    ? moment(record[colKey].endTime, "HH:mm")
                    : null,
                breakHours: record[colKey].breakHours && record[colKey].breakHours,
                notes: record[colKey].notes && record[colKey].notes,
            };
            this.setState({
                isVisible: true,
                editTime: obj,
                timeObj,
            });
        } else {
            this.setState({
                isVisible: true,
                editTime: false,
                timeObj,
            });
        }
    };

    delRow(dataIndex) {
        const data = this.state.data.filter(function (obj, index) {
            return index != dataIndex;
        });

        this.setState({ data: data });
    }

    callBack = (value) => {
        // value = value.obj;
        const { data, timeObj }= this.state
        const { row, col } = timeObj
        value.entryId = value.id
        data[row][col] = value

        this.setState({
            data: data,
            timeObj: false,
            isVisible: false,
            editTime: false
        });
    };

    saveTime = () => {
        const { comments, data } = this.state;

        console.log(comments, data);
    };

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

    exportData = (record) =>{
        const { startDate, endDate } = this.state.sheetDates
      
        let columns= [
            { title: "Project Name:"},//pixels width 
            { title: record.project},//pixels width 
        ]
        let data= [
            [
                {value: 'Date:'},
                {value: moment().format('DD-MMM-YYYY')}
            ],
            [{xSteps: 1},],
            [
                {value: "Date", style: {font: {bold: true}}},
                {value: "Start Time ", style: {font: {bold: true}}},
                {value: "end Time", style: {font: {bold: true}}},
                {value: "Break", style: {font: {bold: true}}},
                {value: "Total Hours", style: {font: {bold: true}}},
            ],
        ]
        let date = undefined
        let key = undefined
        for (let i = startDate.format('D') ; i <= endDate.format('D'); i++) {
            date = date ?? moment(startDate.format())
            key = date.format('D/M')
            data.push(
                record[key] ? [
                    {value: date.format('DD-MMM-YYYY')},
                    {value: record[key].startTime},
                    {value: record[key].endTime},
                    {value: record[key].breakHours},
                    {value: record[key].actualHours},
                ]: 
                [
                    {value: date.format('DD-MMM-YYYY')},
                ]
            )
            date = date.add(1, 'days')
        }
        this.setState({
            eData: [{columns, data}],
            isDownload: true
        })        
    }

    commentSec = (e) => {
        this.setState({
            comments: e.target.value,
        });
    };
    
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
                        // let duration = moment.duration(value,'hours')
                        // return <Table.Summary.Cell align="center">{`${duration.hours()}:${duration.minutes()}`}</Table.Summary.Cell>
                        return <Table.Summary.Cell align="center">{value && value.toFixed(2)}</Table.Summary.Cell>
                    }
                })}
        </Table.Summary.Row>)
    }

    render() {
        const { loading, data, isVisible, proVisible, columns, editTime, timeObj, sheetDates, projects, sProject, isAttach, isDownload, eData, USERS, sUser } = this.state
        return (
            <>
                <Row justify="space-between">
                    <Col>
                        <Title>Timesheet</Title>
                    </Col>
                    <Col style={{ width: 200 }}>
                        <Select
                            size="large"
                            placeholder="Select User"
                            options={USERS}
                            value={sUser}           
                            optionFilterProp={["label", "value"]}
                            style={{ width: 200 }}
                            filterOption={
                                (input, option) =>{
                                    const label = option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    const value = option.value.toString().toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        return label || value
                                }
                            }
                            onSelect={(value, option)=>{
                                this.setState({
                                    sUser: value
                                },()=>{
                                    this.getSheet()
                                })
                            }}
                        />
                    </Col>
                    <Col>
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
                    <Col>
                        <Button
                            size="small"
                            type="primary"
                            onClick={() => {
                                this.getProjects(sUser)
                                this.setState({proVisible: true}) 
                            }}
                        >
                            Add Project
                        </Button>
                    </Col>
                </Row>
                <Table
                    size="small"
                    className="timeSheet-table"
                    scroll={{
                        // x: "calc(700px + 100%)",
                        x: "'max-content'",
                    }}
                    // scroll={{ x: "calc(700px + 100%)", y: "" }}
                    bordered
                    pagination={false}
                    rowKey={data=>data.projectId}
                    columns={columns}
                    dataSource={data}
                    summary={ columnData => this.summaryFooter(columnData)}
                />
                {isVisible && (
                    <TimeModal
                        visible={isVisible}
                        timeObj={timeObj}
                        editTime={editTime}
                        sheetDates={sheetDates}
                        user={sUser}
                        close={()=>this.setState({isVisible: false, editTime: false, timeObj: false})}
                        callBack={this.callBack}
                    />
                )}
                {isAttach && (
                    <AttachModal
                        visible={isAttach}
                        timeObj={timeObj}
                        close={()=>this.setState({isAttach: false, editTime: false, timeObj: false})}
                        // callBack={this.callBack}
                    />
                )}
                {isDownload && (
                    <ExportToExcel
                        download={isDownload}
                        close={()=>this.setState({isDownload: false, editTime: false, timeObj: false})}
                        data={eData}
                    />
                )}
                {proVisible && (
                    <Modal
                        title="Add Project"
                        maskClosable={false}
                        centered
                        visible={proVisible}
                        okButtonProps={{ disabled: loading }}
                        okText={loading ?<LoadingOutlined /> :"Add"}
                        width={500}
                        // pagination={false}
                        onCancel={() => {
                            this.setState({ proVisible: false, sProject:{} });
                        }}
                        onOk={() => {
                            const { data, sProject } = this.state
                            data.push({
                                projectId: sProject.value,
                                project: sProject.label,
                            })
                            this.setState({ proVisible: false, data: [...data], sProject:{} });
                        }}
                    >
                        <Row justify="space-around">
                            <Col span="12">
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
                        </Row>
                    </Modal>
                    
                )}
            </>
        );
    }
}

export default TimeSheet;
