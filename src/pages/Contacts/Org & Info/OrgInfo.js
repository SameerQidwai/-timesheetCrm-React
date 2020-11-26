import React, { Component } from "react";
// import { ContactsOutlined, MailOutlined, TranslationOutlined, AliwangwangOutlined, DollarOutlined } from '@ant-design/icons';

import {
    Row,
    Col,
    Menu,
    Tabs,
    Button,
    Dropdown,
    Popconfirm,
    Descriptions,
} from "antd";

import { SettingOutlined, DownOutlined } from "@ant-design/icons"; //Icons

import Comments from "../../../components/Core/Comments";
import Projects from "../../../components/Core/Projects";
import Opportunity from "../../../components/Core/Opportunities";
import ChildOrg from "./ChildOrg";

import InfoModal from "./InfoModal";

const { Item } = Descriptions;
const { TabPane } = Tabs;

class OrgInfo extends Component {
    constructor() {
        super();
        this.state = {
            infoModal: false,
            editOrg: false,
            data: {
                key: 2,
                EBA: "89898987",
                address: "New York",
                contact: "+923316785557",
                contactName: "Farukh",
                email: "son's@g.com",
                name: "Musab & sons ",
                phone: "+921218967889",
                website: "M&S.com.us",
            },
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
        console.log(this.props.match.params);
        //call function here to render data from node
    };

    render() {
        const { data, infoModal, editOrg } = this.state;
        const DescTitle = (
            <Row justify="space-between">
                <Col>{data.name}</Col>
                <Col>
                    {" "}
                    <Dropdown
                        overlay={
                            <Menu>
                                <Menu.Item danger>
                                    <Popconfirm
                                        title="Sure to delete?"
                                        // onConfirm={() =>
                                        //     this.handleDelete(
                                        //     )
                                        // }
                                    >
                                        Delete
                                    </Popconfirm>
                                </Menu.Item>
                                <Menu.Item
                                    onClick={() => {
                                        this.setState({
                                            infoModal: true,
                                            editOrg: data.key,
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
                    <Item label="Contact">{data.contact}</Item>
                    <Item label="Email">{data.email}</Item>
                    <Item label="Address">{data.address}</Item>
                    <Item label="Website">{data.website}</Item>
                    <Item label="EBA">{data.EBA}</Item>
                </Descriptions>
                <Tabs
                    type="card"
                    style={{ marginTop: "50px" }}
                    // defaultActiveKey="3"
                >
                    <TabPane tab="Project" key="1">
                        <Projects {...this.props.match.params} />
                    </TabPane>
                    <TabPane tab="Opportunity" key="2">
                        <Opportunity {...this.props.match.params} />
                    </TabPane>
                    <TabPane tab="Comments" key="3">
                        <Comments {...this.props.match.params} />
                    </TabPane>
                    <TabPane tab="Sub-organization" key="4">
                        <ChildOrg {...this.props.match.params} />
                    </TabPane>
                </Tabs>
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
