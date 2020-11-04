import React, {Component} from 'react'
import { Table, Menu, Dropdown, Button, Popconfirm, Row, Col,Typography, Modal } from 'antd'
import { DownOutlined, SettingOutlined, PlusSquareOutlined, FilterOutlined} from '@ant-design/icons'; //Icons
import { Link } from 'react-router-dom'


import Form from '../../components/Form';
import '../styles/table.css'

const { Title } = Typography

class Organizations extends Component {
    constructor(props) {
    super(props);
        this.orgForm = React.createRef();
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
                title: 'Action',
                key: 'action',
                align: 'right',
                render: (record) => (
                    <Dropdown overlay={
                        <Menu>
                            <Menu.Item danger>
                                <Popconfirm title="Sure to delete?" onConfirm={() => this.handleDelete(record.key)} >
                                    Delete
                                </Popconfirm>
                            </Menu.Item >
                            <Menu.Item onClick={()=>{this.getRecord(record)}}>Edit</Menu.Item>
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
                    name: 'One_LM',
                },
                {
                    key:2,
                    name: 'Org A',
                },
                {
                    key:3,
                    name: 'Org B',
                },
            ],
            openModal: false,
            editTimeoff:false,
            FormFields: {
                formId: 'org_form',
                FormCol: 24,
                FieldSpace:24,
                justifyField:'center',
                FormLayout:'vertical', 
                size: 'middle',
                fields:[
                    {
                        object:'obj', 
                        filedCol:8,
                        key: 'name',
                        label:'Name',
                        size: 'small',            
                        // rules:[{ required: true }],
                        type: 'input',
                        labelAlign: 'left',
                        itemStyle:{marginBottom:'10px'},

                    },
                    {
                        object:'obj', 
                        filedCol:8,
                        key: 'address',
                        label:'Address',
                        size: 'small',            
                        // rules:[{ required: true }],
                        type: 'input',
                        labelAlign: 'left',
                        itemStyle:{marginBottom:'10px'},

                    },
                    {
                        object:'obj', 
                        filedCol:8,
                        key: 'phone',
                        label:'Phone',
                        size: 'small',            
                        // rules:[{ required: true }],
                        type: 'input',
                        labelAlign: 'left',
                        itemStyle:{marginBottom:'10px'},

                    },
                    {
                        object:'obj', 
                        filedCol:8,
                        key: 'email',
                        label:'Email',
                        size: 'small',            
                        // rules:[{ required: true }],
                        type: 'input',
                        labelAlign: 'left',
                        itemStyle:{marginBottom:'10px'},

                    },
                    {
                        object:'obj', 
                        filedCol:8,
                        key: 'contactName',
                        label:'Contant Name',
                        size: 'small',            
                        // rules:[{ required: true }],
                        type: 'input',
                        labelAlign: 'left',
                        itemStyle:{marginBottom:'10px'},

                    },
                    {
                        object:'obj', 
                        filedCol:8,
                        key: 'contact_Name',
                        label:'Contact Mobile',
                        size: 'small',            
                        // rules:[{ required: true }],
                        type: 'input',
                        labelAlign: 'left',
                        itemStyle:{marginBottom:'10px'},

                    },
                    {
                        object:'obj', 
                        filedCol:8,
                        key: 'ABN',
                        label:'ABN',
                        size: 'small',            
                        // rules:[{ required: true }],
                        type: 'input',
                        labelAlign: 'left',
                        itemStyle:{marginBottom:'10px'},

                    },
                    {
                        object:'obj', 
                        filedCol:8,
                        key: 'Tax_Code',
                        label:'Tax Code',
                        size: 'small',            
                        // rules:[{ required: true }],
                        type: 'input',
                        labelAlign: 'left',
                        itemStyle:{marginBottom:'10px'},

                    },
                    {
                        object:'obj', 
                        filedCol:8,
                        key: 'EBA',
                        label:'Expected Business Amount',
                        size: 'small',            
                        // rules:[{ required: true }],
                        type: 'input',
                        labelAlign: 'left',
                        itemStyle:{marginBottom:'10px'},

                    },
                    {
                        object:'obj', 
                        filedCol:8,
                        key: 'CTI',
                        label:'Client Terms Info',
                        size: 'small',            
                        // rules:[{ required: true }],
                        type: 'input',
                        labelAlign: 'left',
                        itemStyle:{marginBottom:'10px'},

                    },
                    {
                        object:'obj', 
                        filedCol:8,
                        key: 'invoice_email',
                        label:'Invoice Email',
                        size: 'small',            
                        // rules:[{ required: true }],
                        type: 'input',
                        labelAlign: 'left',
                        itemStyle:{marginBottom:'10px'},

                    },
                    {
                        object:'obj', 
                        filedCol:8,
                        key: 'website',
                        label:'Website',
                        size: 'small',            
                        // rules:[{ required: true }],
                        type: 'input',
                        labelAlign: 'left',
                        itemStyle:{marginBottom:'10px'},

                    },
                    {
                        object:'obj', 
                        filedCol:8,
                        key: 'insurer_PI',
                        label:'Insurer PI',
                        size: 'small',            
                        // rules:[{ required: true }],
                        type: 'input',
                        labelAlign: 'left',
                        itemStyle:{marginBottom:'10px'},

                    },
                    {
                        object:'obj', 
                        filedCol:8,
                        key: 'insurer_PL',
                        label:'Insurer PL',
                        size: 'small',            
                        // rules:[{ required: true }],
                        type: 'input',
                        labelAlign: 'left',
                        itemStyle:{marginBottom:'10px'},

                    },
                    {
                        object:'obj', 
                        filedCol:8,
                        key: 'insurer_WC',
                        label:'Insurer WC',
                        size: 'small',            
                        // rules:[{ required: true }],
                        type: 'input',
                        labelAlign: 'left',
                        itemStyle:{marginBottom:'10px'},

                    },
                    {
                        object:'obj', 
                        filedCol:8,
                        key: 'policy_PI',
                        label:'Policy Number PI',
                        size: 'small',            
                        type: 'input',
                        labelAlign: 'left',
                        itemStyle:{marginBottom:'10px'},

                    },
                    {
                        object:'obj', 
                        filedCol:8,
                        key: 'policy_PL',
                        label:'Policy Number PL',
                        size: 'small',            
                        // rules:[{ required: true }],
                        type: 'input',
                        labelAlign: 'left',
                        itemStyle:{marginBottom:'10px'},

                    },
                    {
                        object:'obj', 
                        filedCol:8,
                        key: 'policy_WC',
                        label:'Policy Number WC',
                        size: 'small',            
                        // rules:[{ required: true }],
                        type: 'input',
                        labelAlign: 'left',
                        itemStyle:{marginBottom:'10px'},

                    },
                    {
                        object:'obj', 
                        filedCol:8,
                        key: 'Coverage_WC',
                        label:'Coverage WC',
                        size: 'small',            
                        // rules:[{ required: true }],
                        type: 'Select',
                        labelAlign: 'left',
                        itemStyle:{marginBottom:'10px'},

                    },
                    {
                        object:'obj', 
                        filedCol:8,
                        key: 'parent_id',
                        label:'Parent Organization',
                        size: 'small',            
                        // rules:[{ required: true }],
                        type: 'Select',
                        labelAlign: 'left',
                        itemStyle:{marginBottom:'10px'},

                    },
                    {
                        size: 'small', 
                        filedCol:8,           
                        type: 'Span',
                        labelAlign: 'right',
                        itemStyle:{marginBottom:'10px'},

                    },
                    {
                        Placeholder: 'Sum Insured:',
                        label:'.',
                        size: 'small',            
                        type: 'Span',
                        labelAlign: 'right',
                        itemStyle:{marginBottom:'10px'},

                    },
                    {
                        object:'obj', 
                        key: 'SumIns_PI',
                        label:'PI',
                        size: 'small',            
                        type: 'InputNumber',
                        labelAlign: 'left',
                        itemStyle:{marginBottom:'10px'},

                    },
                    {
                        object:'obj', 
                        filedCol:4,
                        key: 'SumIns_PL',
                        label:'PL',
                        size: 'small',            
                        // rules:[{ required: true }],
                        type: 'InputNumber',
                        labelAlign: 'left',
                        itemStyle:{marginBottom:'10px'},

                    },
                    {
                        Placeholder: 'Insurance Expiry:',
                        label:'.',
                        size: 'small',            
                        type: 'Span',
                        labelAlign: 'right',
                        itemStyle:{marginBottom:'10px'},

                    },
                    {
                        object:'obj', 
                        // filedCol:4,
                        key: 'expiry_PI',
                        label:'PI',
                        size: 'small',            
                        type: 'DatePicker',
                        labelAlign: 'left',
                        itemStyle:{marginBottom:'10px'},

                    },
                    {
                        object:'obj', 
                        // filedCol:4,
                        key: 'expiry_PL',
                        label:'PL',
                        size: 'small',            
                        // rules:[{ required: true }],
                        type: 'DatePicker',
                        labelAlign: 'left',
                        itemStyle:{marginBottom:'10px'},

                    },
                    {
                        object:'obj', 
                        // filedCol:4,
                        key: 'SumIns_Wc',
                        label:'Wc',
                        size: 'small',            
                        // rules:[{ required: true }],
                        type: 'DatePicker',
                        labelAlign: 'left',
                        itemStyle:{marginBottom:'10px'},

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
            this.orgForm.current.refs.org_form.resetFields(); // to reset file
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
            this.setState({
                data: [...this.state.data, vake.obj],
            }, () => {
                this.toggelModal(false)
                this.orgForm.current.refs.org_form.resetFields();
                console.log("Data Rendered");
            });
        }else{
            this.editRecord(vake.obj)
        }
    }

    getRecord = (data) => {
        console.log(data)
        this.setState({
            FormFields: {...this.state.FormFields, initialValues: {obj:data}},
            editTimeoff:data.key
        })
        
        this.toggelModal(true)
    }

    editRecord = (obj) => {
        obj.key =  this.state.editTimeoff
        this.state.data[obj.key - 1] = obj

        this.setState({
            data: [...this.state.data],
            mergeObj:{},
        },()=>{
            this.toggelModal(false)
        })
    }

    submit = () =>{
        this.orgForm.current.refs.org_form.submit();
    }

    render(){
        const data = this.state.data
        const columns = this.columns
        return(
            <>
                <Row justify="space-between">
                    <Col>
                        <Title level={4}>Organizations</Title>
                    </Col>
                    <Col style={{textAlign:'end'}} span={4} >
                        <Row justify="space-between">
                            <Col>
                                <Button type="default"size='small'> <FilterOutlined />Filter</Button>
                            </Col>
                            <Col>
                                <Button type="primary" onClick={()=>{this.toggelModal(true)}} size='small'> <PlusSquareOutlined />Organizations</Button>
                            </Col>
                        </Row>
                    </Col>
                    <Col span={24}>
                        <Table columns={columns} dataSource={data} size='small'/>
                    </Col>
                </Row>
                {this.state.openModal ? 
                    <Modal
                        title= {this.state.editTimeoff? 'Edit Organization' : "Add New Organization"}
                        centered
                        visible={this.state.openModal}
                        onOk={()=>{this.submit()}}
                        okText={this.state.editTimeoff? 'Edit' : 'Save'}
                        onCancel={()=>{this.toggelModal(false)}}
                        width={1200}
                    >
                        <Form ref={this.orgForm} Callback={this.Callback} FormFields= {this.state.FormFields} />   
                    </Modal> : null
                }
            </>
        )
    }
}

export default Organizations