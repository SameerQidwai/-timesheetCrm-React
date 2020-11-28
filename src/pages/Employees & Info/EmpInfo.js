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

import Comments from "../../components/Core/Comments";
import Projects from "../../components/Core/Projects";
import Travels from "../../components/Core/Travels";
import Attachments from "../../components/Core/Attachments";
import Bank from "../../components/Core/Bank";

import InfoModal from "./InfoModal";

const { Item } = Descriptions;
const { TabPane } = Tabs;

class OrgInfo extends Component {
    constructor() {
        super();
        this.state = {
            infoModal: false,
            editEmp: false,
            data: {
                key: 2,
                contact: "+923316785557",
                email: "son's@g.com",
                name: "Musab",
                phone: "+921218967889",
                dob: "12/9/1997",
                address: "15 yemen road, Yemen",
                gender: "Male",
                s_date: "12/9/2020",
            },
        };
    }
    closeModal = () => {
        this.setState({
            infoModal: false,
            editEmp: false,
        });
    };

    callBack = (value, key) => {
        console.log(value);
        this.setState({
            data: value,
        });
    };

    render() {
        const { data, infoModal, editEmp } = this.state;
        const { id } = this.props.match.params;
        const DescTitle = (
            <Row justify="space-between">
                <Col>Basic Info</Col>
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
                                            editEmp: data.key,
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
                    <Item label="Name">{data.name}</Item>
                    <Item label="Phone">{data.contact} </Item>
                    <Item label="Email">{data.email}</Item>
                    <Item label="Address">{data.address}</Item>
                    <Item label="Date Of Birth">{data.dob}</Item>
                    <Item label="Gender">{data.gender}</Item>
                    <Item label="Start Date">{data.s_date}</Item>
                </Descriptions>
                <Tabs
                    type="card"
                    style={{ marginTop: "50px" }}
                    defaultActiveKey="5"
                >
                    <TabPane tab="Project" key="1">
                        <Projects id={id} />
                    </TabPane>
                    <TabPane tab="Travels" key="2">
                        <Travels id={id} />
                    </TabPane>
                    <TabPane tab="Comments" key="4">
                        <Comments id={id} />
                    </TabPane>
                    <TabPane tab="Attachments" key="5">
                        <Attachments />
                    </TabPane>
                    <TabPane tab="Account" key="6">
                        <Bank id={id} title={data.name} />
                    </TabPane>
                </Tabs>
                {infoModal && (
                    <InfoModal
                        visible={infoModal}
                        editEmp={editEmp}
                        close={this.closeModal}
                        callBack={this.callBack}
                    />
                )}
            </>
        );
    }
}

export default OrgInfo;
