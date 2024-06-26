import React, { Component } from "react";
import { Row, Col, Menu, Tabs, Button, Dropdown, Popconfirm, Descriptions, } from "antd";
import { SettingOutlined, DownOutlined } from "@ant-design/icons"; //Icons

import Comments from "../../../components/Core/Comments";
import Projects from "../../../components/Core/Projects";
import Opportunity from "../../../components/Core/Opportunities";
import Bank from "../../../components/Core/Bank";
import Attachments from "../../../components/Core/Attachments";
import ChildOrg from "./ChildOrg"; 

import InfoModal from "./InfoModal";

import { getOrgRecord, delOrg } from "../../../service/Organizations";

const { Item } = Descriptions;
const { TabPane } = Tabs;

class OrgInfo extends Component {
    constructor() {
        super();
        this.state = {
            infoModal: false,
            editOrg: false,
            data: { },
            bank: {},
            basic: {},
            organizationId: false,
        };
    }
    closeModal = () => {
        this.setState({
            infoModal: false,
            editOrg: false,
        });
    };

    callBack = (value, key) => {
        console.log(value);
        this.setState({
            data: value,
        });
    };
    componentDidMount = () => {
        const {id} = this.props.match.params;
        this.getOrgRecord(id)
        //call function here to render data from node
    };
    getOrgRecord = (id) =>{
        getOrgRecord(id).then((res) => {
            if(res.success){
                this.setState({
                    data: res.data,
                    basic: res.basic,
                    bank: res.bank,
                    organizationId: id,
                })
            }
        })
    }
    handleDelete = (id) => {
        delOrg(id).then((res) => {
            if (res.success) {
                window.location.href = '/organizations'
            }
        });
    };

    render() {
        const { data, bank, infoModal, editOrg, organizationId, basic } = this.state;
        const DescTitle = (
            <Row justify="space-between">
                <Col>{data.name}</Col>
                <Col>
                    <Dropdown
                        overlay={
                            <Menu>
                                <Menu.Item danger>
                                    <Popconfirm
                                        title="Sure to delete?"
                                        onConfirm={() => this.handleDelete(data.id) }
                                    >
                                        Delete
                                    </Popconfirm>
                                </Menu.Item>
                                <Menu.Item
                                    onClick={() => {
                                        this.setState({
                                            infoModal: true,
                                            editOrg: data.id,
                                        });
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
                </Col>
            </Row>
        );
        return (
            <>
                <Descriptions
                    title={DescTitle}
                    size="small"
                    bordered
                    layout="horizontal"
                    // extra={<Button type="primary">Edit</Button>}
                >
                    <Item label="Contact">{data.phoneNumber}</Item>
                    <Item label="Email">{data.email}</Item>
                    <Item label="Address">{data.address}</Item>
                    <Item label="Website">{data.website}</Item>
                    <Item label="EBA">{data.expectedBusinessAmount}</Item>
                    <Item label="Contact Person">{basic ?basic.delegate_contactPerson: null}</Item>
                </Descriptions>
                {organizationId &&(
                    <Tabs
                        type="card"
                        style={{ marginTop: "50px" }}
                        // defaultActiveKey="comments"
                    >
                        <TabPane tab="Project" key="project">
                            <Projects targetId={organizationId} customUrl={`helpers/work?type=P&organization=${organizationId}`} />
                        </TabPane>
                        <TabPane tab="Opportunity" key="opportunity">
                            <Opportunity targetId={organizationId} customUrl={`helpers/work?type=O&organization=${organizationId}`}  />
                        </TabPane>
                        {/* <TabPane tab="Sub-organization" key="sub">
                            <ChildOrg {...this.props.match.params} />
                        </TabPane> */}
                        <TabPane tab="Attachments" key="attachments">
                            <Attachments targetId={organizationId} targetType="ORG" />
                        </TabPane>
                        <TabPane tab="Comments" key="comments">
                            <Comments targetId={organizationId} targetType="ORG" />
                        </TabPane>
                        
                        <TabPane tab="Bank Account" key="Bank">
                            <Bank targetId={organizationId} title={data.name} bank={bank} />
                        </TabPane>
                    </Tabs>
                )}
                {infoModal && (
                    <InfoModal
                        visible={infoModal}
                        editOrg={editOrg}
                        close={this.closeModal}
                        callBack={this.callBack}
                    />
                )}
            </>
        );
    }
}

export default OrgInfo;
