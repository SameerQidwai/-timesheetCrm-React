import React, { Component } from "react";
import {
    Table,
    Menu,
    Dropdown,
    Button,
    Popconfirm,
    Row,
    Col,
    Typography,
    Modal,
} from "antd";
import {
    DownOutlined,
    SettingOutlined,
    PlusSquareOutlined,
} from "@ant-design/icons"; //Icons

import Form from "../../../components/Core/Form";
import moment from "moment";
import "../../styles/table.css";

const { Title } = Typography;

class CalenerHolidays extends Component {
    componentDidMount() {
        var { id } = this.props.match.params;
        if (id === "1") {
            this.setState({ data: this.state.data1 });
        } else {
            this.setState({ data: this.state.data2 });
        }
    }
    constructor(props) {
        super(props);
        this.holidayForm = React.createRef();
        this.columns = [
            {
                title: "Title",
                dataIndex: "title",
                key: "title",
            },
            {
                title: "Date",
                dataIndex: "date",
                key: "date",
                align: "right",
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
                                            this.handleDelete(record.key)
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
            data1: [
                {
                    key: 1,
                    title: "Easter",
                    date: "12-Apr-2020",
                },
                {
                    key: 2,
                    title: "Labour Day",
                    date: "01-May-2020",
                },
                {
                    key: 3,
                    title: "Chirstmas",
                    date: "25-Dec-2020",
                },
            ],
            data2: [
                {
                    key: 1,
                    title: "Eid-ul-fiter",
                    date: "13-May-2020",
                },
                {
                    key: 2,
                    title: "Eid-ul-azha",
                    date: "12-jul-2020",
                },
            ],
            data: null,
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
                        key: "title",
                        label: "Title",
                        size: "small",
                        // rules:[{ required: true }],
                        type: "Select",
                        data: [
                            { value: "Easter", label: "Easter" },
                            { value: "Christmas", label: "Christmas" },
                            { value: "Eid-ul-fiter", label: "Eid-ul-fiter" },
                        ],
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
                        fieldStyle: { width: "-webkit-fill-available" },
                        // hidden: false
                    },
                ],
            },
        };
    }

    handleDelete = (key) => {
        const dataSource = [...this.state.data];
        this.setState({ data: dataSource.filter((item) => item.key !== key) });
    };

    toggelModal = (status) => {
        this.setState({ openModal: status });

        if (this.state.openModal) {
            this.holidayForm.current.refs.form.resetFields(); // to reset file
            delete this.state.FormFields.initialValues; // to delete intilize if not written
            this.setState({
                // set state
                FormFields: this.state.FormFields,
                editTimeoff: false,
            });
        }
    };

    Callback = (vake) => {
        // this will work after I get the Object
        if (!this.state.editTimeoff) {
            // to add new datas
            vake.obj.date = moment(vake.obj.date).format("DD-MMM-YYYY");
            vake.obj.key = this.state.data.length + 1;
            this.setState(
                {
                    data: [...this.state.data, vake.obj],
                },
                () => {
                    this.toggelModal(false);
                    // this.holidayForm.current.refs.form.resetFields();
                    console.log("Data Rendered");
                }
            );
        } else {
            this.editRecord(vake.obj);
        }
    };

    getRecord = (data) => {
        const obj = Object.assign({}, data);
        obj.date = moment(obj.date);

        this.setState(
            {
                FormFields: {
                    ...this.state.FormFields,
                    initialValues: { obj: obj },
                },
                editTimeoff: obj.key,
            },
            () => {
                this.toggelModal(true);
            }
        );
    };

    editRecord = (obj) => {
        obj.key = this.state.editTimeoff;
        obj.date = moment(obj.date).format("DD-MMM-YYYY");

        this.state.data[obj.key - 1] = obj;

        this.setState(
            {
                data: [...this.state.data],
                mergeObj: {},
            },
            () => {
                this.toggelModal(false);
            }
        );
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
                        okText={this.state.editTimeoff ? "Edit" : "Save"}
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
