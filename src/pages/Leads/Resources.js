import React, { Component, useState } from "react";
import { Row, Col, Menu, Button, Dropdown, Descriptions, Table, Popconfirm } from "antd";
import { SettingOutlined, DownOutlined, FilterOutlined } from "@ant-design/icons"; //Icons

import ResModal from "./Modals/ResModal";
import { getRecord, getLeadSkills, delLeadSkill, delLeadSkillResource, selectLeadSkillResource } from "../../service/opportunities";

import moment from "moment"
import { formatDate, formatCurrency, localStore } from "../../service/constant";
import { Filtertags, TableModalFilter, tableSorter, tableTitleFilter } from "../../components/Core/Table/TableFilter";
import { getPanelSkills } from "../../service/constant-Apis";
import { generalDelete } from "../../service/delete-Api's";

const { Item } = Descriptions;

class Resources extends Component {
    constructor() {
        super();
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
                title: "Start Date",
                dataIndex: "startDate",
                key: "startDate",
                render: (record)=> record && formatDate(record),
                ...tableSorter('startDate', 'Date'),
            },
            {
                title: "End Date",
                dataIndex: "endDate",
                key: "endDate",
                render: (record)=> record && formatDate(record),
                ...tableSorter('endDate', 'Date'),
            },
            {
                title: "Total Hours",
                dataIndex: "billableHours",
                key: "billableHours",
                ...tableSorter('billableHours', 'number'),
            },
           
