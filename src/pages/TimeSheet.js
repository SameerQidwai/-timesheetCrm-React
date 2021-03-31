import React, { Component } from "react";

import { Row, Col, Table, Modal, Input, Button, Select, Typography, Popconfirm, DatePicker, } from "antd";
import {
    CloseCircleOutlined,
    CheckOutlined,
    SaveOutlined,
} from "@ant-design/icons"; //Icons
import Form from "../components/Core/Form";
import moment from "moment";

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
            dataIndex: {},
            columns: [],
            data: [
                {
                    key: 1,
                    project: "Project 1",
                    1: {
                        start: "09:22",
                        end: "22:02",
                        break: "2",
                    },
                    2: {
                        start: "10:00",
                        end: "20:00",
                        break: "4",
                    },
                    3: {
                        start: "11:22",
                        end: "13:11",
                        break: "5",
                    },
                    4: {
                        start: "16:20",
                        end: "17:10",
                        break: "18",
                    },
                    5: {
                        start: "02:23",
                        end: "14:23",
                        break: "5",
                    },
                    6: {
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
        };

        this.column = [
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
            {
                title: "title",
                dataIndex: 1,
                key: 1,
                width: 200,
                align: "center",
                render: (value, record, rowIndex) =>
                    value ? (
                        <Row style={{ border: "1px solid" }}>
                            <Col span={24}>Start Time: {value["start"]}</Col>
                            <Col span={24}>End Time: {value["end"]}</Col>
                            <Col span={24}>Break: {value["break"]}</Col>
                        </Row>
                    ) : null,
            },
            {
                title: "title",
                dataIndex: 2,
                key: 2,
                width: 200,
                align: "center",
                render: (value, record, rowIndex) =>
                    value ? (
                        <Row style={{ border: "1px solid" }}>
                            <Col span={24}>Start Time: {value["start"]}</Col>
                            <Col span={24}>End Time: {value["end"]}</Col>
                            <Col span={24}>Break: {value["break"]}</Col>
                        </Row>
                    ) : null,
            },
            {
                title: "title",
                dataIndex: 3,
                key: 3,
                width: 200,
                align: "center",
                render: (value, record, rowIndex) =>
                    value ? (
                        <Row style={{ border: "1px solid" }}>
                            <Col span={24}>Start Time: {value["start"]}</Col>
                            <Col span={24}>End Time: {value["end"]}</Col>
                            <Col span={24}>Break: {value["break"]}</Col>
                        </Row>
                    ) : null,
            },
            {
                title: "title",
                dataIndex: 4,
                key: 4,
                width: 200,
                align: "center",
                render: (value, record, rowIndex) =>
                    value ? (
                        <Row style={{ border: "1px solid" }}>
                            <Col span={24}>Start Time: {value["start"]}</Col>
                            <Col span={24}>End Time: {value["end"]}</Col>
                            <Col span={24}>Break: {value["break"]}</Col>
                        </Row>
                    ) : null,
            },
            {
                title: "title",
                dataIndex: 5,
                key: 5,
                width: 200,
                align: "center",
                render: (value, record, rowIndex) =>
                    value ? (
                        <Row style={{ border: "1px solid" }}>
                            <Col span={24}>Start Time: {value["start"]}</Col>
                            <Col span={24}>End Time: {value["end"]}</Col>
                            <Col span={24}>Break: {value["break"]}</Col>
                        </Row>
                    ) : null,
            },
            {
                title: "title",
                dataIndex: 6,
                key: 6,
                width: 200,
                align: "center",
                render: (value, record, rowIndex) =>
                    value ? (
                        <Row style={{ border: "1px solid" }}>
                            <Col span={24}>Start Time: {value["start"]}</Col>
                            <Col span={24}>End Time: {value["end"]}</Col>
                            <Col span={24}>Break: {value["break"]}</Col>
                        </Row>
                    ) : null,
            },
            {
                title: "title",
                dataIndex: 7,
                key: 7,
                width: 200,
                align: "center",
                render: (value, record, rowIndex) =>
                    value ? (
                        <Row style={{ border: "1px solid" }}>
                            <Col span={24}>Start Time: {value["start"]}</Col>
                            <Col span={24}>End Time: {value["end"]}</Col>
                            <Col span={24}>Break: {value["break"]}</Col>
                        </Row>
                    ) : null,
            },
            {
                title: "title",
                dataIndex: 8,
                key: 8,
                width: 200,
                align: "center",
                render: (value, record, rowIndex) =>
                    value ? (
                        <Row style={{ border: "1px solid" }}>
                            <Col span={24}>Start Time: {value["start"]}</Col>
                            <Col span={24}>End Time: {value["end"]}</Col>
                            <Col span={24}>Break: {value["break"]}</Col>
                        </Row>
                    ) : null,
            },
            {
                title: "title",
                dataIndex: 9,
                key: 9,
                width: 200,
                align: "center",
                render: (value, record, rowIndex) =>
                    value ? (
                        <Row style={{ border: "1px solid" }}>
                            <Col span={24}>Start Time: {value["start"]}</Col>
                            <Col span={24}>End Time: {value["end"]}</Col>
                            <Col span={24}>Break: {value["break"]}</Col>
                        </Row>
                    ) : null,
            },
            {
                title: "title",
                dataIndex: 10,
                key: 10,
                width: 200,
                align: "center",
                render: (value, record, rowIndex) =>
                    value ? (
                        <Row style={{ border: "1px solid" }}>
                            <Col span={24}>Start Time: {value["start"]}</Col>
                            <Col span={24}>End Time: {value["end"]}</Col>
                            <Col span={24}>Break: {value["break"]}</Col>
                        </Row>
                    ) : null,
            },
            {
                title: "title",
                dataIndex: 10,
                key: 10,
                width: 200,
                align: "center",
                render: (value, record, rowIndex) =>
                    value ? (
                        <Row style={{ border: "1px solid" }}>
                            <Col span={24}>Start Time: {value["start"]}</Col>
                            <Col span={24}>End Time: {value["end"]}</Col>
                            <Col span={24}>Break: {value["break"]}</Col>
                        </Row>
                    ) : null,
            },
            {
                title: "title",
                dataIndex: 11,
                key: 11,
                width: 200,
                align: "center",
                render: (value, record, rowIndex) =>
                    value ? (
                        <Row style={{ border: "1px solid" }}>
                            <Col span={24}>Start Time: {value["start"]}</Col>
                            <Col span={24}>End Time: {value["end"]}</Col>
                            <Col span={24}>Break: {value["break"]}</Col>
                        </Row>
                    ) : null,
            },
            {
                title: "title",
                dataIndex: 12,
                key: 12,
                width: 200,
                align: "center",
                render: (value, record, rowIndex) =>
                    value ? (
                        <Row style={{ border: "1px solid" }}>
                            <Col span={24}>Start Time: {value["start"]}</Col>
                            <Col span={24}>End Time: {value["end"]}</Col>
                            <Col span={24}>Break: {value["break"]}</Col>
                        </Row>
                    ) : null,
            },
            {
                title: "title",
                dataIndex: 13,
                key: 13,
                width: 200,
                align: "center",
                render: (value, record, rowIndex) =>
                    value ? (
                        <Row style={{ border: "1px solid" }}>
                            <Col span={24}>Start Time: {value["start"]}</Col>
                            <Col span={24}>End Time: {value["end"]}</Col>
                            <Col span={24}>Break: {value["break"]}</Col>
                        </Row>
                    ) : null,
            },
            {
                title: "title",
                dataIndex: 14,
                key: 14,
                width: 200,
                align: "center",
                render: (value, record, rowIndex) =>
                    value ? (
                        <Row style={{ border: "1px solid" }}>
                            <Col span={24}>Start Time: {value["start"]}</Col>
                            <Col span={24}>End Time: {value["end"]}</Col>
                            <Col span={24}>Break: {value["break"]}</Col>
                        </Row>
                    ) : null,
            },
            {
                title: "title",
                dataIndex: 15,
                key: 15,
                width: 200,
                align: "center",
                render: (value, record, rowIndex) =>
                    value ? (
                        <Row style={{ border: "1px solid" }}>
                            <Col span={24}>Start Time: {value["start"]}</Col>
                            <Col span={24}>End Time: {value["end"]}</Col>
                            <Col span={24}>Break: {value["break"]}</Col>
                        </Row>
                    ) : null,
            },
            {
                title: "title",
                dataIndex: 16,
                key: 16,
                width: 200,
                align: "center",
                render: (value, record, rowIndex) =>
                    value ? (
                        <Row style={{ border: "1px solid" }}>
                            <Col span={24}>Start Time: {value["start"]}</Col>
                            <Col span={24}>End Time: {value["end"]}</Col>
                            <Col span={24}>Break: {value["break"]}</Col>
                        </Row>
                    ) : null,
            },
            {
                title: "title",
                dataIndex: 17,
                key: 17,
                width: 200,
                align: "center",
                render: (value, record, rowIndex) =>
                    value ? (
                        <Row style={{ border: "1px solid" }}>
                            <Col span={24}>Start Time: {value["start"]}</Col>
                            <Col span={24}>End Time: {value["end"]}</Col>
                            <Col span={24}>Break: {value["break"]}</Col>
                        </Row>
                    ) : null,
            },
            {
                title: "title",
                dataIndex: 18,
                key: 18,
                width: 200,
                align: "center",
                render: (value, record, rowIndex) =>
                    value ? (
                        <Row style={{ border: "1px solid" }}>
                            <Col span={24}>Start Time: {value["start"]}</Col>
                            <Col span={24}>End Time: {value["end"]}</Col>
                            <Col span={24}>Break: {value["break"]}</Col>
                        </Row>
                    ) : null,
            },
            {
                title: "title",
                dataIndex: 19,
                key: 19,
                width: 200,
                align: "center",
                render: (value, record, rowIndex) =>
                    value ? (
                        <Row style={{ border: "1px solid" }}>
                            <Col span={24}>Start Time: {value["start"]}</Col>
                            <Col span={24}>End Time: {value["end"]}</Col>
                            <Col span={24}>Break: {value["break"]}</Col>
                        </Row>
                    ) : null,
            },
            {
                title: "title",
                dataIndex: 20,
                key: 20,
                width: 200,
                align: "center",
                render: (value, record, rowIndex) =>
                    value ? (
                        <Row style={{ border: "1px solid" }}>
                            <Col span={24}>Start Time: {value["start"]}</Col>
                            <Col span={24}>End Time: {value["end"]}</Col>
                            <Col span={24}>Break: {value["break"]}</Col>
                        </Row>
                    ) : null,
            },
            {
                title: "title",
                dataIndex: 21,
                key: 21,
                width: 200,
                align: "center",
                render: (value, record, rowIndex) =>
                    value ? (
                        <Row style={{ border: "1px solid" }}>
                            <Col span={24}>Start Time: {value["start"]}</Col>
                            <Col span={24}>End Time: {value["end"]}</Col>
                            <Col span={24}>Break: {value["break"]}</Col>
                        </Row>
                    ) : null,
            },
            {
                title: "title",
                dataIndex: 22,
                key: 22,
                width: 200,
                align: "center",
                render: (value, record, rowIndex) =>
                    value ? (
                        <Row style={{ border: "1px solid" }}>
                            <Col span={24}>Start Time: {value["start"]}</Col>
                            <Col span={24}>End Time: {value["end"]}</Col>
                            <Col span={24}>Break: {value["break"]}</Col>
                        </Row>
                    ) : null,
            },
            {
                title: "title",
                dataIndex: 23,
                key: 23,
                width: 200,
                align: "center",
                render: (value, record, rowIndex) =>
                    value ? (
                        <Row style={{ border: "1px solid" }}>
                            <Col span={24}>Start Time: {value["start"]}</Col>
                            <Col span={24}>End Time: {value["end"]}</Col>
                            <Col span={24}>Break: {value["break"]}</Col>
                        </Row>
                    ) : null,
            },
            {
                title: "title",
                dataIndex: 25,
                key: 25,
                width: 200,
                align: "center",
                render: (value, record, rowIndex) =>
                    value ? (
                        <Row style={{ border: "1px solid" }}>
                            <Col span={24}>Start Time: {value["start"]}</Col>
                            <Col span={24}>End Time: {value["end"]}</Col>
                            <Col span={24}>Break: {value["break"]}</Col>
                        </Row>
                    ) : null,
            },
            {
                title: "title",
                dataIndex: 26,
                key: 26,
                width: 200,
                align: "center",
                render: (value, record, rowIndex) =>
                    value ? (
                        <Row style={{ border: "1px solid" }}>
                            <Col span={24}>Start Time: {value["start"]}</Col>
                            <Col span={24}>End Time: {value["end"]}</Col>
                            <Col span={24}>Break: {value["break"]}</Col>
                        </Row>
                    ) : null,
            },
            {
                title: "title",
                dataIndex: 27,
                key: 27,
                width: 200,
                align: "center",
                render: (value, record, rowIndex) =>
                    value ? (
                        <Row style={{ border: "1px solid" }}>
                            <Col span={24}>Start Time: {value["start"]}</Col>
                            <Col span={24}>End Time: {value["end"]}</Col>
                            <Col span={24}>Break: {value["break"]}</Col>
                        </Row>
                    ) : null,
            },
            {
                title: "title",
                dataIndex: 28,
                key: 28,
                width: 200,
                align: "center",
                render: (value, record, rowIndex) =>
                    value ? (
                        <Row style={{ border: "1px solid" }}>
                            <Col span={24}>Start Time: {value["start"]}</Col>
                            <Col span={24}>End Time: {value["end"]}</Col>
                            <Col span={24}>Break: {value["break"]}</Col>
                        </Row>
                    ) : null,
            },
            {
                title: "title",
                dataIndex: 29,
                key: 29,
                width: 200,
                align: "center",
                render: (value, record, rowIndex) =>
                    value ? (
                        <Row style={{ border: "1px solid" }}>
                            <Col span={24}>Start Time: {value["start"]}</Col>
                            <Col span={24}>End Time: {value["end"]}</Col>
                            <Col span={24}>Break: {value["break"]}</Col>
                        </Row>
                    ) : null,
            },
            {
                title: "title",
                dataIndex: 30,
                key: 30,
                width: 200,
                align: "center",
                render: (value, record, rowIndex) =>
                    value ? (
                        <Row style={{ border: "1px solid" }}>
                            <Col span={24}>Start Time: {value["start"]}</Col>
                            <Col span={24}>End Time: {value["end"]}</Col>
                            <Col span={24}>Break: {value["break"]}</Col>
                        </Row>
                    ) : null,
            },
            {
                title: "title",
                dataIndex: 31,
                key: 31,
                width: 200,
                align: "center",
                render: (value, record, rowIndex) =>
                    value ? (
                        <Row style={{ border: "1px solid" }}>
                            <Col span={24}>Start Time: {value["start"]}</Col>
                            <Col span={24}>End Time: {value["end"]}</Col>
                            <Col span={24}>Break: {value["break"]}</Col>
                        </Row>
                    ) : null,
            },
        ];
    }

    componentDidMount = () => {
        this.Columns();
    };

    Columns = (date, dateString) => {
        // console.log(dateString)
        date = dateString ? new Date(date).setDate(1) : new Date().setDate(1); // set date for the selected month or current month
        console.log(new Date(date));
        let month = new Date(date).getMonth(); // get month for the month
        const monthChange = month; // set month to compare whether to run the function or not
        var loopindex = 1;
        this.state.columns = this.column.map((col, index) => {
            // reCreate the table columns to insert onCell click
            // console.log(index);
            if (col.dataIndex === "project") {
                // don't change anything for 1st column
                return col;
            }
            var day = new Date(date).toLocaleString("en-us", {
                weekday: "short",
            }); // to get day Name i.e mon, tue
            var numDate = new Date(date).getDate(); // to get day date
            var monthName = new Date(date).getMonth() + 1; // to get day month

            date = new Date(date).setDate(new Date(date).getDate() + 1); // set next date before return
            month = new Date(date).getMonth(); // get month to check whether to return in next loop or not
            loopindex = monthChange === month ? loopindex + 1 : loopindex;
            return {
                ...col,
                title: this.columnTitle(day, monthName, numDate), //Set title for the column
                onCell: (record, rowIndex) => ({
                    // onCell
                    record, // record to print
                    onClick: (event) => {
                        // on Click Function
                        // console.log(day, numDate, month, monthChange)
                        this.getRecord(record, rowIndex, col.dataIndex); // call function to save data in
                    },
                }),
            };
        });
        for (let i = loopindex; i < 31; i++) {
            // To pop columns for 31 month and feburary
            this.state.columns.pop(); // pop
        }
        this.setState({
            // change column state
            columns: this.state.columns,
        });
    };

    columnTitle = (day, month, numDate) => {
        // create column title
        return (
            <>
                <div>{day}</div>
                <div>
                    {month}/{numDate}
                </div>
            </>
        );
    };

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
                            onChange={this.Columns}
                            defaultValue={moment(new Date())}
                        />
                    </Col>
                    <Col>
                        <Button
                            size="small"
                            type="primary"
                            onClick={() => {
                                this.setState({ proVisible: true });
                            }}
                        >
                            Add Project
                        </Button>
                    </Col>
                </Row>
                <Table
                    columns={this.state.columns}
                    size="small"
                    scroll={{
                        // x: "calc(700px + 100%)",
                        x: "'max-content'",
                    }}
                    // scroll={{ x: "calc(700px + 100%)", y: "" }}
                    // footer={() => "Footer"}
                    bordered
                    pagination={false}
                    dataSource={this.state.data}
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
                            value={this.state.comments}
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
                {this.state.isVisible && (
                    <Modal
                        title="Edit TimeSheet"
                        maskClosable={false}
                        centered
                        visible={this.state.isVisible}
                        okText="Save"
                        width={540}
                        // pagination={false}
                        onCancel={() => {
                            delete this.state.FormFields.initialValues; // delete initialValues of fields on close
                            this.setState({
                                isVisible: false, //close
                                FormFields: this.state.FormFields, //delete Formfields on Close
                            });
                        }}
                        onOk={() => {
                            this.submit();
                        }}
                    >
                        <Row>
                            <Form
                                ref={this.dynamoForm}
                                Callback={this.Callback}
                                FormFields={this.state.FormFields}
                            />
                        </Row>
                    </Modal>
                )}

                {this.state.proVisible && (
                    <Modal
                        title="Add Project"
                        maskClosable={false}
                        centered
                        visible={this.state.proVisible}
                        okText="Add"
                        width={500}
                        // pagination={false}
                        onCancel={() => {
                            this.setState({ proVisible: false });
                        }}
                        onOk={() => {
                            this.setState({ proVisible: false });
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
