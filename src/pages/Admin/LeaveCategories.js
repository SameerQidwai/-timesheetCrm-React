import React, { Component } from "react";
import { Table, Menu, Dropdown, Button, Popconfirm, Row, Col, Typography, Modal, } from "antd";
import { DownOutlined, SettingOutlined, PlusSquareOutlined, LoadingOutlined } from "@ant-design/icons"; //Icons

import Form from "../../components/Core/Forms/Form";

import { getList, addList, editLabel, delLabel } from "../../service/time-off";
import { localStore } from "../../service/constant";
import { tableSorter, tableTitleFilter } from "../../components/Core/Table/TableFilter";

const { Title } = Typography;

class LeaveCategories extends Component {
    constructor(props) {
        super(props);
        this.dynamoForm = React.createRef();

        this.columns = [
            {
                title: "Title",
                dataIndex: "label",
                key: "label",
                ...tableSorter('label', 'string')
            },
            {
                title: "Action",
                key: "action",
                align: "right",
                width: 115,
                render: (text, record) => (
                    <Dropdown
                        overlay={
                            <Menu>
                                <Menu.Item 
                                    danger
                                    key="Delete"
                                    className="pop-confirm-menu"
                                >
                                    <Popconfirm
                                        title="Are you sure you want to delete ?"
                                        onConfirm={() =>
                                            this.handleDelete(record.id)
                                        }
                                        okText="Yes"
                                     >
                                        <div> Delete </div>
                                    </Popconfirm>
                                </Menu.Item>
                                <Menu.Item
                                key="Edit"
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
            data: [],
            filterData: [],
            openModal: false,
            editTimeoff: false,
            loading: false,
            FormFields: {
                formId: "time_off",
                justify: "center",
                FormCol: 20,
                FieldSpace: { xs: 12, sm: 16, md: 122 },
                layout: { labelCol: { span: 12 } },
                justifyField: "center",
                size: "middle",
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
                ],
            },
        };
    }

    componentDidMount = () => {
        this.getData();
    };

    getData = () => {
        getList().then((res) => {
            if (res.success) {
                this.setState({
                    data: res.data,
                    filterData: res.data,
                    openModal: false,
                    editTimeoff: false,
                    loading: false,
                    FormFields: {
                        ...this.state.FormFields,
                        initialValues: {},
                    },
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
        if (!status) {
            this.setState({
                FormFields: {
                    ...this.state.FormFields,
                    initialValues: {},
                },
                openModal: status,
                editTimeoff: false,
            });
        } else {
            this.setState({ openModal: status });
        }
    };

    submit = () => {
        this.dynamoForm.current.refs.time_off.submit();
    };

    Callback = (vake) => {
        // this will work after I get the Object from the form
        if (!this.state.editTimeoff) {
            // to add new datas
            this.addType(vake.obj);
        } else {
            // to edit pervoius data
            this.editRecord(vake.obj);
        }
    };

    addType = (value) => {
        this.setState({loading:true})
        console.log(value);
        addList(value).then((res) => {
            if (res) {
                this.getData();
            }
        });
    };

    getRecord = (data) => {
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
        this.setState({loading:true})
        obj.id = this.state.editTimeoff;
        editLabel(obj).then((res) => {
            if (res) {
                this.getData();
            }
        });
    };

    generalFilter = (value) =>{
        const { data } = this.state
        if (value){
            this.setState({
                filterData: data.filter(el => {
                    return el.label && el.label.toLowerCase().includes(value.toLowerCase()) 
                })
            })
        }else{
            this.setState({
                filterData: data
            })
        }
    }

    render() {
        const {data, editTimeoff, openModal, loading, FormFields, filterData } = this.state;
        const columns = this.columns;
        return (
            <>
                <Row justify="space-between">
                    <Col>
                        <Title level={4}>Leave Categories</Title>
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
                            Add Leave Category
                        </Button>
                    </Col>
                    <Col span={24}>
                        <Table
                            title={()=>tableTitleFilter(5, this.generalFilter)}
                            bordered
                            pagination={{pageSize: localStore().pageSize}}
                            columns={columns}
                            dataSource={filterData}
                            size="small"
                            rowKey={(data) => data.id}
                            className='fs-small'
                        />
                    </Col>
                </Row>
                {openModal ? (
                    <Modal
                        title={ editTimeoff ? "Edit Leave Category" : "Add Leave Category" }
                        maskClosable={false}
                        centered
                        visible={ openModal }
                        onOk={() => { this.submit(); }}
                        okButtonProps={{ disabled: loading }}
                        okText={loading ?<LoadingOutlined /> :"Save"}
                        onCancel={() => {
                            this.toggelModal(false);
                        }}
                        width={600}
                    >
                        <Form
                            ref={this.dynamoForm}
                            Callback={this.Callback}
                            FormFields={FormFields}
                        />
                    </Modal>
                ) : null}
            </>
        );
    }
}

export default LeaveCategories;
