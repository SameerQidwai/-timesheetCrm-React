import React, {Component} from 'react'
import { Table, Menu, Dropdown, Button, Popconfirm, Row, Col,Typography, Modal } from 'antd'
import { DownOutlined, SettingOutlined, PlusSquareOutlined, FilterOutlined} from '@ant-design/icons'; //Icons
import { Link } from 'react-router-dom'

import InfoModal from './Modals/InfoModal'

import { getList, delList } from "../../service/opportunities";

import '../styles/table.css'
import moment from "moment";
import { formatDate, formatCurrency, localStore, O_STAGE, O_STATUS, O_TYPE } from '../../service/constant';
import { Filtertags, TableModalFilter, tableSorter, tableSummaryFilter, tableTitleFilter } from '../../components/Core/Table/TableFilter';
import { getOrganizations, getPanels, getStates } from '../../service/constant-Apis';
import { generalDelete } from '../../service/delete-Api\'s';
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
                ...tableSorter('value', 'number'),
            },
            {
                title: 'Start Date',
                dataIndex: 'startDate',
                key: 'startDate',
                render: (record) =>(record && formatDate(record)),
                ...tableSorter('startDate', 'date'),
            },
            {
                title: 'End Date',
                dataIndex: 'endDate',
                key: 'endDtae',
                render: (record) =>(record && formatDate(record)),
                ...tableSorter('endDate', 'date'),
            },
            {
                title: 'Bid Date',
                dataIndex: 'bidDate',
                key: 'bidDate',
                render: (record) =>(record && formatDate(record)),
                ...tableSorter('bidDate', 'date'),
            },
            {
                title: 'Stage',
                dataIndex: 'stage',
                key: 'stage',
                render: (record) =>  O_STAGE[record],
                ...tableSorter('stage', 'string'),
            },
            {
                title: 'Type',
                dataIndex: 'type',
                key: 'type',
                render: (record) => O_TYPE[record],
                ...tableSorter('type', 'number'),
            },
            {
                title: 'Action',
                key: 'action',
                align: 'right',
                width: 115,
                render: (value, record, index) => (
                    <Dropdown overlay={
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
                                            pathname: `/opportunities/${record.id}/milestones/${record?.milestones?.[0] && record?.milestones?.[0]?.id}/resources`,
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
                'organization': { type: 'Select', multi: true, value: [], label:"Organization",  showInColumn: true},
                'panel': { type: 'Select', multi: true, value: [], label:"panel",  showInColumn: true},
                'revenue': {type: 'Input', value: '', label:"Revenue",  showInColumn: true},
                'startDate': {type: 'Date', value: null,  label:"Start Date", showInColumn: true},
                'endDate': {type: 'Date', value: null,  label:"End Date", showInColumn: true, disabled:true},
                'bidDate': {type: 'Date', value: null,  label:"Bid Date", showInColumn: true, disabled:true},
                'entryDate': {type: 'Date', value: null,  label:"Entry Date", showInColumn: true, disabled:true},
                'stage': { type: 'Select', multi: true, value: [], label:"stage",  showInColumn: true},
                'status': { type: 'Select', value: [], label:"Status",  showInColumn: true},
                'type': { type: 'Select', value: "", label:"Type",  showInColumn: true},
                'Action': {type: 'Input', value: '', label:"",  showInColumn: true, disabled:true},
                'stateId': {type: 'none', multi: true, value: [], label:"State",  showInColumn: false, disabled:false},
                'address': {type: 'none', value: '', label:"Address",  showInColumn: false, disabled:false},
                'qualifiedOps': {type: 'none', value: '', label:"Qualified Ops",  showInColumn: false, disabled:false},
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
                    customValue: (value, option)=> option,
                    size: "small",  
                    data: [],
                    type: "Select",
                },
                {
                    object: "obj",
                    fieldCol: 12,
                    mode: 'multiple',
                    key: "organization",
                    customValue: (value, option)=> option,
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
                    Placeholder: "Stage",
                    fieldCol: 12,
                    size: "small",
                    type: "Text",
                },
                {
                    object: "obj",
                    fieldCol: 12,
                    mode: 'multiple',
                    key: "stateId",
                    customValue: (value, option)=> option,
                    size: "small",
                    data: [],
                    type: "Select",
                },
                {
                    object: "obj",
                    fieldCol: 12,
                    key: "stage",
                    mode: 'multiple',
                    customValue: (value, option)=> option,
                    size: "small",
                    data: [
                        { label: "Lead", value: 'L' },
                        { label: "Tender Released", value: 'TR' },
                        { label: "Bid Submitted", value: 'BS' },
                    ],
                    type: "Select",
                },   
                {
                    Placeholder: "Estimated Value",
                    fieldCol: 12,
                    size: "small",
                    type: "Text",
                },
                {
                    Placeholder: "Expected Project Start Date",
                    fieldCol: 12,
                    size: "small",
                    type: "Text",
                },
                {
                    object: "obj",
                    fieldCol: 12,
                    key: "revenue",
                    size: "small",
                    shape: "$",
                    type: "InputNumber",
                    fieldStyle: { width: "100%" },
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
                    Placeholder: "Expected Project End Date",
                    fieldCol: 12,
                    size: "small",
                    type: "Text",
                },
                {
                    Placeholder: "Bid Due Date",
                    fieldCol: 12,
                    size: "small",
                    type: "Text",
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
                    object: "obj",
                    fieldCol: 12,
                    key: "bidDate",
                    size: "small",
                    type: "RangePicker",
                    fieldStyle: { width: "100%" },
                },  
                {
                    Placeholder: "Entry Date",
                    fieldCol: 24,
                    size: "small",
                    type: "Text",
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
    
    // resRoute = ()=>{ // not using this function keeping just incase
    //     let splitted = this.props.match.url
    //     splitted = splitted.split('/', 2)
    //     return splitted[1]
    // }

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

    handleDelete = (id, index) => {
        const url = '/opportunities'
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
                    el.value && formatCurrency(el.value).toLowerCase().includes(value.toLowerCase()) ||
                    el.startDate && `${formatDate(el.startDate)}`.toLowerCase().includes(value.toLowerCase()) ||
                    el.endDate && `${formatDate(el.endDate)}`.toLowerCase().includes(value.toLowerCase()) ||
                    el.bidDate && `${formatDate(el.bidDate)}`.toLowerCase().includes(value.toLowerCase()) ||
                    el.stage && `${O_STAGE[el.stage]}`.toLowerCase().includes(value.toLowerCase()) ||
                    el.status && `${O_STATUS[el.status]}`.toLowerCase().includes(value.toLowerCase()) ||
                    el.type && `${O_TYPE[el.type]}`.toLowerCase().includes(value.toLowerCase()) ||
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

        if (search['id']['value'] || search['title']['value'] ||
        search['organization']['value'].length>0 || search['revenue']['value'] ||
        search['startDate']['value']|| search['endDate']['value']||
        search['bidDate']['value']|| search['entryDate']['value'] ||
        search['panel']['value'].length>0 || search['stage']['value'].length > 0||
        search['type']['value'] || search['stateId']['value'].length>0
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
                        `${el.value.toString() ?? ''}`.toLowerCase().includes(search['revenue']['value'].toString().toLowerCase()) &&
                        `${el.type?? ''}`.toLowerCase().includes(search['type']['value'].toLowerCase()) &&
                        `${el.qualifiedOps?? ''}`.toLowerCase().includes(search['qualifiedOps']['value'].toLowerCase()) &&
                        // multi Select Search

                        (search['organization']['value'].length > 0 ? search['organization']['value'] : [{value: ','}])
                        .some(s => (search['organization']['value'].length > 0 ? [organization]: [',']).includes(s.value)) &&

                        (search['stateId']['value'].length > 0 ? search['stateId']['value'] : [{value: ','}])
                        .some(s => (search['stateId']['value'].length > 0 ? [el.stateId]: [',']).includes(s.value)) &&

                        (search['stage']['value'].length > 0 ? search['stage']['value'] : [{value: ','}])
                        .some(s => (search['stage']['value'].length > 0 ? [el.stage]: [',']).includes(s.value)) &&

                        (search['status']['value'].length > 0 ? search['status']['value'] : [{value: ','}])
                        .some(s => (search['status']['value'].length > 0 ? [el.status]: [',']).includes(s.value)) &&

                        (search['panel']['value'].length > 0 ? search['panel']['value'] : [{value:','}])
                        .some(s => (search['panel']['value'].length > 0 ? [el.panelId]: [',']).includes(s.value)) &&

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
        const { data, openModal, editLead, permissions, filterData, searchedColumn, filterFields, openSearch } = this.state
        return(
            <>
                <Row justify="space-between">
                    <Col>
                        <Title level={4}>Opportunities</Title>
                    </Col>
                    <Col style={{marginLeft: 'auto'}}>
                        <Row justify="space-between" gutter={'15'}>
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
                                    ><PlusSquareOutlined /> Add Opportunity</Button>
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
                    title={"Opportunities - filter"}
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