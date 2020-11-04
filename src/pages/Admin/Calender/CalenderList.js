import React, {Component} from 'react'
import { Table, Menu, Dropdown, Button, Tag, Row, Col,Typography, Modal } from 'antd'
import { DownOutlined, SettingOutlined, PlusSquareOutlined} from '@ant-design/icons'; //Icons
import { Link } from 'react-router-dom'

import Form from '../../../components/Form';
import '../../styles/table.css'

// import { getList, addToList } from '../../../service/calender'

const { Title } = Typography


class CalenderList extends Component {
    constructor(props) {
        super(props);

        // this.calenderForm =  React.createRef();

        this.columns = [
            {
                title: 'Title',
                dataIndex: 'title',
                key: 'title',
            },
            {
                title: 'Status',
                dataIndex: 'status',
                key: 'status',
                align: 'right',
            render: status => (
                <> {
                    <Tag color={!status ? '#7d7b7b': 'green'} key={status}>
                        {status ? 'Enabled' : 'Disabled'}
                    </Tag>
                }</>
              ),
            },
            {
            title: 'Action',
            key: 'action',
            align: 'right',
            render: (record, text) => (
                    <Dropdown overlay={
                        <Menu>
                            <Menu.Item onClick={()=>this.getRecord(record, text)}>Edit</Menu.Item>
                            <Menu.Item >
                                <Link to={{ pathname: `/admin/calender/holidays/${record.key}`}} className="nav-link">
                                    Holidays
                                </Link>
                            </Menu.Item >
                        </Menu>
                    }>
                        <Button size='small' >
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
                    title: 'Standard',
                    status: true,
                },
                {
                    key: 2,
                    title: 'Muslims',
                    status: false,
                },
            ],
            calenderForm: React.createRef(),
            openModal: false,

            FormFields: {
                formId: 'calenderId',
                justify : 'center',
                FormCol: 20,
                FieldSpace: { xs: 12, sm: 16, md: 122},
                layout: {labelCol: { span: 12 }},
                justifyField:'center',
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
                        key: 'status',
                        label:'Status',
                        size:'small',
                        // rules:[{ required: true, message: 'Insert your Password Please' }],
                        type: 'Switch',
                        layout: {labelCol: { span: 4}},
                        labelAlign: 'left',
                        valuePropName: 'checked'
                        // hidden: false    
                    }
                ],
            }
        }
        
    }

    // componentDidMount=()=>{
    //     this.getAll()
    // }

    // getAll = () => { //creating API's
    //     getList().then(data => {
    //         console.log('calender')
    //         if(data.status !== 'success'){
    //             // localStorage.removeItem('usertoken')
    //             // this.props.history.push(`/login`)
    //         }else{
    //             this.setState(
    //                 {
    //                     data: [...data]
    //                 },() => {
    //                     console.log(this.state.items)
    //                 }
    //             )
    //         }
    //     })
    // }

    handleDelete =  (key) => {
        const dataSource = [...this.state.data];
        this.setState({ data: dataSource.filter(item => item.key !== key) });
    }

    toggelModal =(status)=>{
        this.setState({openModal:status})

        if (this.state.openModal){
            this.state.calenderForm.current.refs.calenderId.resetFields();// to reset file
            delete this.state.FormFields.initialValues // to delete intilize if not written    
            this.setState({  // set state
                FormFields: this.state.FormFields,
                editTimeoff:false 
            })
        }
    }

    getRecord = (data, text) => {
        this.setState({
            FormFields: {...this.state.FormFields, initialValues: {obj:data}},
            editTimeoff: data.key
        }, ()=>{
            this.toggelModal(true)

        })   

    }

    editRecord = (obj) =>{
        console.log(this.state.editTimeoff)
        obj.key =  this.state.editTimeoff
        this.state.data[obj.key - 1] = obj

        this.setState({
            data: [...this.state.data],
            mergeObj:{},
        },()=>{
            this.toggelModal(false)
        })
    }

    Callback =(vake)=>{ // this will work after I get the Object from the form
        if(!this.state.editTimeoff){
            vake.obj.key = this.state.data.length + 1 //frontEnd changes
            this.setState({
                data: [...this.state.data, vake.obj],
            }, () => {
                this.toggelModal(false)
                this.state.calenderForm.current.refs.calenderId.resetFields();
                console.log("Data Rendered");
            });
            // console.log(vake.obj)
            // addToList(vake.obj).then(() => {
            //     this.getAll() // refresh list
            // })
        }else{
            this.editRecord(vake.obj)
        }
    }

    submit = () =>{
        this.state.calenderForm.current.refs.calenderId.submit();
    }

    render(){
        const data = this.state.data
        const columns = this.columns
        return(
            <>
                <Row justify="space-between">
                    <Col >
                        <Title level={4}>Calenders</Title>
                    </Col>
                    <Col  style={{textAlign:'end'}}>
                        <Button type="primary" onClick={()=>{this.toggelModal(true)}} size='small'> <PlusSquareOutlined />Add Calender</Button>
                    </Col>
                    <Col span={24}>
                        <Table 
                            columns={columns} 
                            dataSource={data} 
                            size='small'
                        />
                    </Col>
                </Row>
                {this.state.openModal ? 
                    <Modal
                        title={this.state.editTimeoff? 'Edit Calender' : "Add New Calender" }
                        centered
                        visible={this.state.openModal}
                        onOk={()=>{this.submit()}}
                        okText={this.state.editTimeoff? 'Edit' : 'Save'}
                        onCancel={()=>{this.toggelModal(false)}}
                        width={600}
                    >
                        <Form  ref={this.state.calenderForm} Callback={this.Callback} FormFields= {this.state.FormFields} />   
                    </Modal>: null    //adding a commit
                    
                }
            </>
        )
    }
}

export default CalenderList