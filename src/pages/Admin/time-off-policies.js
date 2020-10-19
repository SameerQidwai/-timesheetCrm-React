import React, {Component} from 'react'
import { Table, Menu, Dropdown, Button, Popconfirm, Row, Col,Typography, Modal } from 'antd'
import { DownOutlined, SettingOutlined, PlusSquareOutlined, CloseOutlined} from '@ant-design/icons'; //Icons


import Form from '../../components/Form';
import '../styles/table.css'

const { Title } = Typography



class TimeOffsPolicy extends Component {
    constructor(props) {
    super(props);
        this.dynamoForm_1 = React.createRef();
        this.dynamoForm_2 = React.createRef();

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
                            <Menu.Item>Edit</Menu.Item>
                        </Menu>
                    }>
                        <Button size="small">
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
                    title: 'Standards',
                },
                {
                    key: 2,
                    title: 'Executives',
                },
            ],
            openModal: false,
            mergeObj: {
            },
            form1Submitted: false,
            form2Submitted: false,
        }

        this.FormFields = {
            formId: 'title_form',
            justify : 'center',
            FormCol: 24,
            FieldSpace: { xs: 12, sm: 16, md: 12},
            layout: {labelCol: { span: 8 }},
            justifyField:'center',
            FormLayout:'inline', 
            size: 'small',
            fields:[
                { 
                    object:'obj',
                    filedCol:24,
                    layout:  { wrapperCol: { span: 22 } },
                    key: 'title',
                    label:'Title',
                    size:'small',
                    // rules:[{ required: true }],
                    type: 'input',
                    labelAlign: 'left',
                    formStyle:{ marginBottom:'5px' }
                },
                {
                    filedCol:24,         
                    layout:  { wrapperCol: { span: 0 }},
                    Placeholder: 'Insert Time Off',
                    type: 'Button',
                    mode: 'primary',
                    style: {textAlign:'right'},
                    size:'small',
                    func: function func (value, e){
                        let obj = this.FormFields_1.fields[this.FormFields_1.fields.length-1]// get the inster number for keys
                        const item_no = obj ? parseInt(obj.key) + 1 :0
                        const splice_key = [`timeoff${item_no}`, `hours${item_no}`, item_no] 
                        const fields=[
                            { 
                                object:'obj',
                                filedCol:11,
                                layout:  { wrapperCol: { span: 23 } },
                                key: `timeoff${item_no}`,
                                size:'small',
                                // rules:[{ required: true }],
                                type: 'Select',
                                labelAlign: 'left',
                                formStyle:{ marginBottom:'5px' },
                                data:[{value:'Sick Leave',label:'Sick Leave'}, {value:'Vacations',label:'Vacations'},{ value:'Traning',label:'Traning'}],
                            },
                            { 
                                object:'obj',
                                filedCol:5,
                                layout:  { wrapperCol: { span: 20, offset:2} },
                                key: `hours${item_no}`,
                                size:'small',
                                // rules:[{ required: true }],
                                type: 'InputNumber',
                                labelAlign: 'left',
                                formStyle:{ marginBottom:'5px' }
                            },
                            { 
                                filedCol:3,
                                size:'small',
                                Placeholder:<CloseOutlined />,
                                key: item_no,
                                // rules:[{ required: true }],
                                type: 'Span',
                                style: {
                                    textAlign:'right',
                                },
                                fieldStyle:{
                                    cursor:'pointer'
                                },
                                func: function func (value, e){
                                    this.FormFields_1.fields = this.FormFields_1.fields.filter(obj => {
                                        return obj.key != splice_key[0] && obj.key != splice_key[1] && obj.key != splice_key[2];
                                    });
                                    this.forceUpdate()
                                }.bind(this)
                            }
                        ]
                        for (const field of fields) {
                            // this.dynamoForm_2.current.props.FormFields.fields.push(field)
                            this.FormFields_1.fields.push(field)
                        }
    
                        this.forceUpdate()
                    }.bind(this)
                },
                {
                    filedCol:11,
                    Placeholder: 'Time Off',
                    type: 'Span',
                    size:'small',
                },
                {
                    filedCol:11,
                    layout:  {
                        wrapperCol: { offset:1}
                    },
                    Placeholder: 'Hours',
                    type: 'Span',
                    size:'small',
                },
            ],
        }

        this.FormFields_1 = {
            formId: 'hours_form',
            justify : 'center',
            FormCol: 24,
            FieldSpace: { xs: 12, sm: 16, md: 12},
            layout: {labelCol: { span: 12 }},
            justifyField:'center',
            FormLayout:'inline', 
            size: 'small',
            backstyle: {maxHeight:'100px',overflowY: 'auto'},
            fields:[
                { 
                    object:'obj',
                    filedCol:11,
                    layout:  { wrapperCol: { span: 23 } },
                    key: 'timeoff0',
                    size:'small',
                    // rules:[{ required: true }],
                    type: 'Select',
                    labelAlign: 'left',
                    formStyle:{ marginBottom:'5px' },
                    data:[{value:'Sick Leave',label:'Sick Leave'}, {value:'Vacations',label:'Vacations'},{ value:'Traning',label:'Traning'}],
                },
                { 
                    object:'obj',
                    filedCol:5,
                    layout:  { wrapperCol: { span: 20, offset:2} },
                    key: 'hours0',
                    size:'small',
                    // rules:[{ required: true }],
                    type: 'InputNumber',
                    labelAlign: 'left',
                    formStyle:{ marginBottom:'5px' }
                },
                { 
                    filedCol:3,
                    size:'small',
                    Placeholder:<CloseOutlined />,
                    key: 0,
                    // rules:[{ required: true }],
                    type: 'Span',
                    style: {
                        textAlign:'right',
                    },
                    fieldStyle:{
                        cursor:'pointer'
                    },
                    func: function func (value, e){
                        this.FormFields_1.fields = this.FormFields_1.fields.filter(obj => {
                            return obj.key != 'timeoff0' && obj.key != 'hours0' && obj.key != 0;
                        });
                        this.forceUpdate()
                    }.bind(this)
                },
            ],
        }
    }

    handleDelete =  (key)=>{
        const dataSource = [...this.state.data];
        this.setState({ data: dataSource.filter(item => item.key !== key) });
    }
    
    toggelModal =(status)=>{
        this.setState({openModal:status})
        if (this.state.openModal){
            this.dynamoForm_1.current.refs.title_form.resetFields()
            this.dynamoForm_2.current.refs.hours_form.resetFields()
        }
    }

    Callback =(vake)=>{ // this will work after I get the Object from the form
        this.setState({
            mergeObj: {
                ...this.state.mergeObj,
                title: vake.obj.title,
                key: this.state.data.length + 1
            },
            form1Submitted: true,
        }, () => {
            if(this.state.form1Submitted && this.state.form2Submitted) {
                this.renderTable();
            }
        })
    }

    Callback2 =(vake)=>{ // this will work after I get the Object from the form
        this.setState({
            mergeObj: {
                ...this.state.mergeObj,
                offs: [vake.obj]
            },
            form2Submitted: true,
        }, () => {
            if(this.state.form1Submitted && this.state.form2Submitted) {
                this.renderTable();
            }
        });
    }

    submit = () =>{
        this.dynamoForm_1.current.refs.title_form.submit();
        this.dynamoForm_2.current.refs.hours_form.submit();
    }

    renderTable = () => {
        this.setState({
            data: [...this.state.data, this.state.mergeObj],
            mergeObj: {},
        }, () => {
            this.toggelModal(false)
            console.log("Data Rendered");
        });

    }
    
    render(){
        const data = this.state.data
        const columns = this.columns
        return (
            <>
                <Row justify="space-between">
                    <Col >
                        <Title level={4}>Time Off Policies </Title>
                    </Col>
                    <Col style={{textAlign:'end'}}>
                        <Button type="primary" onClick={() => { this.toggelModal(true) }} size="small"> <PlusSquareOutlined />Add Time Off Policy</Button>
                    </Col>
                    <Col span={24}>
                        <Table columns={columns} dataSource={data} size="small"/>
                    </Col>
                </Row>
                <Modal
                    title="Add Time Off Policy"
                    centered
                    visible={this.state.openModal}
                    onOk={() => { this.submit() }}
                    onCancel={() => { this.toggelModal(false) }}
                    width={600}
                >
                    <Form ref={this.dynamoForm_1} Callback = {this.Callback} FormFields={this.FormFields} />
                    <Form ref={this.dynamoForm_2} Callback = {this.Callback2} FormFields={this.FormFields_1} />
                </Modal>
            </>
        )
    }
}

export default TimeOffsPolicy