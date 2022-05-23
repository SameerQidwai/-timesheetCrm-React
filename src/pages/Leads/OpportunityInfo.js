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
import { formatDate, formatCurrency, localStore, O_STATUS } from "../../service/constant";
import LostModal from "./Modals/LostModal";
import { generalDelete } from "../../service/delete-Api's";
import AuthError from "../../components/Core/AuthError";
import OMResource from "../../components/Core/Resources/OMResources";
import OTResources from "../../components/Core/Resources/OTResources";

const { SubMenu } = Menu
const { Item } = Descriptions;
const { TabPane } = Tabs;

class OpportunityInfo extends Component {
    constructor(props) {
        super(props);
        this.status = [ //status of the oportunity 
            {title: "Won", msg: "Opportunity Won?" , api: 'won', color: '#6fac45'},
            {title: "Lost", msg: "Opportunity Lost?" , api: 'Lost', key: 'L', color:'#c00505' },
            {title: "Did Not Proceed", msg: "Did Not Proceed?", api: 'NotProceed', key: 'DNP', color: '#78abdb'},
            {title: "Not Bid", msg: "Not Bid On Opportunity?" , api: 'NotBid', key: 'NB', color: '#8d8888'},
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
            notAuth: false
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
            }else if(res.authError){
                this.setState({ notAuth: true })
            }
        })
    }

    closeModal = () => {
        this.setState({ infoModal: false, moveToProject: false, lostModal: false});
    };

    handleDelete = (id) => {
        const { history } = this.props
        const crud = '/opportunities'
        generalDelete(history, crud, id).then(res =>{
            if (res.success){
                this.setState({
                    data: [...res.data],
                    filterData: [...res.filterData]
                })
            }
        })
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
        const { data, infoModal,lostModal, leadId, billing, renderTabs, moveToProject, permissions, basic, notAuth } = this.state;
        const DescTitle = (
            <Row justify="space-between">
                <Col>Opportunity Information</Col>
                <Col>
                    <Dropdown
                        overlay={
                            <Menu>
                                <Menu.Item 
                                danger
                                disabled={!this?.state?.permissions?.['DELETE']}
                            >
                                    <Popconfirm 
                                        title="Are you sure you want to delete" 
                                        onConfirm={() => this.handleDelete(leadId)} 
                                    >
                                        Delete
                                    </Popconfirm>
                                </Menu.Item >
                                <SubMenu title={'Outcome'}>
                                    {this.status.map(el => <Menu.Item 
                                        key={el.title}
                                        disabled={!permissions['UPDATE']}
                                        style={{color: el.color}}
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
                                </SubMenu>
                                <Menu.Item onClick={() => { 
                                        this.setState({ infoModal: true});
                                    }} 
                                    disabled={!permissions['UPDATE']}
                                    > Edit </Menu.Item>
                                {(basic &&basic.type) === 1 ?  //if condition
                                <Menu.Item> 
                                    <Link
                                        to={{ pathname: `/opportunities/${leadId}/milestones` }}
                                        className="nav-link"
                                    >
                                        Milestones
                                    </Link>
                                </Menu.Item>
                                 : //else condition
                                <Menu.Item>
                                    <Link
                                        to={{
                                            pathname: `/opportunities/${leadId}/milestones/${basic.mileId}/resources`
                                        }}
                                        className="nav-link"
                                    >
                                        Postions
                                    </Link>
                                </Menu.Item>
                            }
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
                    <Item label="Delegate Contact"> {basic ?basic.ContactName: ''}</Item>
                    <Item label="Start date">{data.startDate ? formatDate(data.startDate): null} </Item>
                    <Item label="End Date">{data.endDate ? formatDate(data.endDate): null}</Item>
                    <Item label="Bid Date">{data.bidDate ? formatDate(data.bidDate): null}</Item>
                    <Item label="Status">{basic.status ? O_STATUS[basic.status]: ''}</Item>
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
                        <TabPane tab="Resources" key="resources">
                            { basic.type === 1 ?
                                <OMResource id={leadId} data={data}/> 
                                : // Need to create these both component as one
                                <OTResources id={leadId} data={data}/>
                            }
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
                {notAuth && <AuthError {...this.props}/>}
            </>
        );
    }
}

export default OpportunityInfo;
