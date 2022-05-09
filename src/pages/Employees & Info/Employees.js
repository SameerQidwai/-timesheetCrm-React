import React, { Component } from "react";
import { Popconfirm, Typography, Dropdown, Button, Table, Menu, Row, Col, } from "antd";

import { PlusSquareOutlined, SettingOutlined, FilterOutlined, DownOutlined, } from "@ant-design/icons"; //Icons

import { Link } from "react-router-dom"; 

import InfoModal from "./Modals/InfoModal";

import { getList, delList } from "../../service/Employees";
import { localStore } from "../../service/constant";
import { Filtertags, TableModalFilter, tableSorter, tableSummaryFilter, tableTitleFilter } from "../../components/Core/Table/TableFilter";
import { getRoles, getStates } from "../../service/constant-Apis";
import { generalDelete } from "../../service/delete-Api's";

const { Title } = Typography;

class Employees extends Component {
    constructor() {
        super();
        this.columns = [
            {
                title: "Code",
                dataIndex: ["contactPersonOrganization", "contactPersonId"],
                key: "contactPersonId",
                render: (record) => {
                    return `Emp-00${ record }`
                },
                ...tableSorter('contactPersonOrganization.contactPersonId', 'number', true)
            },
            {
                title: "First Name",
                dataIndex: ["contactPersonOrganization", "contactPerson", "firstName"],
                key: "firstName",
                ...tableSorter('contactPersonOrganization.contactPerson.firstName', 'string')
            },
            {
                title: "Last Name",
                dataIndex: ["contactPersonOrganization", "contactPerson", "lastName"],
                key: "lastName",
                ...tableSorter('contactPersonOrganization.contactPerson.lastName', 'string')
            },
            {
                title: "Phone",
                dataIndex: ["contactPersonOrganization", "contactPerson", "phoneNumber"],
                key: "phoneNumber",
            },
            {
                title: "Email",
                dataIndex: ["contactPersonOrganization", "contactPerson", "email"],
                key: "email",
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
                                    onClick={() => {
                                        this.setState({ infoModal: true, editEmp: record.id, });
                                    }}
                                    disabled={this.state&& !this.state.permissions['UPDATE']}
                                >
                                    Edit
                                </Menu.Item>
                                <Menu.Item>
                                    <Link
                                        to={{
                                            pathname: `/Employees/${record.id}/info`,
                                        }}
                                        className="nav-link"
                                    >
                                        View
                                    </Link>
                                </Menu.Item>
                                <Menu.Item>
                                    <Link
                                        to={{
                                            pathname: `/Employee/${record.id}/contracts`,
                                        }}
                                        className="nav-link"
                                    >
                                        Contract History
                                    </Link>
                                </Menu.Item>
                                <Menu.Item>
                                    <Link
                                        to={{
                                            pathname: `/Employee/${record.id}/novated-lease`,
                                        }}
                                        className="nav-link"
                                    >
                                        Novated Lease
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
            editEmp: false,
            data: [],
            permissions: {},
            filterData: [],
            openSearch: false,
            searchedColumn: {
                'id': {type: 'Input', value: '',  label:"Code", showInColumn: true},
                'firstName': {type: 'Input', value: '', label:"First Name",  showInColumn: true},
                'lastName': { type: 'Input', value: '', label:"Last Name",  showInColumn: true},
                'phoneNumber': {type: 'Input', value: '', label:"Phone Number",  showInColumn: true},
                'email': {type: 'Input', value: '',  label:"Personal Email", showInColumn: true},
                'Action': {type: 'Input', value: '', label:"",  showInColumn: true, disabled:true},
                'stateId': {type: 'none', multi: true, value: [], label:"State",  showInColumn: false, disabled:false},
                'gender': {type: 'Select', multi: true, value: [], label:"Gender",  showInColumn: false},
                'address': {type: 'none', value: '', label:"Residential Address",  showInColumn: false, disabled:false},
                'role': {type: 'none', multi: true, value: [], label:"Role",  showInColumn: false, disabled:false},
            },

            filterFields: [
                {
                    fieldCol: 12, // this is only label 5
                    size: "small",
                    Placeholder: "First Name",
                    type: "Text",
                    labelAlign: "left",
                },
                {
                    Placeholder: "Last Name",
                    fieldCol: 12, // this is only label 8
                    size: "small",
                    type: "Text",
                    labelAlign: "left",
                },
                {
                    object: "obj", //this is field 7
                    fieldCol: 12,
                    key: "firstName",
                    size: "small",
                    type: "Input",
                    labelAlign: "left",
                    
                },
                {
                    object: "obj", //this is field 9
                    fieldCol: 12,
                    key: "lastName",
                    size: "small",
                    type: "Input",
                    labelAlign: "left",
                    
                },
                {
                    Placeholder: "Phone",
                    fieldCol: 12,
                    size: "small",
                    type: "Text",
                    labelAlign: "right",
                },
                {
                    fieldCol: 12, // this is only label 4
                    size: "small",
                    Placeholder: "Personal Email",
                    
                    type: "Text",
                    labelAlign: "left",
                },
                {
                    object: "obj",
                    fieldCol: 12,
                    key: "phoneNumber",
                    size: "small",
                    type: "input",
                },
                {
                    object: "obj", //this is field 6
                    fieldCol: 12,
                    key: "email",
                    size: "small",
                    type: "Input",
                    
                },
                {
                    Placeholder: "Gender",
                    fieldCol: 12,
                    size: "small",
                    type: "Text",
                    labelAlign: "right",
                },
                {
                    Placeholder: "State",
                    fieldCol: 12,
                    size: "small",
                    type: "Text",
                    labelAlign: "right",
                },
                {
                    object: "obj",
                    fieldCol: 12,
                    key: "gender",
                    mode: 'multiple',
                    customValue: (value, option)=>option,
                    size: "small",
                    data: [
                        { label: "Male", value: "M" },
                        { label: "Female", value: "F" },
                        { label: "Other", value: "O" },
                    ],
                    type: "Select",
                },
                {
                    object: "obj",
                    fieldCol: 12,
                    mode: 'multiple',
                    customValue: (value, option)=>option,
                    key: "stateId",
                    size: "small",
                    type: "Select",
                    data: [],
                },
                {
                    Placeholder: "Role",
                    fieldCol: 24,
                    size: "small",
                    type: "Text",
                    labelAlign: "right",
                },
                {
                    object: "obj",
                    fieldCol: 12,
                    mode: 'multiple',
                    key: "role",
                    customValue: (value, option)=>option,
                    size: "small",
                    type: "Select",
                    data: [],
                },
                {
                    Placeholder: "Residential Address",
                    fieldCol: 24,
                    size: "small",
                    type: "Text",
                    labelAlign: "right",
                },
                {
                    object: "obj",
                    fieldCol: 24,
                    key: "address",
                    size: "small",
                    type: "Input",
                },
            ],
        };
    }

    componentDidMount = () =>{
        this.getList()
    }

    getList = () =>{
        const { USERS }= JSON.parse(localStore().permissions)
        getList().then(res=>{
            if (res.success){
                this.setState({
                    data: res.data,
                    filterData: res.data,
                    infoModal: false,
                    editEmp: false,
                    permissions: USERS
                })
            }
        })
    }

    handleDelete = (id, index) => {
        const url = '/employees'
        const { data, filterData } = this.state
        const { history } = this.props
        generalDelete(history, url, id, index, filterData, data).then(res =>{
            if (res.success){
                this.setState({
                    data: [...res.data],
                    filterData: [...res.filterData]
                })
            }
        })
    };

    closeModal = () => {
        this.setState({ infoModal: false, editEmp: false, });
    };
    
    callBack = (value) => {
        // const { data, editEmp } = this.state;
        this.getList()
    };

    generalFilter = (value) =>{
        const { data } = this.state
        if (value){
            this.setState({
                filterData: data.filter(el => {
                    const {firstName, lastName, email, phoneNumber, id}= el.contactPersonOrganization.contactPerson
                    return `Emp-00${id.toString()}`.includes(value) ||
                    firstName && firstName.toLowerCase().includes(value.toLowerCase()) || 
                    lastName && lastName.toLowerCase().includes(value.toLowerCase()) ||
                    email && email.toLowerCase().includes(value.toLowerCase()) ||
                    phoneNumber && phoneNumber.startsWith(value) 
                })
            })
        }else{
            this.setState({
                filterData: data
            })
        }
    }
         //summary or modal filter
    advancefilter = (value, column, advSearch) =>{
        let { data, searchedColumn: search }= this.state
        if(column){
            search[column]['value'] = value // this will need in column filter
        }else{
            search = advSearch
        }

        if (search['id']['value'] || search['firstName']['value'] ||
        search['lastName']['value'] || search['email']['value'] ||
        search['phoneNumber']['value'] || search['gender']['value'].length>0 || 
        search['stateId']['value'].length>0 ||search['address']['value'] ||
        search['role']['value'].length > 0 
        ){
            
            this.setState({
                filterData: data.filter(el => { // method one which have mutliple if condition for every multiple search
                    const {firstName, lastName, email, phoneNumber, id, gender, stateId, address}= el.contactPersonOrganization.contactPerson
                    return  `Emp-00${id.toString()}`.includes(search['id']['value']) &&
                    `${firstName ?? ''}`.toLowerCase().includes(search['firstName']['value'].toLowerCase()) &&
                    `${lastName ?? ''}`.toLowerCase().includes(search['lastName']['value'].toLowerCase()) &&
                    `${email ?? ''}`.toLowerCase().includes(search['email']['value'].toLowerCase()) &&
                    `${phoneNumber ?? ''}`.toLowerCase().includes(search['phoneNumber']['value'].toLowerCase())&&
                    `${address ?? ''}`.toLowerCase().includes(search['address']['value'].toLowerCase()) && 
                    //Creating an string using reduce of all the String array and searching sting in the function

    //Define  ====  //Reducing and creating the array        // but gotta check if the array is not empty otherwise gender value can't be found in emptySrting
                    (search['gender']['value'].length > 0 ? search['gender']['value'] : [{value: ','}])
                        .some(s => (search['gender']['value'].length > 0 ? [gender]: [',']).includes(s.value)) &&

                    (search['stateId']['value'].length > 0 ? search['stateId']['value'] : [{value: ','}])
                        .some(s => (search['stateId']['value'].length > 0 ? [stateId]: [',']).includes(s.value)) &&

                    (search['role']['value'].length > 0 ? search['role']['value'] : [{value: ','}])
                        .some(s => (search['role']['value'].length > 0 ? [el.roleId]: [',']).includes(s.value))

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

    filterModalUseEffect = () =>{
        Promise.all([ getStates(), getRoles() ])
        .then(res => {
            const { filterFields } = this.state
            filterFields[11].data = res[0].success? res[0].data : []
            filterFields[13].data = res[1].success? res[1].data : []
            this.setState({
                filterFields,
            })
        })
        .catch(e => {
            console.log(e);
        })
    }

    render() {
        const { data, infoModal, editEmp, permissions, filterData, searchedColumn, filterFields, openSearch } = this.state;
        const columns = this.columns;
        return (
            <>
                <Row justify="space-between">
                    <Col>
                        <Title level={4}>Employees</Title>
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
                                    Employees
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
                            className='fs-small'
                            // summary={()=>tableSummaryFilter(searchedColumn, this.advancefilter)}
                        />
                    </Col>
                </Row>
                {openSearch && <TableModalFilter
                    title={"Search Employees"}
                    visible={openSearch}
                    filters={searchedColumn}
                    filterFields={filterFields}
                    filterFunction={this.advancefilter}
                    effectFunction={this.filterModalUseEffect}
                    effectRender={true}
                    onClose={()=>this.setState({openSearch:false})}
                />}
                {infoModal && (
                    <InfoModal
                        visible={infoModal}
                        editEmp={editEmp}
                        close={this.closeModal}
                        callBack={this.callBack}
                    />
                )}
            </>
        );
    }
}

export default Employees;
