import React, {Component} from 'react'
import { Table, Menu, Dropdown, Button, Popconfirm, Row, Col,Typography, Modal } from 'antd'
import { DownOutlined, SettingOutlined, PlusSquareOutlined, FilterOutlined} from '@ant-design/icons'; //Icons
import { Link } from 'react-router-dom'

import InfoModal from './Modals/InfoModal'

import { getList, delList } from "../../service/opportunities";

import '../styles/table.css'
import moment from "moment";
import { formatCurrency, localStore } from '../../service/constant';
const { Title } = Typography

class Opportunities extends Component {
    constructor(props) {
    super(props);
        this.leadForm = React.createRef();
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
                width: 300,
                key: 'organization',
                render: (record) =>{
                    return record && <Link 
                        to={{ pathname: `/organisations/${record.id}/info`, }}
                        className="nav-link"
                    >
                        {record.name}</Link> 
                }
            },
            {
                title: 'Revenue',
                dataIndex: 'value',
                key: 'value',
                render: (record)=>  `${formatCurrency(record)}` 
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
                title: 'Stage',
                dataIndex: 'stage',
                key: 'stage',
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
                            <Menu.Item danger>
                                <Popconfirm title="Sure to delete?" onConfirm={() => this.handleDelete(record.id)} >
                                    Delete
                                </Popconfirm>
                            </Menu.Item >
                            <Menu.Item 
                                onClick={()=>this.setState({
                                    openModal: true,
                                    editLead: record.id
                                })}
                                disabled={this.state&& !this.state.permissions['UPDATE']}
                            >Edit</Menu.Item>
                            {record.type === 1 ?  //if condition
                                <Menu.Item> 
                                    <Link
                                        to={{ pathname: `/opportunities/${record.id}/milestones`, }}
                                        className="nav-link"
                                    >
                                        Milestones
                                    </Link>
                                </Menu.Item>
                                 : //else condition
                                <Menu.Item>
                                    <Link
                                        to={{
                                            // pathname: `/opportunities/${record.id}/milestones/${record.id}/resources`,
                                            pathname: `/opportunities/${record.id}/milestones/${record.milestones[0] && record.milestones[0].id}/resources`,
                                        }}
                                        className="nav-link"
                                    >
                                        Resources
                                    </Link>
                                </Menu.Item>
                            }
                            <Menu.Item >
                                <Link to={{ pathname: `/opportunities/${record.id}/info`}} className="nav-link">
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
            data : [],
            openModal: false,
            editLead:false,
            permissions: {}
        }
    }

    componentDidMount = () =>{
        this.getList()
    }
    resRoute = ()=>{
        console.log(this.props.match.url)
        let splitted = this.props.match.url
        splitted = splitted.split('/', 2)
        console.log(splitted);
        return splitted[1]
    }

    getList = () =>{
        const { OPPORTUNITIES }= JSON.parse(localStore().permissions)
        getList().then(res=>{
            this.setState({
                data: res.success ? res.data : [],
                openModal: false,
                editLead: false,
                permissions: OPPORTUNITIES
            })
        })
    }

    handleDelete = (id) => {
        delList(id).then((res) => {
            if (res.success) {
                this.getList();
            }
        });
    };

    callBack =()=>{ // this will work after I get the Object from the form
        this.getList()
    }

    closeModal = () =>{
        this.setState({
            openModal: false,
            editLead: false
        })
    }

    render(){
        const { data, openModal, editLead, permissions } = this.state
        return(
            <>
                <Row justify="space-between">
                    <Col>
                        <Title level={4}>Opportunities</Title>
                    </Col>
                    <Col style={{textAlign:'end'}} span={4} >
                        <Row justify="space-between">
                            <Col>
                                <Button type="default"size='small'> <FilterOutlined />Filter</Button>
                            </Col>
                            <Col>
                                <Button 
                                    type="primary" 
                                    size='small'
                                    onClick={()=>{
                                        this.setState({
                                            openModal: true,
                                            editLead:false
                                        })
                                    }} 
                                    disabled={!permissions['ADD']}
                                    ><PlusSquareOutlined /> Opportunity</Button>
                            </Col>
                        </Row>
                    </Col>
                    <Col span={24}>
                        <Table
                            pagination={{pageSize: localStore().pageSize}}
                            rowKey={(data) => data.id} 
                            columns={this.columns}
                            dataSource={data}
                            size='small'
                        />
                    </Col>
                </Row>
                {openModal && (
                    <InfoModal
                        visible={openModal}
                        editLead={editLead}
                        close={this.closeModal}
                        callBack={this.callBack}
                    />
                )}
            </>
        )
    }
}

export default Opportunities