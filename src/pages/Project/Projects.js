import React, {Component} from 'react'
import { Table, Menu, Dropdown, Button, Popconfirm, Row, Col,Typography, Modal } from 'antd'
import { DownOutlined, SettingOutlined, PlusSquareOutlined, FilterOutlined} from '@ant-design/icons'; //Icons
import { Link } from 'react-router-dom'

import InfoModal from './InfoModal'

import { getList, delList } from "../../service/opportunities";

import '../styles/table.css'
import moment from "moment";
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
                render: (record) =>{return record && record.name}
            },
            {
                title: 'Revenue',
                dataIndex: 'value',
                key: 'value',
            },
            {
                title: 'Start Date',
                dataIndex: 'startDate',
                key: 'startDate',
                render: (record) =>(moment(record).format('ddd DD MM yyyy'))
            },
            {
                title: 'End Date',
                dataIndex: 'endDate',
                key: 'endDtae',
                render: (record) =>(moment(record).format('ddd DD MM yyyy'))
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
                                    editPro: record.id
                                })}
                            >Edit</Menu.Item>
                            <Menu.Item >
                                {/* <Link to={{ pathname: '/admin/calender/holidays' ,query: record.key}} className="nav-link"> */}
                                    View
                                {/* </Link> */}
                            </Menu.Item >
                             <Menu.Item>
                                <Link
                                    to={{
                                        pathname: `/projects/resources/${record.id}`,
                                    }}
                                    className="nav-link"
                                >
                                    Resources
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
            data : [
                {title: 'Service', organization: {name: 'PSO'}, value: '1000.00', startDate: '12 10 2020', endDate: '12 4 2021'},
                {title: 'Web Application', organization: {name: 'Technologics'}, value: '200000.00', startDate: '12 10 2020', endDate: '12 4 2021'},
            ],
            openModal: false,
            editPro:false,
        }
    }

    componentDidMount = () =>{
        // this.getList()
    }

    getList = () =>{
        getList().then(res=>{
            this.setState({
                data: res.success ? res.data : []
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
        this.setState({
            openModal: false,
            editPro: false
        })
    }

    closeModal = () =>{
        this.setState({
            openModal: false,
            editPro: false
        })
    }

    render(){
        const { data, openModal, editPro } = this.state
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
                                    ><PlusSquareOutlined />Add Project</Button>
                            </Col>
                        </Row>
                    </Col>
                    <Col span={24}>
                        <Table
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