            {
                title: "Action",
                key: "action",
                align: "right",
                width: 115,
                render: (text, record, index) => (
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
                                        this.getSkilldEmployee(true,  false,  false, record,  index, record.panelSkillStandardLevelId)
                                    }}
                                    disabled={!this?.state?.permissions?.['UPDATE']}
                                >
                                    Edit Position
                                </Menu.Item>
                                <Menu.Item 
                                    onClick={() => {
                                        console.log(record);
                                        this.getSkilldEmployee(true,  record.id,  true, false,  index, record.panelSkillStandardLevelId)
                                    }}
                                    disabled={!this?.state?.permissions?.['ADD']}
                                >
                                        Add Resouce
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
            leadId: false,
            data: [],
            desc: {},
            skillId: false,
            levelId: false,
            crud: false,
            mileId: false,
            resource: false,
            permissons: {ADD: true},
            openSearch: false,
            filterData: [],
            searchedColumn: {
                'skill': { type: 'Select', multi: true, value: [], label:"Skill",  showInColumn: true},
                'level': { type: 'Select', multi: true, value: [], label:"Level",  showInColumn: true},
                'billableHours': { type: 'Input', value: "", label: 'Billable Hour' },
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
                
              ],
        };
    }

    componentDidMount = ()=>{
        this.fetchAll()
    }
    

    fetchAll = () =>{
        const { proId, mileId } = this.props.match.params
        const { url } = this.props.match
        const { OPPORTUNITIES }= JSON.parse(localStore().permissions)
        Promise.all([ getRecord(proId), getLeadSkills(url)])
        .then(res => {
            this.setState({
                desc: res[0].success? res[0].data : {},
                editRex: false,
                infoModal: false,
                leadId: proId,
                mileId: mileId,
                crud: url,
                data: res[1].success? res[1].data : [],
                filterData: res[1].success? res[1].data : [],
                permissions: OPPORTUNITIES
            })
        })
        .catch(e => {
            console.log(e);
        })
    }

    getLeadSkills = () =>{
        const { crud }= this.state
        getLeadSkills(crud).then(res=>{
            if(res.success){
                this.setState({
                    data: res.data,
                    filterData: res.data,
                    editRex: false,
                    infoModal: false,
                    skillId: false,
                    levelId: false,
                    tableIndex:false
                })
            }
        })
    }

    getSkilldEmployee = (infoModal, skillId, resource, editRex, tableIndex, levelId ) =>{
        this.setState({ 
            infoModal:infoModal, 
            skillId:skillId,
            levelId: levelId,
            resource:resource, 
            editRex:editRex, 
            tableIndex:tableIndex 
        })
    }

    closeModal = () => {
        this.setState({ infoModal: false, editRex: false});
    };

    handleDelete = (id, index) => {
        const { crud, data, filterData } = this.state
        const { history } = this.props
        generalDelete(history, crud, id, index, filterData, data).then(res =>{
            if (res.success){
                this.setState({
                    data: [...res.data],
                    filterData: [...res.filterData]
                })
            }
        })
    };

    callBack = (value) => {
        let { leadId, skillId, editRex, tableIndex } = this.state
        // // let data = this.state.data;
        // if (editRex){ // edit skill value
        //     data[tableIndex] = value
        // }else if (skillId){ // add new Resource in skill
        //     data[tableIndex].opportunityResourceAllocations = [...data[tableIndex].opportunityResourceAllocations, value] 
        // }else{
        //     data = [...data, value]
        // }
        // this.setState({data,editRex: false, infoModal: false, skillId: false})
        this.getLeadSkills(leadId)
    };

    generalFilter = (value) =>{
        const { data } = this.state
        if (value){
            this.setState({
                filterData: data.filter(el => {
                    const { label: skill } = el.panelSkill 
                    const { levelLabel: skillLevel } = el.panelSkillStandardLevel
                    return el.title && el.title.toLowerCase().includes(value.toLowerCase()) ||
                    `${skill ?? ''}`.toLowerCase().includes(value.toLowerCase()) ||
                    `${skillLevel ?? ''}`.toLowerCase().includes(value.toLowerCase()) ||
                    el.startDate && `${formatDate(el.startDate)}`.toLowerCase().includes(value.toLowerCase()) ||
                    el.endDate && `${formatDate(el.endDate)}`.toLowerCase().includes(value.toLowerCase()) ||
                    `${el.billableHours ?? ''}`.toLowerCase().includes(value.toLowerCase()) 
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
            search['endDate']['value'] 
        ){
            const startDate = search['startDate']['value'] ?? [null, null]
            const endDate = search['endDate']['value'] ?? [null, null]
            this.setState({
                filterData: data.filter(el => { // method one which have mutliple if condition for every multiple search

                    return `${el.billableHours.toString() ?? ''}`.toLowerCase().includes(search['billableHours']['value'].toString().toLowerCase()) &&                        
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
        const { desc, filterData, data, infoModal, editRex, leadId, resource , skillId, levelId, permissions, mileId, crud, openSearch, filterFields, searchedColumn} = this.state;
        return (
            <>
                <Descriptions
                    // title={DescTitle}
                    size="small"
                    bordered
                    layout="horizontal"
                    // extra={<Button type="primary">Edit</Button>}
                >
                    <Item label="Title">{desc.title}</Item>
                    <Item label="Value">{ formatCurrency(desc.value)}</Item>
                    <Item label="Start Date">{desc.startDate ? formatDate(desc.startDate): null} </Item>
                    <Item label="End Date">{desc.endDate ? formatDate(desc.endDate): null}</Item>
                    <Item label="Bid Date">{desc.bidDate ? formatDate(desc.bidDate): null}</Item>
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
                            onClick={() => { this.setState({ infoModal: true, editRex: false, resource: false, skillId: false }) }}
                            disabled={permissions&& !permissions['ADD']}
                            >
                                Add Position
                        </Button>
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
                    rowKey={(record) => record.id}
                    columns={this.columns}
                    dataSource={filterData}
                    expandable={{
                        expandedRowRender: record => {
                            return (
                            <NestedTable 
                                data={record.opportunityResourceAllocations} 
                                skill={record.id}
                                levelId={record.panelSkillStandardLevelId}
                                leadId={leadId} 
                                mileId={mileId}
                                crud={crud}
                                history={this.props.history}
                                panelId={desc.panelId}
                                callBack={this.callBack}
                                permissions={permissions}
                                className='fs-small'
                            />)
                        },
                        // rowExpandable: record => record.user.length > 0,
                      }}
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
                        skillId={skillId}
                        levelId={levelId}
                        leadId={leadId}
                        mileId={mileId}
                        crud={crud}
                        panelId = {desc.panelId}
                        close={this.closeModal}
                        callBack={this.callBack}
                    />
                )}

            </>
        );
    }
}


function NestedTable(props) {
    const [data, setData] = useState(props.data);
    const [visible, setVisible ] = useState(false)
    const [editRex, setEditRex] = useState(false)
    // const [selectedRowKeys, setSelectedRowKeys] = useState(props.data ? [props.data.findIndex(el => el.isMarkedAsSelected === true)]: [])
    const [selectedRowKeys, setSelectedRowKeys] = useState(
        props.data ? //checking data
            props.data.length === 1 ? //checking if data length is one
                [props.data[0].id] // this must be selected
            // console.log(props.data)
            : props.data.findIndex(el => el.isMarkedAsSelected === true)!==-1 ? // otherwise check if anyone is selected
                [props.data[props.data.findIndex(el => el.isMarkedAsSelected)].id] // get the selected resource
            :
                []
        :   
            []
        )
        
    const columns = [
        { 
            
            title: 'Name', 
            dataIndex: 'contactPerson', 
            key: 'contactPerson' ,
            render: (record) =>(record &&`${record.firstName} ${record.lastName}`)
        },
        { title: 'Buy Cost', dataIndex: 'buyingRate', key: 'buyingRate', render: (record)=> `${formatCurrency(record)}` },
        { title: 'Sale Cost', dataIndex: 'sellingRate', key: 'sellingRate', render: (record)=> `${formatCurrency(record)}`},
        // { title: 'Billable Hours', dataIndex: 'hours', key: 'hours' },
        {
            title: "Action",
            key: "action",
            align: "right",
            width: 115,
            render: (text, record, index) => (
                <Dropdown
                    overlay={
                        <Menu>
                            <Menu.Item 
                                    danger 
                                    disabled={!props?.permissions?.['DELETE']}
                                >
                                    <Popconfirm
                                        title="Are you sure, you want to delete?" 
                                        onConfirm={() => handleDelete(record.id, index)} 
                                    >
                                        Delete
                                    </Popconfirm>
                                </Menu.Item >
                            <Menu.Item
                                onClick={()=>{
                                    setEditRex({...record, tableIndex: index})
                                    setVisible(true)
                                }}
                                disabled={!props?.permissions?.['UPDATE']}
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

    const handleDelete = (id, index) => {
        let {crud, history, skill } = props
        crud += `/${skill}/allocations`
        generalDelete(history, crud, id, index, data, false).then(res =>{
            if (res.success){
                props.callBack()
            }
        })
    };

    const onSelectChange = (selected, Rows) =>  {
        const { leadId, skill, crud } = props
        setSelectedRowKeys(selected)
        selectLeadSkillResource(crud, skill, Rows[0].id).then(res=>{
            console.log(res);
        })
        // [data.findIndex(el => el.isMarkedAsSelected === true)]
    }

    const callBack = (value) => {
        setVisible(false)
        // if (editRex){
        //     data[editRex.index] = value
        //     setData(data)
        // }else{
            props.callBack()
        // }
    };

    return <div style={{ paddingRight: 20}}> 
        <Table
            bordered
            key={props.skill}
            rowKey={(record) => record.id} 
            columns={columns} 
            dataSource={props.data} 
            pagination={false}
            className='fs-small'
            rowSelection={{
                type: 'radio',
                selectedRowKeys: selectedRowKeys,
                onChange: onSelectChange
            }}
        />
        {visible && <ResModal
            visible={visible}
            editRex={editRex}
            skillId={props.skill}
            leadId = {props.leadId}
            levelId = {props.levelId}
            panelId = {props.panelId}
            mileId={props.mileId}
            crud={props.crud}
            close={()=>{setVisible(false)}}
            callBack={callBack}
        />}
    </div>
};


export default Resources;
