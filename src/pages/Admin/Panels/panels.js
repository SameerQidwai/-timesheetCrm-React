import React, {Component} from 'react'
import { Table, Menu, Dropdown, Button, Popconfirm, Row, Col,Typography, Modal } from 'antd'
import { DownOutlined, SettingOutlined, PlusSquareOutlined} from '@ant-design/icons'; //Icons
import { Link } from 'react-router-dom'

import Form from '../../../components/Form';
import '../../styles/table.css'

const { Title } = Typography

class Panels extends Component {
    constructor(props) {
        super(props);
        this.dynamoForm = React.createRef();

        this.columns = [
            {
                title: 'Name',
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: 'Contact',
                dataIndex: 'contact',
                key: 'contact',
            },
            {
                title: 'Action',
                key: 'action',
                align: 'right',
                render: (text, record) => (
                    <Dropdown overlay={
                        <Menu>
                            <Menu.Item danger>
                                <Popconfirm title="Sure to delete?" onConfirm={() => this.handleDelete(record.key)}>
                                    Delete
                                </Popconfirm>
                            </Menu.Item >
                            <Menu.Item onClick={()=>this.getRecord(record)}>Edit</Menu.Item>
                            <Menu.Item >
                                {/* <Link to={{ pathname: `/admin/panels/info/${record.key}` }} className="nav-link"> */}
                                <Link to={{ pathname: `/admin/panels/info/${record.key}` }}>
                                    Skills
                                </Link></Menu.Item>
                        </Menu>
                    }>
                        <Button  size="small">
                            <SettingOutlined/> Option <DownOutlined/>
                        </Button>
                    </Dropdown>  
                ),
            },
        ];

        this.state={
            data : [
                {
                    key: 1,
                    name: 'Panel 1',
                    contact: '000-00001',
                },
                {
                    key: 2,
                    name: 'Panel 2',
                    contact: 'xxx-xxxx',
                },
                {
                    key: 3,
                    name: 'Panel 3',
                    contact: '9999999',
                },
            ],
            openModal: false,
            editTimeoff: false,
            FormFields: {
                formId: 'time_off',
                justify : 'center',
                FormCol: 20,
                FieldSpace: { xs: 12, sm: 16, md: 122},
                layout: {labelCol: { span: 12 }},
                justifyField:'center',
                // FormLayout:'inline', 
                size: 'middle',
                fields:[
                    {
                        object:'obj',
                        filedCol:20,
                        layout:  {labelCol: { span: 4 },
                        wrapperCol: { span: 0 }},
                        key: 'name',
                        label:'Name',
                        size:'small',
                        // rules:[{ required: true }],
                        type: 'input',
                        labelAlign: 'left',
                    },
                    {
                        object:'obj',
                        filedCol:20,
                        layout:  {labelCol: { span: 4 },
                        wrapperCol: { span: 0 }},
                        key: 'contact',
                        label:'Contact',
                        size:'small',
                        // rules:[{ required: true }],
                        type: 'input',
                        labelAlign: 'left',
                    },
                ],
            }
        } 
    }

    handleDelete =  (key)=>{
        const dataSource = [...this.state.data];
        this.setState({ data: dataSource.filter(item => item.key !== key) });
    }

    toggelModal =(status)=>{
        this.setState({openModal:status})

        if (this.state.openModal){
            this.dynamoForm.current.refs.time_off.resetFields(); // to reset file
            delete this.state.FormFields.initialValues // to delete intilize if not written    
            this.setState({  // set state
                FormFields: this.state.FormFields,
                editTimeoff:false 
            })
        }
    }

    Callback =(vake)=>{ // this will work after I get the Object from the form
        if (!this.state.editTimeoff){ // to add new datas
            vake.obj.key = this.state.data.length + 1
            this.setState({
                data: [...this.state.data, vake.obj],
            }, () => {
                this.toggelModal(false)
                console.log("Data Rendered");
            });
        }else{ // to edit pervoius data
            this.editRecord(vake.obj)
        }
    }

    submit = () =>{
        this.dynamoForm.current.refs.time_off.submit();
    }

    getRecord = (data) => {

        this.setState({
            FormFields: {...this.state.FormFields, initialValues: {obj:data}},
            editTimeoff: data.key
        }, ()=>{
            this.toggelModal(true)

        })   
    }

    editRecord = (obj) =>{
        obj.key =  this.state.editTimeoff
        this.state.data[obj.key - 1] = obj

        this.setState({
            data: [...this.state.data],
            mergeObj:{},
        },()=>{
            this.toggelModal(false)
        })
    }

    
    render(){
        const data = this.state.data
        const columns = this.columns
        return(
            <>
                <Row justify="space-between">
                    <Col>
                        <Title level={4}>Panels</Title>
                    </Col>
                    <Col style={{textAlign:'end'}}>
                        <Button type="primary" onClick={()=>{this.toggelModal(true)}} size="small"> <PlusSquareOutlined />Add Panels</Button>
                    </Col>
                    <Col span={24}>
                        <Table columns={columns} dataSource={data} size="small"/>
                    </Col>
                </Row>
                {this.state.openModal?
                    <Modal
                        title="Add Time Off"
                        centered
                        visible={this.state.openModal}
                        onOk={()=>{this.submit()}}
                        okText={this.state.editTimeoff? 'Edit' : 'Save'}
                        onCancel={()=>{this.toggelModal(false)}}
                        width={600}
                    >
                        <Form ref={this.dynamoForm} Callback={this.Callback} FormFields = {this.state.FormFields} />   
                    </Modal>:null
                }
            </>
        )
    }
}

export default Panels