import React, { Component } from "react";
import { Row, Col, Menu, Button, Dropdown, Descriptions, Table, Popconfirm } from "antd";
import { SettingOutlined, DownOutlined } from "@ant-design/icons"; //Icons
import { Link } from "react-router-dom"; 

import ResModal from "./Modals/ResModal";
import { getRecord, getLeadSkills, delLeadSkill } from "../../service/projects";

import moment from "moment"
import { formatCurrency, localStore } from "../../service/constant";

const { Item } = Descriptions;

class Resources extends Component {
    constructor(props) {
        super(props);

        this.columns = [
            {
                title: "Skill",
                dataIndex: "panelSkill",
                key: "panelSkill",
                render: (record) =>(
                    record && record.label
                )
            },
            {
                title: "Level",
                dataIndex: "panelSkillStandardLevel",
                key: "panelSkillStandardLevel",
                render: (record)=>(
                    record && record.levelLabel
                )
            },
            {
                title: "Employee Name",
                dataIndex: "opportunityResourceAllocations",
                key: "opportunityResourceAllocations",
                render: (record)=>(
                    record && record[0] && record[0].contactPerson && `${record[0].contactPerson.firstName	} ${record[0].contactPerson.lastName	}`
                )
            },
            {
                title: "Billable Hours",
                dataIndex: "billableHours",
                key: "billableHours",
            },
            {
                title: "Buy Cost",
                dataIndex: "opportunityResourceAllocations",
                key: "opportunityResourceAllocations",
                render:(record)=>(
                    // console.log(record)
                    record && record[0] && formatCurrency(record[0].buyingRate)
                )
            },
            {
                title: "Sale Cost",
                dataIndex: "opportunityResourceAllocations",
                key: "opportunityResourceAllocations",
                render:(record)=>(
                    record && record[0] &&  formatCurrency(record[0].sellingRate)
                )
            },
            {
                title: "Action",
                key: "action",
                align: "right",
                render: (record) => (
                    <Dropdown
                        overlay={
                            <Menu>
                                {/* <Menu.Item danger>
                                    <Popconfirm
                                        title="Sure to delete?"
                                        onConfirm={() => this.handleDelete(record.id) }
                                    >
                                        Delete
                                    </Popconfirm>
                                </Menu.Item> */}
                                <Menu.Item
                                    onClick={() => {
                                        this.setState({ infoModal: true, editRex: record.id, });
                                    }}
                                    disabled={this.state&& !this.state.permissions['UPDATE']}
                                >
                                    Edit Resource
                                </Menu.Item>
                            </Menu>
                        }
                    >
                        <Button size="small">
                            <SettingOutlined /> Option <DownOutlined />
                        </Button>
                    </Dropdown>
                ),
            },
        ];

        this.state = {
            infoModal: false,
            editRex: false,
            proId: false,
            mileId: false,
            crud: false,
            desc: {title: '', organization: {name: ''}, value: '', startDate: '', endDate: ''},
            permissions: {}
        };
    }

    componentDidMount = ()=>{
        this.fetchAll()
    }

    fetchAll = (id) =>{
        const { PROJECTS }= JSON.parse(localStore().permissions)
        const { url } = this.props.match
        const { proId, mileId } = this.props.match.params
        Promise.all([ getRecord(proId), getLeadSkills(url, id)])
        .then(res => {
            this.setState({
                desc: res[0].success? res[0].data : {},
                editRex: false,
                proId: proId,
                crud: url,
                mileId: mileId,
                infoModal: false,
                data: res[1].success? res[1].data : [],
                permissions: PROJECTS
            })
        })
        .catch(e => {
            console.log(e);
        })
    }

    getLeadSkills = (id) =>{
        getLeadSkills(id).then(res=>{
            if(res.success){
                this.setState({
                    data: res.success? res.data : [],
                    editRex: false,
                    infoModal: false
                })
            }
        })
    }

    closeModal = () => {
        this.setState({ infoModal: false, editRex: false});
    };

    handleDelete = (rId) => {
        const { proId } = this.props.match.params //opputunityId
        delLeadSkill(proId,rId).then((res) => {
            if (res.success) {
                this.props.history.push('/Employees')
            }
        });
    };

    callBack = () => {
        const { proId } = this.state
        this.getLeadSkills(proId)
    };

    render() {
        const { desc, data, infoModal, editRex, proId, permissions, crud, mileId } = this.state;
        return (
            <>
                <Descriptions
                    // title={DescTitle}
                    size="small"
                    bordered
                    layout="horizontal"
                    // extra={<Button type="primary">Edit</Button>}
                >
                    <Item label="Project Name">{desc.title}</Item>
                    <Item label="Estimated Value">{ formatCurrency(desc.value ?? 0)}</Item>
                    <Item label="Organisation">{desc.organizationName ? desc.organization.name :' No Organisation'}</Item>
                    <Item label="Start date">{desc.startDate ? moment(desc.startDate).format('ddd DD MM YYYY'): null} </Item>
                    <Item label="End Date">{desc.endDate ? moment(desc.endDate).format('ddd DD MM YYYY'): null}</Item>
                    {/* <Item label="Gender">{data.gender}</Item> */}
                </Descriptions>
                <Row justify="end">
                    <Col> 
                        <Button 
                            type="primary" 
                            size='small'  
                            onClick={() => {  this.setState({ infoModal: true, editRex: false, }) }}
                            disabled={!permissions['ADD']}
                        >Add Resource</Button> 
                    </Col>
                    {/* <Col> <Button type="danger" size='small'>Delete Resource</Button></Col> */}
                </Row>
                <Table
                    pagination={{pageSize: localStore().pageSize}}
                    rowKey={(data) => data.id}
                    columns={this.columns}
                    dataSource={data}
                    size="small"
                />
                {infoModal && (
                    <ResModal
                        visible={infoModal}
                        editRex={editRex}
                        proId = {proId}
                        crud={crud}
                        mileId={mileId}
                        panelId = {desc.panelId}
                        close={this.closeModal}
                        callBack={this.callBack}
                    />
                )}
            </>
        );
    }
}

export default Resources;
