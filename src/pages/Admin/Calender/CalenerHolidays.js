import React, { Component } from "react";
import { Row, Col, Menu, Table, Modal, Button, Dropdown, Popconfirm, Typography, DatePicker, } from "antd";
import { DownOutlined, SettingOutlined, PlusSquareOutlined, } from "@ant-design/icons"; //Icons

import Form from "../../../components/Core/Form";
import moment from "moment";
import "../../styles/table.css";

import {
    holidayType,
    addList,
    getList,
    editLabel,
    delLabel,
} from "../../../service/calendar-holidays";

const { Title } = Typography;

class CalenerHolidays extends Component {
    constructor(props) {
        super(props);
        this.holidayForm = React.createRef();
        this.columns = [
            {
                title: "Title",
                dataIndex: "label",
                key: "label",
            },
            {
                title: "Date",
                dataIndex: "date",
                key: "date",
                align: "right",
                render: (text, record) => moment(text).format("DD-MMM-YYYY"),
            },
            {
                title: "Action",
                key: "action",
                align: "right",
                render: (text, record) => (
                    <Dropdown
                        overlay={
                            <Menu>
                                <Menu.Item danger>
                                    <Popconfirm
                                        title="Sure to delete?"
                                        onConfirm={() =>
                                            this.handleDelete(record.id)
                                        }
                                    >
                                        Delete
                                    </Popconfirm>
                                </Menu.Item>
                                <Menu.Item
                                    onClick={() => this.getRecord(record)}
                                >
                                    Edit
                                </Menu.Item>
                            </Menu>
                        }
                    >
                        <Button size="small">
                            <SettingOutlined /> Option <DownOutlined />
                        </Button>
                    </Dropdown>
                ),
            },
        ];

        this.state = {
            calendarId: false,
            data: [],
            openModal: false,
            editTimeoff: false,
            FormFields: {
                formId: "form",
                justify: "center",
                FormCol: 12,
                layout: { labelCol: { span: 6 } },
                justifyField: "center",
                size: "small",
                fields: [
                    {
                        object: "obj",
                        fieldCol: 24,
                        key: "label",
                        label: "Title",
                        size: "small",
                        // rules:[{ required: true }],
                        type: "Select",
                        data: [],
                        labelAlign: "right",
                    },
                    {
                        object: "obj",
                        fieldCol: 24,
                        key: "date",
                        label: "Date",
                        size: "small",
                        // rules:[{ required: true, message: 'Insert your Password Please' }],
                        mode: "date",
                        type: "DatePicker",
                        labelAlign: "right",
                        fieldStyle: { width: "100%" },
                        // hidden: false
                    },
                ],
            },
        };
    }

    componentDidMount() {
        const { id } = this.props.match.params
        this.setState({calendarId: id},()=>this.getData(id))
        
    }

    getData = (id) => {
        const { calendarId } = this.state;
        getList(calendarId).then((res) => {
            if (res.success) {
                this.setState({
                    data: res.data,
                    openModal: false,
                    editTimeoff: false,
                });
            }
        });
    };

    handleDelete = (id) => {
        delLabel(id).then((res) => {
            if (res) {
                this.getData();
            }
        });
    };

    toggelModal = (status) => {
        if (status) {
            const { FormFields } = this.state;
            holidayType().then((res) => {
                if (res.success) {
                    FormFields.fields[0].data = res.data;
                    this.setState({
                        FormFields,
                        openModal: status,
                    });
                }
            });
        } else {
            this.setState({ openModal: status, editTimeoff: false });
        }

        // this.holidayForm.current.refs.form.resetFields(); // to reset file
    };

    Callback = (vake) => {
        const { calendarId } = this.state;
        // this will work after I get the Object
        vake.obj.date = moment(vake.obj.date).format("DD-MMM-YYYY");
        const obj = {
            calendarId: calendarId,
            holidayTypeId: vake.obj.label,
            date: new Date(vake.obj.date).getTime(),
        };
        if (!this.state.editTimeoff) {
            // to add new datas
            this.addType(obj);
        } else {
            this.editRecord(obj);
        }
    };
    addType = (value) => {
        addList(value).then((res) => {
            if (res) {
                this.getData();
            }
        });
    };

    getRecord = (data) => {
        const vars = {
            id: data.id,
            label: data.label,
            date: moment(data.date),
        };
        this.setState(
            {
                FormFields: {
                    ...this.state.FormFields,
                    initialValues: { obj: vars },
                },
                editTimeoff: vars.id,
            },
            () => {
                this.toggelModal(true);
            }
        );
    };

    editRecord = (obj) => {
        const { editTimeoff } = this.state;
        obj.id = editTimeoff;
        editLabel(obj).then((res) => {
            if (res) {
                this.getData();
            }
        });
    };

    submit = () => {
        this.holidayForm.current.refs.form.submit();
    };

    render() {
        const data = this.state.data;
        const columns = this.columns;
        return (
            <>
                <Row justify="space-between">
                    <Col>
                        <Title level={4}>Holidays</Title>
                    </Col>
                    <Col span="2">
                        <DatePicker
                            size="small"
                            mode="year"
                            picker="year"
                            format="YYYY"
                            defaultValue={moment(new Date())}
                        />
                    </Col>
                    <Col style={{ textAlign: "end" }}>
                        <Button
                            type="primary"
                            size="small"
                            onClick={() => {
                                this.toggelModal(true);
                            }}
                        >
                            {" "}
                            <PlusSquareOutlined /> Add Holiday
                        </Button>
                    </Col>
                    <Col span={24}>
                        <Table
                            columns={columns}
                            dataSource={data}
                            size="small"
                            rowKey={(data) => data.id}
                        />
                    </Col>
                </Row>
                {this.state.openModal ? (
                    <Modal
                        title={
                            this.state.editTimeoff
                                ? "Edit Holiday"
                                : "Add New Holiday"
                        }
                        centered
                        visible={this.state.openModal}
                        onOk={() => {
                            this.submit();
                        }}
                        onCancel={() => {
                            this.toggelModal(false);
                        }}
                        okText={"Save"}
                        width={500}
                        bodyStyle={{ padding: "10px 0px 0px 0px" }}
                    >
                        <Row justify="center">
                            <Form
                                ref={this.holidayForm}
                                Callback={this.Callback}
                                FormFields={this.state.FormFields}
                            />
                        </Row>
                    </Modal>
                ) : null}
            </>
        );
    }
}

export default CalenerHolidays;
