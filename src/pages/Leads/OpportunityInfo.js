import React, { Component } from "react";
import { Row, Col, Menu, Tabs, Button, Dropdown, Popconfirm, Descriptions, } from "antd";
import { SettingOutlined, DownOutlined } from "@ant-design/icons"; //Icons
import { Link } from "react-router-dom"; 

import Comments from "../../components/Core/Comments";
import Travels from "../../components/Core/Travels";
import Attachments from "../../components/Core/Attachments";
import Bank from "../../components/Core/Bank";

import InfoModal from "./infoModal";

import { getRecord, delList } from "../../service/opportunities";

import moment from "moment"

const { Item } = Descriptions;
const { TabPane } = Tabs;

class OpportunityInfo extends Component {
    constructor() {
        super();
        this.state = {
            infoModal: false,
            leadId: false,
            data: { },
        };
    }
    componentDidMount = ()=>{
        const { id } = this.props.match.params
        this.getRecord(id)
    }

    getRecord = (id) =>{
        getRecord(id).then(res=>{
            console.log(res);
            if(res.success){
                this.setState({
                    data: res.basic,
                    leadId: id,
                    infoModal: false
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
        const { leadId } = this.state
        this.getRecord(leadId)
    };

    render() {
        const { data, infoModal, leadId } = this.state;
        const DescTitle = (
            <Row justify="space-between">
                <Col>Lead Basic Information</Col>
                <Col>
                    <Dropdown
                        overlay={
                            <Menu>
                                <Menu.Item>
                                    <Popconfirm title="Lead is Done!?" >
                                        Add To Project
                                    </Popconfirm>
                                </Menu.Item>
                                <Menu.Item onClick={() => { this.setState({ infoModal: true, }); }} > Edit </Menu.Item>
                                <Menu.Item>
                                    <Link
                                        to={{
                                            pathname: `/opportunity/resources/${leadId}`,
                                        }}
                                        className="nav-link"
                                    >
                                        Resources
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
                    <Item label="Project Name">{data.title}</Item>
                    <Item label="Estimated Value">{data.value}</Item>
                    <Item label="Organisation">{
                        data.organizationName ? 
                            <Link
                                to={{
                                    pathname: `/organiations/info/${data.organizationId}`,
                                }}
                                className="nav-link"
                            >
                                {data.organizationName}
                            </Link>
                        : 
                            'No Organisation'
                        
                    }</Item>
                    <Item label="Delegate Contact"> {data.ContactName}</Item>
                    <Item label="Start date">{data.startDate ? moment(data.startDate).format('ddd DD MM YYYY'): null} </Item>
                    <Item label="End Date">{data.endDate ? moment(data.endDate).format('ddd DD MM YYYY'): null}</Item>
                    <Item label="Bid Date">{data.bidDate ? moment(data.bidDate).format('ddd DD MM YYYY'): null}</Item>
                    {/* <Item label="Gender">{data.gender}</Item> */}
                </Descriptions>
                <Tabs
                    type="card"
                    style={{ marginTop: "50px" }}
                    defaultActiveKey="5"
                >
                    <TabPane tab="Comments" key="comments">
                        <Comments id={leadId} />
                    </TabPane>
                    <TabPane tab="Travels" key="travels">
                        <Travels id={leadId} />
                    </TabPane>
                    <TabPane tab="Attachments" key="attachments">
                        <Attachments />
                    </TabPane>
                    <TabPane tab="Account" key="account">
                        <Bank id={leadId} title={data.name} />
                    </TabPane>
                </Tabs>
                {infoModal && (
                    <InfoModal
                        visible={infoModal}
                        editLead={leadId}
                        close={this.closeModal}
                        callBack={this.callBack}
                    />
                )}
            </>
        );
    }
}

export default OpportunityInfo;
