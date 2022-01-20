import React, { Component } from "react";
import { Row, Col, Menu, Button, Dropdown, Descriptions, Table, Popconfirm } from "antd";
import { SettingOutlined, DownOutlined } from "@ant-design/icons"; //Icons
import { Link } from "react-router-dom"; 

import ResModal from "./Modals/ResModal";
import { getRecord, getLeadSkills, delLeadSkill } from "../../service/projects";

import moment from "moment"
import { formatCurrency, localStore } from "../../service/constant";
import { tableSorter, tableTitleFilter } from "../../components/Core/Table/TableFilter";

const { Item } = Descriptions;

class Resources extends Component {
    constructor(props) {
        super(props);

        this.columns = [
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
            },
            {
                title: "Employee Name",
                dataIndex: ["opportunityResourceAllocations", "0", "contactPerson"],
                key: "contactPerson",
                render: (record)=>(
                    // record && record[0] && record[0].contactPerson && `${record[0].contactPerson.firstName	} ${record[0].contactPerson.lastName	}`
                    `${record.firstName	} ${record.lastName	}`
                ),
                sorter: (a, b) => {
                    if(a["opportunityResourceAllocations"][0]["contactPerson"]){
                        const {firstName, lastName } = a["opportunityResourceAllocations"][0]["contactPerson"]
                        const {firstName: firstNameB, lastName: lastNameB} = b["opportunityResourceAllocations"][0]["contactPerson"]
                        return `${firstName} ${lastName}`.localeCompare(`${firstNameB} ${lastNameB}`)
                    }
                },
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
                skill: {
                    'skill': { type: 'Select', multi: true, value: [], label:"Skill",  showInColumn: true},
                    'level': { type: 'Select', multi: true, value: [], label:"Level",  showInColumn: true},
                    'name': { type: 'Input', value: "", label:"Name",  showInColumn: true },
                    'billableHour': { type: 'Input', value: "", label: 'Billable Hour' },
                    'buyCost': { type: 'Input', value: "", label: 'Billable Hour' },
                    'saleCost': { type: 'Input', value: "", label: 'Billable Hour' },
                }
            },
            filterFields: [
                {
                  Placeholder: "Skill",
                  fieldCol: 12,
                  size: "small",
                  rangeMin: true,
                  type: "Text",
                  labelAlign: "right",
                },
                {
                  Placeholder: "Level",
                  fieldCol: 12,
                  size: "small",
                  rangeMin: true,
                  type: "Text",
                  labelAlign: "right",
                },
                {
                  object: "obj",
                  fieldCol: 12,
                  key: "panelSkillId",
          
                  // disabled: true,
                  size: "small",
                  data: [],
                  type: "Select",
                  onChange: (e, value) =>{
                    const { filterFields } = this.state;
                    filterFields[3].data = value ? value.levels : [];
                    const {
                      obj,
                    } = this.formRef.current.getFieldsValue(); // const
                    obj["panelSkillStandardLevelId"] = undefined;
                    obj["contactPersonId"] = undefined;
                    this.formRef.current.setFieldsValue({
                      obj,
                    });
                    this.setState({ filterFields });
                  },
                },
                {
                  object: "obj",
                  fieldCol: 12,
                  key: "panelSkillStandardLevelId",
                  // disabled: true,
                  size: "small",
                  data: [],
                  type: "Select",
                  onChange: (e, value) =>{
                    const { filterFields } = this.state;
                    const customUrl = `employees/get/by-skills?psslId=${value&&value.value}`
                    getOrgPersons(customUrl).then((res) => {
                      filterFields[7].data = res.success ? res.data : [];
                      const { obj, } = this.formRef.current.getFieldsValue(); // const
                      obj["contactPersonId"] = undefined;
                      this.formRef.current.setFieldsValue({ obj, });
                      this.setState({ filterFields });
                    });
                  },
                },
                {
                  Placeholder: "Work Hours",
                  fieldCol: 12,
                  size: "small",
                  type: "Text",
                  rangeMin: true,
                  labelAlign: "right",
                },
                {
                  Placeholder: "Resource",
                  fieldCol: 12,
                  rangeMin: true,
                  size: "small",
                  type: "Text",
                  labelAlign: "right",
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
                  object: "obj",
                  fieldCol: 12,
                  key: "contactPersonId",
                  // disabled: true,
                  size: "small",
                  data: [],
                  type: "Select",
                },
                {
                  Placeholder: "Start Date",
                  fieldCol: 12,
                  size: "small",
                  rangeMin: true,
                  type: "Text",
                  labelAlign: "right",
                },
                {
                  Placeholder: "End Date",
                  fieldCol: 12,
                  size: "small",
                  rangeMin: true,
                  type: "Text",
                  labelAlign: "right",
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
                  rangeMin: true,
                  type: "Text",
                  labelAlign: "right",
                },
                {
                  Placeholder: "Buy Cost",
                  fieldCol: 12,
                  size: "small",
                  rangeMin: true,
                  type: "Text",
                  labelAlign: "right",
                },
                {
                  object: "obj",
                  fieldCol: 12,
                  key: "effortRate",
                  shape: "%",
                  size: "small",
                  type: "InputNumber",
                  fieldStyle: { width: "100%" },
                  rangeMin: 0,
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
                  rangeMin: true,
                  size: "small",
                  type: "Text",
                  labelAlign: "right",
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
                    const {firstName, lastName } = el.opportunityResourceAllocations[0].contactPerson
                    return (firstName ?`${firstName} ${lastName}` : '').toLowerCase().includes(value.toLowerCase()) 
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
        search['type']['value'] || search['stateId']['value'].length>0
        ){
            const startDate = search['startDate']['value'] ?? [null, null]
            const endDate = search['endDate']['value'] ?? [null, null]
            const bidDate = search['bidDate']['value'] ?? [null, null]
            const entryDate = search['entryDate']['value'] ?? [null, null]
            this.setState({
                filterData: data.filter(el => { // method one which have mutliple if condition for every multiple search
                    const {firstName, lastName } = el.opportunityResourceAllocations[0].contactPerson
                    return  
                        (firstName ?`${firstName} ${lastName}` : '').toLowerCase().includes(value.toLowerCase())  &&
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


    render() {
        const { desc, data, infoModal, editRex, proId, permissions, crud, mileId, filterData } = this.state;
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
                    <Item label="Start date">{desc.startDate ? moment(desc.startDate).format('ddd DD MM YYYY'): null} </Item>
                    <Item label="End Date">{desc.endDate ? moment(desc.endDate).format('ddd DD MM YYYY'): null}</Item>
                    {/* <Item label="Gender">{data.gender}</Item> */}
                </Descriptions>
                <Row justify="end">
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
                <Table
                    title={()=>tableTitleFilter(5, this.generalFilter)}
                    bordered
                    pagination={{pageSize: localStore().pageSize}}
                    rowKey={(data) => data.id}
                    columns={this.columns}
                    dataSource={filterData}
                    size="small"
                />
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
