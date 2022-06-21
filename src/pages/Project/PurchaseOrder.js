import React, { Component } from "react";
import { Row, Col, Menu, Button, Dropdown, Descriptions, Table, Popconfirm, Typography } from "antd";
import { SettingOutlined, PlusSquareOutlined } from "@ant-design/icons"; //Icons
import { Link } from "react-router-dom"; 

import OrderModal from "./Modals/OrderModal";
import { getRecord, getOrders, delOrder } from "../../service/projects";

import moment from "moment"
import { formatDate, formatCurrency, localStore, O_STATUS } from "../../service/constant";
import { generalDelete } from "../../service/delete-Api's";
import { Filtertags, TableModalFilter, tableSorter, tableTitleFilter } from "../../components/Core/Table/TableFilter";

const { Title } = Typography
const { Item } = Descriptions;

class PurchaseOrder extends Component {
    constructor(props) {
        super(props);
        const { proId } = props.match.params
        this.columns = [
            {
                title: "Order Number",
                dataIndex: "orderNo",
                key: "orderNo",
                ...tableSorter('orderNo', 'string', true),
            },
            {
                title: "Issue Date",
                dataIndex: "issueDate",
                key: "issueDate",
                render:(record)=> formatDate(record, true, true),
                ...tableSorter('issueDate', 'date'),
            },
            {
                title: "Expiry Date",
                dataIndex: "expiryDate",
                key: "expiryDate",
                render:(record)=> formatDate(record, true, true),
                ...tableSorter('expiryDate', 'date'),
            },
            {
                title: "Value",
                dataIndex: "value",
                key: "value",
                render: record => `${formatCurrency(record)}`,
                ...tableSorter('value', 'number'),
            },
            {
                title: "Expense",
                dataIndex: "expense",
                key: "expense",
                render: record => `${formatCurrency(record)}`,
                ...tableSorter('expense', 'number'),
            },
            {
                title: "...",
                key: "action",
                align: "center",
                width: '1%',
                render: (value, record, index) => (
                    <Dropdown
                        overlay={
                            <Menu>
                                <Menu.Item 
                                key={"delete"}
                                danger
                                disabled={!this?.state?.permissions?.['DELETE']}
                                className="pop-confirm-menu"
                            >
                                <Popconfirm
                                    title="Are you sure you want to delete" 
                                    onConfirm={() => this.handleDelete(record.id, index)} 
                                >
                                    <div> Delete </div>
                                </Popconfirm>
                            </Menu.Item >
                                <Menu.Item
                                    key={"edit"}
                                    onClick={() => { this.openModal(true, record.id, index) }}
                                    disabled={!this?.state?.permissions?.['UPDATE']}
                                >
                                    Edit
                                </Menu.Item>
                            </Menu>
                        }
                    >
                        <Button size="small">
                            <SettingOutlined />
                        </Button>
                    </Dropdown>
                ),
            },
        ];

        this.state = {
            openModal: false,
            editRex: false,
            ProId: false,
            tableIndex: false,
            openSearch: false, 
            desc: {title: 'Service', organization: {name: 'PSO'}, value: '1000.00', startDate: '12 10 2020', endDate: '12 4 2021'},
            searchedColumn: {
                'id': {type: 'Input', value: '',  label:"Code", showInColumn: true},
                'value1': {type: 'Input', value: null, label:"Value <",  showInColumn: true},
                'value2': {type: 'Input', value: '', label:"Value >",  showInColumn: true},
                'expense1': {type: 'Input', value: '', label:"Expense <",  showInColumn: true},
                'expense2': {type: 'Input', value: '', label:"Expense >",  showInColumn: true},
                'issueDate': {type: 'Date', value: null,  label:"Issue Date", showInColumn: true},
                'expiryDate': {type: 'Date', value: null,  label:"Expiry Date", showInColumn: true, disabled:true},
                'description': {type: 'Input', value: '',  label:"Expiry Date", showInColumn: true, disabled:true},
                'comment': {type: 'Input', value: '',  label:"Expiry Date", showInColumn: true, disabled:true},
            },

            filterFields: [
                {
                    Placeholder: "Issue Date",
                    fieldCol: 12,
                    size: "small",
                    type: "Text",
                },
                {
                    Placeholder: "Expiry Date",
                    fieldCol: 12,
                    size: "small",
                    type: "Text",
                },
                {
                    object: "obj",
                    fieldCol: 12,
                    key: 'issueDate',
                    size: "small",
                    type: "RangePicker",
                    fieldStyle: { width: "100%" },
                }, 
                {
                    object: "obj",
                    fieldCol: 12,
                    key: 'expiryDate',
                    size: "small",
                    type: "RangePicker",
                    fieldStyle: { width: "100%" },
                },
                {
                    Placeholder: "Value",
                    fieldCol: 12,
                    size: "small",
                    type: "Text",
                },
                {
                    Placeholder: "Expense",
                    fieldCol: 12,
                    size: "small",
                    type: "Text",
                },
                {
                    object: "obj",
                    fieldCol: 5,
                    key: 'value1',
                    size: "small",
                    shape:"$",
                    type: "InputNumber",
                    fieldStyle: { width: "100%" },
                }, 
                {
                    Placeholder: "<",
                    fieldCol: 1,
                    size: "small",
                    type: "Text",
                    fieldStyle: { textAlign: 'center'}
                },
                {
                    object: "obj",
                    fieldCol: 5,
                    key: 'value2',
                    size: "small",
                    shape:"$",
                    type: "InputNumber",
                    fieldStyle: { width: "100%" },
                }, 
                {
                    Placeholder: ".",
                    fieldCol: 1,
                    size: "small",
                    type: "Text",
                    fieldStyle: { textAlign: 'center'}
                },
                {
                    object: "obj",
                    fieldCol: 5,
                    key: 'expense1',
                    size: "small",
                    shape:"$",
                    type: "InputNumber",
                    fieldStyle: { width: "100%" },
                },
                {
                    Placeholder: "<",
                    fieldCol: 1,
                    size: "small",
                    type: "Text",
                },
                {
                    object: "obj",
                    fieldCol: 5,
                    key: 'expense2',
                    size: "small",
                    shape:"$",
                    type: "InputNumber",
                    fieldStyle: { width: "100%" },
                },
                {
                    Placeholder: "Description",
                    fieldCol: 24,
                    size: "small",
                    type: "Text",
                },
                {
                    object: "obj",
                    fieldCol: 24,
                    key: "description",
                    size: "small",
                    type: "Textarea",
                },
                {
                    Placeholder: "Comments",
                    fieldCol: 24,
                    size: "small",
                    type: "Text",
                },
                {
                    object: "obj",
                    fieldCol: 24,
                    key: "comment",
                    size: "small",
                    type: "Textarea",
                },
                
            ],
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
                    filterData: res.success? res.data : [],
                    editRex: false,
                    openModal: false
                })
            }
        })
    }

    openModal = (open, recordId, index) =>{
        this.setState({
            openModal: open, 
            editRex: recordId,
            tableIndex: index
        })
    }

    closeModal = () => {
        this.setState({ openModal: false, editRex: false, tableIndex: false});
    };

    handleDelete = (id, index) => {
        const { ProId, data,filterData } = this.state
        const { history } = this.props
        const url = `/projects/${ProId}/purchaseOrders`
        console.log(id, index);
        generalDelete(history, url, id, index, filterData, data).then(res =>{
            if (res.success){
                this.setState({
                    data: [...res.data],
                    filterData: [...res.filterData]
                })
            }
        })
    };

    callBack = (record) => {
        let { tableIndex, data } = this.state
        if(tableIndex !== false){
            data[tableIndex] = record
        }else{
            data.push(record)
        }
        this.setState({
            data: data,
            filterData: [...data],
            openModal: false, 
            editRex: false, 
            tableIndex: false
        })
    };

    generalFilter = (value) =>{
        const { data } = this.state
        if (value){
            this.setState({
                filterData: data.filter(el => {
                    return `00${el.id.toString()}`.includes(value) ||
                    el.value && formatCurrency(el.value).toLowerCase().includes(value.toLowerCase()) ||
                    el.expense && formatCurrency(el.expense).toLowerCase().includes(value.toLowerCase()) ||
                    el.issueDate && `${formatDate(el.issueDate, true, true)}`.toLowerCase().includes(value.toLowerCase()) ||
                    el.expiryDate && `${formatDate(el.expiryDate, true, true)}`.toLowerCase().includes(value.toLowerCase())
                })
            })
        }else{
            this.setState({
                filterData: data
            })
        }
    }

    advancefilter = (value, column, advSearch) =>{
        let { data, searchedColumn: search }= this.state
        if(column){
            search[column]['value'] = value // this will need in column filter
        }else{
            search = advSearch
        }
        if (search['issueDate']['value'] || search['expiryDate']['value'] ||
            search['value1']['value'] ||search['value2']['value']
            || search['expense1']['value'] || search['expense2']['value'] || 
            search['comment']['value'] || search['description']['value']  
        ){
            const issueDate = search['issueDate']['value'] ?? ['2010-10-19','2010-10-25' ]
            const expiryDate = search['expiryDate']['value'] ?? ['2010-10-19','2010-10-25']

            this.setState({
                filterData: data.filter(el => { // method one which have mutliple if condition for every multiple search
                    return (
                        moment(search['issueDate']['value']? formatDate(el.issueDate, true, 'YYYY-MM-DD'): '2010-10-20')
                        .isBetween(issueDate[0] ,issueDate[1] , undefined, '[]') &&
                        moment(search['expiryDate']['value']? formatDate(el.expiryDate, true, 'YYYY-MM-DD'): '2010-10-20')
                        .isBetween(expiryDate[0] , expiryDate[1] , undefined, '[]') &&
                        // (el.value >= 2 )&&
                        // ((el.value?? Number.NEGATIVE_INFINITY) <= (search['value1']['value'] === '' ? Number.POSITIVE_INFINITY  :Number.POSITIVE_INFINITY))&&
                        // ((el.value?? Number.POSITIVE_INFINITY) >= (search['value2']['value'] === '' ? Number.NEGATIVE_INFINITY  :Number.NEGATIVE_INFINITY))&&
                        // ((el.expense?? Number.NEGATIVE_INFINITY) <= (search['expense1']['value'] === '' ? Number.POSITIVE_INFINITY  :Number.POSITIVE_INFINITY))&&
                        // ((el.expense?? Number.POSITIVE_INFINITY) >= (search['expense2']['value'] === '' ? Number.NEGATIVE_INFINITY  :Number.NEGATIVE_INFINITY)) &&
                        `${el.comment ?? ''}`.toLowerCase().includes(search['comment']['value'].toLowerCase()) &&
                        `${el.description ?? ''}`.toLowerCase().includes(search['description']['value'].toLowerCase())
                    )
                }),
                searchedColumn: search,
                openSearch: false,
            })
        }else{
            this.setState({
                searchedColumn: search,
                filterData: data,
                openSearch: false,
            })
        }
    }

    render() {
        const { desc, filterData, openModal, editRex, ProId, permissions, searchedColumn, openSearch, filterFields } = this.state;
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
                    <Item label="Start Date">{formatDate(desc.startDate, true, true)} </Item>
                    <Item label="End Date">{formatDate(desc.endDate, true, true)}</Item>
                    <Item label="Bid Date">{formatDate(desc.bidDate, true, true)}</Item>
                    <Item label="Status">{desc.status ? O_STATUS[desc.status]: ''}</Item>
                    {/* <Item label="Gender">{data.gender}</Item> */}
                </Descriptions>
                <Row justify="end" gutter={'20'}>
                    {/* <Col> <Button 
                        type="default" 
                        size="small"
                        onClick={()=>this.setState({openSearch: true})}    
                    >
                        <FilterOutlined /> Filter
                    </Button> </Col> */}
                    <Col> <Button 
                        type="primary" 
                        size='small' 
                        onClick={() => {  this.openModal(true, false, false) }}
                        disabled={permissions && !permissions['ADD']}
                    > <PlusSquareOutlined/> Add Purchase Order</Button> </Col>
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
                    dataSource={filterData}
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
                {openSearch && <TableModalFilter
                    title={"Purchase Order - filter"}
                    visible={openSearch}
                    filters={searchedColumn}
                    filterFields={filterFields}
                    filterFunction={this.advancefilter}
                    onClose={()=>this.setState({openSearch:false})}
                />}
            </>
        );
    }
}

export default PurchaseOrder;
