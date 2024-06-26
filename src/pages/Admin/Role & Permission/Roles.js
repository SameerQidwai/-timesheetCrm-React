import React, { Component } from "react";
import { Table, Menu, Dropdown, Button, Popconfirm, Row, Col, Typography, Modal, } from "antd";
import {
    DownOutlined, SettingOutlined, PlusSquareOutlined, LoadingOutlined } from "@ant-design/icons"; //Icons

import Form from "../../../components/Core/Form";
import "../../styles/table.css";
import Permission from "./Permission";
import { addList, delLabel, editLabel, getList } from "../../../service/Roles-Apis";
import { localStore } from "../../../service/constant";

const { Title } = Typography;

class Roles extends Component {
    constructor(props) {
        super(props);
        this.roleForm = React.createRef();
        this.columns = [
            {
                title: "Title",
                dataIndex: "label",
                key: "label",
            },
            {
                title: "Action",
                key: "action",
                align: "right",
                render: (record, obj , index) => (
                    <Dropdown
                        overlay={
                            <Menu>
                                <Menu.Item disabled={record.isSystem} onClick={() => { this.getRecord(record, index); }} > Edit </Menu.Item>
                                <Menu.Item onClick={()=>this.callPermission(record, index)}> Permissions </Menu.Item>
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
            data: [ ],
            

            openModal: false,
            editRole: false,
            perModal: false,
            permissions: false,
            isSystem: false,
            loading: false,
            FormFields: {
                formId: "role_form",
                justify: "center",
                FormCol: 20,
                FieldSpace: { xs: 12, sm: 16, md: 122 },
                layout: { labelCol: { span: 12 } },
                justifyField: "center",
                // FormLayout:'inline',
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
    componentDidMount = () =>{
        this.getRoles()
    }

    getRoles = () =>{
        getList().then(res=>{
            if(res.success){
                this.setState({
                    data: res.data,
                    openModal: false,
                    editRole: false,
                })
            }
        })
    }

    closeModal = () => {
            this.roleForm.current.refs.role_form.resetFields(); // to reset file
            this.setState({
                openModal: false,
                editRole: false,
            });
    };

    Callback = (vake) => {
        // this will work after I get the Object from the form
        const { editRole } = this.state
        if (!editRole) {
            this.addRecord(vake.obj)
        } else {
            this.editRecord(vake.obj);
        }
    };
    addRecord = (data) => {
        addList(data).then(res=>{
            if (res.success){
                this.setState({
                    data: [...this.state.data, res.data],
                    openModal: false
                })
            }
        })
    }
    getRecord = (data, index) => {
        this.setState({
            editRole: data.id,
            openModal: true,
            roleIndex: index
        },()=>{
            this.roleForm.current.refs.role_form.setFieldsValue({obj:data})
        })
    };

    editRecord = (obj) => {
        const { editRole, roleIndex, data } = this.state
        editLabel(editRole, obj).then(res=>{
            if (res.success){
                data[roleIndex] = res.data
                console.log(data);
                this.setState({
                    data: [...data],
                    editRole: false,
                    openModal: false,
                    roleIndex: false
                })
            }
        })
    };

    callPermission = (record, index) => {//record.isSystem
        console.log(record);
        this.setState({ perModal: true, editRole: record.id,  roleIndex: index, permissions: record.permissions??[], isSystem: record.isSystem});
    };

    updatePermission = (value) =>{
        const {roleIndex, data } = this.state
        data[roleIndex] = value
        console.log(data);
        this.setState({
            data: [...data],
            editRole: false,
            openModal: false,
            roleIndex: false,
            perModal: false
        })
    }
    perColse = () =>{
        this.setState({
            perModal: false,
            editRole: false,
            openModal: false,
            roleIndex: false
        })
    }

    render() {
        const {data, openModal, editRole, FormFields, perModal, loading, permissions, isSystem} = this.state;
        const columns = this.columns;
        return (
            <>
                <Row justify="space-between">
                    <Col>
                        <Title level={4}>Roles</Title>
                    </Col>
                    <Col style={{ textAlign: "end" }}>
                        <Button
                            type="primary"
                            onClick={() => { this.setState({openModal: true}) }}
                            size="small"
                        > <PlusSquareOutlined /> Add Roles </Button>
                    </Col>
                    <Col span={24}>
                        <Table
                            pagination={{pageSize: localStore().pageSize}}
                            rowKey="id"
                            columns={columns}
                            dataSource={data}
                            size="small"
                        />
                    </Col>
                </Row>
                {openModal && (
                    <Modal
                        title={ editRole ? "Edit Role" : "Add New Role" }
                        maskClosable={false}
                        centered
                        visible={openModal}
                        okButtonProps={{ disabled: loading, htmlType: 'submit', form: 'role_form' }}
                        okText={loading ?<LoadingOutlined /> :"Save"}
                        onCancel={() => { this.closeModal() }}
                        width={600}
                    >
                        <Form
                            ref={this.roleForm}
                            Callback={this.Callback}
                            FormFields={FormFields}
                        />
                    </Modal>
                )}
                {perModal && <Permission
                    isVisible={perModal}
                    Callback={this.updatePermission}
                    perData={permissions}
                    isSystem={isSystem}
                    eidtPer={editRole}
                    closeModal={this.perColse}
                />}
            </>
        );
    }
}

export default Roles;
