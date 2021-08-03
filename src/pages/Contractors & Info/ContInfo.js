import React, { Component } from "react";
import { Row, Col, Menu, Tabs, Button, Dropdown, Descriptions, } from "antd";
import { SettingOutlined, DownOutlined } from "@ant-design/icons"; //Icons
import { Link } from "react-router-dom"; 

import Comments from "../../components/Core/Comments";
import Projects from "../../components/Core/Projects";
// import Travels from "../../components/Core/Travels";
import Attachments from "../../components/Core/Attachments";
import Bank from "../../components/Core/Bank";

import InfoModal from "./Modals/InfoModal";

import { getRecord, delList } from "../../service/contractors";
import { localStore } from "../../service/constant";
import  moment from "moment";

const { Item } = Descriptions;
const { TabPane } = Tabs;

class ContInfo extends Component {
    constructor() {
        super();
        this.state = {
            infoModal: false,
            editCont: false,
            data: { },
            permissions: {}
        };
    }

    componentDidMount = ()=>{
        const { id } = this.props.match.params
        this.getRecord(id)
    }

    getRecord = (id) =>{
        const { USERS }= JSON.parse(localStore().permissions)
        getRecord(id).then(res=>{
            if(res.success){
                this.setState({
                    data: res.basic,
                    editCont: id,
                    permissions: USERS
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
                this.props.history.push('/sub-contractors')
            }
        });
    };

    callBack = () => {
        const { editCont } = this.state
        this.getRecord(editCont)
    };


    render() {
        const { data, infoModal, editCont, permissions } = this.state;
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
                                <Menu.Item 
                                    onClick={() => { this.setState({ infoModal: true }); }} 
                                    disabled={permissions['UPDATE']}
                                >
                                    Edit
                                </Menu.Item>
                                <Menu.Item>
                                    <Link
                                        to={{
                                            pathname: `/sub-contractors/${editCont}/contracts`,
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
                {editCont && (
                    <Tabs
                        type="card"
                        style={{ marginTop: "50px" }}
                        // defaultActiveKey="1"
                    >
                        <TabPane tab="Projects" key="projects">
                            <Projects targetId={editCont} customUrl={`helpers/work?type=P&employee=${editCont}`} />
                        </TabPane>
                        <TabPane tab="Comments" key="comments">
                            <Comments targetType="CON" targetId={editCont} />
                        </TabPane>
                        <TabPane  tab="Attachments" key="attachments">
                            <Attachments targetType="CON" targetId={editCont}/>
                        </TabPane>
                    </Tabs>
                )}
                {infoModal && (
                    <InfoModal
                        visible={infoModal}
                        editCont={editCont}
                        close={this.closeModal}
                        callBack={this.callBack}
                    />
                )}
            </>
        );
    }
}

export default ContInfo;
