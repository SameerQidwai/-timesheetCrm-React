import React, { Component } from "react";
import { Row, Col, Menu, Tabs, Button, Dropdown, Popconfirm, Descriptions, } from "antd";
import { SettingOutlined, DownOutlined } from "@ant-design/icons"; //Icons
import { Link } from "react-router-dom"; 

import Comments from "../../components/Core/Comments";
// import Travels from "../../components/Core/Travels";
import Attachments from "../../components/Core/Attachments";
import Bank from "../../components/Core/Bank";
import ProfitLoss from "../../components/Core/ProfitLoss";

import InfoModal from "./Modals/InfoModal";

import { getRecord, delList, workIsLost } from "../../service/opportunities";

import moment from "moment"
import { formatCurrency, localStore } from "../../service/constant";
import LostModal from "./Modals/LostModal";

const { Item } = Descriptions;
const { TabPane } = Tabs;

class OpportunityInfo extends Component {
    constructor() {
        super();
        this.status = [ //status of the oportunity 
            {title: "Won", msg: "Opportunity Won!?" , api: 'won'},
            {title: "Lost", msg: "Opportunity Lost!?" , api: 'Lost', key: 'L'},
            {title: "Not Bid", msg: "Not Bid On Opportunity!?" , api: 'NotBid', key: 'NB'},
            {title: "Did Not Proceed", msg: "Did Not Proceed?", api: 'NotProceed', key: 'NP'},
        ]
        this.state = {
            infoModal: false,
            lostModal: false,
            leadId: false,
            data: { },
            basic: {},
            billing: {},
            renderTabs: false,
            moveToProject: false,
            permissions: {},
        };
    }
    componentDidMount = ()=>{
        const { proId } = this.props.match.params
        this.getRecord(proId)
    }

    getRecord = (id) =>{
        const { OPPORTUNITIES }= JSON.parse(localStore().permissions)
        getRecord(id).then(res=>{
            if(res.success){
                this.setState({
                    data: res.data,
                    basic: res.basic,
                    billing: res.billing,
                    leadId: id,
                    infoModal: false,
                    lostModal: false,
                    renderTabs: true,
                    moveToProject: false,
                    permissions: OPPORTUNITIES
                })
            }
        })
    }

    closeModal = () => {
        this.setState({ infoModal: false, moveToProject: false, lostModal: false});
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
        const { data, infoModal,lostModal, leadId, billing, renderTabs, moveToProject, permissions, basic } = this.state;
        const DescTitle = (
            <Row justify="space-between">
                <Col>Opportunity Basic Information</Col>
                <Col>
                    <Dropdown
                        overlay={
                            <Menu>
                                {this.status.map(el => <Menu.Item 
                                    key={el.title}
                                    disabled={!permissions['UPDATE']}
                                >
                                    <Popconfirm 
                                        title={el.msg} 
                                        onConfirm={() => {
                                            if (el.title === "Won"){
                                                this.setState({ infoModal: true, moveToProject: true});
                                            }else{
                                                this.setState({lostModal: true, moveToProject: el})
                                            }
                                            //new function (...el)
                                        }}
                                        okText="Yes"
                                        cancelText="No" 
                                    >
                                        {el.title}
                                    </Popconfirm>
                                </Menu.Item>)}
                                <Menu.Item onClick={() => { 
                                        this.setState({ infoModal: true});
                                    }} 
                                    disabled={!permissions['UPDATE']}
                                    > Edit </Menu.Item>
                                <Menu.Item>
                                    <Link
                                        to={{
                                            pathname: `/opportunities/${leadId}/resources`,
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
                    <Item label="Estimated Value">{`${formatCurrency(data.value)}`}</Item>
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
                    <Item label="Delegate Contact"> {basic ?basic.ContactName: null}</Item>
                    <Item label="Start date">{data.startDate ? moment(data.startDate).format('ddd DD MM YYYY'): null} </Item>
                    <Item label="End Date">{data.endDate ? moment(data.endDate).format('ddd DD MM YYYY'): null}</Item>
                    <Item label="Bid Date">{data.bidDate ? moment(data.bidDate).format('ddd DD MM YYYY'): null}</Item>
                    {/* <Item label="Gender">{data.gender}</Item> */}
                </Descriptions>
                {renderTabs &&(
                    <Tabs
                        type="card"
                        style={{ marginTop: "50px" }}
                    >
                        <TabPane tab="Comments" key="comments">
                            <Comments targetId={leadId} targetType="WOR" />
                        </TabPane>
                        <TabPane tab="Attachments" key="attachments">
                            <Attachments targetId={leadId} targetType="WOR"  />
                        </TabPane>
                        {/* <TabPane tab="Travels" key="travels">
                            <Travels id={leadId} />
                        </TabPane> */}
                        
                        {/* <TabPane tab="Bank Account" key="account">
                            <Bank id={leadId} title={data.name} />
                        </TabPane> */}
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
                {lostModal && (
                    <LostModal
                        visible={lostModal}
                        editLead={leadId}
                        reason={moveToProject}
                        close={this.closeModal}
                        // callBack={this.callBack}
                    />
                )}
            </>
        );
    }
}

export default OpportunityInfo;
