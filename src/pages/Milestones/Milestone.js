import React, { Component } from "react";
import { Row, Col, Menu, Button, Dropdown, Descriptions, Table, Tag, Progress, Popconfirm } from "antd";
import { SettingOutlined, DownOutlined } from "@ant-design/icons"; //Icons
import { Link } from 'react-router-dom'

import moment from "moment"

import MileModal from "./MileModal";
import { formatDate, formatCurrency, localStore } from "../../service/constant";
import { getMilestones, getProjectDetail } from "../../service/Milestone-Apis";
import { getRecord } from "../../service/opportunities";
import { generalDelete } from "../../service/delete-Api's";

const { Item } = Descriptions;

class Milestone extends Component {
    constructor(props) {
        super(props);

        this.state = {
            infoModal: false,
            editMile: false,
            pDates: {},
            proId: false,
            desc: {title: '', organization: {name: ''}, value: '', startDate: '', endDate: ''},
            permissions: {},
            customUrl: 'opportunity',
            columns: [
                {
                    title: "Title",
                    dataIndex: "title",
                    key: "title",
                    sorter: (a, b) => a.title - b.title,
                },
                {
                    title: "Start Date",
                    dataIndex: "startDate",
                    key: "startDate",
                    render: (record) =>(record && formatDate(record)),
                    sorter: (a, b) => moment(a.startDate).unix() - moment(b.startDate).unix()
                },
                {
                    title: "End Date",
                    dataIndex: "endDate",
                    key: "endDate",
                    render: (record) =>(record && formatDate(record)),
                    sorter: (a, b) => moment(a.endDate).unix() - moment(b.endDate).unix()
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
                    width: 115,
                    render: (value, record, index) => (
                        
                        <Dropdown
                            overlay={
                                <Menu>
                                    <Menu.Item danger 
                                        disabled={!this?.state?.permissions?.['DELETE']}
                                    >
                                        <Popconfirm 
                                            title="Are you sure, you want to delete?" 
                                            onConfirm={() => this.handleDelete(record.id, index)} 
                                        >
                                            Delete
                                        </Popconfirm>
                                    </Menu.Item >
                                    <Menu.Item
                                        onClick={() => { this.openModal({...record, rowIndex: index}) }}
                                        disabled={this.state && !this.state.permissions['UPDATE']}
                                    >
                                        Edit Milestone
                                    </Menu.Item>
                                    <Menu.Item>
                                    <Link
                                        to={{
                                            pathname:  `milestones/${record.id}/resources`,
                                        }}
                                        className="nav-link"
                                    >
                                        Positions
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
        const { PROJECTS, OPPORTUNITIES }= JSON.parse(localStore().permissions)
        const customUrl = this.props.match.url
        console.log(customUrl);
        let crud = this.props.match.url
        crud = crud.split('/')
        let work = crud[1]
        crud = `${crud[1]}/${crud[2]}`
        
        Promise.all([ getProjectDetail( crud ), getMilestones( customUrl) ])
        .then(res => {
            let { columns } = this.state
            if (work === 'opportunities'){ columns.splice(3,1);}
            this.setState({
                desc: res[0].success && res[0].data,
                data: res[1].success && res[1].data,
                columns: [...columns],
                proId: id,
                customUrl, 
                permissions: work === 'opportunities'? OPPORTUNITIES: PROJECTS
            })
        })
        .catch(e => {
            console.log(e);
        })
    }

    openModal = (editObj) =>{
        const { startDate, endDate } = this.state.desc
        this.setState({
            pDates: { startDate, endDate },
            editMile: editObj,
            infoModal: true,
        })
    }

    closeModal = () => {
        this.setState({ infoModal: false, editMile: false});
    };

    handleDelete = (id, index) => {
        const { customUrl, data } = this.state
        const { history } = this.props
        generalDelete(history, customUrl, id, index, data, false).then(res =>{
            if (res.success){
                this.setState({
                    data: [...res.filterData],
                })
            }
        })
    };

    callBack = (milestone) => {
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
        const { desc, data, infoModal, editMile, proId, permissions, columns, customUrl, pDates } = this.state;
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
                    <Item label="Start Date">{desc.startDate ? formatDate(desc.startDate): null} </Item>
                    <Item label="End Date">{desc.endDate ? formatDate(desc.endDate): null}</Item>
                    <Item label="Bid Date">{desc.bidDate ? formatDate(desc.bidDate): null}</Item>
                    {/* <Item label="Gender">{data.gender}</Item> */}
                </Descriptions>
                <Row justify="end">
                    <Col> 
                        <Button 
                            type="primary" 
                            size='small'  
                            onClick={() => this.openModal(false) }
                            // disabled={!permissions['ADD']}
                        >Add Milestone</Button> 
                    </Col>
                    {/* <Col> <Button type="danger" size='small'>Delete Resource</Button></Col> */}
                </Row>
                <Table
                    bordered
                    pagination={{pageSize: localStore().pageSize}}
                    rowKey={(data) => data.id}
                    columns={columns}
                    dataSource={data}
                    size="small"
                    className='fs-small'
                />
                {infoModal && (
                    <MileModal
                        visible={infoModal}
                        editMile={editMile}
                        pDates={pDates}
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
