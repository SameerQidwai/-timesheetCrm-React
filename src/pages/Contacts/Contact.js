import React, {Component} from 'react'
import { Table, Menu, Dropdown, Button, Popconfirm, Row, Col,Typography } from 'antd'
import { DownOutlined, SettingOutlined, PlusSquareOutlined, FilterOutlined} from '@ant-design/icons'; //Icons
// import { Link } from 'react-router-dom'


// import Form from '../../components/Form';
import '../styles/table.css'

const { Title } = Typography



class Contact extends Component {
    constructor(props) {
    super(props);
        this.contactForm = React.createRef();
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
                title: 'Name',
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: 'Email',
                dataIndex: 'email',
                key: 'email',
            },
            {
                title: 'Organization',
                dataIndex: 'org',
                key: 'org',
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
                            <Menu.Item >Edit</Menu.Item>
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
                    name:'Micheal Boltz',
                    email: 'm.boltz@gmail.com'
                },
                {
                    key:2,
                    org: 'Org A',
                    name: 'Bob Tuner',
                    email: 'b.tuner@gmail.com'
                },
                {
                    key:3,
                    org: 'Org B',
                    name: 'Richard Tim',
                    email: 'r.tim@gmail.com'
                },
            ],
            openModal: false,
            editTimeoff:false,
            FormFields: {
                formId: 'contact_form',
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
                        label:'Title',
                        size: 'small',            
                        // rules:[{ required: true }],
                        type: 'input',
                        labelAlign: 'left',
                    },
                ],
            }
        }
    }

    handleDelete =  (code)=>{
        const dataSource = [...this.state.data];
        this.setState({ data: dataSource.filter(item => item.code !== code) });
    }

    toggelModal =(status)=>{
        this.setState({openModal:status})

        if (this.state.openModal){
            this.contactForm.current.refs.contact_form.resetFields(); // to reset file
            delete this.state.FormFields.initialValues // to delete intilize if not written    
            this.setState({  // set state
                FormFields: this.state.FormFields,
                editTimeoff:false 
            })

        }
    }

    Callback =(vake)=>{ // this will work after I get the Object from the form
        if(!this.state.editTimeoff){
            vake.obj.key = this.state.data.length + 1
            vake.obj.code = vake.obj.key
            this.setState({
                data: [...this.state.data, vake.obj],
            }, () => {
                this.toggelModal(false)
                this.contactForm.current.refs.contact_form.resetFields();
                console.log("Data Rendered");
            });
        }else{
            this.editRecord(vake.obj)
        }
    }

    getRecord = (data) => {

        this.setState({
            FormFields: {...this.state.FormFields, initialValues: {obj:data}},
            editTimeoff:data.key
        })
        
        this.toggelModal(true)
    }

    editRecord = (obj) => {
        obj.key =  this.state.editTimeoff
        obj.code = obj.key
        this.state.data[obj.key - 1] = obj

        this.setState({
            data: [...this.state.data],
            mergeObj:{},
        },()=>{
            this.toggelModal(false)
        })
    }

    submit = () =>{
        this.contactForm.current.refs.contact_form.submit();
    }

    render(){
        const data = this.state.data
        const columns = this.columns
        return(
            <>
                <Row justify="space-between">
                    <Col>
                        <Title level={4}>Contact Persons</Title>
                    </Col>
                    <Col style={{textAlign:'end'}} span={4} >
                        <Row justify="space-between">
                            <Col>
                                <Button type="default"size='small'> <FilterOutlined />Filter</Button>
                            </Col>
                            <Col>
                                <Button type="primary" size='small'> <PlusSquareOutlined />Contact Person</Button>
                            </Col>
                        </Row>
                    </Col>
                    <Col span={24}>
                        <Table columns={columns} dataSource={data} size='small'/>
                    </Col>
                </Row>
                {/* {this.state.openModal ? 
                    <Modal
                        title="Add Organizations"
                        centered
                        visible={this.state.openModal}
                        onOk={()=>{this.submit()}}
                        okText={this.state.editTimeoff? 'Edit' : 'Save'}
                        onCancel={()=>{this.toggelModal(false)}}
                        width={600}
                    >
                        <Form ref={this.contactForm} Callback={this.Callback} FormFields= {this.state.FormFields} />   
                    </Modal> : null
                } */}
            </>
        )
    }
}

export default Contact