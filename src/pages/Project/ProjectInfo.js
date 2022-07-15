import React, { Component } from "react";
import { Row, Col, Menu, Tabs, Button, Dropdown, Popconfirm, Descriptions, Tag, } from "antd";
import { SettingOutlined, DownOutlined } from "@ant-design/icons"; //Icons
import { Link } from "react-router-dom"; 

import Comments from "../../components/Core/Comments";
// import Travels from "../../components/Core/Travels";
import Attachments from "../../components/Core/Attachments";
import Bank from "../../components/Core/Bank";
import ProfitLoss from "../../components/Core/ProfitLoss";

import InfoModal from "./Modals/InfoModal";

import { getRecord, delList, Outcomes } from "../../service/projects";

import { formatDate, formatCurrency, localStore, O_STATUS, O_PHASE } from "../../service/constant";
import AuthError from "../../components/Core/AuthError";
import PMResources from "../../components/Core/Resources/PMResources";
import PTResources from "../../components/Core/Resources/PTResources";
import { generalDelete } from "../../service/delete-Api's";

const { Item } = Descriptions;
const { TabPane } = Tabs;

class ProjectInfo extends Component {
    constructor() {
        super();
        this.state = {
            infoModal: false,
            leadId: false,
            data: {},
            basic: {},
            billing: {},
            renderTabs: false,
            permissions: {},
            notAuth: false
        };
    }
    componentDidMount = ()=>{
        const { proId } = this.props.match.params
        this.getRecord(proId)
    }

    getRecord = (id) =>{
        const { PROJECTS }= JSON.parse(localStore().permissions)
        getRecord(id).then(res=>{
            if(res.success){
                console.log(res.data, res.billing);
                this.setState({
                    data: res.data,
                    basic: res.basic,
                    billing: res.billing,
                    leadId: id,
                    infoModal: false,
                    renderTabs: true,
                    permissions: PROJECTS
                })
            }else if(res.authError){
                this.setState({ notAuth: true })
            }
        })
    }

    closeModal = () => {
        this.setState({ infoModal: false });
    };

    handleDelete = (id) => {
        const url = '/projects'
        const { history } = this.props
        generalDelete(history, url, id).then(res =>{
            if (res.success){
               // will not run
            }
        })
    };

    callBack = () => {
        const { leadId } = this.state
        this.getRecord(leadId)
    };

    OutcomeAction = (action) =>{
        const { leadId, basic } = this.state        
        Outcomes(action,leadId).then(res=>{
            if (res.success){
                this.setState({basic: {...basic, phase:action==='open'}})
            }
        })
    }

