import React, { Component } from "react";
import { Row, Col, Menu, Tabs, Button, Dropdown, Popconfirm, Descriptions, } from "antd";
import { SettingOutlined, DownOutlined } from "@ant-design/icons"; //Icons
import { Link } from "react-router-dom"; 

import Comments from "../../components/Core/Comments";
import Travels from "../../components/Core/Travels";
import Attachments from "../../components/Core/Attachments";
import Bank from "../../components/Core/Bank";
import ProfitLoss from "../../components/Core/ProfitLoss";

import InfoModal from "./Modals/InfoModal";

import { getRecord, delList, workIsLost } from "../../service/opportunities";

import moment from "moment"
import { formatCurrency } from "../../service/constant";

const { Item } = Descriptions;
const { TabPane } = Tabs;

class OpportunityInfo extends Component {
    constructor() {
        super();
        this.state = {
            infoModal: false,
            leadId: false,
            data: { },
            billing: {},
            renderTabs: false,
            moveToProject: false,
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
                    data: res.data,
                    billing: res.billing,
                    leadId: id,
                    infoModal: false,
                    renderTabs: true,
                    moveToProject: false,
                })
            }
        })
    }

    closeModal = () => {
        this.setState({ infoModal: false, moveToProject: false, });
    };

    handleDelete = (id) => {
        delList(id).then((res) => {
            if (res.success) {
                this.props.history.push('/opportunities')
            }
        });
    };

    callBack = () => {
        const { leadId, moveToProject } = this.state
        if (moveToProject){
            this.props.history.push('/opportunities')
        }else{
            this.getRecord(leadId)
        }
    };

    render() {
        const { data, infoModal, leadId, billing, renderTabs, moveToProject } = this.state;
        const DescTitle = (
            <Row justify="space-between">
                <Col>Opportunity Basic Information</Col>
                <Col>
                    <Dropdown
                        overlay={
                            <Menu>
                                <Menu.Item>
                                    <Popconfirm 
                                        title="Opportunity is Done!?" 
                                        onConfirm={() => {
                                            this.setState({ infoModal: true, moveToProject: true});
                                        }}
                                        okText="Yes"
                                        cancelText="No" 
                                    >
                                        Won
                                    </Popconfirm>
                                </Menu.Item>
                                <Menu.Item>
                                    <Popconfirm 
                                        title="Opportunity Lost!?" 
                                        onConfirm={() => { workIsLost(leadId) }}
                                        okText="Yes"
                                        cancelText="No"  
                                    >
                                        Lost
                                    </Popconfirm>
                                </Menu.Item>
                                <Menu.Item onClick={() => { 
                                    this.setState({ infoModal: true});
                                    }} > Edit </Menu.Item>
                                <Menu.Item>
                                    <Link
                                        to={{
                                            pathname: `/opportunity/${leadId}/resources`,
                                        }}
                                        className="nav-link"
                                    >
                                        Resources
                                    </Link>
                                </Menu.Item>
                            </Menu>
                        }
                    >
                        <Button size="small" >
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
                    <Item label="Estimated Value">{`$ ${formatCurrency(data.value)}`}</Item>
                    <Item label="Organisation">{
                        data.organization ? 
                            <Link
                                to={{
                                    pathname: `/organizations/info/${data.organizationId}`,
                                }}
                                className="nav-link"
                            >
                                {data.organization.name}
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
                {renderTabs &&(
                    <Tabs
                        type="card"
                        style={{ marginTop: "50px" }}
                        // defaultActiveKey="profitloss"   
                    >
                        <TabPane tab="Comments" key="comments">
                            <Comments targetId={leadId} targetType="WOR" />
                        </TabPane>
                        <TabPane tab="Attachments" key="attachments">
                            <Attachments targetId={leadId} targetType="WOR"  />
                        </TabPane>
                        <TabPane tab="Travels" key="travels">
                            <Travels id={leadId} />
                        </TabPane>
                        
                        <TabPane tab="Bank Account" key="account">
                            <Bank id={leadId} title={data.name} />
                        </TabPane>
                        <TabPane tab="Projected Profit & Loss" key="profitloss">
                            <ProfitLoss id={leadId} billing={billing} />
                        </TabPane>
                    </Tabs>
                )}
                {infoModal && (
                    <InfoModal
                        visible={infoModal}
                        editLead={leadId}
                        project={moveToProject}
                        close={this.closeModal}
                        callBack={this.callBack}
                    />
                )}
            </>
        );
    }
}

export default OpportunityInfo;
