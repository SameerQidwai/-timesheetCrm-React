import React, { Component } from "react";
import { Table, Menu, Dropdown, Button, Popconfirm, Row, Col, Typography, Modal, Form, InputNumber, Select, Space, Input} from "antd";
import { DownOutlined, SettingOutlined, PlusSquareOutlined, MinusCircleFilled, LoadingOutlined} from "@ant-design/icons"; //Icons

// import Form from "../../components/Core/Form";

import { timeOff, addList, getList, editLabel, delLabel, } from "../../service/time-off-policy";
import { localStore } from "../../service/constant";
import FormItems from "../../components/Core/Forms/FormItems";
import { tableSorter, tableTitleFilter } from "../../components/Core/Table/TableFilter";

const { Title } = Typography;

class LeavePolicies extends Component {
    constructor(props) {
        super(props);
        this.formRef = React.createRef();
        this.addField = React.createRef();

        this.columns = [
            {
                title: "Code",
                dataIndex: "id",
                key: "id",
                width: '5%',
                ...tableSorter('id', 'number', true)
            },
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
                                    key="Delete"
                                    className="pop-confirm-menu"
                                    danger
                                >
                                    <Popconfirm
                                        title="Are you sure you want to delete ?"
                                        onConfirm={() =>
                                            this.handleDelete(record.id)
                                        }
                                        okText="Yes"
                                        cancelText="No"
                                     >
                                       <div> Delete </div>
                                    </Popconfirm>
                                </Menu.Item>
                                <Menu.Item
                                    key="Edit"
                                    onClick={() => this.getRecord(record, text)}
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
            loading: false,

            FormFields: [
                {
                    object: "obj",
                    fieldCol: 24,
                    key: "label",
                    label: "Policy Title",
                    size: "small",
                    rules: [
                        {
                            required: true,
                            message: "Policy Title is Required",
                        },
                    ],
                    type: "Input",
                    labelAlign: "left",
                    itemStyle: { marginBottom: "5px" },
                },
                {
                    fieldCol: 24,
                    layout: { wrapperCol: { span: 0 } },
                    Placeholder: "Insert Leave Type",
                    type: "Button",
                    mode: "primary",
                    style: { textAlign: "right" },
                    size: "small",
                    onClick: (value, e) => {
                        this.addField.click()
                    },
                    itemStyle: { marginBottom: 5 },
                },
                {
                    fieldCol: 5,
                    Placeholder: "Categories",
                    type: "Text",
                    size: "small",
                    style: {margin: 'auto 0'}
                },
                {
                    fieldCol: 2,
                    layout: {
                        wrapperCol: { offset: 1 },
                    },
                    Placeholder: "Earn Hours",
                    type: "Text",
                    size: "small",
                    style: {margin: 'auto 0'}
                },
                {
                    fieldCol: 3,
                    layout: {
                        wrapperCol: { offset: 1 },
                    },
                    Placeholder: "Earn Every",
                    type: "Text",
                    size: "small",
                    style: {margin: 'auto 0'}
                },
                {
                    fieldCol: 2,
                    layout: {
                        wrapperCol: { offset: 1 },
                    },
                    Placeholder: "Reset Hours",
                    type: "Text",
                    size: "small",
                    style: {margin: 'auto 0'}
                },
                {
                    fieldCol: 3,
                    layout: {
                        wrapperCol: { offset: 1 },
                    },
                    Placeholder: "Reset Every",
                    type: "Text",
                    size: "small",
                    style: {margin: 'auto 0'}
                },
                {
                    fieldCol: 2,
                    layout: {
                        wrapperCol: { offset: 1 },
                    },
                    Placeholder: "Threshold",
                    type: "Text",
                    size: "small",
                    style: {margin: 'auto 0'}
                },
                {
                    fieldCol: 2,
                    layout: {
                        wrapperCol: { offset: 1 },
                    },
                    Placeholder: "Overdraw Allowance",
                    type: "Text",
                    size: "small",
                    style: {margin: 'auto 0'}
                },
                {
                    fieldCol: 2,
                    layout: {
                        wrapperCol: { offset: 1 },
                    },
                    Placeholder: "Balance Required",
                    type: "Text",
                    size: "small",
                    style: {margin: 'auto 0'}
                },
                {
                    fieldCol: 2,
                    layout: {
                        wrapperCol: { offset: 1 },
                    },
                    Placeholder: "Include Holidays",
                    type: "Text",
                    size: "small",
                    style: {margin: 'auto 0'}
                },
            ],

            FormFields_1: [
                {
                    fieldCol: 5,
                    key: "leaveRequestTypeId",
                    size: "small",
                    type: "Select",
                    itemStyle: { marginBottom: "5px" },
                },
                {
                    fieldCol: 2,
                    key: "earnHours",
                    initialValue:  0,
                    size: "small",
                    type: "InputNumber",
                    fieldStyle: { width: "100%" },
                },
                {
                    fieldCol: 3,
                    key: "earnEvery",
                    initialValue: 'N',
                    size: "small",
                    type: "Select",
                    labelAlign: "left",
                    data: [
                        { value: "M", label: "Monthly" },
                        { value: "Y", label: "Yearly" },
                        { value: "A", label: "Anniversary" },
                        { value: "MA", label: "Monthly Anniversary" },
                        { value: "N", label: "NEVER" },
                    ],
                },
                {
                    fieldCol: 2,
                    key: "resetHours",
                    initialValue:  0,
                    size: "small",
                    type: "InputNumber",
                    labelAlign: "left",
                    fieldStyle: { width: "100%" },
                },
                {
                    fieldCol: 3,
                    key: "resetEvery",
                    initialValue: 'N',
                    size: "small",
                    type: "Select",
                    labelAlign: "left",
                    data: [
                        { value: "M", label: "Monthly" },
                        { value: "Y", label: "Yearly" },
                        { value: "A", label: "Anniversary" },
                        { value: "MA", label: "Monthly Anniversary" },
                        { value: "N", label: "NEVER" },
                    ],
                },
                {
                    fieldCol: 2,
                    key: "threshold",
                    initialValue:  0,
                    size: "small",
                    type: "InputNumber",
                    labelAlign: "left",
                    fieldStyle: { width: "100%" },
                },
                {
                    fieldCol: 2,
                    key: "minimumBalance",
                    initialValue:  0,
                    size: "small",
                    type: "InputNumber",
                    labelAlign: "left",
                    fieldStyle: { width: "100%" },
                    rules:[{ type: 'number', max: 0, message: 'Maximum 0' }],
                },
                {
                    fieldCol: 2,
                    key: "minimumBalanceRequired",
                    initialValue:  0,
                    size: "small",
                    type: "InputNumber",
                    labelAlign: "left",
                    fieldStyle: { width: "100%" },
                    rules:[{ type: 'number', min: 0 , message: 'Minimum 0' }],
                },
                {
                    fieldCol: 1,
                    key: "includeOffDays",
                    valuePropName:"checked",
                    size: "small", 
                    type: "Switch",
                    labelAlign: "left",
                    style:{textAlign: 'center'}
                },
            ],

            editTimeoff: false,
        };
    }

