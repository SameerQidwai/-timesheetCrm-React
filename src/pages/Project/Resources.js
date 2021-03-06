import React, { Component } from "react";
import { Row, Col, Menu, Button, Dropdown, Descriptions, Table, Popconfirm } from "antd";
import { SettingOutlined, DownOutlined } from "@ant-design/icons"; //Icons
import { Link } from "react-router-dom"; 

import InfoModal from "./ResModal";
import { getRecord, getResources, delResource } from "../../service/opportunities";

import moment from "moment"

const { Item } = Descriptions;

class OrgInfo extends Component {
    constructor(props) {
        super(props);
        const { id } = props.match.params
        this.columns = [
            {
                title: "Skill",
                dataIndex: "panelSkillId",
                key: "panelSkillId",
            },
            {
                title: "Level",
                dataIndex: "panelSkillStandardLevelId",
                key: "panelSkillStandardLevelId",
            },
            {
                title: "Employee Name",
                dataIndex: "userId",
                key: "userId",
            },
            {
                title: "Billable Hours",
                dataIndex: "billableHours",
                key: "billableHours",
            },
            {
                title: "Buy Cost",
                dataIndex: "buyingRate",
                key: "buyingRate",
            },
            {
                title: "Sale Cost",
                dataIndex: "sellingRate",
                key: "sellingRate",
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
                title: "Action",
                key: "action",
                align: "right",
                render: (record) => (
                    <Dropdown
                        overlay={
                            <Menu>
                                <Menu.Item danger>
                                    <Popconfirm
                                        title="Sure to delete?"
                                        onConfirm={() => this.handleDelete(record.id) }
                                    >
                                        Delete
                                    </Popconfirm>
                                </Menu.Item>
                                <Menu.Item
                                    onClick={() => {
                                        console.log(record.id);
                                        this.setState({ infoModal: true, editRex: record.id, });
                                    }}
                                >
                                    Edit
                                </Menu.Item>
                                <Menu.Item >
                                <Link
                                    to={{
                                        pathname: `/projects/${id}/resources/rates/${record.id}`,
                                    }}
                                    className="nav-link"
                                >
                                    History
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
        ];

        this.state = {
            infoModal: false,
            editRex: false,
            ProId: false,
            data: [
                {panelSkillId: 'Developer', panelSkillStandardLevelId: 'Senior', userId: 'Faizan', billableHours: '8', buyingRate: '20', sellingRate: '23', startDate: '12 10 2020', endDate: '12 4 2021'},
                {panelSkillId: 'Designer', panelSkillStandardLevelId: 'Senior', userId: 'Adam', billableHours: 8, buyingRate: 10, sellingRate: 15, startDate: '12 10 2020', endDate: '12 4 2021'},
            ],
            desc: {title: 'Service', organization: {name: 'PSO'}, value: '1000.00', startDate: '12 10 2020', endDate: '12 4 2021'},
        };
    }

    componentDidMount = ()=>{
        const { id } = this.props.match.params
        // console.log(this.props.match.params);
        // this.fetchAll(id)
    }

    fetchAll = (id) =>{
        Promise.all([ getRecord(id), getResources(id)])
        .then(res => {
            this.setState({
                desc: res[0].success? res[0].data : {},
                editRex: false,
                ProId: id,
                data: res[1].success? res[1].data : [],
            })
        })
        .catch(e => {
            console.log(e);
        })
    }

    getResources = (id) =>{
        getResources(id).then(res=>{
            if(res.success){
                this.setState({
                    desc: res.data,
                    editRex: false
                })
            }
        })
    }

    closeModal = () => {
        this.setState({ infoModal: false, editRex: false});
    };

    handleDelete = (rId) => {
        const { id } = this.props.match.params //opputunityId
        delResource(id,rId).then((res) => {
            if (res.success) {
                this.props.history.push('/Employees')
            }
        });
    };

    callBack = () => {
        const { ProId } = this.state
        this.getResources(ProId)
    };

    render() {
        const { desc, data, infoModal, editRex, ProId } = this.state;
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
                    <Item label="Estimated Value">{desc.value}</Item>
                    <Item label="Organisation">{desc.organizationName ? desc.organization.name :' No Organisation'}</Item>
                    <Item label="Start date">{desc.startDate ? moment(desc.startDate).format('ddd DD MM YYYY'): null} </Item>
                    <Item label="End Date">{desc.endDate ? moment(desc.endDate).format('ddd DD MM YYYY'): null}</Item>
                    {/* <Item label="Gender">{data.gender}</Item> */}
                </Descriptions>
                <Row justify="end">
                    <Col> <Button type="primary" size='small'  onClick={() => {  this.setState({ infoModal: true, editRex: false, }) }}>Add New</Button> </Col>
                    {/* <Col> <Button type="danger" size='small'>Delete Resource</Button></Col> */}
                </Row>
                <Table
                    rowKey={(data) => data.id}
                    columns={this.columns}
                    dataSource={data}
                    size="small"
                />
                {infoModal && (
                    <InfoModal
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

export default OrgInfo;
