import React, { Component } from "react";
import { Table, Menu, Dropdown, Button, Tag, Row, Col, Typography, Modal, } from "antd";
import { DownOutlined, SettingOutlined, PlusSquareOutlined, } from "@ant-design/icons"; //Icons
import { Link } from "react-router-dom";

import Form from "../../../components/Core/Form";
import "../../styles/table.css";

import { getList, addList, editLabel } from "../../../service/calender";

const { Title } = Typography;

class Calenders extends Component {
    constructor(props) {
        super(props);

        // this.calenderForm =  React.createRef();

        this.columns = [
            {
                title: "Title",
                dataIndex: "label",
                key: "label",
            },
            {
                title: "Status",
                dataIndex: "isActive",
                key: "isActive",
                align: "right",
                render: (isActive) => (
                    <>
                        {
                            <Tag
                                color={!isActive ? "#7d7b7b" : "green"}
                                key={isActive}
                            >
                                {isActive ? "Enabled" : "Disabled"}
                            </Tag>
                        }
                    </>
                ),
            },
            {
                title: "Action",
                key: "action",
                align: "right",
                render: (record, text) => (
                    <Dropdown
                        overlay={
                            <Menu>
                                <Menu.Item
                                    onClick={() => this.getRecord(record, text)}
                                >
                                    Edit
                                </Menu.Item>
                                <Menu.Item>
                                    <Link
                                        to={{
                                            pathname: `/admin/calenders/holidays/${record.id}`,
                                        }}
                                        className="nav-link"
                                    >
                                        Holidays
                                    </Link>
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
            data: [],
            calenderForm: React.createRef(),
            openModal: false,

            FormFields: {
                formId: "calenderId",
                justify: "center",
                FormCol: 20,
                FieldSpace: { xs: 12, sm: 16, md: 122 },
                layout: { labelCol: { span: 12 } },
                justifyField: "center",
                size: "middle",
                initialValues: { obj: { isActive: true } },
                fields: [
                    {
                        object: "obj",
                        fieldCol: 20,
                        layout: {
                            labelCol: { span: 4 },
                            wrapperCol: { span: 0 },
                        },
                        key: "label",
                        label: "Title",
                        size: "small",
                        // rules:[{ required: true }],
                        type: "input",
                        labelAlign: "left",
                    },
                    {
                        object: "obj",
                        fieldCol: 20,
                        key: "isActive",
                        label: "Status",
                        size: "small",
                        // rules:[{ required: true, message: 'Insert your Password Please' }],
                        type: "Switch",
                        layout: { labelCol: { span: 4 } },
                        labelAlign: "left",
                        valuePropName: "checked",
                        // hidden: false
                    },
                ],
            },
        };
    }

    componentDidMount = () => {
        this.getData();
    };

    getData = () => {
        //creating API's
        getList().then((res) => {
            if (res.success) {
                this.setState({
                    data: res.data,
                    FormFields: {
                        ...this.state.FormFields,
                        initialValues: {},
                    },
                    openModal: false,
                    editTimeoff: false,
                });
            }
        });
    };

    toggelModal = (status) => {
        if (status) {
            this.setState({ openModal: status });
        } else {
            this.setState({
                FormFields: {
                    ...this.state.FormFields,
                    initialValues: {},
                },
                openModal: false,
                editTimeoff: false,
            });
        }
    };

    Callback = (vake) => {
        // this will work after I get the Object from the form
        if (!this.state.editTimeoff) {
            this.addCal(vake.obj);
        } else {
            this.editRecord(vake.obj);
        }
    };

    addCal = (value) => {
        addList(value).then((res) => {
            if (res) {
                this.getData();
            }
        });
    };

    getRecord = (data, text) => {
        this.setState({
            FormFields: {
                ...this.state.FormFields,
                initialValues: { obj: data },
            },
            editTimeoff: data.id,
            openModal: true,
        });
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
        this.state.calenderForm.current.refs.calenderId.submit();
    };

    render() {
        const { data, openModal, editTimeoff } = this.state;
        const columns = this.columns;
        return (
            <>
                <Row justify="space-between">
                    <Col>
                        <Title level={4}>Calenders</Title>
                    </Col>
                    <Col style={{ textAlign: "end" }}>
                        <Button
                            type="primary"
                            onClick={() => {
                                this.toggelModal(true);
                            }}
                            size="small"
                        >
                            <PlusSquareOutlined />
                            Add Calender
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
                {
                    openModal ? (
                        <Modal
                maskClosable={false}
                            title={
                                editTimeoff
                                    ? "Edit Calender"
                                    : "Add New Calender"
                            }
                            centered
                            visible={openModal}
                            onOk={() => {
                                this.submit();
                            }}
                            okText={"Save"}
                            onCancel={() => {
                                this.toggelModal(false);
                            }}
                            width={600}
                        >
                            <Form
                                ref={this.state.calenderForm}
                                Callback={this.Callback}
                                FormFields={this.state.FormFields}
                            />
                        </Modal>
                    ) : null //adding a commit
                }
            </>
        );
    }
}

export default Calenders;
