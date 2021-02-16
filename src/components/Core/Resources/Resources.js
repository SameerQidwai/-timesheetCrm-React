import React, { Component } from "react";
import { Row, Col, Menu, Button, Dropdown, Descriptions, Table, Popconfirm } from "antd";
import { SettingOutlined, DownOutlined } from "@ant-design/icons"; //Icons
import { Link } from "react-router-dom"; 

import InfoModal from "./InfoModal";

import moment from "moment"

const { Item } = Descriptions;

class OrgInfo extends Component {
    constructor() {
        super();
        this.columns = [
            {
                title: "Skill",
                dataIndex: "skill",
                key: "skill",
            },
            {
                title: "Level",
                dataIndex: "level",
                key: "level",
            },
            {
                title: "Employee Name",
                dataIndex: "name",
                key: "names",
            },
            {
                title: "Billable Hours",
                dataIndex: "bill_h",
                key: "bill_h",
            },
            {
                title: "Buy Cost",
                dataIndex: "b_cost",
                key: "b_cost",
            },
            {
                title: "Sale Cost",
                dataIndex: "s_cost",
                key: "s_cost",
            },
            {
                title: "Start Date",
                dataIndex: "s_date",
                key: "s_date",
            },
            {
                title: "Ene Date",
                dataIndex: "s_date",
                key: "e_date",
            },
            {
                title: "Action",
                key: "action",
                align: "right",
                render: (record) => (
                    <Dropdown
                        overlay={
                            <Menu>
                                <Menu.Item danger>
                                    <Popconfirm
                                        title="Sure to delete?"
                                        onConfirm={() => this.handleDelete(record.id) }
                                    >
                                        Delete
                                    </Popconfirm>
                                </Menu.Item>
                                <Menu.Item
                                    onClick={() => {
                                        console.log(record.id);
                                        this.setState({ infoModal: true, editRex: record.id, });
                                    }}
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
            infoModal: false,
            editRex: false,
            data: [
                {
                    id: 1,
                    skill: 'devleoper',
                    level: 'Expert',
                    name: 'Experties',
                    bill_h: 8,
                    b_cost: 80,
                    s_cost: 100,
                    s_date: '19 Nov 2020',
                    s_date: '26 Nov 2020',
                }
            ],
        };
    }
    componentDidMount = ()=>{
        const { id } = this.props.match.params
        // this.getRecord(id)
    }

    getRecord = (id) =>{
        // getRecord(id).then(res=>{
        //     if(res.success){
        //         this.setState({
        //             data: res.basic,
        //             emp: id
        //         })
        //     }
        // })
    }

    closeModal = () => {
        this.setState({ infoModal: false, });
    };

    handleDelete = (id) => {
        // delList(id).then((res) => {
        //     if (res.success) {
        //         this.props.history.push('/Employees')
        //     }
        // });
    };

    callBack = () => {
        const { emp } = this.state
        this.getRecord(emp)
    };

    render() {
        const { data, infoModal, editRex } = this.state;
        return (
            <>
                <Descriptions
                    // title={DescTitle}
                    size="small"
                    bordered
                    layout="horizontal"
                    // extra={<Button type="primary">Edit</Button>}
                >
                    <Item label="First Name">{data.firstName}</Item>
                    <Item label="Last Name">{data.lastName}</Item>
                    <Item label="Phone">{data.phoneNumber} </Item>
                    <Item label="Email">{data.email}</Item>
                    <Item label="Address">{data.address}</Item>
                    <Item label="Date Of Birth">{data.dateOfBirth ? moment(data.dateOfBirth).format('DD MM YYYY'): null}</Item>
                    <Item label="Gender">{data.gender}</Item>
                </Descriptions>
                <Row justify="end">
                    <Col> <Button type="primary" size='small'  onClick={() => {  this.setState({ infoModal: true, editRex: false, }) }}>Add New</Button> </Col>
                    <Col> <Button type="danger" size='small'>Delete Resource</Button></Col>
                </Row>
                <Table
                    rowKey={(data) => data.id}
                    columns={this.columns}
                    dataSource={data}
                    size="small"
                />
                {infoModal && (
                    <InfoModal
                        visible={infoModal}
                        editEmp={editRex}
                        close={this.closeModal}
                        callBack={this.callBack}
                    />
                )}
            </>
        );
    }
}

export default OrgInfo;
