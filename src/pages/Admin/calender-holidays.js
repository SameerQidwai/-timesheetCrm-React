import React, {Component} from 'react'
import { Table, Menu, Dropdown, Button, Popconfirm, Row, Col,Typography, Modal } from 'antd'
import { DownOutlined, SettingOutlined, PlusSquareOutlined} from '@ant-design/icons'; //Icons

import Form from '../../components/Form';
import moment from 'moment'
import '../styles/table.css'

const { Title } = Typography

const FormFields = {
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
        {
            object:'obj',
            filedCol:20,
            key: 'date',
            label:'Date',
            size:'small',
            // rules:[{ required: true, message: 'Insert your Password Please' }],
            type: 'DatePicker',
            layout: {labelCol: { span: 4}},
            labelAlign: 'left',
            // hidden: false    
        }
    ]
}

class CalenerHolidays extends Component {

    componentDidMount(){
        var query = this.props.location.query
        if (query=='1'){
            this.setState({ data: this.state.data1 });
        }else{
            this.setState({ data: this.state.data2 });
        }

    }
    constructor(props) {
    super(props);
        this.holidayForm = React.createRef();
        this.columns = [
            {
                title: 'Title',
                dataIndex: 'title',
                key: 'title',
            },
            {
                title: 'Date',
                dataIndex: 'date',
                key: 'date',
                align: 'right'
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
                        <Button size='small'>
                            <SettingOutlined/> Option <DownOutlined/>
                        </Button>
                    </Dropdown>  
                ),
            },
        ];

        this.state = {
            data1 : [
                {
                    key: '1',
                    title: 'Easter',
                    date: '12-Apr-2020',
                },
                {
                    key: '2',
                    title: 'Labour Day',
                    date: '01-May-2020',
                },
                {
                    key: '3',
                    title: 'Chirstmas',
                    date: '25-Dec-2020',
                },
            ],
            data2 : [
                {
                    key: '1',
                    title: 'Eid-ul-fiter',
                    date: '13-May-2020',
                },
                {
                    key: '2',
                    title: 'Eid-ul-azha',
                    date: '12-jul-2020',
                },
            ],
            data: null,
            openModal: false
        }

        this.FormFields = {
            formId: 'form',
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
                {
                    object:'obj',
                    filedCol:20,
                    key: 'date',
                    label:'Date',
                    size:'small',
                    // rules:[{ required: true, message: 'Insert your Password Please' }],
                    type: 'DatePicker',
                    layout: {labelCol: { span: 4}},
                    labelAlign: 'left',
                    // hidden: false    
                }
            ]
        }
    }

    handleDelete =  (key)=>{
        const dataSource = [...this.state.data];
        this.setState({ data: dataSource.filter(item => item.key !== key) });
    }

    toggelModal =(status)=>{
        this.holidayForm.current.refs.form.resetFields();
        this.setState({openModal:status})
    }

    Callback =(vake)=>{ // this will work after I get the Object
        vake.obj.date = moment(vake.obj.date).format('DD-MMM-YYYY')
        this.setState({
            data: [...this.state.data, vake.obj],
        }, () => {
            this.toggelModal(false)
            // this.holidayForm.current.refs.form.resetFields();
            console.log("Data Rendered");
        });
    }

    editRecord = (data) => {
        console.log(data)
        const obj = Object.assign({}, data);
        obj.date = moment(obj.date)
        this.FormFields.initialValues={obj:obj}
        this.forceUpdate()
        this.toggelModal(true)
    }
    
    submit = () =>{
        this.holidayForm.current.refs.form.submit();
    }

    render(){
        const data = this.state.data
        const columns = this.columns
        return(
            <>
                <Row justify="space-between">
                    <Col >
                        <Title level={4}>Holidays</Title>
                    </Col>
                    <Col style={{textAlign:'end'}}>
                        <Button type="primary" size='small' onClick={()=>{this.toggelModal(true)}}> <PlusSquareOutlined /> Add Holiday</Button>
                    </Col>
                    <Col span={24}>
                        <Table columns={columns} dataSource={data} size='small'/>
                    </Col>
                </Row>
                <Modal
                    title="Add Holiday"
                    centered
                    visible={this.state.openModal}
                    onOk={()=>{this.submit()}}
                    onCancel={()=>{this.toggelModal(false)}}
                    width={600}
                >
                    <Form 
                        ref={this.holidayForm}
                        Callback = {this.Callback} 
                        FormFields= {this.FormFields} 
                    />   
                </Modal>
            </>
        )
    }
}

export default CalenerHolidays