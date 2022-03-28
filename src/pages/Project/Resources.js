import React, { Component } from "react";
import { Row, Col, Menu, Button, Dropdown, Descriptions, Table } from "antd";
import { SettingOutlined, DownOutlined, FilterOutlined } from "@ant-design/icons"; //Icons
import { Link } from "react-router-dom"; 

import ResModal from "./Modals/ResModal";
import { getRecord, getLeadSkills, delLeadSkill } from "../../service/projects";

import moment from "moment"
import { formatDate, formatCurrency, localStore } from "../../service/constant";
import { Filtertags, TableModalFilter, tableSorter, tableTitleFilter } from "../../components/Core/Table/TableFilter";
import { getPanelSkills } from "../../service/constant-Apis";

const { Item } = Descriptions;

class Resources extends Component {
    constructor(props) {
        super(props);

        this.columns = [
            {
                title: "Title",
                dataIndex: "title",
                key: "title",
                ...tableSorter('title', 'string'),
            },
            {
                title: "Skill",
                dataIndex: ["panelSkill", "label"],
                key: "panelSkill",
                ...tableSorter('panelSkill.label', 'string'),
            },
            {
                title: "Level",
                dataIndex: ["panelSkillStandardLevel", "levelLabel"],
                key: "panelSkillStandardLevel",
                ...tableSorter('panelSkillStandardLevel.levelLabel', 'string'),
            },
            {
                title: "Employee Name",
                dataIndex: ["opportunityResourceAllocations", "0", "contactPerson"],
                key: "contactPerson",
                render: (record)=>(
                    // record && record[0] && record[0].contactPerson && `${record[0].contactPerson.firstName	} ${record[0].contactPerson.lastName	}`
                    `${record?.firstName	} ${record?.lastName	}`
                ),
                ...tableSorter('opportunityResourceAllocations.0.contactPerson', 'string'),
            },
            {
                title: "Billable Hours",
                dataIndex: "billableHours",
                key: "billableHours",
                sorter: (a, b) => a.billableHours - b.billableHours,
                ...tableSorter('billableHours', 'number'),
            },
            {
                title: "Buy Cost",
                dataIndex: ["opportunityResourceAllocations", "0", "buyingRate"],
                key: "opportunityResourceAllocations",
                render:(record)=>(
                    record &&formatCurrency(record)
                ),
                ...tableSorter('opportunityResourceAllocations.0.buyingRate', 'number'),
            },
            {
                title: "Sale Cost",
                dataIndex: ["opportunityResourceAllocations", "0", "sellingRate"],
                key: "opportunityResourceAllocations",
                render:(record)=>(
                    record && formatCurrency(record)
                ),
                ...tableSorter('opportunityResourceAllocations.0.sellingRate', 'number'),
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
                                        this.setState({ infoModal: true, editRex: record.id, });
                                    }}
                                    disabled={this.state&& !this.state.permissions['UPDATE']}
                                >
                                    Edit Resource
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
            editRex: false,
            proId: false,
            mileId: false,
            crud: false,
            desc: {title: '', organization: {name: ''}, value: '', startDate: '', endDate: ''},
            permissions: {},
            openSearch: false,
            filterData: [],
            searchedColumn: {
                'skill': { type: 'Select', multi: true, value: [], label:"Skill",  showInColumn: true},
                'level': { type: 'Select', multi: true, value: [], label:"Level",  showInColumn: true},
                'name': { type: 'Input', value: "", label:"Name",  showInColumn: true },
                'billableHours': { type: 'Input', value: "", label: 'Billable Hour' },
                'buyingRate': { type: 'Input', value: "", label: 'Buy Cost' },
                'sellingRate': { type: 'Input', value: "", label: 'Sale Cost' },
                'effortRate': { type: 'Input', value: "", label: 'Effort Rate' },
                'startDate': {type: 'Date', value: null,  label:"Start Date", showInColumn: true},
                'endDate': {type: 'Date', value: null,  label:"End Date", showInColumn: true, disabled:true},
            },
            filterFields: [
                {
                  Placeholder: "Skill",
                  fieldCol: 12,
                  size: "small",
                  type: "Text",
                },
                {
                    Placeholder: "Work Hours",
                    fieldCol: 12,
                    size: "small",
                    type: "Text",
                  },
                {
                    object: "obj",
                    fieldCol: 12,
                    mode: 'multiple',
                    key: "skill",
                    customValue: (value, option)=> option,
                    size: "small",  
                    data: [],
                    type: "Select",
                },
                {
                  object: "obj",
                  fieldCol: 12,
                  key: "billableHours",
                  size: "small",
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
                  Placeholder: "Effort Rate",
                  fieldCol: 12,
                  size: "small",
                  type: "Text",
                },
                {
                  Placeholder: "Buy Cost",
                  fieldCol: 12,
                  size: "small",
                  type: "Text",
                },
                {
                  object: "obj",
                  fieldCol: 12,
                  key: "effortRate",
                  shape: "%",
                  size: "small",
                  type: "InputNumber",
                  fieldStyle: { width: "100%" },
                  rangeMax: 100,
                },
                {
                  object: "obj",
                  fieldCol: 12,
                  key: "buyingRate",
                  shape: "$",
                  size: "small",
                  type: "InputNumber",
                  fieldStyle: { width: "100%" },
                },
                {
                  Placeholder: "Sale Cost",
                  fieldCol: 24,
                  size: "small",
                  type: "Text",
                },
                {
                  object: "obj",
                  fieldCol: 12,
                  key: "sellingRate",
                  shape: "$",
                  size: "small",
                  type: "InputNumber",
                  fieldStyle: { width: "100%" },
                },
            ],
        };
    }

    componentDidMount = ()=>{
        this.fetchAll()
    }

    fetchAll = (id) =>{
        const { PROJECTS }= JSON.parse(localStore().permissions)
        const { url } = this.props.match
        const { proId, mileId } = this.props.match.params
        Promise.all([ getRecord(proId), getLeadSkills(url, id)])
        .then(res => {
            this.setState({
                desc: res[0].success? res[0].data : {},
                editRex: false,
                proId: proId,
                crud: url,
                mileId: mileId,
                infoModal: false,
                data: res[1].success? res[1].data : [],
                filterData: res[1].success? res[1].data : [],
                permissions: PROJECTS
            })
        })
        .catch(e => {
            console.log(e);
        })
    }

    getLeadSkills = (id) =>{
        const {crud} = this.state
        getLeadSkills(crud).then(res=>{
            if(res.success){
                this.setState({
                    data: res.success? res.data : [],
                    filterData: res.success? res.data : [],
                    editRex: false,
                    infoModal: false
                })
            }
        })
    }

    closeModal = () => {
        this.setState({ infoModal: false, editRex: false});
    };

    handleDelete = (rId) => {
        const { proId } = this.props.match.params //opputunityId
        delLeadSkill(proId,rId).then((res) => {
            if (res.success) {
                this.props.history.push('/Employees')
            }
        });
    };

    callBack = () => {
        const { proId } = this.state
        this.getLeadSkills(proId)
    };

    generalFilter = (value) =>{
        const { data } = this.state
        if (value){
            this.setState({
                filterData: data.filter(el => {
                    const {firstName, lastName } = el.opportunityResourceAllocations && el.opportunityResourceAllocations[0]?.contactPerson
                    const {buyingRate, sellingRate } = el.opportunityResourceAllocations && el.opportunityResourceAllocations[0]
                    const { label } = el.panelSkill 
                    const { levelLabel } = el.panelSkillStandardLevel
                    return el.title && el.title.toLowerCase().includes(value.toLowerCase()) ||
                    (`${firstName ?? ''} ${lastName ?? ''}`).toLowerCase().includes(value.toLowerCase()) ||
                    `${label ?? ''}`.toLowerCase().includes(value.toLowerCase()) ||
                    `${levelLabel ?? ''}`.toLowerCase().includes(value.toLowerCase()) ||
                    `${el.billableHours ?? ''}`.toLowerCase().includes(value.toLowerCase()) ||
                    buyingRate && formatCurrency(buyingRate).toLowerCase().includes(value.toLowerCase()) ||
                    sellingRate && formatCurrency(sellingRate).toLowerCase().includes(value.toLowerCase())
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

        if ( search['skill']['value'] ||
        search['billableHours']['value'] || search['startDate']['value'] || 
        search['endDate']['value'] || search['buyingRate']['value'] ||
        search['sellingRate']['value'] || search['effortRate']['value'] 
        ){
            const startDate = search['startDate']['value'] ?? [null, null]
            const endDate = search['endDate']['value'] ?? [null, null]
            this.setState({
                filterData: data.filter(el => { // method one which have mutliple if condition for every multiple search
                    const {buyingRate, sellingRate, effortRate } = el.opportunityResourceAllocations && el.opportunityResourceAllocations[0]

                    return `${el.billableHours.toString() ?? ''}`.toLowerCase().includes(search['billableHours']['value'].toString().toLowerCase()) &&
                        (formatCurrency(buyingRate) ?? '').toLowerCase().includes(search['buyingRate']['value'].toString().toLowerCase()) &&
                        (formatCurrency(sellingRate) ?? '').toLowerCase().includes(search['sellingRate']['value'].toString().toLowerCase()) &&
                        (formatCurrency(effortRate) ?? '').toLowerCase().includes(search['effortRate']['value'].toString().toLowerCase()) &&
                        
                        // multi Select Search

                        (search['skill']['value'].length > 0 ? search['skill']['value'] : [{value: ','}])
                        .some(s => (search['skill']['value'].length > 0 ? [el.panelSkillId]: [',']).includes(s.value)) &&

                        //Start Date Filter
                        moment(search['startDate']['value']? moment(el.startDate).format('YYYY-MM-DD'): '2010-10-20')
                        .isBetween(startDate[0]?? '2010-10-19',startDate[1]?? '2010-10-25' , undefined, '[]') &&
                        //End Date Filter
                        moment(search['endDate']['value']? moment(el.endDate).format('YYYY-MM-DD'): '2010-10-20')
                        .isBetween(endDate[0]?? '2010-10-19', endDate[1]?? '2010-10-25' , undefined, '[]') 
                   
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
        const { desc } = this.state
        Promise.all([getPanelSkills(desc.panelId) ])
        .then(res => {
           const { filterFields } = this.state
           filterFields[2].data = res[0].success ? res[0].data : []
           this.setState({filterFields})
        })
        .catch(e => {
            console.log(e);
        })
    }


    render() {
        const { desc, data, infoModal, editRex, proId, permissions, crud, mileId, filterData, openSearch, searchedColumn, filterFields } = this.state;
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
                    <Item label="Estimated Value">{ formatCurrency(desc.value ?? 0)}</Item>
                    <Item label="Organisation">{desc.organizationName ? desc.organization.name :' No Organisation'}</Item>
                    <Item label="Start date">{desc.startDate ? formatDate(desc.startDate): null} </Item>
                    <Item label="End Date">{desc.endDate ? formatDate(desc.endDate): null}</Item>
                    {/* <Item label="Gender">{data.gender}</Item> */}
                </Descriptions>
                <Row justify="end" span={4} gutter={[30, 0]}>
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
                            onClick={() => {  this.setState({ infoModal: true, editRex: false, }) }}
                            disabled={!permissions['ADD']}
                        >Add Resource</Button> 
                    </Col>
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
                />
                {openSearch && <TableModalFilter
                    title={"Search Resources"}
                    visible={openSearch}
                    filters={searchedColumn}
                    filterFields={filterFields}
                    filterFunction={this.advancefilter}
                    effectFunction={this.filterModalUseEffect}
                    effectRender={true}
                    onClose={()=>this.setState({openSearch:false})}
                />}
                {infoModal && (
                    <ResModal
                        visible={infoModal}
                        editRex={editRex}
                        proId = {proId}
                        crud={crud}
                        mileId={mileId}
                        panelId = {desc.panelId}
                        close={this.closeModal}
                        callBack={this.callBack}
                    />
                )}
            </>
        );
    }
}

export default Resources;
