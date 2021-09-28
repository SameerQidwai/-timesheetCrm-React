import React, { Component } from "react";
import { Row, Col, Menu, Button, Dropdown, Descriptions, Table } from "antd";
import { SettingOutlined, DownOutlined } from "@ant-design/icons"; //Icons

import MileModal from "./Modals/MileModal";
import { getRecord, getLeadSkills, delLeadSkill } from "../../service/projects";

import moment from "moment"
import { formatCurrency, localStore } from "../../service/constant";

const { Item } = Descriptions;

class Milestone extends Component {
    constructor(props) {
        super(props);
        this.columns = [
            {
                title: "Title",
                dataIndex: "title",
                key: "title",
            },
            {
                title: "Amount",
                dataIndex: "amount",
                key: "amount",
            },
            {
                title: "Start Date",
                dataIndex: "startDate",
                key: "startDate",
            },
            {
                title: "End Date",
                dataIndex: "endDate",
                key: "endDate",
            },
            {
                title: "Progress",
                dataIndex: "progress",
                key: "progress",
            },
            {
                title: "Approved",
                dataIndex: "isApproved",
                key: "isApproved",
            },
            {
                title: "Action",
                key: "action",
                align: "right",
                render: (record) => (
                    <Dropdown
                        overlay={
                            <Menu>
                                <Menu.Item
                                    onClick={() => {
                                        this.setState({ infoModal: true, editRex: record.id, });
                                    }}
                                    disabled={this.state&& !this.state.permissions['UPDATE']}
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
                ),
            },
        ];

        this.state = {
            infoModal: false,
            editRex: false,
            ProId: false,
            desc: {title: '', organization: {name: ''}, value: '', startDate: '', endDate: ''},
            permissions: {}
        };
    }

    componentDidMount = ()=>{
        const { id } = this.props.match.params
        this.fetchAll(id)
    }

    fetchAll = (id) =>{
        const { PROJECTS }= JSON.parse(localStore().permissions)
        Promise.all([ getRecord(id), getLeadSkills(id)])
        .then(res => {
            this.setState({
                desc: res[0].success? res[0].data : {},
                editRex: false,
                ProId: id,
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
        const { id } = this.props.match.params //opputunityId
        delLeadSkill(id,rId).then((res) => {
            if (res.success) {
                this.props.history.push('/Employees')
            }
        });
    };

    callBack = () => {
        const { ProId } = this.state
        this.getLeadSkills(ProId)
    };

    render() {
        const { desc, data, infoModal, editRex, ProId, permissions } = this.state;
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
                    <Item label="Estimated Value">{ formatCurrency(desc.value)}</Item>
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
                        >Add New</Button> 
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
                    <MileModal
                        visible={infoModal}
                        editRex={editRex}
                        ProId = {ProId}
                        panelId = {desc.panelId}
                        close={this.closeModal}
                        callBack={this.callBack}
                    />
                )}
            </>
        );
    }
}

export default Milestone;
