import React, { Component } from "react";
import { Row, Col, Menu, Button, Dropdown, Descriptions, Table, Popconfirm, Typography } from "antd";
import { SettingOutlined, DownOutlined } from "@ant-design/icons"; //Icons
import { Link } from "react-router-dom"; 

import OrderModal from "./Modals/OrderModal";
import { getRecord, getOrders, delOrder } from "../../service/projects";

import moment from "moment"
import { formatDate, formatCurrency, localStore, O_STATUS } from "../../service/constant";
import { generalDelete } from "../../service/delete-Api's";
import { Filtertags, tableTitleFilter } from "../../components/Core/Table/TableFilter";

const { Title } = Typography
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
                render: (value, record, index) => (
                    <Dropdown
                        overlay={
                            <Menu>
                                <Menu.Item 
                                danger
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
                                    onClick={() => { this.setState({ openModal: true, editRex: record.id, }); }}
                                    disabled={!this?.state?.permissions?.['UPDATE']}
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
            searchedColumn: {
                'id': {type: 'Input', value: '',  label:"Code", showInColumn: true},
                'value': {type: 'Input', value: '', label:"Value",  showInColumn: true},
                'expense': {type: 'Input', value: '', label:"Expense",  showInColumn: true},
                'issueDate': {type: 'Date', value: null,  label:"Issue Date", showInColumn: true},
                'expiryDate': {type: 'Date', value: null,  label:"Expiry Date", showInColumn: true, disabled:true},
            },
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
                filterData: res[1].success? res[1].data : [],
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

    handleDelete = (id, index) => {
        const { ProId, data } = this.state
        const { history } = this.props
        const url = `/projects/${ProId}/purchaseOrders`
        generalDelete(history, url, id, index, data, false).then(res =>{
            if (res.success){
                this.setState({
                    data: [...res.filterData],
                })
            }
        })
    };

    callBack = () => {
        const { ProId } = this.state
        this.getRecords(ProId)
    };

    generalFilter = (value) =>{
        const { data } = this.state
        if (value){
            this.setState({
                filterData: data.filter(el => {
                    const { name: organization} = el.organization
                    return `00${el.id.toString()}`.includes(value) ||
                    el.value && formatCurrency(el.value).toLowerCase().includes(value.toLowerCase()) ||
                    el.expense && formatCurrency(el.expense).toLowerCase().includes(value.toLowerCase()) ||
                    el.issueDate && `${formatDate(el.issueDate)}`.toLowerCase().includes(value.toLowerCase()) ||
                    el.expiryDate && `${formatDate(el.expiryDate)}`.toLowerCase().includes(value.toLowerCase())
                })
            })
        }else{
            this.setState({
                filterData: data
            })
        }
    }

    render() {
        const { desc, data, openModal, editRex, ProId, permissions, searchedColumn } = this.state;
        return (
            <>
                <Descriptions
                    title={"Purchase Orders"}
                    size="small"
                    bordered
                    layout="horizontal"
                    // extra={<Button type="primary">Edit</Button>}
                >
                    <Item label="Project Name">{desc.title}</Item>
                    <Item label="Estimated Value">{`${formatCurrency(desc.value)}`}</Item>
                    <Item label="Organisation">{
                        desc.organization ? 
                            <Link
                                to={{
                                    pathname: `/organizations/info/${desc.organizationId}`,
                                }}
                                className="nav-link"
                            >
                                {desc.organization.name}
                            </Link>
                        : 
                            'No Organisation'
                        
                    }</Item>
                    <Item label="Delegate Contact"> {desc.ContactName}</Item>
                    <Item label="Start date">{desc.startDate ? formatDate(desc.startDate): null} </Item>
                    <Item label="End Date">{desc.endDate ? formatDate(desc.endDate): null}</Item>
                    <Item label="Bid Date">{desc.bidDate ? formatDate(desc.bidDate): null}</Item>
                    <Item label="Status">{desc.status ? O_STATUS[desc.status]: ''}</Item>
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
                <Filtertags
                    filters={searchedColumn}
                    filterFunction={this.advancefilter}
                />
                <Table
                    title={()=>tableTitleFilter(5, this.generalFilter)}
                    bordered
                    pagination={{pageSize: localStore().pageSize}}
                    rowKey={(data) => data.id}
                    columns={this.columns}
                    dataSource={data}
                    size="small"
                    className='fs-small'
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
