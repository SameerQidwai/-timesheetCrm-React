import React, { Component } from "react";
import { Typography, Row, Col, Popconfirm, Modal, Button, Table, Dropdown, Menu, } from "antd";
import { SettingOutlined, DownOutlined, PlusSquareOutlined, LoadingOutlined} from "@ant-design/icons"; //Icons
import Forms from "../../../components/Core/Forms/Form";

import { getList, addList, delLabel, editLabel, } from "../../../service/holiday-type";
import { localStore } from "../../../service/constant";
import { tableSorter, tableTitleFilter } from "../../../components/Core/Table/TableFilter";

const { Title } = Typography;

class HolidayTypes extends Component {
    constructor() {
        super();
        this.HalForm = React.createRef();
        this.columns = [
            {
                title: "Types",
                dataIndex: "label",
                key: "label",
                ...tableSorter('label', 'string')
            },
            {
                title: "Action",
                key: "action",
                align: "right",
                width: 115,
                render: (record, text) => (
                    <Dropdown
                        overlay={
                            <Menu>
                                <Menu.Item
                                    key="Edit"
                                    onClick={() => this.getRecord(record, text)}
                                >
                                    Edit
                                </Menu.Item>
                                <Menu.Item 
                                    key="Delete"
                                    danger
                                    className="pop-confirm-menu"
                                >
                                    <Popconfirm
                                        title="Are you sure you want to delete"
                                        onConfirm={() =>
                                            this.handleDelete(record.id)
                                        }
                                    >
                                        <div> Delete </div>
                                    </Popconfirm>
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
            isVisible: false,
            newType: "",
            data: [],
            filterData: [],
            editType: false,
            FormFields: {
                formId: "type_form",
                FormCol: 20,
                FieldSpace: { xs: 12, sm: 16, md: 122 },
                // layout: { labelCol: { span: 8 } },
                FormLayout: "inline",
                size: "middle",
                fields: [
                    {
                        object: "obj",
                        fieldCol: 24,
                        key: "label",
                        label: "Name",
                        labelAlign: "right",
                        type: "Input",
                        size: "small",
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
                    isVisible: false,
                    editType: false,
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

    submit = () => {
        this.HalForm.current.refs.type_form.submit();
    };

    Callback = (value) => {
        if (!this.state.editType) {
            this.addType(value.obj);
        } else {
            this.editRecord(value.obj);
        }
    };

    addType = (value) => {
        this.setState({loading: false})
        addList(value).then((res) => {
            if (res) {
                this.HalForm.current.refs.type_form.resetFields();
                this.getData();
            }
        });
    };

    getRecord = (data) => {
        const obj = Object.assign({}, data);
        // console.log(obj);
        this.setState({
            FormFields: {
                ...this.state.FormFields,
                initialValues: { obj: obj },
            },
            editType: obj.id,
            isVisible: true,
        });
    };

    editRecord = (obj) => {
        const { editType } = this.state;
        this.setState({loading: false})
        obj.id = editType;
        editLabel(obj).then((res) => {
            if (res) {
                this.HalForm.current.refs.type_form.resetFields();
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
        const { data, isVisible, editType, FormFields, loading, filterData } = this.state;
        return (
            <>
                <Row justify="space-between">
                    <Col>
                        <Title level={3}>Holiday Types</Title>
                    </Col>
                    <Col>
                        <Button
                            type="primary"
                            size="small"
                            onClick={() => {
                                this.setState({
                                    isVisible: true, //Open Modal
                                });
                            }}
                        >
                            <PlusSquareOutlined /> Holiday Type
                        </Button>
                    </Col>
                </Row>
                <Table
                    title={()=>tableTitleFilter(5, this.generalFilter)}
                    bordered
                    pagination={{pageSize: localStore().pageSize}}
                    columns={this.columns}
                    dataSource={filterData}
                    size="small"
                    rowKey={(data) => data.id}
                    className='fs-small'
                />
                {isVisible && (
                    <Modal
                        title={editType ? "Edit Type" : "Add Type"}
                        maskClosable={false}
                        centered
                        visible={isVisible}
                        okButtonProps={{ disabled: loading }}
                        okText={loading ?<LoadingOutlined /> :"Save"}
                        width={400}
                        onCancel={() => {
                            delete FormFields.initialValues; // delete initialValues of fields on close
                            this.setState({
                                isVisible: false, //close
                                FormFields: FormFields, //delete Formfields on Close
                            });
                        }}
                        onOk={() => {
                            this.submit();
                        }}
                    >
                        <Row justify="center">
                            <Forms
                                ref={this.HalForm}
                                Callback={this.Callback}
                                FormFields={FormFields}
                            />
                        </Row>
                    </Modal>
                )}
            </>
        );
    }
}

export default HolidayTypes;
