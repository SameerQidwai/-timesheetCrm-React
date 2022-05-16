import React, { Component, useState } from "react";
import { Row, Col, Menu, Button, Dropdown, Descriptions, Table } from "antd";
import { SettingOutlined, DownOutlined } from "@ant-design/icons"; //Icons
import moment from "moment"
import { formatDate, formatCurrency, localStore } from "../../../service/constant";


class OMResource extends Component {
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
                width: 115,
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
            leadId: false,
            data: [],
            desc: {},
            skillId: false,
            levelId: false,
            resource: false,
            permissons: {ADD: true}
        };
    }

    componentDidMount = () => {
        const { data, id } = this.props
        this.setState({
            data: data.milestones,
            type: data.type, 
            leadId: data.id,
        })
    }

    render() {
        const { desc, data, leadId, permissions} = this.state;
        return (
                <Table
                    bordered
                    pagination={{pageSize: localStore().pageSize}}
                    rowKey={(record) => record.id}
                    columns={this.columns}
                    dataSource={data}
                    size="small"
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
                />
        );
    }
}


function NestedTable(props) {
    const [data, setData] = useState(props.data);
    const [visible, setVisible ] = useState(false)
    const [editRex, setEditRex] = useState(false)
    // const [selectedRowKeys, setSelectedRowKeys] = useState(props.data ? [props.data.findIndex(el => el.isMarkedAsSelected === true)]: [])
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


    return <div style={{ paddingRight: 20}}> 
        <Table
            bordered
            key={props.skill}
            rowKey={(record) => record.id} 
            columns={columns} 
            dataSource={props.data} 
            pagination={false}
        />
    </div>
};


export default OMResource;
