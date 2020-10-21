import React, {Component} from 'react'
import { Table, Menu, Dropdown, Button, Popconfirm, Row, Col,Typography, Modal } from 'antd'
import { DownOutlined, SettingOutlined, PlusSquareOutlined} from '@ant-design/icons'; //Icons

import Form from '../../components/Form';
import '../styles/table.css'

const { Title } = Typography

class TimeOffs extends Component {
    constructor(props) {
        super(props);
        this.dynamoForm = React.createRef();

        this.columns = [
            {
                title: 'Title',
                dataIndex: 'title',
                key: 'title',
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
                                    <a>Delete</a>
                                </Popconfirm>
                            </Menu.Item >
                            <Menu.Item onClick={()=>this.editRecord(record)}>Edit</Menu.Item>
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
                    title: 'Sick Leaves',
                },
                {
                    key: 2,
                    title: 'Vacations',
                },
                {
                    key: 3,
                    title: 'Training',
                },
            ],
            openModal: false,
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
                        key: 'title',
                        label:'Title',
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
        if (!status){
            this.dynamoForm.current.refs.time_off.resetFields();
        }
        this.setState({openModal:status})
    }

    editRecord = (data) => {

        this.setState({
            FormFields: {...this.state.FormFields, initialValues: {obj:data}}
        })
        
        this.toggelModal(true)
    }

    Callback =(vake)=>{ // this will work after I get the Object from the form
        vake.obj.key = this.state.data.length + 1
        this.setState({
            data: [...this.state.data, vake.obj],
        }, () => {
            this.toggelModal(false)
            console.log("Data Rendered");
        });
    }

    submit = () =>{
        console.log('submit')
        this.dynamoForm.current.refs.time_off.submit();
    }


    render(){
        const data = this.state.data
        const columns = this.columns
        return(
            <>
                <Row justify="space-between">
                    <Col>
                        <Title level={4}>Time Offs</Title>
                    </Col>
                    <Col style={{textAlign:'end'}}>
                        <Button type="primary" onClick={()=>{this.toggelModal(true)}} size="small"> <PlusSquareOutlined />Add Time Off</Button>
                    </Col>
                    <Col span={24}>
                        <Table columns={columns} dataSource={data} size="small"/>
                    </Col>
                </Row>
                <Modal
                    title="Add Time Off"
                    centered
                    visible={this.state.openModal}
                    onOk={()=>{this.submit()}}
                    onCancel={()=>{this.toggelModal(false)}}
                    width={600}
                >
                    <Form ref={this.dynamoForm} Callback={this.Callback} FormFields= {this.state.FormFields} />   
                </Modal>
            </>
        )
    }
}

export default TimeOffs