    render() {
        const { data, infoModal, leadId, billing, renderTabs, permissions, basic,notAuth } = this.state;
        
        const DescTitle = (
            <Row justify="space-between">
                <Col>Project Information</Col>
                <Col>
                    <Dropdown
                        overlay={
                            <Menu>
                                <Menu.Item  
                                    key={'delete'}
                                    danger
                                    disabled={!permissions?.['DELETE']|| basic.phase===false}
                                    className="pop-confirm-menu"
                                >
                                    <Popconfirm
                                        disabled={!permissions?.['DELETE']|| basic.phase===false}
                                        title="Are you sure you want to delete" 
                                        onConfirm={() => this.handleDelete(leadId)} 
                                    >
                                        <div> Delete </div>
                                    </Popconfirm>
                                </Menu.Item >
                                <Menu.SubMenu title={'Outcome'} key="Outcome">
                                    <Menu.Item 
                                        key="Open"
                                        disabled={!permissions['UPDATE']|| basic.phase===true}
                                        style={{color: '#6fac45'}}
                                        className="pop-confirm-menu"
                                    >
                                        <Popconfirm 
                                            disabled={!permissions['UPDATE']|| basic.phase===true}
                                            title={'Do You Want To Open this Project?'} 
                                            onConfirm={() => this.OutcomeAction('open')}
                                            okText="Yes"
                                            cancelText="No" 
                                        >
                                            <div>Open</div>
                                        </Popconfirm>
                                    </Menu.Item>
                                    <Menu.Item 
                                        key="Close"
                                        disabled={!permissions['UPDATE']|| basic.phase===false}
                                        style={{color: '#c00505'}}
                                        className="pop-confirm-menu"
                                    >
                                        <Popconfirm 
                                            disabled={!permissions['UPDATE']|| basic.phase===false}
                                            title={'Do You Want To Close this Project?'} 
                                            onConfirm={() => this.OutcomeAction('close')}
                                            okText="Yes"
                                            cancelText="No" 
                                        >
                                            <div>Close</div>
                                        </Popconfirm>
                                    </Menu.Item>
                                </Menu.SubMenu>
                                <Menu.Item  
                                    key={'edit'}
                                    onClick={() => { 
                                        this.setState({ infoModal: true});
                                    }}
                                    disabled={!permissions?.['UPDATE']}
                                > 
                                    Edit 
                                </Menu.Item>
                                <Menu.Item  
                                    key={'order'}>
                                    <Link to={{ pathname: `/projects/${leadId}/purchase-order`}} className="nav-link">
                                        Purchase Order
                                    </Link>
                                </Menu.Item >
                                {(basic && basic.type) === 1 ?  //if condition
                                    <Menu.Item 
                                        key={'milestone'}> 
                                        <Link
                                            to={{ pathname: `/projects/${leadId}/milestones`, }}
                                            className="nav-link"
                                        >
                                            Milestones
                                        </Link>
                                    </Menu.Item>
                                    : //else condition
                                    <Menu.Item 
                                        key={'position'}>
                                        <Link
                                            to={{
                                                pathname: `/projects/${leadId}/milestones/${data?.milestones?.[0]?.id}/resources`,
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
                    <Item label="Contract Value">{ formatCurrency(data.value)}</Item>
                    <Item label="Organisation">{
                        data.organizationName ? 
                            <Link
                                to={{
                                    pathname: `/organizations/info/${data.organizationId}`,
                                }}
                                className="nav-link"
                            >
                                {data.organizationName}
                            </Link>
                        : 
                            'No Organisation'
                        
                    }</Item>
                    <Item label="Delegate Contact"> {basic ?basic.ContactName: null}</Item>
                    <Item label="Start Date">{formatDate(data.startDate, true, true)} </Item>
                    <Item label="End Date">{formatDate(data.endDate, true, true)}</Item>
                    <Item label="Bid Date">{formatDate(data.bidDate, true, true)}</Item>
                    <Item label="Status">{<Tag color={!basic.phase ? "red" : "green"}>{O_PHASE[basic.phase]}</Tag>}</Item>
                    {/* <Item label="Gender">{data.gender}</Item> */}
                </Descriptions>
                {renderTabs &&(
                    <Tabs
                        type="card"
                        style={{ marginTop: "50px" }}
                        defaultActiveKey="profitloss"   
                    >
                        <TabPane tab="Comments" key="comments">
                            <Comments targetId={leadId} targetType="WOR" onHold={basic.phase===false} />
                        </TabPane>
                        {/* <TabPane tab="Travels" key="travels">
                            <Travels id={leadId} />
                        </TabPane> */}
                        <TabPane tab="Attachments" key="attachments">
                            <Attachments targetId={leadId} targetType="WOR" onHold={basic.phase===false} />
                        </TabPane>
                        {/* <TabPane tab="Bank Account" key="account">
                            <Bank id={leadId} title={data.name} />
                        </TabPane> */}
                        <TabPane tab="Projected Profit & Loss" key="profitloss">
                            <ProfitLoss id={leadId} parent={"P"} billing={billing} type={data.type} />
                        </TabPane>
                        <TabPane tab="Resources" key="resources">
                            { basic.type === 1 ?
                                <PMResources id={leadId} data={data}/> 
                                : // Need to create these both component as one
                                <PTResources id={leadId} data={data}/>
                            }
                        </TabPane>
                    </Tabs>
                )}
                {infoModal && (
                    <InfoModal
                        visible={infoModal}
                        editPro={leadId}
                        close={this.closeModal}
                        callBack={this.callBack}
                        onHold={basic.phase===false}
                    />
                )}
                {notAuth && <AuthError {...this.props}/>}
            </>
        );
    }
}

export default ProjectInfo;
