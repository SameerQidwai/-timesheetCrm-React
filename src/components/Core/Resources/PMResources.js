import React, { Component } from "react";
import { Menu, Button, Dropdown, Table } from "antd";

import { getMilestones } from "../../../service/Milestone-Apis";

import moment from "moment"
import { formatDate, formatCurrency, localStore } from "../../../service/constant";


class PMResources extends Component {
    constructor() {
        super();
        this.state = {
            proId: false,
            permissions: {},
            customUrl: null,
            columns: [
                {
                    title: "Title",
                    dataIndex: "title",
                    key: "title",
                },
                {
                    title: "Amount",
                    dataIndex: "amount",
                    key: "amount",
                },
                {
                    title: "Start Date",
                    dataIndex: "startDate",
                    key: "startDate",
                    render: (record) =>(record && formatDate(record))
                },
                {
                    title: "End Date",
                    dataIndex: "endDate",
                    key: "endDate",
                    render: (record) =>(record && formatDate(record))
                },
                {
                    title: "Progress",
                    dataIndex: "progress",
                    key: "progress",
                },
                {
                    title: "Approved",
                    dataIndex: "isApproved",
                    key: "isApproved",
                    render: (record) => record? 'Approved': 'Not Approved'
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
                                                // pathname:  `/projects/${this.state&& this.state.proId}/milestones/${record.id}/resources`,
                                                pathname:  `/projects/${record.id}/resources`,
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
                                <SettingOutlined /> <DownOutlined />
                            </Button>
                        </Dropdown>
                    ),
                },
            ],
        };
    }

    componentDidMount = ()=>{
        const { id } = this.props.match.params
        this.fetch(id)
    }

    fetch = (id) =>{
        const { PROJECTS }= JSON.parse(localStore().permissions)
        getMilestones('projects',id).then(res => {
            this.setState({
                data: res.success && res.data,
                proId: id,
                permissions: PROJECTS
            })
        })
        .catch(e => {
            console.log(e);
        })
    }

    render() {
        const { data, leadId, permissions} = this.state;
        console.log(permissions);
        return (
            <Table
                bordered
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
                            callBack={this.callBack}
                            permissions={permissions}
                        />)
                    },
                    // rowExpandable: record => record.user.length > 0,
                    }}
                size="small"
            />
        );
    }
}


function NestedTable(props) {
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
    ];

    return <Table
        bordered
        key={props.skill}
        rowKey={(record) => record.id} 
        columns={columns} 
        dataSource={props.data} 
        pagination={false}
    />
};


export default PMResources;
