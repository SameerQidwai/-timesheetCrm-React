import React, {Component} from 'react'
import { Table, Menu, Dropdown, Button, Popconfirm, Row, Col,Typography, Modal } from 'antd'
import { DownOutlined, SettingOutlined, PlusSquareOutlined, FilterOutlined} from '@ant-design/icons'; //Icons
import { Link } from 'react-router-dom'

import InfoModal from './Modals/InfoModal'

import { getList, delList } from "../../service/projects";

import '../styles/table.css'
import moment from "moment";
import { formatCurrency, localStore } from '../../service/constant';
const { Title } = Typography

class Projects extends Component {
    constructor(props) {
    super(props);
        this.proForm = React.createRef();
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
                width: 300,
                render: (record) =>{return record && record.name}
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
                            {/* <Menu.Item danger>
                                <Popconfirm title="Sure to delete?" onConfirm={() => this.handleDelete(record.id)} >
                                    Delete
                                </Popconfirm>
                            </Menu.Item > */}
                            <Menu.Item 
                                onClick={()=>this.setState({
                                    openModal: true,
                                    editPro: record.id
                                })}
                                disabled={this.state&& !this.state.permissions['UPDATE']}
                            >Edit</Menu.Item>
                            <Menu.Item >
                                <Link to={{ pathname: `/projects/${record.id}/info`}} className="nav-link">
                                    View
                                </Link>
                            </Menu.Item >
                            <Menu.Item >
                                <Link to={{ pathname: `/projects/${record.id}/purchase-order`}} className="nav-link">
                                    Purchase Order
                                </Link>
                            </Menu.Item >
                             <Menu.Item>
                                <Link
                                    to={{ pathname: `/projects/${record.id}/resources`, }}
                                    className="nav-link"
                                >
                                    Resources
                                </Link>
                            </Menu.Item>
                             <Menu.Item>
                                <Link
                                    to={{ pathname: `/projects/${record.id}/milestones`, }}
                                    className="nav-link"
                                >
                                    Milestones
                                </Link>
                            </Menu.Item>
                            
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
            data : [ ],
            openModal: false,
            editPro:false,
            permissions: {}
        }
    }

    componentDidMount = () =>{
        this.getList()
    }

    getList = () =>{
        const { PROJECTS }= JSON.parse(localStore().permissions)
        getList().then(res=>{
            this.setState({
                data: res.success ? res.data : [],
                openModal: false,
                editPro: false,
                permissions: PROJECTS
            })
        })
    }

    handleDelete = (id) => {
        delList(id).then((res) => {
            if (res.success) {
                this.getData();
            }
        });
    };

    callBack =()=>{ // this will work after I get the Object from the form
        this.getList()
    }

    closeModal = () =>{
        this.setState({
            openModal: false,
            editPro: false
        })
    }

    render(){
        const { data, openModal, editPro, permissions } = this.state
        return(
            <>
                <Row justify="space-between">
                    <Col>
                        <Title level={4}>Project</Title>
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
                                            editPro:false
                                        })
                                    }}
                                    disabled={!permissions['ADD']}
                                    ><PlusSquareOutlined />Add Project</Button>
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
                        editPro={editPro}
                        close={this.closeModal}
                        callBack={this.callBack}
                    />
                )}
            </>
        )
    }
}

export default Projects