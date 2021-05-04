import React, { Component } from "react";

import { Row, Col, Table, Modal, Input, Button, Select, Typography, Popconfirm, DatePicker, } from "antd";
import { CloseCircleOutlined, CheckOutlined, SaveOutlined, LoadingOutlined } from "@ant-design/icons"; //Icons
import Form from "../components/Core/Form";
import moment from "moment";
import {  getList } from "../service/timesheet"
import "./styles/table.css";

const { Title } = Typography;
//inTable insert

class TimeSheet extends Component {
    constructor() {
        super();
        this.dynamoForm = React.createRef();

        this.state = {
            isVisible: false,
            proVisible: false,
            startDate: moment().startOf("month"), 
            endDate: moment().endOf("months"),
            dataIndex: {},
            loading: false,
            data: [
                {
                    key: 1,
                    project: "Project 1",
                    '1/5': {
                        start: "09:22",
                        end: "22:02",
                        break: "2",
                    },
                    '2/5': {
                        start: "10:00",
                        end: "20:00",
                        break: "4",
                    },
                    '3/5': {
                        start: "11:22",
                        end: "13:11",
                        break: "5",
                    },
                    '4/5': {
                        start: "16:20",
                        end: "17:10",
                        break: "18",
                    },
                    '5/5': {
                        start: "02:23",
                        end: "14:23",
                        break: "5",
                    },
                    '6/5': {
                        start: "15:05",
                        end: "20:1",
                        break: "1",
                    },
                },
                {
                    key: 2,
                    project: "Project 2",
                    1: {
                        start: "10:00",
                        end: "20:00",
                        break: "4",
                    },
                },
                {
                    key: 3,
                    project: "Project 3",

                    3: {
                        start: "15:05",
                        end: "20:1",
                        break: "1",
                    },
                },
                {
                    key: 4,
                    project: "Project 4",
                },
            ],
            comments: null,

            FormFields: {
                // Add new Time break and table in time-sheet
                formId: "time_form",
                justify: "center",
                FormCol: 24,
                FieldSpace: { xs: 12, sm: 16, md: 122 },
                // layout: { labelCol: { span: 8 } },
                FormLayout: "inline",
                size: "middle",
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
                    render: (value, record, dataIndex) => (
                        <Row justify="space-between">
                            <Col span={20}>{value}</Col>
                            <Col span={3}>
                                <Row justify="space-between">
                                    <Col>
                                        <Popconfirm
                                            title="Sure to delete?"
                                            onConfirm={() => this.delRow(dataIndex)}
                                        >
                                            <CloseCircleOutlined
                                                style={{
                                                    color: "red",
                                                    fontSize: "1.2em",
                                                }}
                                            />
                                        </Popconfirm>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    ),
                },
            ]
        };
    }

    componentDidMount = () => {
        const { startDate, endDate } = this.state
        // this.Columns();
        this.columns(startDate, endDate)
    };

    columns = (startDate, endDate) =>{
        const { columns }  = this.state
        let date = undefined
        for (let i = startDate.format('D') ; i <= endDate.format('D'); i++) {
            date = date ?? startDate
            columns.push({
                title: <span>
                    <div>{date.format('ddd')}</div>
                    <div> {date.format('DD MMM')} </div>
                </span>,
                dataIndex: date.format('D/M'),
                key: date.format('D/M'),
                width: 200,
                align: "center",
                onCell: (record, rowIndex) => ({
                    // onCell
                    record, // record to print
                    onClick: (event) => {
                        // on Click Function
                        this.getRecord(record, rowIndex, date.format('D/M')); // call function to save data in
                    },
                }),
                render: (value, record, rowIndex) =>
                    value && (
                        <Row style={{ border: "1px solid" }}>
                            <Col span={24}>Start Time: {value["start"]}</Col>
                            <Col span={24}>End Time: {value["end"]}</Col>
                            <Col span={24}>Break: {value["break"]}</Col>
                        </Row>
                    )
            })
            date = date.add(1, 'days')
        }
        this.setState({columns}, ()=>{console.log(this.state.columns);})
    }


    delRow(dataIndex) {
        const data = this.state.data.filter(function (obj, index) {
            return index != dataIndex;
        });

        this.setState({ data: data });
    }

    getRecord = (data, rowIndex, colKey) => {
        // get record in dialog box for edit
        if (data[colKey]) {
            let obj = {
                start: moment(data[colKey].start, "HH:mm")._isValid
                    ? moment(data[colKey].start, "HH:mm")
                    : null,
                end: moment(data[colKey].end, "HH:mm")._isValid
                    ? moment(data[colKey].end, "HH:mm")
                    : null,
                break: data[colKey].break && data[colKey].break,
                notes: data[colKey].notes && data[colKey].notes,
            };

            this.setState({
                FormFields: {
                    ...this.state.FormFields,
                    initialValues: { obj: obj },
                },
                isVisible: true,
                dataIndex: { r: rowIndex, c: colKey },
            });
        } else {
            this.setState({
                isVisible: true,
                dataIndex: { r: rowIndex, c: colKey },
            });
        }
    };

    submit = () => {
        this.dynamoForm.current.refs.time_form.submit();
    };

    Callback = (value) => {
        value = value.obj;
        let obj = {
            start: value.start ? value.start.format("HH:mm") : "",
            end: value.end ? value.end.format("hh:mm") : "",
            break: value["break"],
            notes: value["notes"],
        };
        this.state.data[this.state["dataIndex"]["r"]][
            this.state["dataIndex"]["c"]
        ] = obj;

        delete this.state.FormFields.initialValues;
        this.setState({
            data: this.state.data,
            FormFields: this.state.FormFields,
            dataIndex: {},
            isVisible: false,
        });
    };

    saveTime = () => {
        const { comments, data } = this.state;

        console.log(comments, data);
    };
    submitTime = () => {
        console.log("Submitted");
    };
    commentSec = (e) => {
        this.setState({
            comments: e.target.value,
        });
    };

    render() {
        const { loading, columns, data, comments, isVisible, FormFields, proVisible } = this.state
        return (
            <>
                <Row justify="space-between">
                    <Col>
                        <Title>Time Offs</Title>
                    </Col>
                    <Col>
                        <DatePicker

                            size="large"
                            mode="month"
                            picker="month"
                            format="MMM-YYYY"
                            onChange={(value)=>{this.setState({Cmonth: value})}}
                            defaultValue={moment(new Date())}
                        />
                        <DatePicker

                            size="large"
                            // mode="month"
                            // picker="month"
                            format={'DD/MM/YYYY'}
                            oonChange={(value)=>{this.setState({Cdate: value})}}
                            defaultValue={moment(new Date())}
                        />
                    </Col>
                    <Col>
                        <Button
                            size="small"
                            type="primary"
                            onClick={() => {
                                console.log({startDate: moment().startOf("month").format('DD/M/YYYY'), endDate: moment().endOf("months").format('DD/M/YYYY')})
                                getList({startDate: moment().startOf("month").format('DD/M/YYYY'), endDate: moment().endOf("month").format('DD/M/YYYY')})
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
                    bordered
                    pagination={false}
                    dataSource={data}
                    className="timeSheet-table"
                />
                <Row
                    style={{ marginTop: 20 }}
                    justify="space-around"
                    // align="middle"
                >
                    <Col span={12}>
                        <Input.TextArea
                            autoSize={{ minRows: 6, maxRows: 12 }}
                            showCount
                            onChange={this.commentSec}
                            value={comments}
                            placeholder="Add some commen"
                        />
                    </Col>
                    <Col span={6} offset="6">
                        <Row justify="space-around" style={{ padding: 20 }}>
                            <Col>
                                <Button type="primary" onClick={this.saveTime}>
                                    <SaveOutlined /> Save
                                </Button>
                            </Col>
                            <Col>
                                <Button
                                    type="primary"
                                    style={{ backgroundColor: "#517717" }}
                                    onClick={this.submitTime}
                                >
                                    <CheckOutlined /> Submit
                                </Button>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                {isVisible && (
                    <Modal
                        title="Edit TimeSheet"
                        maskClosable={false}
                        centered
                        visible={isVisible}
                        width={540}
                        // pagination={false}
                        onCancel={() => {
                            delete FormFields.initialValues; // delete initialValues of fields on close
                            this.setState({
                                isVisible: false, //close
                                FormFields: FormFields, //delete Formfields on Close
                            });
                        }}
                        onOk={() => { this.submit(); }}
                        okButtonProps={{ disabled: loading }}
                        okText={loading ?<LoadingOutlined /> :"Save"}
                    >
                        <Row>
                            <Form
                                ref={this.dynamoForm}
                                Callback={this.Callback}
                                FormFields={FormFields}
                            />
                        </Row>
                    </Modal>
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
                            this.setState({ proVisible: false });
                        }}
                        onOk={() => {
                            this.setState({ proVisible: false, loading: true });
                        }}
                    >
                        <Row justify="space-around">
                            <Col span="12">
                                <Select
                                    placeholder="Select Project"
                                    style={{ width: 200 }}
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
