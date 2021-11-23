import React, { Component } from "react";
import { Row, Col, Menu, Button, Dropdown, Descriptions, Table, Tag, Progress } from "antd";
import { SettingOutlined, DownOutlined } from "@ant-design/icons"; //Icons
import { Link } from 'react-router-dom'

import moment from "moment"

import MileModal from "./MileModal";
import { formatCurrency, localStore } from "../../service/constant";
import { getMilestones, getProjectDetail } from "../../service/Milestone-Apis";
import { getRecord } from "../../service/opportunities";

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
            customUrl: 'opportunity',
            columns: [
                {
                    title: "Title",
                    dataIndex: "title",
                    key: "title",
                },
                {
                    title: "Start Date",
                    dataIndex: "startDate",
                    key: "startDate",
                    render: (record) =>(record && moment(record).format('ddd DD MM yyyy'))
                },
                {
                    title: "End Date",
                    dataIndex: "endDate",
                    key: "endDate",
                    render: (record) =>(record && moment(record).format('ddd DD MM yyyy'))
                },
                {
                    title: "Progress",
                    dataIndex: "progress",
                    key: "progress",
                    align: "center",
                    render: (record) => <Progress percent={record} size="small" />
                },
                {
                    title: "Approved",
                    dataIndex: "isApproved",
                    key: "isApproved",
                    align: "right",
                    render: (record) =>  <Tag color={record? 'green': 'volcano'} key={record}>
                        {record? 'TRUE': 'FALSE'}
                    </Tag>
                    
                },
                {
                    title: "Action",
                    key: "action",
                    align: "right",
                    render: (value, record, index) => (
                        
                        <Dropdown
                            overlay={
                                <Menu>
                                    <Menu.Item
                                        onClick={() => {
                                            this.setState({ infoModal: true, editMile: {...record, rowIndex: index}, });
                                        }}
                                        disabled={this.state && !this.state.permissions['UPDATE']}
                                    >
                                        Edit
                                    </Menu.Item>
                                    <Menu.Item>
                                    <Link
                                        to={{
                                            // pathname:  `/${this.resRoute()}/${this.state&& this.state.proId}/milestones/${record.id}/resources`,
                                            pathname:  `milestones/${record.id}/resources`,
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
        const { proId } = this.props.match.params
        this.fetchAll(proId)
    }

    resRoute = (mileId)=>{
        let splitted = this.props.match.url
        splitted = splitted.split('/')
        return `/${splitted[1]}/${splitted[2]}/${splitted[3]}/${mileId}/resources`
    }

    fetchAll = (id) =>{
        const { PROJECTS }= JSON.parse(localStore().permissions)
        const customUrl = this.props.match.url
        let crud = this.props.match.url
        crud = crud.split('/')
        crud = `${crud[1]}/${crud[2]}`
        Promise.all([ getProjectDetail( crud ), getMilestones( customUrl) ])
        .then(res => {
            this.setState({
                desc: res[0].success && res[0].data,
                data: res[1].success && res[1].data,
                proId: id,
                customUrl, // for temporary bases
                permissions: PROJECTS
            })
        })
        .catch(e => {
            console.log(e);
        })
    }


    closeModal = () => {
        this.setState({ infoModal: false, editMile: false});
    };

    handleDelete = (rId) => {
        const { proId } = this.props.match.params //opputunityId
    };

    callBack = (milestone) => {
        console.log(milestone);
        const { proId, editMile, data } = this.state
        if (editMile){
            data[editMile.rowIndex]= milestone
        }else{
            data.push(milestone)
        }

        this.setState({
            data: [...data],
            infoModal: false
        })
    };

    render() {
        const { desc, data, infoModal, editMile, proId, permissions, columns, customUrl } = this.state;
        return (
            <>
                <Descriptions
                    // title={DescTitle}
                    size="small"
                    bordered
                    layout="horizontal"
                    // extra={<Button type="primary">Edit</Button>}
                >
                    <Item label="Title">{desc.title}</Item>
                    <Item label="Value">{ formatCurrency(desc.value)}</Item>
                    <Item label="Start Date">{desc.startDate ? moment(desc.startDate).format('ddd DD MM YYYY'): null} </Item>
                    <Item label="End Date">{desc.endDate ? moment(desc.endDate).format('ddd DD MM YYYY'): null}</Item>
                    <Item label="Bid Date">{desc.bidDate ? moment(desc.bidDate).format('ddd DD MM YYYY'): null}</Item>
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
                        crud={customUrl}
                        close={this.closeModal}
                        callBack={this.callBack}
                    />
                )}
            </>
        );
    }
}

export default Milestone;
