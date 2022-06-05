import React, { Component } from "react";
import { Button, Table, Dropdown, Menu } from "antd";
import { SettingOutlined, DownOutlined } from "@ant-design/icons"; //Icons
import { Link } from 'react-router-dom'

import moment from "moment";

import { formatDate, formatCurrency, localStore } from "../../service/constant";
import { entityProjects } from "../../service/constant-Apis";

class Projects extends Component {
    constructor() {
        super();
        this.columns = [
            {
                title: 'Code',
                dataIndex: 'id',
                key: 'id',
                wdith: 115,
                render:(record) =>(
                    `00${record}`
                ),
            },
            {
                title: 'Title',
                dataIndex: 'title',
                key: 'title',
                render: (value, record) => (
                    <Link to={{ pathname: `/projects/${record.id}/info`}} className="nav-link"
                    > {value} </Link>
                ),
            },
            {
                title: 'Organisation Name',
                dataIndex: 'organization',
                key: 'organization',
                width: 300,
                render: (record) =>{
                    return record && <Link 
                        to={{ pathname: `/organisations/${record.id}/info`, }}
                        className="nav-link"
                    >
                        {record.name}</Link> 
                },
            },
            {
                title: 'Revenue',
                dataIndex: 'value',
                key: 'value',
                render: record =>   `${formatCurrency(record)}`
            },
            {
                title: 'Start Date',
                dataIndex: 'startDate',
                key: 'startDate',
                render: (record) =>(record && formatDate(record))
            },
            {
                title: 'End Date',
                dataIndex: 'endDate',
                key: 'endDtae',
                render: (record) =>(record &&  formatDate(record))
            },
            {
                title: '...',
                key: 'action',
                align: 'center',
                width: '1%',
                render: (record) => (
                    <Dropdown overlay={
                        <Menu>
                            <Menu.Item 
                                disabled={this.state&& !this.state.permissions['READ']}
                            >
                                <Link to={{ pathname: `/projects/${record.id}/info`}} className="nav-link">
                                    View
                                </Link>
                            </Menu.Item >                            
                        </Menu>
                    }>
                        <Button size='small'>
                            <SettingOutlined/>
                        </Button>
                    </Dropdown>  
                ),
            },
        ];

        this.state = {
            projects: [ ],
            permissions: {},
            columns:[]
        };
    }

    componentDidMount = () =>{
        this.getEntityProjects()
        
    }

    getEntityProjects = () =>{
        const { PROJECTS }= JSON.parse(localStore().permissions)
        const { customUrl, showColumn } = this.props
        entityProjects(customUrl).then(res=>{
            if(res.success){
                this.setState({
                    permissions: PROJECTS,
                    projects: res.data,
                    columns: showColumn ? this.columns.filter(el=> el.dataIndex !== 'organization') : this.columns
                })
            }
        })
    }

    render() {
        const { projects, columns } = this.state;
        return (
            <>
                <Table
                    bordered
                    rowKey={(data) => data.id} 
                    pagination={{pageSize: localStore().pageSize}}
                    columns={columns}
                    dataSource={projects}
                    size="small"
                    className='fs-small'
                />
            </>
        );
    }
}

export default Projects;
