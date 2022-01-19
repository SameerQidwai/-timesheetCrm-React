import React, { Component } from "react";
import { Typography, Dropdown, Button, Table, Menu, Row, Col, } from "antd";
import { PlusSquareOutlined, SettingOutlined, FilterOutlined, DownOutlined, } from "@ant-design/icons"; //Icons

import { Link } from "react-router-dom";

import InfoModal from "./Modals/InfoModal";

import { getList } from "../../service/contractors";
import { localStore } from "../../service/constant";
import "../styles/table.css";
import { getOrganizations, getRoles, getStates } from "../../service/constant-Apis";
import { Filtertags, TableModalFilter, tableSorter, tableSummaryFilter, tableTitleFilter } from "../../components/Core/Table/TableFilter";

const { Title } = Typography;

class Contractors extends Component {
    constructor() {
        super();
        this.columns = [
            {
                title: "Code",
                dataIndex: ["contactPersonOrganization", "contactPersonId"],
                key: "contactPersonId",
                width: 115,
                render: (record) => {
                    return `Sub-00${ record}`
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
                title: "Organisation",
                dataIndex: ["contactPersonOrganization", "organization", "name"],
                key: "organization",
                ...tableSorter('contactPersonOrganization.organization.name', 'string')
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
                render: (record) => (
                    <Dropdown
                        overlay={
                            <Menu>
                                {/* <Menu.Item danger>
                                    <Popconfirm
                                        title="Sure to delete?"
                                        onConfirm={() => this.handleDelete(record.id) }
                                    >
                                        Delete
                                    </Popconfirm>
                                </Menu.Item> */}
                                <Menu.Item
                                    onClick={() => {
                                        this.setState({ infoModal: true, editCont: record.id, });
                                    }}
                                    disabled={this.state&& !this.state.permissions['UPDATE']}
                                >
                                    Edit
                                </Menu.Item>
                                <Menu.Item>
                                    <Link
                                        to={{
                                            pathname: `/sub-contractors/${record.id}/info`,
                                        }}
                                        className="nav-link"
                                    >
                                        View
                                    </Link>
                                </Menu.Item>
                                <Menu.Item>
                                    <Link
                                        to={{
                                            pathname: `/sub-contractors/${record.id}/contracts`,
                                        }}
                                        className="nav-link"
                                    >
                                        Contracts
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
            editCont: false,
            data: [],
            permissions: {},
            filterData: [],
            openSearch: false,
            searchedColumn: {
                'id': {type: 'Input', value: '',  label:"Code", showInColumn: true},
                'firstName': {type: 'Input', value: '', label:"First Name",  showInColumn: true},
                'lastName': { type: 'Input', value: '', label:"Last Name",  showInColumn: true},
                'organization': { type: 'Select', multi: true, value: [], label:"Organisation",  showInColumn: true},
                'phoneNumber': {type: 'Input', value: '', label:"Phone Number",  showInColumn: true},
                'email': {type: 'Input', value: '',  label:"Email", showInColumn: true},
                'Action': {type: 'Input', value: '', label:"",  showInColumn: true, disabled:true},
                'stateId': {type: 'none', multi: true, value: [], label:"State",  showInColumn: false, disabled:false},
                'gender': {type: 'Select', multi: true, value: [], label:"Gender",  showInColumn: false},
                'address': {type: 'none', value: '', label:"Address",  showInColumn: false, disabled:false},
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
                    Placeholder: "Email",
                    
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
                    customValue: (value, option)=> option,
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
                    customValue: (value, option)=> option,
                    key: "stateId",
                    size: "small",
                    type: "Select",
                    data: [],
                },
                {
                    Placeholder: "Role",
                    fieldCol: 12,
                    size: "small",
                    type: "Text",
                    labelAlign: "right",
                },
                {
                    Placeholder: "Organization",
                    fieldCol: 12,
                    size: "small",
                    type: "Text",
                    labelAlign: "right",
                },
                {
                    object: "obj",
                    fieldCol: 12,
                    mode: 'multiple',
                    customValue: (value, option)=> option,
                    key: "role",
                    size: "small",
                    type: "Select",
                    data: [],
                },
                {
                    object: "obj",
                    fieldCol: 12,
                    mode: 'multiple',
                    customValue: (value, option)=> option,
                    key: "organization",
                    size: "small",
                    type: "Select",
                    data: [],
                },
                {
                    Placeholder: "Address",
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
                    editCont: false,
                    permissions: USERS
                })
            }
        })
    }
    
    callBack = () => {
        this.getList()
    };


    handleDelete = (code) => {
        const dataSource = [...this.state.data];
        this.setState({
            data: dataSource.filter((item) => item.code !== code),
        });
    };

    closeModal = () => {
        this.setState({
            infoModal: false,
            editCont: false,
        });
    };

    generalFilter = (value) =>{
        const { data } = this.state
        if (value){
            this.setState({
                filterData: data.filter(el => {
                    const {firstName, lastName, email, phoneNumber, id}= el.contactPersonOrganization.contactPerson
                    const {name: organization}= el.contactPersonOrganization.organization
                    return `Sub-${id.toString()}`.includes(value) ||
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
                search[column]['value'] = value
            }else{
                search = advSearch
            }
    
            if (search['id']['value'] || search['firstName']['value'] ||
            search['lastName']['value'] || search['email']['value'] ||
            search['phoneNumber']['value'] || search['gender']['value'].length>0 || 
            search['stateId']['value'].length>0 ||search['address']['value'] ||
            search['role']['value'].length > 0 || search['organization']['value'].length > 0
            ){
                
                this.setState({
                    filterData: data.filter(el => { // method one which have mutliple if condition for every multiple search
                        const {firstName, lastName, email, phoneNumber, id, gender, stateId, address}= el.contactPersonOrganization.contactPerson
                        const {organizationId}= el.contactPersonOrganization
                        return  `Sub-${id.toString()}`.includes(search['id']['value']) &&
                            `${firstName ?? ''}`.toLowerCase().includes(search['firstName']['value'].toLowerCase()) &&
                            `${lastName ?? ''}`.toLowerCase().includes(search['lastName']['value'].toLowerCase()) &&
                            `${email ?? ''}`.toLowerCase().includes(search['email']['value'].toLowerCase()) &&
                            `${phoneNumber ?? ''}`.toLowerCase().includes(search['phoneNumber']['value'].toLowerCase())&&
                            `${address ?? ''}`.toLowerCase().includes(search['address']['value'].toLowerCase()) && 
                            //Creating an string using reduce of all the String array and searching sting in the function
                                                        
                            (search['gender']['value'].length > 0 ? search['gender']['value'] : [{value: ','}])
                             .some(s => (search['gender']['value'].length > 0 ? [gender]: [',']).includes(s.value)) &&
    
                            (search['stateId']['value'].length > 0 ? search['stateId']['value'] : [{value: ','}])
                             .some(s => (search['stateId']['value'].length > 0 ? [stateId]: [',']).includes(s.value)) &&
        
                            (search['role']['value'].length > 0 ? search['role']['value'] : [{value: ','}])
                             .some(s => (search['role']['value'].length > 0 ? [el.roleId]: [',']).includes(s.value)) &&

                             (search['organization']['value'].length > 0 ? search['organization']['value'] : [{value: ','}])
                             .some(s => (search['organization']['value'].length > 0 ? [organizationId]: [',']).includes(s.value)) 
                    }),
                    searchedColumn: search,
                    openSearch: false,
                })
            }else{
                this.setState({
                    searchedColumn: search,
                    filterData: data
                })
            }
        }
    
        filterModalUseEffect = () =>{
            Promise.all([ getStates(), getRoles(), getOrganizations() ])
            .then(res => {
                const { filterFields } = this.state
                filterFields[11].data = res[0].success? res[0].data : []
                filterFields[14].data = res[1].success? res[1].data : []
                filterFields[15].data = res[2].success? res[2].data.filter((item) => item.value !== 1 ): []
                this.setState({
                    filterFields,
                })
            })
            .catch(e => {
                console.log(e);
            })
        }


    render() {
        const { data, infoModal, editCont, permissions, filterData, searchedColumn, filterFields, openSearch } = this.state;
        const columns = this.columns;
        return (
            <>
                <Row justify="space-between">
                    <Col>
                        <Title level={4}>Contractors</Title>
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
                                    Contactors
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
                        editCont={editCont}
                        close={this.closeModal}
                        callBack={this.callBack}
                    />
                )}
            </>
        );
    }
}

export default Contractors;
