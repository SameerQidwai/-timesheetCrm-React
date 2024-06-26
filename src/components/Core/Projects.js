import React, { Component } from "react";
import { Button, Table, Dropdown, Menu } from "antd";
import { SettingOutlined, DownOutlined } from "@ant-design/icons"; //Icons
import { Link } from 'react-router-dom'

import moment from "moment";

import { formatCurrency, localStore } from "../../service/constant";
import { entityProjects } from "../../service/constant-Apis";

class Projects extends Component {
    constructor() {
        super();
        this.columns = [
            {
                title: 'Code',
                dataIndex: 'id',
                key: 'id',
                render:(record) =>(
                    `00${record}`
                ),
            },
            {
                title: 'Title',
                dataIndex: 'title',
                key: 'title',
            },
            {
                title: 'Organisation Name',
                dataIndex: 'organization',
                key: 'organization',
                render: (record) =>{return record && record.name}
            },
            {
                title: 'Revenue',
                dataIndex: 'value',
                key: 'value',
                render: record =>   `$ ${formatCurrency(record)}`
            },
            {
                title: 'Start Date',
                dataIndex: 'startDate',
                key: 'startDate',
                render: (record) =>(record && moment(record).format('ddd DD MM yyyy'))
            },
            {
                title: 'End Date',
                dataIndex: 'endDate',
                key: 'endDtae',
                render: (record) =>(record &&  moment(record).format('ddd DD MM yyyy'))
            },
            {
                title: 'Action',
                key: 'action',
                align: 'right',
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
                            <SettingOutlined/> Option <DownOutlined/>
                        </Button>
                    </Dropdown>  
                ),
            },
        ];

        this.state = {
            projects: [ ],
            permissions: {}
        };
    }

    componentDidMount = () =>{
        this.getEntityProjects()
        
    }

    getEntityProjects = () =>{
        const { PROJECTS }= JSON.parse(localStore().permissions)
        const { customUrl } = this.props
        entityProjects(customUrl).then(res=>{
            if(res.success){
                this.setState({
                    permissions: PROJECTS,
                    projects: res.data
                })
            }
        })
    }

    render() {
        const { projects } = this.state;
        return (
            <>
                <Table
                    pagination={{pageSize: localStore().pageSize}}
                    columns={this.columns}
                    dataSource={projects}
                    size="small"
                />
            </>
        );
    }
}

export default Projects;
