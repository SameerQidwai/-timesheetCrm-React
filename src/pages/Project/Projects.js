import React, {Component} from 'react'
import { Table, Menu, Dropdown, Button, Popconfirm, Row, Col,Typography } from 'antd'
import { DownOutlined, SettingOutlined, PlusSquareOutlined, FilterOutlined} from '@ant-design/icons'; //Icons
import { Link } from 'react-router-dom'

import InfoModal from './Modals/InfoModal'

import { getList, delList } from "../../service/projects";

import '../styles/table.css'
import moment from "moment";
import { formatCurrency, localStore, O_TYPE } from '../../service/constant';
import { getOrganizations, getPanels, getStates } from '../../service/constant-Apis';
import { Filtertags, TableModalFilter, tableTitleFilter } from '../../components/Core/Table/TableFilter';
const { Title } = Typography

class Projects extends Component {
    constructor(props) {
    super(props);
        this.proForm = React.createRef();
        this.columns = [
            {
                title: 'Code',
                dataIndex: 'id',
                key: 'id',
                render:(record) =>( `00${record}` ),
                sorter: (a, b) => a.id - b.id,
                defaultSortOrder: 'ascend'
            },
            {
                title: 'Title',
                dataIndex: 'title',
                key: 'title',
                width: 400,
                sorter: (a, b) => a.title.localeCompare(b.title)
            },
            {
                title: 'Organisation Name',
                dataIndex: 'organization',
                key: 'organization',
                width: 200,
                render: (record) =>{
                    return record && <Link 
                        to={{ pathname: `/organisations/${record.id}/info`, }}
                        className="nav-link"
                    >
                        {record.name}</Link> 
                },
                sorter: (a, b) => a.organization.name.localeCompare(b.organization.name)
            },
            {
                title: 'Revenue',
                dataIndex: 'value',
                key: 'value',
                render: record =>   `${formatCurrency(record)}`,
                sorter: (a, b) => a.value - b.value,
            },
            {
                title: 'Start Date',
                dataIndex: 'startDate',
                key: 'startDate',
                render: (record) =>(record && moment(record).format('ddd DD MM yyyy')),
                sorter: (a, b) => moment(a.startDate).unix() - moment(b.startDate).unix()
            },
            {
                title: 'End Date',
                dataIndex: 'endDate',
                key: 'endDtae',
                render: (record) =>(record &&  moment(record).format('ddd DD MM yyyy')),
                sorter: (a, b) => moment(a.endDate).unix() - moment(b.endDate).unix()
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
                            {/* <Menu.Item danger>
                                <Popconfirm title="Sure to delete?" onConfirm={() => this.handleDelete(record.id)} >
                                    Delete
                                </Popconfirm>
                            </Menu.Item > */}
                            <Menu.Item 
                                onClick={()=>this.setState({
                                    openModal: true,
                                    editPro: record.id
                                })}
                                disabled={this.state&& !this.state.permissions['UPDATE']}
                            >Edit</Menu.Item>
                            <Menu.Item >
                                <Link to={{ pathname: `/projects/${record.id}/purchase-order`}} className="nav-link">
                                    Purchase Order
                                </Link>
                            </Menu.Item >
                            {record.type === 1 ?  //if condition
                                <Menu.Item> 
                                    <Link
                                        to={{ pathname: `/projects/${record.id}/milestones`, }}
                                        className="nav-link"
                                    >
                                        Milestones
                                    </Link>
                                </Menu.Item>
                                 : //else condition
                                <Menu.Item>
                                    <Link
                                        to={{
                                            pathname: `/projects/${record.id}/milestones/${record.id}/resources`,
                                            // pathname: `/projects/${record.id}/resources`,
                                        }}
                                        className="nav-link"
                                    >
                                        Postions
                                    </Link>
                                </Menu.Item>
                            }
                            <Menu.Item >
                                <Link to={{ pathname: `/projects/${record.id}/info`}} className="nav-link">
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
            data : [ ],
            openModal: false,
            editPro:false,
            permissions: {},
            filterData: [],
            openSearch: false,
            searchedColumn: {
                'id': {type: 'Input', value: '',  label:"Code", showInColumn: true},
                'title': {type: 'Input', value: '', label:"Title",  showInColumn: true},
                'organization': { type: 'Select', value: [], label:"Organization",  showInColumn: true},
                'panel': { type: 'Select', value: [], label:"panel",  showInColumn: true},
                'revenue': {type: 'Input', value: '', label:"Revenue",  showInColumn: true},
                'startDate': {type: 'Date', value: null,  label:"Start Date", showInColumn: true},
                'endDate': {type: 'Date', value: null,  label:"End Date", showInColumn: true, disabled:true},
                'bidDate': {type: 'Date', value: null,  label:"Bid Date", showInColumn: true, disabled:true},
                'entryDate': {type: 'Date', value: null,  label:"Entry Date", showInColumn: true, disabled:true},
                'stage': { type: 'Select', value: [], label:"stage",  showInColumn: true},
                'status': { type: 'Select', value: [], label:"Status",  showInColumn: true},
                'type': { type: 'Select', value: '', label:"Type",  showInColumn: true},
                'Action': {type: 'Input', value: '', label:"",  showInColumn: true, disabled:true},
                'stateId': {type: 'none', value: [], label:"State",  showInColumn: false, disabled:false},
                'gender': {type: 'Select', value: [], label:"Gender",  showInColumn: false},
                'address': {type: 'none', value: '', label:"Address",  showInColumn: false, disabled:false},
                'role': {type: 'none', value: [], label:"Role",  showInColumn: false, disabled:false},
            },

            filterFields: [
                {
                    Placeholder: "Panel",
                    fieldCol: 12,
                    size: "small",
                    type: "Text",
                },
                {
                    Placeholder: "Organisation",
                    fieldCol: 12,
                    size: "small",
                    type: "Text",
                },
                {
                    object: "obj",
                    fieldCol: 12,
                    mode: 'multiple',
                    key: "panel",
                    size: "small",  
                    data: [],
                    type: "Select",
                },
                {
                    object: "obj",
                    fieldCol: 12,
                    mode: 'multiple',
                    key: "organization",
                    size: "small",
                    data: [],
                    type: "Select",
                },
                {
                    Placeholder: "Name",
                    fieldCol: 12,
                    size: "small",
                    type: "Text",
                },
                {
                    Placeholder: "Type",
                    fieldCol: 12,
                    size: "small",
                    type: "Text",
                },
                {
                    object: "obj",
                    fieldCol: 12,
                    key: "title",
                    size: "small",
                    type: "Input",
                },
                {
                    object: "obj",
                    fieldCol: 12,
                    key: "type",
                    size: "small",
                    data: [{label: 'MILESTONE BASE', value: '1'},
                        {label: 'TIME BASE', value: '2'}],
                    type: "Select",
                },
                {
                    Placeholder: "State",
                    fieldCol: 12,
                    size: "small",
                    type: "Text",
                },
                {
                    Placeholder: "Qualified Ops",
                    fieldCol: 12,
                    size: "small",
                    type: "Text",
                },
                {
                    object: "obj",
                    fieldCol: 12,
                    mode: 'multiple',
                    key: "stateId",
                    size: "small",
                    data: [],
                    type: "Select",
                },
                {
                    object: "obj",
                    fieldCol: 12,
                    key: "qualifiedOps",
                    // label: "Qualified Ops",
                    size: "small",
                    data: [
                        { label: "True", value: true },
                        { label: "False", value: false },
                    ],
                    type: "Select",
                },  
                {
                    Placeholder: "Stage",
                    fieldCol: 12,
                    size: "small",
                    type: "Text",
                },
                {
                    Placeholder: "Estimated Value",
                    fieldCol: 12,
                    size: "small",
                    type: "Text",
                },
                {
                    object: "obj",
                    fieldCol: 12,
                    key: "stage",
                    mode: 'multiple',
                    size: "small",
                    data: [
                        { label: "Lead", value: 'L' },
                        { label: "Tender Released", value: 'TR' },
                        { label: "Bid Submitted", value: 'BS' },
                    ],
                    type: "Select",
                },       
                {
                    object: "obj",
                    fieldCol: 12,
                    key: "value",
                    size: "small",
                    shape: "$",
                    type: "InputNumber",
                    fieldStyle: { width: "100%" },
                },
                {
                    Placeholder: "Start Date",
                    fieldCol: 12,
                    size: "small",
                    type: "Text",
                },
                {
                    Placeholder: "End Date",
                    fieldCol: 12,
                    size: "small",
                    type: "Text",
                },
                {
                    object: "obj",
                    fieldCol: 12,
                    key: "startDate",
                    size: "small",
                    type: "RangePicker",
                    fieldStyle: { width: "100%" },
                },
                {
                    object: "obj",
                    fieldCol: 12,
                    key: "endDate",
                    size: "small",
                    type: "RangePicker",
                    fieldStyle: { width: "100%" },
                },
                {
                    Placeholder: "Bid Date",
                    fieldCol: 12,
                    size: "small",
                    type: "Text",
                },
                {
                    Placeholder: "Entry Date",
                    fieldCol: 12,
                    size: "small",
                    type: "Text",
                },
                {
                    object: "obj",
                    fieldCol: 12,
                    key: "bidDate",
                    size: "small",
                    type: "RangePicker",
                    fieldStyle: { width: "100%" },
                },                
                {
                    object: "obj",
                    fieldCol: 12,
                    key: "entryDate",
                    size: "small",
                    type: "RangePicker",
                    fieldStyle: { width: "100%" },
                },
            ],
        }
    }

    componentDidMount = () =>{
        this.getList()
    }

    getList = () =>{
        const { PROJECTS }= JSON.parse(localStore().permissions)
        getList().then(res=>{
            this.setState({
                data: res.success ? res.data : [],
                filterData: res.success ? res.data : [],
                openModal: false,
                editPro: false,
                permissions: PROJECTS
            })
        })
    }

    handleDelete = (id) => {
        delList(id).then((res) => {
            if (res.success) {
                this.getData();
            }
        });
    };

    callBack =()=>{ // this will work after I get the Object from the form
        this.getList()
    }

    closeModal = () =>{
        this.setState({
            openModal: false,
            editPro: false
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

    advancefilter = (value, column, advSearch) =>{
        let { data, searchedColumn: search }= this.state
        if(column){
            search[column]['value'] = value
        }else{
            search = advSearch
        }
        if (search['id']['value'] || search['title']['value'] ||
            search['organization']['value'].length>0 || search['revenue']['value'] ||
            search['startDate']['value']|| search['endDate']['value']||
            search['bidDate']['value']|| search['entryDate']['value'] ||
            search['panel']['value'].length>0 || search['stage']['value'].length > 0||
            search['type']['value'] || search['stateId']['value']
        ){
            const startDate = search['startDate']['value'] ?? [null, null]
            const endDate = search['endDate']['value'] ?? [null, null]
            const bidDate = search['bidDate']['value'] ?? [null, null]
            const entryDate = search['entryDate']['value'] ?? [null, null]
            this.setState({
                filterData: data.filter(el => { // method one which have mutliple if condition for every multiple search
                    const { id: organization} = el.organization
                    return  `00${el.id.toString()}`.includes(search['id']['value']) &&
                        `${el.title ?? ''}`.toLowerCase().includes(search['title']['value'].toLowerCase()) &&
                        `${el.value.toString() ?? ''}`.toLowerCase().includes(search['revenue']['value'].toLowerCase()) &&
                        `${el.type.toString() ?? ''}`.toLowerCase().includes(search['type']['value'].toLowerCase()) &&
                        // multi Select Search
                        (search['organization']['value'].length > 0 ? search['organization']['value'] : [',']).some(s => 
                                (search['organization']['value'].length > 0 ? [organization]: [',']).includes(s))

                        `${search['stateId']['value'].reduce((p, n) => p + n, '')}`
                        .includes(`${search['stateId']['value'].length > 0 ?el.stateId ?? '' : ''}`) &&
                        
                        `${search['stage']['value'].reduce((p, n) => p + n, '')}`
                        .includes(`${search['stage']['value'].length > 0 ?el.stage ?? '' : ''}`) &&

                        (search['status']['value'].length > 0 ? search['status']['value'] : [','])
                        .includes(`${search['status']['value'].length > 0 ?el.status ?? '' : ','}`)  &&

                        `${search['panel']['value'].reduce((p, n) => p + n, '')}`
                        .includes(`${search['panel']['value'].length > 0 ?el.panelId ?? '' : ''}`) &&
                        //Start Date Filter
                        moment(search['startDate']['value']? moment(el.startDate).format('YYYY-MM-DD'): '2010-10-20')
                        .isBetween(startDate[0]?? '2010-10-19',startDate[1]?? '2010-10-25' , undefined, '[]') &&
                        //End Date Filter
                        moment(search['endDate']['value']? moment(el.endDate).format('YYYY-MM-DD'): '2010-10-20')
                        .isBetween(endDate[0]?? '2010-10-19', endDate[1]?? '2010-10-25' , undefined, '[]') &&
                        //Bid Date Filter
                        moment(search['bidDate']['value']? moment(el.bidDate).format('YYYY-MM-DD'): '2010-10-20')
                        .isBetween(bidDate[0]?? '2010-10-19', bidDate[1]?? '2010-10-25' , undefined, '[]') &&
                        //Entry Date Filter
                        moment(search['entryDate']['value']? moment(el.entryDate).format('YYYY-MM-DD'): '2010-10-20')
                        .isBetween(entryDate[0]?? '2010-10-19', entryDate[1]?? '2010-10-25' , undefined, '[]') 
                   
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
        Promise.all([getPanels(), getOrganizations(), getStates()])
        .then(res => {
            console.log(res);
           const { filterFields } = this.state
           filterFields[2].data = res[0].success ? res[0].data : []
           filterFields[3].data = res[1].success ? res[1].data : []
           filterFields[10].data = res[2].success ? res[2].data : []
           this.setState({filterFields})
        })
        .catch(e => {
            console.log(e);
        })
    }


    render(){
        const { data, openModal, editPro, permissions, filterData, searchedColumn, filterFields, openSearch  } = this.state
        return(
            <>
                <Row justify="space-between">
                    <Col>
                        <Title level={4}>Project</Title>
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
                                            editPro:false
                                        })
                                    }}
                                    disabled={!permissions['ADD']}
                                    ><PlusSquareOutlined />Add Project</Button>
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
                            // sticky
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
                {openModal && (
                    <InfoModal
                        visible={openModal}
                        editPro={editPro}
                        close={this.closeModal}
                        callBack={this.callBack}
                    />
                )}
            </>
        )
    }
}

export default Projects