    componentDidMount = () => {
        this.timeOff();
        this.getData();
    };

    timeOff = () => {
        timeOff().then((res) => {
            if (res.success) {
                const { FormFields_1 } = this.state
                FormFields_1[0].data = res.data
                this.setState({
                    FormFields_1,
                });
            }
        });
    };
    getData = () => {
        getList().then((res) => {
            if (res.success) {
                this.setState({
                    data: res.data,
                    filterData: res.data,
                    openModal: false,
                    editTimeoff: false,
                    loading: false
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

    getRecord = (data, text) => {   
        this.setState({
            editTimeoff: data.id,
            openModal: true,
        },()=>this.formRef.current.setFieldsValue({obj: data}));
    };

    editRecord = (value) => {
        value.id = this.state.editTimeoff;
        this.setState({loading: true})
        editLabel(value).then((res) => {
            if (res) {
                this.getData();
            }
        });
    };

    renderTable = (value) => {
        this.setState({loading: true})
        addList(value).then((res) => {
            this.getData();
        });
    };

    onFinish = (values) =>{
        const { obj } = values
        if (!this.state.editTimeoff) {
            console.log("emes");
            this.renderTable(obj);
        } else {
            console.log("edit");
            this.editRecord(obj);
        }
    }
    
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
        const {data, openModal, editTimeoff, FormFields, FormFields_1, loading, filterData} = this.state;
        const columns = this.columns;
        return (
            <>
                <Row justify="space-between">
                    <Col>
                        <Title level={4}>Leave Policies </Title>
                    </Col>
                    <Col style={{ textAlign: "end" }}>
                        <Button
                            type="primary"
                            onClick={() => {
                                this.setState({openModal: true})
                            }}
                            size="small"
                        >
                            <PlusSquareOutlined />
                            Add Leave Policy
                        </Button>
                    </Col>
                    <Col span={24}>
                        <Table
                            title={()=>tableTitleFilter(5, this.generalFilter)}
                            bordered
                            pagination={{pageSize: localStore().pageSize}}
                            rowKey={(data) => data.id}
                            columns={columns}
                            dataSource={filterData}
                            size="small"
                            className='fs-small'
                        />
                    </Col>
                </Row>
                {openModal && (
                    <Modal
                        title={ editTimeoff ? "Edit Leave Policy" : "Add Leave Policy" }
                        maskClosable={false}
                        centered
                        visible={openModal}
                        okButtonProps={{ disabled: loading, htmlType: 'submit', form: 'my-form' }}
                        okText={loading ?<LoadingOutlined /> :"Save"}
                        onCancel={() => { this.setState({openModal: false}) }}
                        width={1400}
                        forceRender={true}
                    >   
                    <Form
                        id={'my-form'}
                        ref={this.formRef}
                        onFinish={this.onFinish}
                        scrollToFirstError={true}
                        size="small"
                        layout="inline"
                    >
                        <FormItems FormFields={FormFields} />

                        <Form.List 
                            name={['obj', "leaveRequestPolicyLeaveRequestTypes"]}
                            // initialValue={[{ earnHours: 0, earnEvery: 'N', resetHours: 0, resetEvery: 'N', threshold: 0, minimumBalance: 0, minimumBalanceRequired: 0,}]}
                        >
                            {(fields, { add, remove }) => (<>
                                <Form.Item style={{textAlign: "right"}}>
                                    <Button size="small" onClick={() => add()} ref={(el)=>this.addField =el} >
                                    </Button>
                                </Form.Item>
                                    {fields.map(({name, key}) => (
                                    <span className="ant-row" key={key} style={{width: '100%'}}>
                                        <FormItems FormFields={FormFields_1} listName={name} />
                                        <MinusCircleFilled style={{color:"red",margin: 'auto'}} onClick={() => remove(name)} />
                                    </span>
                                ))}
                            </>)}
                        </Form.List>
                        </Form>
                    </Modal>
                )}
            </>
        );
    }
}

export default LeavePolicies;