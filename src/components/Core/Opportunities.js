import React, { Component } from 'react'
import { Button, Table, Dropdown, Menu} from 'antd'
import { SettingOutlined, DownOutlined} from '@ant-design/icons'; //Icons
import { Link } from 'react-router-dom'
import moment from 'moment'
import { formatCurrency, localStore } from '../../service/constant';
import { entityProjects } from "../../service/constant-Apis";

class Skills extends Component {
    constructor (){
        super()
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
                render: (record)=>  `$ ${formatCurrency(record)}` 
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
                render: (record) =>(record && moment(record).format('ddd DD MM yyyy'))
            },
            {
                title: 'Bid Date',
                dataIndex: 'bidDate',
                key: 'bidDate',
                render: (record) =>(record && moment(record).format('ddd DD MM yyyy'))
            },
            {
                title: 'Status',
                dataIndex: 'status',
                key: 'status',
                render: (record) =>(record )
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
                                <Link to={{ pathname: `/opportunity/${record.id}/info`}} className="nav-link">
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
        ]

        this.state = {
            data:[ ],
            permissions: {}
        }
    }

    componentDidMount = () =>{
        this.getList()
        
    }

    getList = () =>{
        const { OPPORTUNITIES }= JSON.parse(localStore().permissions)
        const { customUrl } = this.props
        entityProjects(customUrl).then(res=>{
            this.setState({
                data: res.success ? res.data : [],
                permissions: OPPORTUNITIES
            })
        })
    }

    render(){
        const { data } = this.state
        return (
            <>
                <Table 
                    pagination={{pageSize: localStore().pageSize}}
                    columns={this.columns} 
                    dataSource={data} 
                    size="small"
                />
            </>
        )
    }
}

export default Skills