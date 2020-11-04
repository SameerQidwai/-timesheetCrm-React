import React, { Component } from 'react'
import { Typography, Row, Col, Popconfirm, Modal, Button, Table, Dropdown, Menu} from 'antd'
import { SettingOutlined, DownOutlined} from '@ant-design/icons'; //Icons
import Forms from '../../../components/Form'
const {Title} = Typography

class Levels extends Component {
    constructor (){
        super()
        this.levelForm = React.createRef();
        this.columns = [
            {
                title: 'Level Name',
                dataIndex: 'level',
                key: 'level',
            },
            // {
            //     title: 'Priority',
            //     dataIndex: 'priority',
            //     key: 'priority',
            //     align: 'right',
            // },
            {
            title: 'Action',
            key: 'action',
            align: 'right',
            render: (record, text) => (
                    <Dropdown overlay={
                        <Menu>
                            <Menu.Item onClick={()=>this.getRecord(record, text)}>Edit</Menu.Item>
                            <Menu.Item >
                                <Popconfirm title="Sure to delete?" onConfirm={() => this.handleDelete(record.key)}>
                                    Delete
                                </Popconfirm>
                            </Menu.Item >
                        </Menu>
                    }>
                        <Button size='small' >
                            <SettingOutlined/> Option <DownOutlined/>
                        </Button>
                    </Dropdown>  
                ),
            },
        ]
        this.state = {
            isVisible: false,
            newSkill:'',
            data:[
                {
                    key:1,
                    level: 'Superstar',
                },
                {
                    key:2,
                    level: 'Senior',
                },
                {
                    key:3,
                    level: 'Middle',
                },
                {
                    key:4,
                    level: 'Junior',
                },
                {
                    key:5,
                    level: 'Trainee',
                }
            ],
            editLevel:false,
            
            FormFields: {
                formId: "level_form",
                FormCol: 20,
                FieldSpace: { xs: 12, sm: 16, md: 122 },
                // layout: { labelCol: { span: 8 } },
                FormLayout:'inline',
                size: "middle",
                fields: [
                  {
                    object: "obj",
                    filedCol: 24,
                    key: "level",
                    label: "Name",
                    labelAlign: "right",
                    type: "Input",
                    size: 'small',
                  },
                //   {
                //     object: "obj",
                //     filedCol: 8,
                //     key: "priority",
                //     data: [
                //         {
                //             key:1,
                //             value:1
                //         },
                //         {
                //             key:2,
                //             value:2
                //         },
                //         {
                //             key:3,
                //             value:3
                //         },
                //         {
                //             key:4,
                //             value:4
                //         },
                //         {
                //             key:5,
                //             value:5
                //         }
                //     ],
                //     label: "priority",
                //     labelAlign: "right",
                //     type: "Select",
                //     size: 'small',
                //   },
                ],
            },
        }
    }


    handleDelete =  (key)=>{
        this.setState({ data: this.state.data.filter(item => item.key !== key) });
    }

    submit = () =>{
        this.levelForm.current.refs.level_form.submit();
    }


    Callback = (value) =>{
        if (!this.state.editLevel){ 
            this.addSkill(value.obj)
        }else{
            this.editRecord(value.obj)
        }
    }

    addSkill = (value)=>{
        let obj= {
            level: value.level,
            // priority: value.priority,
            key: this.state.data[this.state.data.length-1].key + 1
        }

        this.setState({
            data: [...this.state.data, obj],
            isVisible: false,
        })
    }

    getRecord = (data) => {
        const obj = Object.assign({}, data);
        console.log(obj)
        this.setState({
            FormFields: {...this.state.FormFields, initialValues: {obj:obj}},
            editLevel: obj.key,
            isVisible:true
        })
    }
    editRecord = (obj) =>{
        obj.key =  this.state.editLevel
        this.state.data[obj.key-1] = obj
        this.setState({
            data: [...this.state.data],
            editLevel:false,
            isVisible:false
        })
    }
    
    render(){
        console.log('12211')
        const data = this.state.data
        return (
            <>
                <Row justify="space-between">
                    <Col>
                        <Title level={3}>
                            Standard Levels
                        </Title>
                    </Col>
                    <Col>
                    <Button type="primary" size="small" onClick={()=>{
                        this.setState({ 
                            isVisible: true,  //Open Modal
                         });
                    }}>Add Level</Button>
                    </Col>
                </Row>
                <Table columns={this.columns} dataSource={data} size="small"/>
                { this.state.isVisible &&
                    <Modal
                        title={this.state.editLevel ? 'Edit Level': 'Add Level'}
                        centered
                        visible={this.state.isVisible}
                        okText={this.state.editLevel ? 'Edit': 'Save'}
                        width={400}
                        onCancel={() => { 
                        delete this.state.FormFields.initialValues // delete initialValues of fields on close
                        this.setState({ 
                            isVisible: false,  //close
                            FormFields: this.state.FormFields //delete Formfields on Close
                         });
                        }}
                        onOk={() => {
                            this.submit();
                        }}
                    >
                        <Row justify="center">
                        <Forms
                            ref={this.levelForm}
                            Callback={this.Callback}
                            FormFields={this.state.FormFields}
                        />
                        </Row>
                    </Modal>
                }
            </>
        )
    }
}

export default Levels