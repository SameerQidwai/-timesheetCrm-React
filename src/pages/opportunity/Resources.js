import React, { Component } from "react";
import { Row, Col, Menu, Button, Dropdown, Descriptions, Table, Popconfirm } from "antd";
import { SettingOutlined, DownOutlined } from "@ant-design/icons"; //Icons
import { Link } from "react-router-dom"; 

import InfoModal from "./resModal";
import { getRecord, getResources, delResource } from "../../service/opportunities";

import moment from "moment"

const { Item } = Descriptions;

class OrgInfo extends Component {
    constructor() {
        super();
        this.columns = [
            {
                title: "Skill",
                dataIndex: "panelSkill",
                key: "panelSkill",
                render: (record)=> {return record  && record.label}
            },
            {
                title: "Level",
                dataIndex: "panelSkillStandardLevel",
                key: "panelSkillStandardLevel",
                render: (record)=> {return record && record.levelLabel}
            },
            {
                title: "Employee Name",
                dataIndex: "user",
                key: "user",
                render: (record)=> {return record && `${record.contactPersonOrganization.contactPerson.firstName} ${record.contactPersonOrganization.contactPerson.lastName}`}
            },
            {
                title: "Billable Hours",
                dataIndex: "billableHours",
                key: "billableHours",
            },
            {
                title: "Buy Cost",
                dataIndex: "buyingRate",
                key: "buyingRate",
            },
            {
                title: "Sale Cost",
                dataIndex: "sellingRate",
                key: "sellingRate",
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
            leadId: false,
            data: [],
            desc: {},
        };
    }

    componentDidMount = ()=>{
        const { id } = this.props.match.params
        this.fetchAll(id)
    }

    fetchAll = (id) =>{
        Promise.all([ getRecord(id), getResources(id)])
        .then(res => {
            console.log(res[1].data);
            this.setState({
                desc: res[0].success? res[0].data : {},
                editRex: false,
                infoModal: false,
                leadId: id,
                data: res[1].success? res[1].data : [],
            })
        })
        .catch(e => {
            console.log(e);
        })
    }

    getResources = (id) =>{
        getResources(id).then(res=>{
            if(res.success){
                this.setState({
                    data: res.data,
                    editRex: false,
                    infoModal: false,
                })
            }
        })
    }

    closeModal = () => {
        this.setState({ infoModal: false, editRex: false});
    };

    handleDelete = (rId) => {
        const { id } = this.props.match.params //opputunityId
        console.log(id);
        delResource(id, rId).then((res) => {
            if (res.success) {
                this.props.history.push('/Employees')
            }
        });
    };

    callBack = () => {
        const { leadId } = this.state
        console.log(leadId);
        this.getResources(leadId)
    };

    render() {
        const { desc, data, infoModal, editRex, leadId } = this.state;
        return (
            <>
                <Descriptions
                    // title={DescTitle}
                    size="small"
                    bordered
                    layout="horizontal"
                    // extra={<Button type="primary">Edit</Button>}
                >
                    <Item label="First Name">{desc.title}</Item>
                    <Item label="Last Name">{desc.value}</Item>
                    <Item label="Phone">{desc.startDate ? moment(desc.startDate).format('ddd DD MM YYYY'): null} </Item>
                    <Item label="Email">{desc.endDate ? moment(desc.endDate).format('ddd DD MM YYYY'): null}</Item>
                    <Item label="Address">{desc.bidDate ? moment(desc.bidDate).format('ddd DD MM YYYY'): null}</Item>
                    {/* <Item label="Gender">{data.gender}</Item> */}
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
                        editRex={editRex}
                        leadId = {leadId}
                        panelId = {desc.panelId}
                        close={this.closeModal}
                        callBack={this.callBack}
                    />
                )}
            </>
        );
    }
}

export default OrgInfo;
