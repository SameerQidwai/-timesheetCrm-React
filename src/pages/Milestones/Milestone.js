import React, { Component } from "react";
import { Row, Col, Menu, Button, Dropdown, Descriptions, Table } from "antd";
import { SettingOutlined, DownOutlined } from "@ant-design/icons"; //Icons
import { Link } from 'react-router-dom'

import MileModal from "./MileModal";

import moment from "moment"
import { formatCurrency, localStore } from "../../service/constant";
import { getMilestones } from "../../service/Milestone-Apis";

const { Item } = Descriptions;

class Milestone extends Component {
    constructor(props) {
        super(props);

        this.state = {
            infoModal: false,
            editMile: false,
            proId: false,
            desc: {title: '', organization: {name: ''}, value: '', startDate: '', endDate: ''},
            permissions: {},
            columns: [
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
                                            this.setState({ infoModal: true, editMile: record.id, });
                                        }}
                                        disabled={this.state && !this.state.permissions['UPDATE']}
                                    >
                                        Edit
                                    </Menu.Item>
                                    <Menu.Item>
                                    <Link
                                        to={{
                                            pathname:  `/${this.resRoute()}/${record.id}/resources`,
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
                    ),
                },
            ],
        };
    }

    componentDidMount = ()=>{
        const { id } = this.props.match.params
        // this.fetchAll(id)
    }

    resRoute = ()=>{
        let splitted = this.props.match.url
        splitted = splitted.split('/', 2)
        return splitted[1]
    }

    fetchAll = (id) =>{
        const { PROJECTS }= JSON.parse(localStore().permissions)
        getMilestones(id).then(res=>{
            if( res.success ){
                this.setState({
                    data: res.data,
                    proId: id,
                    permissions: PROJECTS
                },()=>console.log(this.state.permissions) )
            }
        })
    }


    closeModal = () => {
        this.setState({ infoModal: false, editMile: false});
    };

    handleDelete = (rId) => {
        const { id } = this.props.match.params //opputunityId
    };

    callBack = () => {
        const { proId } = this.state
        
    };

    render() {
        const { desc, data, infoModal, editMile, proId, permissions, columns } = this.state;
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
                            onClick={() => {  this.setState({ infoModal: true, editMile: false, }) }}
                            // disabled={!permissions['ADD']}
                        >Add New</Button> 
                    </Col>
                    {/* <Col> <Button type="danger" size='small'>Delete Resource</Button></Col> */}
                </Row>
                <Table
                    pagination={{pageSize: localStore().pageSize}}
                    rowKey={(data) => data.id}
                    columns={columns}
                    dataSource={data}
                    size="small"
                />
                {infoModal && (
                    <MileModal
                        visible={infoModal}
                        editMile={editMile}
                        proId={proId}
                        close={this.closeModal}
                        callBack={this.callBack}
                    />
                )}
            </>
        );
    }
}

export default Milestone;
