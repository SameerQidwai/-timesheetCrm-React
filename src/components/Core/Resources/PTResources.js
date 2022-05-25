import React, { Component, useEffect, useState } from "react";
import { Menu, Button, Dropdown, Table} from "antd";
import { SettingOutlined, DownOutlined } from "@ant-design/icons"; //Icons
import { Link } from 'react-router-dom'
import { formatDate, formatCurrency, localStore } from "../../../service/constant";
import { tableSorter } from "../Table/TableFilter";
import { getHierarchy } from "../../../service/projects";



const resourceColumn = (milestoneId) => [
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
        dataIndex: "contactPerson",
        key: "contactPerson",
        render: (record)=>(
            `${record?.firstName} ${record?.lastName}`
        ),
        ...tableSorter('contactPerson.firstName', 'string'),
    },
    {
        title: "Billable Hours",
        dataIndex: "billableHours",
        key: "billableHours",
        sorter: (a, b) => a.billableHours - b.billableHours,
        ...tableSorter('billableHours', 'number'),
    },
    {
        title: "Buy Rate (hourly)",
        dataIndex: "buyingRate",
        key: "buyingRate",
        render:(record)=>( record &&formatCurrency(record) ),
        ...tableSorter('buyingRate', 'number'),
    },
    {
        title: "Sale Rate (hourly)",
        dataIndex: "sellingRate",
        key: "sellingRate",
        render:(record)=>( record && formatCurrency(record) ),
        ...tableSorter('sellingRate', 'number'),
    },
    {
        title: "Action",
        key: "action",
        align: "right",
        width: 115,
        render: (value, record, index) => (
            <Dropdown
                overlay={
                    <Menu>
                        <Menu.Item>
                            <Link
                                to={{
                                    pathname:  `milestones/${milestoneId}/resources`,
                                }}
                                className="nav-link"
                            >
                                Milestone
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
]

class PTResources extends Component {
    constructor() {
        super();

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
        const { id } = this.props
        getHierarchy(id).then(res=>{
            if (res){
                const {success, data } = res
                //inserting Link to redirect to positions
                this.setState({
                    leadId: id, 
                    data: success ? data[0].opportunityResources : [], 
                    milestoneId: success && data?.[0]?.id
                })
            }
        })
    }
    


    render() {
        const { desc, data, leadId, permissions,milestoneId} = this.state;
        return ( //will remove it in near future will be using NestedTable Function here as well 
                <Table
                    bordered
                    pagination={{pageSize: localStore().pageSize}}
                    rowKey={(record) => record.id}
                    columns={resourceColumn(milestoneId)}
                    dataSource={data}
                    size="small"
                />
        );
    }
}

export default PTResources;