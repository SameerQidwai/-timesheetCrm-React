import React, { Component, useState } from "react";
import { Menu, Button, Dropdown, Table} from "antd";
import { SettingOutlined, DownOutlined } from "@ant-design/icons"; //Icons
import { Link } from 'react-router-dom'
import { formatDate, formatCurrency, localStore } from "../../../service/constant";
import { tableSorter } from "../Table/TableFilter";
import { getHierarchy } from "../../../service/opportunities";

const positionColumns = (milestoneId) => [
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
        title: "...",
        key: "action",
        align: "center",
        width: '1%',
        render: (text, record, index) => (
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
                    <SettingOutlined />
                </Button>
            </Dropdown>
        ),
    },
];

const resourceColumn = [
    { 
            
        title: 'Name', 
        dataIndex: 'contactPerson', 
        key: 'contactPerson' ,
        render: (record) =>(record &&`${record.firstName} ${record.lastName}`)
    },
    { 
        title: 'Buy Cost (hourly)', 
        dataIndex: 'buyingRate', 
        key: 'buyingRate', 
        render: (record)=> `${formatCurrency(record)}` 
    },
    {  
        title: 'Sale Cost (hourly)', 
        dataIndex: 'sellingRate', 
        key: 'sellingRate', 
        render: (record)=> `${formatCurrency(record)}`
    },
]

class OTResources extends Component {
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
                    columns={positionColumns(milestoneId)}
                    dataSource={data}
                    size="small"
                    className='fs-small'
                    expandable={{
                        rowExpandable: record => record?.opportunityResourceAllocations?.length > 0,
                        expandedRowRender: record => {
                            return (
                            <NestedTable 
                                data={record.opportunityResourceAllocations} 
                                columns={resourceColumn}
                                key={record.id}
                            />)
                        },
                        // rowExpandable: record => record.user.length > 0,
                      }}
                />
        );
    }
}

function NestedTable({columns, data}) {
    // const [data, setData] = useState(data);
    const [selectedRowKeys, setSelectedRowKeys] = useState(
        data ? //checking data
            data.length === 1 ? //checking if data length is one
                [data[0].id] // this must be selected
            // console.log(data)
            : data.findIndex(el => el.isMarkedAsSelected === true)!==-1 ? // otherwise check if anyone is selected
                [data[data.findIndex(el => el.isMarkedAsSelected)].id] // get the selected resource
            :
                []
        :   
            []
        )

    return <div style={{ paddingRight: 20}}> 
        <Table
            bordered
            // key={key}
            size="small"
            className='fs-small'
            rowKey={(record) => record.id} 
            columns={columns} 
            dataSource={data} 
            pagination={false}
            rowSelection={{
                type: 'radio',
                selectedRowKeys: selectedRowKeys,
                getCheckboxProps: (record) => ({
                    disabled: true
                })
            }}
        />
    </div>
};


export default OTResources;
