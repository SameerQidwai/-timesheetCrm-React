import React, { Component } from "react";
import { Row, Col, Menu, Tabs, Button, Dropdown, Descriptions, Popconfirm, } from "antd";
import { SettingOutlined, DownOutlined } from "@ant-design/icons"; //Icons
import { Link } from "react-router-dom"; 

import Comments from "../../components/Core/Comments";
import Projects from "../../components/Core/Projects";
// import Travels from "../../components/Core/Travels";
import Attachments from "../../components/Core/Attachments";
import ContractorCalculator from "../../components/Core/Cost Calculator/ContractorCalculator"
// import Bank from "../../components/Core/Bank";

import InfoModal from "./Modals/InfoModal";

import { getRecord, delList } from "../../service/contractors";
import { formatDate, GENDER, localStore } from "../../service/constant";
import AuthError from "../../components/Core/AuthError";
import { generalDelete } from "../../service/delete-Api's";

const { Item } = Descriptions;
const { TabPane } = Tabs;

class ContInfo extends Component {
    constructor() {
        super();
        this.state = {
            infoModal: false,
            editCont: false,
            data: { },
            permissions: {},
            notAuth: false,
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
                    permissions: USERS,
                    infoModal: false
                })
            }else if(res.authError){
                this.setState({ notAuth: true })
            }
        })
    }

    closeModal = () => {
        this.setState({ infoModal: false, });
    };

    handleDelete = (id) => {
        const url = '/sub-contractors'
        const { history } = this.props
        generalDelete(history, url, id).then(res =>{
            if (res.success){
                //wil not work
            }
        })
    };

    callBack = () => {
        const { editCont } = this.state
        this.getRecord(editCont)
    };


    render() {
        const { data, infoModal, editCont, permissions, notAuth } = this.state;
        const DescTitle = (
            <Row justify="space-between"> 
                 <Col>Basic Information</Col>
                <Col>
                    <Dropdown
                        overlay={
                            <Menu>
                                <Menu.Item 
                                    key="delete"
                                    danger
                                    disabled={!permissions?.['DELETE']}
                                >
                                    <Popconfirm
                                        title="Are you sure you want to delete" 
                                        onConfirm={() => this.handleDelete(editCont)} 
                                    >
                                        Delete
                                    </Popconfirm>
                                </Menu.Item >
                                <Menu.Item 
                                    key="edit"
                                    onClick={() => { this.setState({ infoModal: true }); }} 
                                    disabled={!permissions?.['UPDATE']}
                                >
                                    Edit
                                </Menu.Item>
                                <Menu.Item 
                                    key='contract'
                                >
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
                    <Item label="Date Of Birth">{formatDate(data.dateOfBirth, true, true)}</Item>
                    <Item label="Gender">{GENDER[data.gender]}</Item>
                    {data.organization && <Item label="Organisation">{
                        <Link 
                        to={{ pathname: `/organisations/${data.organization.id}/info`, }}
                        className="nav-link"
                    >
                        {data.organization.name}</Link> 
                    }</Item> }
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
                        <TabPane tab="Cost Calculator" key="cost-calculator">
                            <ContractorCalculator conId={editCont}/>
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
                {notAuth && <AuthError {...this.props}/>}
            </>
        );
    }
}

export default ContInfo;
