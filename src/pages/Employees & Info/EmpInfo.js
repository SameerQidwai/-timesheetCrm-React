import React, { Component } from "react";
import { Row, Col, Menu, Tabs, Button, Dropdown, Popconfirm, Descriptions, } from "antd";
import { SettingOutlined, DownOutlined } from "@ant-design/icons"; //Icons
import { Link } from "react-router-dom"; 

import Comments from "../../components/Core/Comments";
import Projects from "../../components/Core/Projects";
import Travels from "../../components/Core/Travels";
import Attachments from "../../components/Core/Attachments";
import Bank from "../../components/Core/Bank";

import InfoModal from "./InfoModal";

import { getRecord, delList } from "../../service/Employees";

import moment from "moment"

const { Item } = Descriptions;
const { TabPane } = Tabs;

class OrgInfo extends Component {
    constructor() {
        super();
        this.state = {
            infoModal: false,
            emp: false,
            data: {
                cpCode: '',
                firstName: '',
                lastName: '',
                gender: '',
                dateOfBirth:  '',
                phoneNumber: '',
                email: '',
                address: '',
                stateId: '',
            },
        };
    }
    componentDidMount = ()=>{
        const { id } = this.props.match.params
        this.getRecord(id)
    }

    getRecord = (id) =>{
        getRecord(id).then(res=>{
            if(res.success){
                this.setState({
                    data: res.basic,
                    emp: id
                })
            }
        })
    }

    closeModal = () => {
        this.setState({ infoModal: false, });
    };

    handleDelete = (id) => {
        delList(id).then((res) => {
            if (res.success) {
                this.props.history.push('/Employees')
            }
        });
    };

    callBack = () => {
        const { emp } = this.state
        this.getRecord(emp)
    };

    render() {
        const { data, infoModal, emp } = this.state;
        const DescTitle = (
            <Row justify="space-between">
                <Col>Basic Information</Col>
                <Col>
                    <Dropdown
                        overlay={
                            <Menu>
                                {/* <Menu.Item danger>
                                    <Popconfirm
                                        title="Sure to delete?"
                                        onConfirm={() => this.handleDelete(emp) }
                                    >
                                        Delete
                                    </Popconfirm>
                                </Menu.Item> */}
                                <Menu.Item onClick={() => { this.setState({ infoModal: true, }); }} >
                                    Edit
                                </Menu.Item>
                                <Menu.Item>
                                    <Link
                                        to={{
                                            pathname: `/Employee/contracts/${emp}`,
                                        }}
                                        className="nav-link"
                                    >
                                        Contracts
                                    </Link>
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
                    <Item label="First Name">{data.firstName}</Item>
                    <Item label="Last Name">{data.lastName}</Item>
                    <Item label="Phone">{data.phoneNumber} </Item>
                    <Item label="Email">{data.email}</Item>
                    <Item label="Address">{data.address}</Item>
                    <Item label="Date Of Birth">{data.dateOfBirth ? moment(data.dateOfBirth).format('DD MM YYYY'): null}</Item>
                    <Item label="Gender">{data.gender}</Item>
                </Descriptions>
                <Tabs
                    type="card"
                    style={{ marginTop: "50px" }}
                    defaultActiveKey="5"
                >
                    <TabPane tab="Project" key="project">
                        <Projects id={emp} />
                    </TabPane>
                    <TabPane tab="Travels" key="travels">
                        <Travels id={emp} />
                    </TabPane>
                    <TabPane tab="Comments" key="comments">
                        <Comments id={emp} />
                    </TabPane>
                    <TabPane tab="Attachments" key="attachments">
                        <Attachments />
                    </TabPane>
                    <TabPane tab="Account" key="account">
                        <Bank id={emp} title={data.name} />
                    </TabPane>
                </Tabs>
                {infoModal && (
                    <InfoModal
                        visible={infoModal}
                        editEmp={emp}
                        close={this.closeModal}
                        callBack={this.callBack}
                    />
                )}
            </>
        );
    }
}

export default OrgInfo;
