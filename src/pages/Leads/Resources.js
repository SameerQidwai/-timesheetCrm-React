import React, { Component, useState } from "react";
import { Row, Col, Menu, Button, Dropdown, Descriptions, Table } from "antd";
import { SettingOutlined, DownOutlined } from "@ant-design/icons"; //Icons

import ResModal from "./Modals/ResModal";
import { getRecord, getLeadSkills, delLeadSkill, delLeadSkillResource, selectLeadSkillResource } from "../../service/opportunities";

import moment from "moment"
import { formatCurrency, localStore } from "../../service/constant";

const { Item } = Descriptions;

class OpportunityMilestones extends Component {
    constructor() {
        super();
        this.columns = [
            {
                title: "Skill",
                dataIndex: "panelSkill",
                key: "panelSkill",
                render: (record)=> {return record  && record.label}
            },
            {
                title: "Level",
                dataIndex: "panelSkillStandardLevel",
                key: "panelSkillStandardLevel",
                render: (record)=> {return record && record.levelLabel}
            },
          
            {
                title: "Total Hours",
                dataIndex: "billableHours",
                key: "billableHours",
            },
           
            {
                title: "Action",
                key: "action",
                align: "right",
                render: (text, record, index) => (
                    <Dropdown
                        overlay={
                            <Menu>
                                <Menu.Item
                                    onClick={() => {
                                        this.getSkilldEmployee(true,  false,  false, record,  index, record.panelSkillStandardLevelId)
                                    }}
                                    disabled={this.state&& !this.state.permissions['UPDATE']}
                                >
                                    Edit
                                </Menu.Item>
                                <Menu.Item 
                                    onClick={() => {
                                        console.log(record);
                                        this.getSkilldEmployee(true,  record.id,  true, false,  index, record.panelSkillStandardLevelId)
                                    }}
                                    disabled={this.state&& !this.state.permissions['ADD']}
                                >
                                        Add
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
            resource: false,
            permissons: {ADD: true}
        };
    }

    componentDidMount = ()=>{
        const { id } = this.props.match.params
        this.fetchAll(id)
    }
    

    fetchAll = (id) =>{
        const { OPPORTUNITIES }= JSON.parse(localStore().permissions)
        console.log(OPPORTUNITIES);
        Promise.all([ getRecord(id), getLeadSkills(id)])
        .then(res => {
            this.setState({
                desc: res[0].success? res[0].data : {},
                editRex: false,
                infoModal: false,
                leadId: id,
                data: res[1].success? res[1].data : [],
                permissions: OPPORTUNITIES
            })
        })
        .catch(e => {
            console.log(e);
        })
    }

    getLeadSkills = (id) =>{
        getLeadSkills(id).then(res=>{
            if(res.success){
                this.setState({
                    data: res.data,
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

    handleDelete = (rId) => {
        const { leadId } = this.state //opputunityId
        delLeadSkill(leadId, rId).then((res) => {
            if (res.success) {
                this.callBack()
            }
        });
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

    render() {
        const { desc, data, infoModal, editRex, leadId, resource , skillId, levelId, permissions} = this.state;
        console.log(permissions);
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
                    <Item label="Start Date">{desc.startDate ? moment(desc.startDate).format('ddd DD MM YYYY'): null} </Item>
                    <Item label="End Date">{desc.endDate ? moment(desc.endDate).format('ddd DD MM YYYY'): null}</Item>
                    <Item label="Bid Date">{desc.bidDate ? moment(desc.bidDate).format('ddd DD MM YYYY'): null}</Item>
                    {/* <Item label="Gender">{data.gender}</Item> */}
                </Descriptions>
                <Row justify="end">
                    <Col> 
                        <Button 
                            type="primary" 
                            size='small'  
                            onClick={() => { this.setState({ infoModal: true, editRex: false, resource: false, skillId: false }) }}
                            disabled={permissions&& !permissions['ADD']}
                            >
                                Add New
                        </Button>
                    </Col>
                    {/* <Col> <Button type="danger" size='small'>Delete Resource</Button></Col> */}
                </Row>
                <Table
                    pagination={{pageSize: localStore().pageSize}}
                    rowKey={(record) => record.id}
                    columns={this.columns}
                    dataSource={data}
                    expandable={{
                        expandedRowRender: record => {
                            return (
                            <NestedTable 
                                data={record.opportunityResourceAllocations} 
                                skill={record.id}
                                levelId={record.panelSkillStandardLevelId}
                                leadId={leadId} 
                                panelId={desc.panelId}
                                callBack={this.callBack}
                                permissions={permissions}
                            />)
                        },
                        // rowExpandable: record => record.user.length > 0,
                      }}
                    size="small"
                />
                {infoModal && (
                    <ResModal
                        visible={infoModal}
                        editRex={editRex}
                        skillId={skillId}
                        levelId={levelId}
                        leadId={leadId}
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
    const [selectedRowKeys, setSelectedRowKeys] = useState((props.data && props.data.findIndex(el => el.isMarkedAsSelected === true)!==-1)? [props.data[props.data.findIndex(el => el.isMarkedAsSelected === true)].id]: [])
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
            render: (text, record, index) => (
                <Dropdown
                    overlay={
                        <Menu>
                            {/* <Menu.Item danger>
                                <Popconfirm
                                    title="Sure to delete?"
                                    onConfirm={() => handleDelete(text.id) }
                                >
                                    Delete
                                </Popconfirm>
                            </Menu.Item> */}
                            <Menu.Item
                                onClick={()=>{
                                    setEditRex({...text, tableIndex: index})
                                    setVisible(true)
                                }}
                                disabled={props.permissions&& !props.permissions['UPDATE']}
                            >
                                Edit
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

    const handleDelete = (rId) => {
        const { leadId, skill } = props
        delLeadSkillResource(leadId, skill, rId).then((res) => {
            if (res.success) {
                props.callBack()
            //     this.props.history.push('/Employees')
            }
        });
    };

    const onSelectChange = (selected, Rows) =>  {
        const { leadId, skill } = props
        setSelectedRowKeys(selected)
        selectLeadSkillResource(leadId, skill, Rows[0].id).then(res=>{
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
            key={props.skill}
            rowKey={(record) => record.id} 
            columns={columns} 
            dataSource={props.data} 
            pagination={false}
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
            close={()=>{setVisible(false)}}
            callBack={callBack}
        />}
    </div>
};


export default OpportunityMilestones;
