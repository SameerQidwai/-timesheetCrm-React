import React, { Component } from "react";
import { Row, Col, Menu, Button, Dropdown, Descriptions, Table, Popconfirm } from "antd";
import { SettingOutlined, DownOutlined } from "@ant-design/icons"; //Icons
import { Link } from "react-router-dom"; 

import OrderModal from "./Modals/OrderModal";
import { getRecord, getOrders, delOrder } from "../../service/projects";

import moment from "moment"
import { formatCurrency, localStore } from "../../service/constant";

const { Item } = Descriptions;

class PurchaseOrder extends Component {
    constructor(props) {
        super(props);
        const { proId } = props.match.params
        this.columns = [
            {
                title: "Issue Date",
                dataIndex: "issueDate",
                key: "issueDate",
                render:(record)=> record && moment(record).format(`ddd MMM DD YYYY`),
                sorter: (a, b) => moment(a.issueDate).unix() - moment(b.issueDate).unix()
            },
            {
                title: "Expiry Date",
                dataIndex: "expiryDate",
                key: "expiryDate",
                render:(record)=> record && moment(record).format(`ddd MMM DD YYYY`),
                sorter: (a, b) => moment(a.expiryDate).unix() - moment(b.expiryDate).unix()
            },
            {
                title: "Value",
                dataIndex: "value",
                key: "value",
                render: record => `${formatCurrency(record)}`,
                sorter: (a, b) => a.value - b.value,
            },
            {
                title: "Expense",
                dataIndex: "expense",
                key: "expense",
                render: record => `${formatCurrency(record)}`,
                sorter: (a, b) => a.expense - b.expense,
            },
            {
                title: "Action",
                key: "action",
                align: "right",
                width: 115,
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
                                    onClick={() => { this.setState({ openModal: true, editRex: record.id, }); }}
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
            openModal: false,
            editRex: false,
            ProId: false,
            desc: {title: 'Service', organization: {name: 'PSO'}, value: '1000.00', startDate: '12 10 2020', endDate: '12 4 2021'},
        };
    }

    componentDidMount = ()=>{
        const { proId } = this.props.match.params
        this.fetchAll(proId)
    }

    fetchAll = (id) =>{
        const { PROJECTS }= JSON.parse(localStore().permissions)
        Promise.all([ getRecord(id), getOrders(id)])
        .then(res => {
            this.setState({
                desc: res[0].success? res[0].data : {},
                editRex: false,
                ProId: id,
                openModal: false,
                data: res[1].success? res[1].data : [],
                permissions: PROJECTS
            })
        })
        .catch(e => {
            console.log(e);
        })
    }

    getRecords = (id) =>{
        getOrders(id).then(res=>{
            if(res.success){
                this.setState({
                    data: res.success? res.data : [],
                    editRex: false,
                    openModal: false
                })
            }
        })
    }

    closeModal = () => {
        this.setState({ openModal: false, editRex: false});
    };

    handleDelete = (rId) => {
        const { ProId } = this.state //opputunityId
        delOrder(ProId,rId).then((res) => {
            if (res.success) {
                this.getRecords(ProId)
            }
        });
    };

    callBack = () => {
        const { ProId } = this.state
        this.getRecords(ProId)
    };

    render() {
        const { desc, data, openModal, editRex, ProId, permissions } = this.state;
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
                    <Item label="Estimated Value">{formatCurrency(desc.value)}</Item>
                    <Item label="Organisation">{desc.organizationName ? desc.organization.name :' No Organisation'}</Item>
                    <Item label="Start date">{desc.startDate ? moment(desc.startDate).format('ddd DD MM YYYY'): null} </Item>
                    <Item label="End Date">{desc.endDate ? moment(desc.endDate).format('ddd DD MM YYYY'): null}</Item>
                    {/* <Item label="Gender">{data.gender}</Item> */}
                </Descriptions>
                <Row justify="end">
                    <Col> <Button 
                        type="primary" 
                        size='small' 
                        onClick={() => {  this.setState({ openModal: true, editRex: false, }) }}
                        disabled={permissions && !permissions['ADD']}
                    >Add New</Button> </Col>
                    {/* <Col> <Button type="danger" size='small'>Delete Resource</Button></Col> */}
                </Row>
                <Table
                    bordered
                    pagination={{pageSize: localStore().pageSize}}
                    rowKey={(data) => data.id}
                    columns={this.columns}
                    dataSource={data}
                    size="small"
                />
                {openModal && (
                    <OrderModal
                        visible={openModal}
                        editRex={editRex}
                        ProId = {ProId}
                        close={this.closeModal}
                        callBack={this.callBack}
                    />
                )}
            </>
        );
    }
}

export default PurchaseOrder;
