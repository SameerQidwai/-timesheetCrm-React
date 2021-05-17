import React, { Component } from "react";

import { Row, Col, Table, Modal, Input, Button, Select, Typography, Popconfirm, DatePicker, Space, Tag, } from "antd";
import { CloseCircleOutlined, CheckOutlined, SaveOutlined, LoadingOutlined } from "@ant-design/icons"; //Icons
import moment from "moment";
import TimeModal from "./Modals/TimeModal"
import {  getList, reviewTimeSheet } from "../../service/timesheet"
import { getProjects } from "../../service/constant-Apis";
import "../styles/table.css";

const { Title } = Typography;
//inTable insert

class TimeSheet extends Component {
    constructor() {
        super();
        this.dynamoForm = React.createRef();

        this.state = {
            isVisible: false,
            proVisible: false,
            sheetDates: {
                startDate: moment().startOf("month"), 
                endDate: moment().endOf("month"),
                cMonth: moment().format('MM-YYYY')
            },
            timeObj: false,
            editTime: false,
            loading: false,
            data: [
                {
                    prjoectId: 1,
                    project: "Project 1",
                    status : 'SB',
                    '1/5': {
                        startTime: "09:22",
                        endTime: "22:02",
                        breakHours: "2",
                        notes: 'sameer'
                    },
                    '2/5': {
                        startTime: "10:00",
                        endTime: "20:00",
                        breakHours: "4",
                    },
                    '3/5': {
                        startTime: "11:22",
                        endTime: "13:11",
                        breakHours: "5",
                    },
                    '4/5': {
                        startTime: "16:20",
                        endTime: "17:10",
                        breakHours: "18",
                    },
                    '5/5': {
                        startTime: "02:23",
                        endTime: "14:23",
                        breakHours: "5",
                    },
                    '6/5': {
                        start: "15:05",
                        end: "20:1",
                        breakHours: "1",
                    },
                },
                {
                    prjoectIdprjoectId: 2,
                    project: "Project 2",
                    status : 'AP',
                    1: {
                        start: "10:00",
                        end: "20:00",
                        break: "4",
                    },
                },
                {
                    prjoectId: 3,
                    project: "Project 3",
                    status : 'RJ',
                    3: {
                        start: "15:05",
                        end: "20:1",
                        break: "1",
                    },
                },
                {
                    prjoectId: 4,
                    status : 'SV',
                    project: "Project 4",
                },
            ],
            comments: null,
            sProject: {},
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
                        <Row >
                            <Col span={24}>
                                {value} 
                            </Col>
                            {record.status === 'SV' || record.status === 'RJ' ?<Col sapn={12}>
                                <Popconfirm
                                    title={`You want to submit ${value}'s timesheet?`}
                                    onConfirm={()=>{this.reviewTimeSheet(record.projectEntryId, 'submit', index, 'SB')}}
                                >
                                    <Button style={{backgroundColor: "#4CAF50"}} size="small" type="primary"> Submit </Button>
                                </Popconfirm>
                            </Col> : 
                            record.status === 'SB' &&
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
            ]
        };
    }

    componentDidMount = () => {
        this.getSheet()
        this.getProjects()        
    };
    getProjects = () =>{
        getProjects().then(res=>{
            if(res.success){
                this.setState({
                    projects: res.data
                })
            }
        })

    }

    getSheet = () =>{
        const { startDate, endDate } = this.state.sheetDates
        getList({userId:1, startDate: startDate.format('DD-MM-YYYY'), endDate: endDate.format('DD-MM-YYYY')}).then(res=>{
            if (res.success){
                this.setState({
                    timesheet: res.success && res.data,
                    data: res.data ? res.data.projects: []
                })
            }
        })
        this.columns(startDate, endDate)
    }

    columns = (startDate, endDate) =>{
        let { columns }  = this.state
        let date = undefined
        let key = undefined
        columns = [columns[0]]
        for (let i = startDate.format('D') ; i <= endDate.format('D'); i++) {
            date = date ?? moment(startDate.format())
            key = date.format('D/M')
            columns.push({
                title: <span>
                    <div>{date.format('ddd')}</div>
                    <div> {date.format('DD MMM')} </div>
                </span>,
                dataIndex: date.format('D/M'),
                width: 200,
                editable: true,
                align: "center",
                render: (value, record, rowIndex) =>
                    value && (
                        <Row style={{ border: "1px solid" }}>
                            <Col span={24}>Start Time: {value["startTime"]}</Col>
                            <Col span={24}>End Time: {value["endTime"]}</Col>
                            <Col span={24}>Break: {value["breakHours"]}</Col>
                        </Row>
                    ),
            })
            date = date.add(1, 'days')
        }
        this.setState({columns},()=> {
            const columns = this.state.columns.map(col => { // when creating column onCell key is not render at that time and is async function so had to call it again 
                if (col.dataIndex === 'project'){
                    return col
                }
                return {
                  ...col,
                  onCell: (record: DataType, rowIndex) => ({
                    record,
                    // dataIndex: col.dataIndex,
                    onDoubleClick: (event) => {
                        // on Click Function
                        this.getRecord(record,rowIndex, col.dataIndex); // call function to save data in
                    },
                  }),
                };
            })
            this.setState({columns})
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
        console.log(timeObj);
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
        const query= {pEntryId: id, userId:1, startDate: startDate.format('DD-MM-YYYY'), endDate: endDate.format('DD-MM-YYYY')}
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

    commentSec = (e) => {
        this.setState({
            comments: e.target.value,
        });
    };

    render() {
        const { loading, data, isVisible, proVisible, columns, editTime, timeObj, sheetDates, projects, sProject } = this.state
        return (
            <>
                <Row justify="space-between">
                    <Col>
                        <Title>Timesheet</Title>
                    </Col>
                    <Col>
                        <DatePicker
                            size="large"
                            mode="month"
                            picker="month"
                            format="MMM-YYYY"
                            onChange={(value)=>{
                                console.log(value);
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
                              this.setState({proVisible: true})
                            }}
                        >
                            Add Project
                        </Button>
                    </Col>
                </Row>
                <Table
                    columns={columns}
                    size="small"
                    scroll={{
                        // x: "calc(700px + 100%)",
                        x: "'max-content'",
                    }}
                    // scroll={{ x: "calc(700px + 100%)", y: "" }}
                    // footer={() => "Footer"}
                    rowKey={data=>data.projectId}
                    bordered
                    pagination={false}
                    dataSource={data}
                    className="timeSheet-table"
                />
                {isVisible && (
                    <TimeModal
                        visible={isVisible}
                        timeObj={timeObj}
                        editTime={editTime}
                        sheetDates={sheetDates}
                        close={()=>this.setState({isVisible: false, editTime: false})}
                        callBack={this.callBack}
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
                            console.log(data, sProject);
                            data.push({
                                projectId: sProject.value,
                                project: sProject.label,
                            })
                            this.setState({ proVisible: false, data: [...data], sProject:{} },()=>{
                                console.log(this.state.data)
                            });
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
                                        // console.log(option.label)
                                        // console.log(input.toLowerCase())
                                    }
                                    onSelect={(value, option)=>{
                                        console.log(this.state.data)
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
