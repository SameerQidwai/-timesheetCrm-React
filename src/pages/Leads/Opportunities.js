import React, {Component} from 'react'
import { Table, Menu, Dropdown, Button, Popconfirm, Row, Col,Typography, Modal } from 'antd'
import { DownOutlined, SettingOutlined, PlusSquareOutlined, FilterOutlined} from '@ant-design/icons'; //Icons
import { Link } from 'react-router-dom'

import InfoModal from './Modals/InfoModal'

import { getList, delList } from "../../service/opportunities";

import '../styles/table.css'
import moment from "moment";
import { formatCurrency, localStore, O_STAGE, O_STATUS, O_TYPE } from '../../service/constant';
import { Filtertags, TableModalFilter, tableSorter, tableSummaryFilter, tableTitleFilter } from '../../components/Core/Table/TableFilter';
const { Title } = Typography

class Opportunities extends Component {
    constructor(props) {
    super(props);
        this.leadForm = React.createRef();
        this.columns = [
            {
                title: 'Code',
                dataIndex: 'id',
                key: 'id',
                render:(record) =>( `00${record}` ),
                ...tableSorter('id', 'number', true),
            },
            {
                title: 'Title',
                dataIndex: 'title',
                key: 'title',
                ...tableSorter('title', 'string'),
            },
            {
                title: 'Organisation Name',
                dataIndex: 'organization',
                width: 200,
                key: 'organization',
                render: (record) =>{
                    return record && <Link 
                        to={{ pathname: `/organisations/${record.id}/info`, }}
                        className="nav-link"
                    >
                        {record.name}</Link> 
                },
                ...tableSorter('organization.name', 'string'),
            },
            {
                title: 'Revenue',
                dataIndex: 'value',
                key: 'value',
                render: (record)=>  `${formatCurrency(record)}`,
                sorter: (a, b) => a.value - b.value,
                ...tableSorter('value', 'number'),
            },
            {
                title: 'Start Date',
                dataIndex: 'startDate',
                key: 'startDate',
                render: (record) =>(record && moment(record).format('ddd DD MM yyyy')),
                ...tableSorter('startDate', 'date'),
            },
            {
                title: 'End Date',
                dataIndex: 'endDate',
                key: 'endDtae',
                render: (record) =>(record && moment(record).format('ddd DD MM yyyy')),
                ...tableSorter('endDate', 'date'),
            },
            {
                title: 'Bid Date',
                dataIndex: 'bidDate',
                key: 'bidDate',
                render: (record) =>(record && moment(record).format('ddd DD MM yyyy')),
                ...tableSorter('bidDate', 'date'),            },
            {
                title: 'Stage',
                dataIndex: 'stage',
                key: 'stage',
                render: (record) =>  O_STAGE[record]
            },
            {
                title: 'Status',
                dataIndex: 'status',
                key: 'status',
                render: (record) => O_STATUS[record] 
            },
            {
                title: 'Type',
                dataIndex: 'type',
                key: 'type',
                render: (record) => O_TYPE[record] 
            },
            {
                title: 'Action',
                key: 'action',
                align: 'right',
                width: 115,
                render: (record) => (
                    <Dropdown overlay={
                        <Menu>
                            <Menu.Item danger>
                                <Popconfirm title="Sure to delete?" onConfirm={() => this.handleDelete(record.id)} >
                                    Delete
                                </Popconfirm>
                            </Menu.Item >
                            <Menu.Item 
                                onClick={()=>this.setState({
                                    openModal: true,
                                    editLead: record.id
                                })}
                                disabled={this.state&& !this.state.permissions['UPDATE']}
                            >Edit</Menu.Item>
                            {record.type === 1 ?  //if condition
                                <Menu.Item> 
                                    <Link
                                        to={{ pathname: `/opportunities/${record.id}/milestones`, }}
                                        className="nav-link"
                                    >
                                        Milestones
                                    </Link>
                                </Menu.Item>
                                 : //else condition
                                <Menu.Item>
                                    <Link
                                        to={{
                                            // pathname: `/opportunities/${record.id}/milestones/${record.id}/resources`,
                                            pathname: `/opportunities/${record.id}/milestones/${record.milestones[0] && record.milestones[0].id}/resources`,
                                        }}
                                        className="nav-link"
                                    >
                                        Postions
                                    </Link>
                                </Menu.Item>
                            }
                            <Menu.Item >
                                <Link to={{ pathname: `/opportunities/${record.id}/info`}} className="nav-link">
                                    View
                                </Link>
                            </Menu.Item >
                        </Menu>
                    }>
                        <Button size='small'>
                            <SettingOutlined/> Option <DownOutlined/>
                        </Button>
                    </Dropdown>  
                ),
            },
        ];

        this.state = {
            data : [],
            openModal: false,
            editLead:false,
            permissions: {},
            filterData: [],
            openSearch: false,
            searchedColumn: {
                'id': {type: 'Input', value: '',  label:"Code", showInColumn: true},
                'title': {type: 'Input', value: '', label:"Title",  showInColumn: true},
                'organization': { type: 'Select', value: [], label:"Organization",  showInColumn: true},
                'value': {type: 'Input', value: '', label:"Revenue",  showInColumn: true},
                'starDate': {type: 'Input', value: '',  label:"starDate", showInColumn: true, disabled:true},
                'endDate': {type: 'Input', value: '',  label:"endDate", showInColumn: true, disabled:true},
                'bidDate': {type: 'Input', value: '',  label:"bidDate", showInColumn: true, disabled:true},
                'stage': { type: 'Select', value: [], label:"stage",  showInColumn: true},
                'status': { type: 'Select', value: [], label:"Status",  showInColumn: true},
                'type': { type: 'Select', value: [], label:"Type",  showInColumn: true},
                'Action': {type: 'Input', value: '', label:"",  showInColumn: true, disabled:true},
                'stateId': {type: 'none', value: [], label:"State",  showInColumn: false, disabled:false},
                'gender': {type: 'Select', value: [], label:"Gender",  showInColumn: false},
                'address': {type: 'none', value: '', label:"Address",  showInColumn: false, disabled:false},
                'role': {type: 'none', value: [], label:"Role",  showInColumn: false, disabled:false},
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
        }
    }

    componentDidMount = () =>{
        this.getList()
    }
    resRoute = ()=>{
        console.log(this.props.match.url)
        let splitted = this.props.match.url
        splitted = splitted.split('/', 2)
        return splitted[1]
    }

    getList = () =>{
        const { OPPORTUNITIES }= JSON.parse(localStore().permissions)
        getList().then(res=>{
            this.setState({
                data: res.success ? res.data : [],
                filterData: res.success ? res.data : [],
                openModal: false,
                editLead: false,
                permissions: OPPORTUNITIES
            })
        })
    }

    handleDelete = (id) => {
        delList(id).then((res) => {
            if (res.success) {
                this.getList();
            }
        });
    };

    callBack =()=>{ // this will work after I get the Object from the form
        this.getList()
    }

    closeModal = () =>{
        this.setState({
            openModal: false,
            editLead: false
        })
    }

    generalFilter = (value) =>{
        const { data } = this.state
        if (value){
            this.setState({
                filterData: data.filter(el => {
                    const { name: organization} = el.organization
                    return `00${el.id.toString()}`.includes(value) ||
                    el.title && el.title.toLowerCase().includes(value.toLowerCase()) || 
                    organization && organization.toLowerCase().includes(value.toLowerCase()) ||
                    el.value && `${el.value.toString()}`.toLowerCase().includes(value.toLowerCase()) ||
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
            search[column]['value'] = value
        }else{
            search = advSearch
        }

        if (search['id']['value']
        ){
            
            this.setState({
                filterData: data.filter(el => { // method one which have mutliple if condition for every multiple search
                    return  ''

                }),
                searchedColumn: search,
                openSearch: false,
            })
        }else{
            this.setState({
                filterData: data
            })
        }
    }

    filterModalUseEffect = () =>{
        Promise.all([ ])
        .then(res => {
           
        })
        .catch(e => {
            console.log(e);
        })
    }

    render(){
        const { data, openModal, editLead, permissions, filterData, searchedColumn, filterFields, openSearch } = this.state
        return(
            <>
                <Row justify="space-between">
                    <Col>
                        <Title level={4}>Opportunities</Title>
                    </Col>
                    <Col style={{textAlign:'end'}} span={4} >
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
                                    size='small'
                                    onClick={()=>{
                                        this.setState({
                                            openModal: true,
                                            editLead:false
                                        })
                                    }} 
                                    disabled={!permissions['ADD']}
                                    ><PlusSquareOutlined /> Opportunity</Button>
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
                            columns={this.columns}
                            dataSource={filterData}
                            size='small'
                            sticky
                            summary={()=>tableSummaryFilter(searchedColumn, this.advancefilter)}
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
                {openModal && (
                    <InfoModal
                        visible={openModal}
                        editLead={editLead}
                        close={this.closeModal}
                        callBack={this.callBack}
                    />
                )}
            </>
        )
    }
}

export default Opportunities