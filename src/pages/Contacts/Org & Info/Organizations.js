import React, { Component } from "react";
import { Popconfirm, Typography, Dropdown, Button, Table, Menu, Row, Col, } from "antd";
import { PlusSquareOutlined, SettingOutlined, FilterOutlined, DownOutlined, } from "@ant-design/icons"; //Icons
import { Link } from "react-router-dom";

import InfoModal from "./InfoModal";
import { getList, delOrg } from "../../../service/Organizations";

import "../../styles/table.css";
import { localStore } from "../../../service/constant";
import {  Filtertags, TableModalFilter, tableSorter, tableSummaryFilter, tableTitleFilter } from "../../../components/Core/Table/TableFilter";

const { Title } = Typography;

class Organizations extends Component {
    constructor(props) {
        super(props);
        this.columns = [
            {
                title: "Code",
                dataIndex: "id",
                key: "id",
                width: 120,
                render: (record) => `ORG-00${record}`,
                ...tableSorter('id', 'number', true),
            },
            {
                title: "Name",
                dataIndex: "name",
                key: "name",
                width: 500,
                ...tableSorter('name', 'string'),
            },
            {
                title: "Title",
                dataIndex: "title",
                key: "title",
                width: 100,
                ...tableSorter('name', 'string'),
            },
            {
                title: "Parent Organisation",
                dataIndex: "parentOrganization",
                key: "parentOrganization",
                width: 500,
                render: (record) => {
                    return record && <Link 
                        to={{ pathname: `/organisations/${record.id}/info`, }}
                        className="nav-link"
                    >
                        {record.name}</Link> 
                },
                ...tableSorter('parentOrganization.name', 'string'),
            },
            {
                title: "Action",
                key: "action",
                align: "right",
                width: 100,
                render: (record) => ( 
                    <Dropdown
                        overlay={
                            <Menu>
                                {/* <Menu.Item danger>
                                    <Popconfirm
                                        title="Sure to delete?"
                                        onConfirm={() => this.handleDelete(record.id) }
                                    >Delete</Popconfirm>
                                </Menu.Item> */}
                                <Menu.Item
                                    onClick={() => { this.setState({ infoModal: true, editOrg: record.id }); }}
                                    disabled={this.state&& !this.state.permissions['UPDATE']}
                                >Edit </Menu.Item>
                                <Menu.Item>
                                    <Link
                                        to={{ pathname: `/organisations/${record.id}/info`, }}
                                        className="nav-link"
                                    >View </Link>
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
            editOrg: false, //creating Component
            data: [],
            filterData: [],
            permissions: {},
            searchedColumn: {
                'id': {type: 'Input', value: '',  label:"Code", showInColumn: true},
                'name': {type: 'Input', value: '', label:"Organisation",  showInColumn: true},
                'title': {type: 'Input', value: '', label:"Title",  showInColumn: true},
                'parentOrganization.name': { type: 'Input', value: '', label:"Parent Organisation",  showInColumn: true},
                'Action': {type: 'Input', value: '', label:"",  showInColumn: true, disabled:true},
                'email': {type: 'Input', value: '',  label:"Email", showInColumn: false},
                'phoneNumber': {type: 'Input', value: '', label:"Phone Number",  showInColumn: false},
                'address': {type: 'none', value: '', label:"Address",  showInColumn: false},
                'businessType': {type: 'none', multi: true, value: [], label:"Business Type",  showInColumn: false},
                'delegate_cp': {type: 'none', value: [], label:"Delegate Contact Person",  showInColumn: false},

            },

            filterFields: [
                {
                    Placeholder: "Name",
                    fieldCol: 9,
                    size: "small",
                    type: "Text",
                },
                {
                    Placeholder: "Title",
                    fieldCol: 3,
                    size: "small",
                    type: "Text",
                },
                {
                    Placeholder: "Parent",
                    fieldCol: 12,
                    size: "small",
                    type: "Text",
                },
                {
                    object: "obj",
                    fieldCol: 9,
                    key: "name",
                    size: "small",
                    type: "Input",
                },
                {
                    object: "obj",
                    fieldCol: 3,
                    key: "title",
                    size: "small",
                    type: "Input",
                },
                {
                    object: "obj",
                    fieldCol: 12,
                    key: "parentOrganization.name",
                    size: "small",
                    type: "Input",
                },
                {
                    Placeholder: "Phone",
                    fieldCol: 12,
                    size: "small",
                    type: "Text",
                },
                {
                    Placeholder: "Email",
                    fieldCol: 12,
                    size: "small",
                    type: "Text",
                },
                {
                    object: "obj",
                    fieldCol: 12,
                    key: "phone",
                    size: "small",
                    type: "Input",
                },
                {
                    object: "obj",
                    fieldCol: 12,
                    key: "email",
                    size: "small",
                    type: "Input",
                },
                {
                    Placeholder: "Business Type",
                    fieldCol: 12,
                    size: "small",
                    type: "Text",
                },
                {
                    Placeholder: "Delegate Contact person",
                    fieldCol: 12,
                    size: "small",
                    type: "Text",
                },
                {
                    object: "obj",
                    fieldCol: 12,
                    key: "businessType",
                    size: "small",
                    type: "Select",
                    mode: "multiple",
                    customValue: (value, option) => option,
                    data: [
                        {label: 'Sole Trader', value: 1 },
                        {label: 'Partnership', value: 2 },
                        {label: 'Company', value: 3 },
                        {label: 'Trust', value: 4 },
                    ]
                },
                {
                    object: "obj",
                    fieldCol: 12,
                    key: "delegate_cp",
                    size: "small",
                    // rules:[{ required: true }],
                    data: this.state? this.state.contactPerson : [],
                    type: "Select",
                    itemStyle: { marginBottom: "10px" },
                },
                {
                    Placeholder: "Address",
                    fieldCol: 24,
                    size: "small",
                    type: "Text",
                    labelAlign: "right",
                    // itemStyle:{marginBottom:'10px'},
                },
                {
                    object: "obj",
                    fieldCol: 24,
                    key: "address",
                    size: "small",
                    // rules:[{ required: true }],
                    type: "Input",
                },
            ]
        };
    }
    
    componentDidMount = () =>{
        this.getData()
    }

    getData = () => {
        const { ORGANIZATIONS }= JSON.parse(localStore().permissions)
        getList().then((res) => {
            if (res.success) {
                this.setState({
                    data: res.data,
                    filterData: res.data,
                    infoModal: false,
                    editOrg: false,
                    permissions: ORGANIZATIONS,
                    openSearch: false
                });
            }
        });
    };

    handleDelete = (id) => {
        delOrg(id).then((res) => {
            if (res.success) {
                this.getData();
            }
        });
    };

    closeModal = () => {
        this.setState({
            infoModal: false,
            editOrg: false,
        });
    };
    
    callBack = () => {
        this.getData()
    };

    generalFilter = (value) =>{
        const { data } = this.state
        if (value){
            this.setState({
                filterData: data.filter(el => {
                    return `ORG-00${el.id.toString()}`.includes(value) ||
                    el.name && el.name.toLowerCase().includes(value.toLowerCase()) || 
                    el.title && el.title.toLowerCase().includes(value.toLowerCase()) ||
                    el.parentOrganization && el.parentOrganization.name.toLowerCase().includes(value.toLowerCase())
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
            search[column]['value'] = value
        }else{
            search = advSearch
        }
        if (search['id']['value'] || search['name']['value'] ||
        search['title']['value'] ||search['parentOrganization.name']['value']
        || search['phoneNumber']['value'] || search['email']['value'] || 
        search['address']['value'] || search['businessType']['value'].length >0  
        ){
            
            this.setState({
                filterData: data.filter(el => { // method one which have mutliple if condition for every multiple search
                    return `ORG-00${el.id.toString()}`.includes(search['id']['value']) &&
                        `${el.name ?? ''}`.toLowerCase().includes(search['name']['value'].toLowerCase()) &&
                        `${el.title ?? ''}`.toLowerCase().includes(search['title']['value'].toLowerCase()) &&
                        `${el.parentOrganization ?el.parentOrganization.name : ""}`.toLowerCase()
                        .includes(search['parentOrganization.name']['value'].toLowerCase()) &&
                        `${el.phoneNumber ?? ''}`.toLowerCase().includes(search['phoneNumber']['value'].toLowerCase())&&
                        `${el.email ?? ''}`.toLowerCase().includes(search['email']['value'].toLowerCase()) &&
                        `${el.address ?? ''}`.toLowerCase().includes(search['address']['value'].toLowerCase()) &&
                        `${search['delegate_cp']['value'].reduce((p, n) => p + n, '')}`.includes(`${search['delegate_cp']['value'].length > 0 ?el.delegateContactPersonId ?? '' : ''}`) &&
                        
                        (search['businessType']['value'].length > 0 ? search['businessType']['value'] : [{value: ','}])
                        .some(s => (search['businessType']['value'].length > 0 ? [el.businessType]: [',']).includes(s.value))
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
        const { data, infoModal, editOrg, permissions, filterData, searchedColumn, filterFields, openSearch } = this.state;
        const columns = this.columns;
        return (
            <>
                <Row justify="space-between">
                    <Col>
                        <Title level={4}>Organisations</Title>
                    </Col>
                    <Col style={{ textAlign: "end" }} span={4}>
                        <Row justify="space-between">
                            <Col>
                                
                                <Button 
                                    type="default" 
                                    size="small"
                                    onClick={()=>this.setState({openSearch: true})}    
                                >
                                    <FilterOutlined />
                                    Filter
                                </Button>
                            </Col>
                            <Col>
                                <Button
                                    type="primary"
                                    onClick={() => { this.setState({ infoModal: true }); }}
                                    size="small"
                                    disabled={!permissions['ADD']}
                                >
                                    <PlusSquareOutlined />
                                    Organisations
                                </Button>
                            </Col>
                        </Row>
                    </Col>
                    <Filtertags
                        filters={searchedColumn}
                        filterFunction={this.advancefilter}
                    />
                    <Col span={24}>
                        <Table
                            title={()=>tableTitleFilter(5, this.generalFilter)}
                            bordered
                            pagination={{pageSize: localStore().pageSize}} 
                            rowKey={(data) => data.id}
                            columns={columns}
                            dataSource={filterData}
                            size="small"
                            sticky
                            // summary={()=>tableSummaryFilter(searchedColumn, this.advancefilter)}
                        />
                    </Col>
                </Row>
                {openSearch && <TableModalFilter
                    title="Search Organization"
                    visible={openSearch}
                    filters={searchedColumn}
                    filterFields={filterFields}
                    filterFunction={this.advancefilter}
                    onClose={()=>this.setState({openSearch:false})}
                />}
                {infoModal && (
                    <InfoModal
                        visible={infoModal}
                        editOrg={editOrg}
                        close={this.closeModal}
                        callBack={this.callBack}
                    />
                )}
            </>
        );
    }
}

export default Organizations;
