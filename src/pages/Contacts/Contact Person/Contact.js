import React, { Component } from "react";
import { Row, Col, Menu, Table, Modal, Button, Dropdown, Popconfirm, Typography, Input, Space, Switch, InputNumber, } from "antd";
import { DownOutlined, SettingOutlined, PlusSquareOutlined, FilterOutlined, UploadOutlined,  SearchOutlined} from "@ant-design/icons"; //Icons
// import { Link } from 'react-router-dom'

import InfoModal from "./InfoModal";
import { getList, delList } from "../../../service/conatct-person";
import { GENDER, localStore } from "../../../service/constant";
import "../../styles/table.css";
import { Filtertags, TableModalFilter, tableSorter, tableSummaryFilter, tableTitleFilter } from "../../../components/Core/Table/TableFilter";
import { getOrganizations, getStandardLevels, getStates } from "../../../service/constant-Apis";

const { Title } = Typography;

class Contact extends Component {
    constructor(props) {
        super(props);
        this.contactForm = React.createRef();
        
        this.columns = [
            {
                title: "Code",
                dataIndex: "id",
                key: "id",
                width: 115,
                render: (record) => `00${record}`,
                // sorter: (a, b) => a.id - b.id,
                ...tableSorter('id', 'number', true),
                // ...tableFilter('id', 'startsWith')
            },
            {
                title: "First Name",
                dataIndex: "firstName",
                key: "firstName",
                ...tableSorter('firstName', 'string'),
                // ...tableFilter('firstName', 'includes')
            },
            {
                title: "Last Name",
                dataIndex: "lastName",
                key: "lastName",
                ...tableSorter('lastName', 'string'),
                // ...tableFilter('firstName', 'includes')
            },
            {
                title: "Gender",
                dataIndex: "gender",
                key: "gender",
                width: 100,
                render: (value)=> GENDER[value]
                // ...tableFilter('firstName', 'includes')
            },
            {
                title: "Email",
                dataIndex: "email",
                key: "email",
                // ...tableFilter('firstName', 'includes')
            },
            {
                title: "Contact",
                dataIndex: "phoneNumber",
                key: "phoneNumber",
                width: 150,
                // ...tableFilter('firstName', 'startsWith')
            },
            {
                title: "Action",
                key: "action",
                align: "right",
                width: 115,
                render: (value, record, index) => (
                    <Dropdown
                        overlay={
                            <Menu key={index}>
                                <Menu.Item danger>
                                    <Popconfirm
                                        title="Are you sure, you want to delete?"
                                        onConfirm={() =>
                                            this.handleDelete(record.id, index)
                                        }
                                    >
                                        Delete
                                    </Popconfirm>
                                </Menu.Item>
                                <Menu.Item
                                    onClick={() => { this.setState({ openModal: true, editCP: record.id }); }}
                                    disabled={this.state&& !this.state.permissions['UPDATE']}
                                >Edit</Menu.Item>
                                {/* <Menu.Item> */}
                                    {/* <Link to={{ pathname: '/admin/calender/holidays' ,query: record.key}} className="nav-link"> */}
                                    {/* View */}
                                    {/* </Link> */}
                                {/* </Menu.Item> */}
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
            openSearch: false,
            filterData:[],
            data: [],
            openModal: false,
            editCP: false,
            permissions: {},
            searchText: '',
            searchedColumn: {
                'id': {type: 'Input', value: '',  label:"Code", showInColumn: true},
                'firstName': {type: 'Input', value: '', label:"First Name",  showInColumn: true},
                'lastName': { type: 'Input', value: '', label:"Last Name",  showInColumn: true},
                'gender': {type: 'Select', multi: true, value: [], label:"Gender",  showInColumn: true, mode: 'multiple',
                options: [
                    { label: "Male", value: "M" },
                    { label: "Female", value: "F" },
                    { label: "Other", value: "O" },
                ]},
                'email': {type: 'Input', value: '',  label:"Email", showInColumn: true},
                'phoneNumber': {type: 'Input', value: '', label:"Phone Number",  showInColumn: true},
                'Action': {type: 'Input', value: '', label:"",  showInColumn: true, disabled:true},
                'stateId': {type: 'none', multi: true, value: [], label:"State",  showInColumn: false, disabled:false},
                'address': {type: 'none', value: '', label:"Address",  showInColumn: false, disabled:false},
                'skill': {type: 'none', multi: true, value: [], label:"Skill",  showInColumn: false, disabled:false},
                'association': {type: 'none', multi: true, value: [], label:"Association",  showInColumn: false, disabled:false},
            },
            
            filterFields: [ //just here for fun will get shift to contact
                {
                    Placeholder: "First Name",
                    fieldCol: 12,
                    size: "small",
                    type: "Text",
                },
                {
                    Placeholder: "Last Name",
                    fieldCol: 12,
                    size: "small",
                    type: "Text",
                },
                {
                    object: "obj",
                    fieldCol: 12,
                    key: "firstName",
                    size: "small",
                    type: "input",
                },
                {
                    object: "obj",
                    fieldCol: 12,
                    key: "lastName",
                    size: "small",
                    type: "input",
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
                    key: "phoneNumber",
                    size: "small",
                    type: "input",
                },
                {
                    object: "obj",
                    fieldCol: 12,
                    key: "email",
                    size: "small",
                    type: "input",
                },
                {
                    Placeholder: "Gender",
                    fieldCol: 12,
                    size: "small",
                    type: "Text",
                },
                {
                    Placeholder: "State",
                    fieldCol: 12,
                    size: "small",
                    type: "Text",
                },
                {
                    object: "obj",
                    fieldCol: 12,
                    key: "gender",
                    size: "small",
                    mode: 'multiple',
                    customValue: (value, option) => option,
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
                    key: "stateId",
                    mode: 'multiple',
                    customValue: (value, option) => option,
                    size: "small",
                    type: "Select",
                    // data: ,
                },
                {
                    Placeholder: "Skill",
                    fieldCol: 12,
                    size: "small",
                    type: "Text",
                },
                {
                    object: "obj",
                    fieldCol: 24,
                    key: "skill",
                    size: "small",
                    mode: 'multiple',
                    customValue: (value, option) => option,
                    data: [],
                    type: "Select",
                },
                {
                    Placeholder: "Association",
                    fieldCol: 12,
                    size: "small",
                    type: "Text",
                },
                {
                    object: "obj",
                    fieldCol: 24,
                    key: "association",
                    size: "small",
                    mode: 'multiple',
                    customValue: (value, option) => option,
                    data: [],
                    type: "Select",
                },
                {
                    Placeholder: "Address",
                    fieldCol: 12,
                    size: "small",
                    type: "Text",
                },
                {
                    object: "obj",
                    fieldCol: 24,
                    key: "address",
                    size: "small",
                    type: "Input",
                },
            ]
        };
    }
    
    componentDidMount = () =>{
        this.getData()
    }

    getData = () => {
        const { CONTACT_PERSONS }= JSON.parse(localStore().permissions)
        getList().then((res) => {
            if (res.success) {
                this.setState({
                    data: res.data,
                    filterData: res.data,
                    openModal: false,
                    editCP: false,
                    permissions: CONTACT_PERSONS
                });
            }
        });
    };

    handleDelete = (id, index) => {
        const url = '/contactpersons'
       const { data: d, filterData: fd } = this.state
       fd.splice(index,1) // deleting Index
       d.splice(index,1) // deleting Index
       this.setState({ filterData: [...fd], data: [...d] }) //Set the data...
    };

    toggelModal = (status) => {
        this.setState({ openModal: status, editCP: false, });
    };

    Callback = () => {
        this.getData()
    };

    submit = () => {
        this.contactForm.current.refs.contact_form.submit();
    };

    //Title bar filter for evey Coulmn showing 
    generalFilter = (value) =>{
        const { data } = this.state
        if (value){
            this.setState({
                filterData: data.filter(el => {
                    return `00${el.id.toString()}`.includes(value) ||
                    el.firstName && el.firstName.toLowerCase().includes(value.toLowerCase()) || 
                    el.lastName && el.lastName.toLowerCase().includes(value.toLowerCase()) ||
                    el.email && el.email.toLowerCase().includes(value.toLowerCase()) ||
                    el.gender && GENDER[el.gender].toLowerCase().includes(value.toLowerCase()) ||
                    el.phoneNumber && el.phoneNumber.startsWith(value) 
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
        search['skill']['value'].length > 0  ||search['association']['value'].length > 0
        ){
            
            this.setState({
                filterData: data.filter(el => { // method one which have mutliple if condition for every multiple search
                    return  `00${el.id.toString()}`.includes(search['id']['value']) &&
                    `${el.firstName ?? ''}`.toLowerCase().includes(search['firstName']['value'].toLowerCase()) &&
                    `${el.lastName ?? ''}`.toLowerCase().includes(search['lastName']['value'].toLowerCase()) &&
                    `${el.email ?? ''}`.toLowerCase().includes(search['email']['value'].toLowerCase()) &&
                    `${el.phoneNumber ?? ''}`.toLowerCase().includes(search['phoneNumber']['value'].toLowerCase())&&
                    `${el.address ?? ''}`.toLowerCase().includes(search['address']['value'].toLowerCase()) && 
                    //Creating an string using reduce of all the String array and searching sting in the function

    //Define  ====  //Reducing and creating the array        // but gotta check if the array is not empty otherwise gender value can't be found in emptySrting
                    (search['gender']['value'].length > 0 ? search['gender']['value'] : [{value: ','}])
                        .some(s => (search['gender']['value'].length > 0 ? [el.gender]: [',']).includes(s.value)) &&

                    (search['stateId']['value'].length > 0 ? search['stateId']['value'] : [{value: ','}])
                        .some(s => (search['stateId']['value'].length > 0 ? [el.stateId]: [',']).includes(s.value)) &&
                    // //searching for skill in skills array
                    // giving some function a default array... and search it if not passed
                    (search['skill']['value'].length > 0 ? search['skill']['value'] : [{value: ','}]).some(s => 
                        el.standardSkillStandardLevels && el.standardSkillStandardLevels.length> 0 && 
                            (search['skill']['value'].length > 0 ? el.standardSkillStandardLevels.map(p => p.standardSkillId): [',']).includes(s.value)) &&

                    (search['association']['value'].length > 0 ? search['association']['value'] : [{value: ','}]).some(s => 
                        el.contactPersonOrganizations && el.contactPersonOrganizations.length> 0 && 
                            (search['association']['value'].length > 0 ? el.contactPersonOrganizations.map(p => p.organizationId): [',']).includes(s.value))

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
        Promise.all([ getStates(), getStandardLevels(), getOrganizations() ])
        .then(res => {
            const { filterFields } = this.state
            filterFields[11].data = res[0].success? res[0].data : []
            filterFields[13].data = res[1].success? res[1].data : []
            filterFields[15].data = res[2].success? res[2].data : []
            this.setState({
                filterFields,
            })
        })
        .catch(e => {
            console.log(e);
        })
    }

    render() {
        const {filterData, openModal, editCP, permissions, searchedColumn, openSearch, filterFields} = this.state;
        const columns = this.columns;
        return (
            <>
                <Row justify="space-between">
                    <Col>
                        <Title level={4}>Contact Persons</Title>
                    </Col>
                    <Col style={{ textAlign: "end" }} span={12}>
                        <Row justify="end">
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
                            <Col offset={1}>
                                <Button
                                    type="primary"
                                    size="small"
                                    onClick={() => { this.setState({ openModal: true, }); }}
                                    disabled={!permissions['ADD']}
                                >
                                    <PlusSquareOutlined />
                                    Contact Person
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
                            className="fixed-top"
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
                    title={"Search Contact Persons"}
                    visible={openSearch}
                    filters={searchedColumn}
                    filterFields={filterFields}
                    filterFunction={this.advancefilter}
                    effectFunction={this.filterModalUseEffect}
                    effectRender={true}
                    onClose={()=>this.setState({openSearch:false})}
                />}
                {openModal && (
                    <InfoModal
                        visible={openModal}
                        editCP={editCP}
                        close={this.toggelModal}
                        callBack={this.Callback}
                    />
                )}

            </>
        );
    }
}

export default Contact;
