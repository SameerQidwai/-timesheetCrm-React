import React, { Component } from 'react'
import { Button, Table, Dropdown, Menu} from 'antd'
import { SettingOutlined, DownOutlined} from '@ant-design/icons'; //Icons
import { Link } from 'react-router-dom'
import { formatDate, formatCurrency, localStore } from '../../service/constant';
import { entityProjects } from "../../service/constant-Apis";

class Opportunities extends Component {
    constructor (){
        super()
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
                    <Link to={{ pathname: `/opportunities/${record.id}/info`}} className="nav-link"
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
                title: 'Estimated Value',
                dataIndex: 'value',
                key: 'value',
                render: (record)=>  `${formatCurrency(record)}` 
            },
            {
                title: 'Estimated Start Date',
                dataIndex: 'startDate',
                key: 'startDate',
                width: 'fit-content',
                render: (record) =>(record && formatDate(record, true, true))
            },
            {
                title: 'Estimated End Date',
                dataIndex: 'endDate',
                key: 'endDtae',
                render: (record) =>(record && formatDate(record, true, true))
            },
            {
                title: 'Bid Date',
                dataIndex: 'bidDate',
                key: 'bidDate',
                render: (record) =>(record && formatDate(record, true, true))
            },
            {
                title: 'Status',
                dataIndex: 'status',
                key: 'status',
                render: (record) =>(record )
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
                                <Link to={{ pathname: `/opportunities/${record.id}/info`}} className="nav-link">
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
        ]

        this.state = {
            data:[ ],
            columns:[],
            permissions: {}
        }
    }

    componentDidMount = () =>{
        this.getList()
        
    }

    getList = () =>{
        const { OPPORTUNITIES }= JSON.parse(localStore().permissions)
        const { customUrl, showColumn } = this.props
        const { data } = this.state
        entityProjects(customUrl).then(res=>{
            this.setState({
                data: res.success ? res.data : [],
                permissions: OPPORTUNITIES,
                columns: showColumn ? this.columns.filter(el=> el.dataIndex !== 'organization') : this.columns
            })
        })
    }

    render(){
        const { data, columns } = this.state
        return (
            <>
                <Table
                    bordered
                    pagination={{pageSize: localStore().pageSize}}
                    columns={columns} 
                    dataSource={data} 
                    size="small"
                    className='fs-small'
                />
            </>
        )
    }
}

export default Opportunities