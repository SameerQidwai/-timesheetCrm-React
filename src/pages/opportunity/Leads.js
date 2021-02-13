import React, {Component} from 'react'
import { Table, Menu, Dropdown, Button, Popconfirm, Row, Col,Typography, Modal } from 'antd'
import { DownOutlined, SettingOutlined, PlusSquareOutlined, FilterOutlined} from '@ant-design/icons'; //Icons
import { Link } from 'react-router-dom'

import InfoModal from './infoModal'
import '../styles/table.css'

const { Title } = Typography

class Leads extends Component {
    constructor(props) {
    super(props);
        this.leadForm = React.createRef();
        this.columns = [
            {
                title: 'Code',
                dataIndex: 'key',
                key: 'key',
                render:(record) =>(
                    `00${record}`
                ),
            },
            {
                title: 'Organization Name',
                dataIndex: 'org',
                key: 'org',
            },
            {
                title: 'Revenue',
                dataIndex: 'revenue',
                key: 'revenue',
            },
            {
                title: 'Last Comment',
                dataIndex: 'l_comment',
                key: 'l_comment',
            },
            {
                title: 'Action',
                key: 'action',
                align: 'right',
                render: (record) => (
                    <Dropdown overlay={
                        <Menu>
                            <Menu.Item danger>
                                <Popconfirm title="Sure to delete?" onConfirm={() => this.handleDelete(record.code)} >
                                    Delete
                                </Popconfirm>
                            </Menu.Item >
                            <Menu.Item 
                                onClick={()=>this.setState({
                                    openModal: true
                                })}
                            >Edit</Menu.Item>
                            <Menu.Item >
                                {/* <Link to={{ pathname: '/admin/calender/holidays' ,query: record.key}} className="nav-link"> */}
                                    View
                                {/* </Link> */}
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

        this.state={

            data : [
                {
                    key:1,
                    org: 'One_LM',
                    Revenue:'$3000',
                    l_comment: 'they are evaluating'
                },
                {
                    key:2,
                    org: 'lead Carot',
                    Revenue:'$4000',
                    l_comment: 'they want demo'
                },
                {
                    key:3,
                    org: 'Jubliee',
                    Revenue:'$1000',
                    l_comment: 'Need to gether req'
                },
            ],
            openModal: false,
            editLead:false,
        }
    }

    handleDelete =  (code)=>{
        const dataSource = [...this.state.data];
        this.setState({ data: dataSource.filter(item => item.code !== code) });
    }

    Callback =()=>{ // this will work after I get the Object from the form
        console.log("callback called in lead");
        this.setState({
            openModal: false,
            editLead: false
        })
    }
    closeModal = () =>{
        console.log("Colse called in lead");
        this.setState({
            openModal: false,
            editLead: false
        })
    }

    render(){
        const { data, openModal, editLead } = this.state
        return(
            <>
                <Row justify="space-between">
                    <Col>
                        <Title level={4}>Lead</Title>
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
                                    ><PlusSquareOutlined />Add Lead</Button>
                            </Col>
                        </Row>
                    </Col>
                    <Col span={24}>
                        <Table columns={this.columns} dataSource={data} size='small'/>
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

export default Leads