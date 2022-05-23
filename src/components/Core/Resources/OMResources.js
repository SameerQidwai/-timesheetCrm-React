import React, { Component, useEffect, useState } from "react";
import { Row, Col, Menu, Button, Dropdown, Descriptions, Table, Tag, Popconfirm } from "antd";
import { SettingOutlined, DownOutlined } from "@ant-design/icons"; //Icons
import { Link } from 'react-router-dom'
import moment from "moment"
import { formatDate, formatCurrency, localStore } from "../../../service/constant";
import { tableSorter } from "../Table/TableFilter";
import { getHierarchy } from "../../../service/opportunities";

const milestoneColmuns = [
    {
        title: "Title",
        dataIndex: "title",
        key: "title",
        render:(text, record) => (
            <Link
                to={{
                    pathname:  `milestones/${record.id}/resources`,
                }}
                className="nav-link"
            >
                {text}
            </Link>
        ),
        ...tableSorter('title', 'string'),
    },
    {
        title: "Start Date",
        dataIndex: "startDate",
        key: "startDate",
        render: (record) =>(record && formatDate(record)),
        ...tableSorter('startDate', 'date'),
    },
    {
        title: "End Date",
        dataIndex: "endDate",
        key: "endDate",
        render: (record) =>(record && formatDate(record)),
        ...tableSorter('endDate', 'date'),
    },
    {
        title: "Approved",
        dataIndex: "isApproved",
        key: "isApproved",
        align: "right",
        render: (record) =>  <Tag color={record? 'green': 'volcano'} key={record}>
            {record? 'TRUE': 'FALSE'}
        </Tag>
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
                        {/* <Menu.Item danger 
                            disabled={!this?.state?.permissions?.['DELETE']}
                        >
                            <Popconfirm 
                                title="Are you sure you want to delete" 
                                onConfirm={() => this.handleDelete(record.id, index)} 
                            >
                                Delete
                            </Popconfirm>
                        </Menu.Item >
                        <Menu.Item
                            onClick={() => { this.openModal({...record, rowIndex: index}) }}
                            disabled={this.state && !this.state.permissions['UPDATE']}
                        >
                            Edit Milestone
                        </Menu.Item> */}
                        <Menu.Item>
                            <Link
                                to={{
                                    pathname:  `milestones/${record.id}/resources`,
                                }}
                                className="nav-link"
                            >
                                Positions
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
];

const positionColumns = [
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
   
    // {
    //     title: "Action",
    //     key: "action",
    //     align: "right",
    //     width: 115,
    //     render: (text, record, index) => (
    //         <Dropdown
    //             overlay={
    //                 <Menu>
    //                     <Menu.Item 
    //                         danger 
    //                         disabled={!this?.state?.permissions?.['DELETE']}
    //                     >
    //                         <Popconfirm
    //                             title="Are you sure you want to delete" 
    //                             onConfirm={() => this.handleDelete(record.id, index)} 
    //                         >
    //                             Delete
    //                         </Popconfirm>
    //                     </Menu.Item >
    //                     <Menu.Item
    //                         onClick={() => {
    //                             this.getSkilldEmployee(true,  false,  false, record,  index, record.panelSkillStandardLevelId)
    //                         }}
    //                         disabled={!this?.state?.permissions?.['UPDATE']}
    //                     >
    //                         Edit Position
    //                     </Menu.Item>
    //                     <Menu.Item 
    //                         onClick={() => {
    //                             console.log(record);
    //                             this.getSkilldEmployee(true,  record.id,  true, false,  index, record.panelSkillStandardLevelId)
    //                         }}
    //                         disabled={!this?.state?.permissions?.['ADD']}
    //                     >
    //                             Add Resouce
    //                     </Menu.Item>
    //                 </Menu>
    //             }
    //         >
    //             <Button size="small">
    //                 <SettingOutlined /> Option <DownOutlined />
    //             </Button>
    //         </Dropdown>
    //     ),
    // },
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
    // {
    //     title: "Action",
    //     key: "action",
    //     align: "right",
    //     width: 115,
    //     render: (text, record, index) => (
    //         // <Dropdown
    //         //     overlay={
    //         //         <Menu>
    //         //             <Menu.Item 
    //         //                     danger 
    //         //                     disabled={!props?.permissions?.['DELETE']}
    //         //                 >
    //         //                     <Popconfirm
    //         //                         title="Are you sure you want to delete" 
    //         //                         onConfirm={() => handleDelete(record.id, index)} 
    //         //                     >
    //         //                         Delete
    //         //                     </Popconfirm>
    //         //                 </Menu.Item >
    //         //             <Menu.Item
    //         //                 onClick={()=>{
    //         //                     setEditRex({...record, tableIndex: index})
    //         //                     setVisible(true)
    //         //                 }}
    //         //                 disabled={!props?.permissions?.['UPDATE']}
    //         //             >
    //         //                 Edit Resource
    //         //             </Menu.Item>
    //         //         </Menu>
    //         //     }
    //         // >
    //         //     <Button size="small">
    //         //         <SettingOutlined /> Option <DownOutlined />
    //         //     </Button>
    //         // </Dropdown>
    //     ),
    // },
]

class OMResources extends Component {
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
                this.setState({
                    leadId: id, 
                    data: success ? data : []
                })
            }
        })
    }
    


    render() {
        const { desc, data, leadId, permissions} = this.state;
        return ( //will remove it in near future will be using NestedTable Function here as well 
                <Table
                    bordered
                    pagination={{pageSize: localStore().pageSize}}
                    rowKey={(record) => record.id}
                    columns={milestoneColmuns}
                    dataSource={data}
                    size="small"
                    expandable={{
                        rowExpandable: record => record?.opportunityResources?.length > 0,
                        expandedRowRender: record => {
                            return (
                            <NestedTable 
                                data={record.opportunityResources} 
                                columns={positionColumns}
                                key={record.id}
                                expandable={true}
                                checked={false}
                            />)
                        },
                        // rowExpandable: record => record.user.length > 0,
                      }}
                />
        );
    }
}

function NestedTable({key, columns, data, expandable,checked}) {
    // const [data, setData] = useState(data);
    const [selectedRowKeys, setSelectedRowKeys] = useState([])

    useEffect(() => {
        if (checked){
            setSelectedRowKeys(data ? //checking data
            data.length === 1 ? //checking if data length is one
                [data[0].id] // this must be selected
            // console.log(data)
            : data.findIndex(el => el.isMarkedAsSelected === true)!==-1 ? // otherwise check if anyone is selected
                [data[data.findIndex(el => el.isMarkedAsSelected)].id] // get the selected resource
            :
                []
            :   
                [])
        }
    }, [])

    return <div style={{ paddingRight: 20}}> 
        <Table
            bordered
            // key={key}
            size="small"
            rowKey={(record) => record.id} 
            columns={columns} 
            dataSource={data} 
            pagination={false}
            rowSelection={checked &&{
                type: 'radio',
                selectedRowKeys: selectedRowKeys,
                getCheckboxProps: (record) => ({
                    disabled: true
                  })
            }}
            expandable={expandable &&{
                rowExpandable: record => record?.opportunityResourceAllocations?.length > 0,
                expandedRowRender: record => {
                    return (
                    <NestedTable 
                        data={record.opportunityResourceAllocations} 
                        columns={resourceColumn}
                        key={record.id}
                        expandable={false}
                        checked={true}
                    />)
                },
              }}
        />
    </div>
};


export default OMResources;
