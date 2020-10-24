import React, { Component } from 'react'
import {Row, Col, Typography, Button, Table, Menu, Dropdown, Popconfirm, Modal} from 'antd'
import { DownOutlined, SettingOutlined, PlusSquareOutlined, CloseOutlined} from '@ant-design/icons'; //Icons

import Form from '../../../components/Form';

const { Title } = Typography


class PanelInfo extends Component {
    constructor(props) {
        super(props);
        this.dynamoForm_1 = React.createRef();
        this.dynamoForm_2 = React.createRef();

        this.columns = [
            {
                title: 'Skill',
                dataIndex: 'skill',
                key: 'skill',
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
                            <Menu.Item onClick={()=>this.getRecord(record)}>
                                View
                            </Menu.Item>
                        </Menu>
                    }>
                        <Button  size="small">
                            <SettingOutlined/> Option <DownOutlined/>
                        </Button>
                    </Dropdown>  
                ),
            },
        ];

        this.skill_select =[
            {value:'Ux Developer',label:'Ux Developer'},
            {value:'UI developer',label:'UI developer'},
            {value:'Front developer',label:'Front developer'},
            {value:'Back developer',label:'Back developer'},
            {value:'Producer',label:'Producer'},
            {value:'Director',label:'Director'},
            {value:'Actors',label:'Actors'},
            {value:'Camera Man',label:'Camera Man'},
            {value:'civil Engineer',label:'civil Engineer'},
            {value:'Labour',label:'Labour'},
            {value:'Stuff',label:'Stuff'},
        ]

        this.state = {
            openModal:false,

            data1:[
                {
                    key:1,
                    skill: 'Ux Developer',
                    levels: {
                        level0: 'Beginner', pirority0: 1, stceil0: 11, ltceil0: 12,
                        level1: 'Intermediate Class 1', pirority1: 2, stceil1: 11, ltceil1: 12,
                        level2: 'Intermediate Class 2', pirority2: 1, stceil2: 11, ltceil2: 12,
                        level3: 'Intermediate Class 3', pirority3: 3, stceil3: 11, ltceil3: 12,
                        level4: 'Expert', pirority4: 3, stceil4: 11, ltceil4: 12,
                    }
                },
                {
                    key:2,
                    skill: 'UI developer',
                    levels: {
                        level0: 'Beginner', pirority0: 1, stceil0: 11, ltceil0: 12,
                        level1: 'Intermediate Class 1', pirority1: 2, stceil1: 11, ltceil1: 12,
                        level2: 'Expert', pirority2: 3, stceil2: 11, ltceil2: 12,
                    }
                },
                {
                    key:3,
                    skill: 'Front developer',
                    levels: {
                        level0: 'Beginner', pirority0: 1, stceil0: 11, ltceil0: 12,
                    }
                },
                {
                    key:4,
                    skill: 'back developer',
                    levels: {
                        level0: 'Expert', pirority0: 3, stceil0: 11, ltceil0: 12,
                    }
                },
            ],
            data2: [
                {
                    key:1,
                    skill: 'Producer',
                    levels: {
                        level0: 'Beginner', pirority0: 1, stceil0: 11, ltceil0: 12,
                        level1: 'Intermediate Class 1', pirority1: 2, stceil1: 11, ltceil1: 12,
                        level2: 'Intermediate Class 2', pirority2: 1, stceil2: 11, ltceil2: 12,
                        level3: 'Intermediate Class 3', pirority3: 3, stceil3: 11, ltceil3: 12,
                        level4: 'Expert', pirority4: 3, stceil4: 11, ltceil4: 12,
                    }
                },
                {
                    key:2,
                    skill: 'Director',
                    levels: {
                        level0: 'Beginner', pirority0: 1, stceil0: 11, ltceil0: 12,
                        level1: 'Intermediate Class 1', pirority1: 2, stceil1: 11, ltceil1: 12,
                        level2: 'Intermediate Class 2', pirority2: 1, stceil2: 11, ltceil2: 12,
                        level3: 'Expert', pirority3: 3, stceil3: 11, ltceil3: 12,
                    }
                },
                {
                    key:3,
                    skill: 'Actors',
                    levels: {
                        level0: 'Beginner', pirority0: 1, stceil0: 11, ltceil0: 12,
                        level1: 'Intermediate ', pirority1: 2, stceil1: 11, ltceil1: 12,
                        level2: 'Expert', pirority2: 3, stceil2: 11, ltceil2: 12,
                    }
                },
                {
                    key:4,
                    skill: 'Camera Man',
                    levels: {
                        
                        level0: 'Intermediate Class 2', pirority0: 1, stceil0: 11, ltceil0: 12,
                    }
                },
            ],
            data3: [
                {
                    key:1,
                    skill: 'civil Engineer',
                    levels: {
                        level0: 'Beginner', pirority0: 1, stceil0: 11, ltceil0: 12,
                        level1: 'Expert', pirority1: 3, stceil1: 11, ltceil1: 12,
                    }
                },
                {
                    key:2,
                    skill: 'Technician',
                    levels: {
                        level0: 'Beginner', pirority0: 1, stceil0: 11, ltceil0: 12,
                        level1: 'Intermediate Class 1', pirority1: 2, stceil1: 11, ltceil1: 12,
                        level2: 'Intermediate Class 2', pirority2: 1, stceil2: 11, ltceil2: 12,
                    }
                },
                {
                    key:3,
                    skill: 'Labour',
                    levels: {
                        level0: 'Beginner', pirority0: 1, stceil0: 11, ltceil0: 12,
                    }
                },
                {
                    key:4,
                    skill: 'Stuff',
                    levels: {
                        level0: 'Expert', pirority0: 3, stceil0: 11, ltceil0: 12,
                    }
                },
            ],
            data: [],

            mergeObj: {},
            form1Submitted: false,
            form2Submitted: false,
            
            FormFields: {
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
                        key: 'skill',
                        label:'Skill',
                        size:'small',
                        rules:[{ required: true, message:'You are not good to go' }],
                        type: 'Select',
                        data:this.skill_select,
                        labelAlign: 'left',
                        formStyle:{ marginBottom:'5px' }
                    },
                    {
                        filedCol:24,         
                        layout:  { wrapperCol: { span: 0 }},
                        Placeholder: 'Add Level',
                        type: 'Button',
                        mode: 'primary',
                        style: {textAlign:'right'},
                        size:'small',
                        formStyle:{ marginBottom:'10px' },
                        func: function func (value, e){
                            let obj = this.state.FormFields_1.fields[this.state.FormFields_1.fields.length-1]// get the inster number for keys
                            console.log(obj)
                            const item_no = obj ? parseInt(obj.key) +1:0
                            this.state.FormFields_1.fields = this.state.FormFields_1.fields.concat(...this.newField(item_no));
                            this.setState({
                                FormFields_1: this.state.FormFields_1
                            })
                        }.bind(this)
                    },
                    {
                        filedCol:8,
                        Placeholder: 'Level',
                        type: 'Span',
                        size:'small',
                    },
                    {
                        filedCol:5,
                        layout:  {
                            wrapperCol: { offset:1}
                        },
                        Placeholder: 'Pirority',
                        type: 'Span',
                        size:'small',
                    },
                    {
                        filedCol:5,
                        layout:  {
                            wrapperCol: { offset:1}
                        },
                        Placeholder: 'ST Ceil',
                        type: 'Span',
                        size:'small',
                    },
                    {
                        filedCol:5,
                        layout:  {
                            wrapperCol: { offset:1}
                        },
                        Placeholder: 'LT Ceil',
                        type: 'Span',
                        size:'small',
                    },
                ],
            },

            FormFields_1: {
                formId: 'hours_form',
                justify : 'center',
                FormCol: 24,
                // FieldSpace: { xs: 12, sm: 16, md: 12},
                // layout: {labelCol: { span: 12 }},
                justifyField:'center',
                FormLayout:'inline', 
                size: 'small',
                backstyle: {maxHeight:'145px',overflowY: 'auto'},
                fields: this.newField(0)
            },
            editTimeoff: false,
        }
    }

    componentDidMount(){
        var { id } = this.props.match.params
        console.log(typeof id)
        switch (id) {
            case '1' :
                this.setState({ data: this.state.data1 });
                break;
            case '2' :
                this.setState({ data: this.state.data2 });
                break;
            default:
                this.setState({ data: this.state.data3 });
                break;
        }
    }

    newField = (item_no) =>{ //inserting new fields in modals
        const splice_key = [`level${item_no}`, `pirority${item_no}`, `stceil${item_no}`, `ltceil${item_no}`, item_no] 
        return [
            { 
                object:'obj',
                filedCol:8,
                layout:  { wrapperCol: { span: 23 } },
                key: `level${item_no}`,
                size:'small',
                // rules:[{ required: true }],
                type: 'Input',
                labelAlign: 'left',
                formStyle:{ marginBottom:'5px' },
            },
            { 
                object:'obj',
                filedCol:5,
                layout:  { wrapperCol: { span: 20} },
                key: `pirority${item_no}`,
                size:'small',
                // rules:[{ required: true }],
                type: 'InputNumber',
                labelAlign: 'left',
                formStyle:{ marginBottom:'5px' }
            },
            { 
                object:'obj',
                filedCol:5,
                layout:  { wrapperCol: { span: 24} },
                key: `stceil${item_no}`,
                size:'small',
                // rules:[{ required: true }],
                type: 'InputNumber',
                labelAlign: 'left',
                formStyle:{ marginBottom:'5px' }
            },
            { 
                object:'obj',
                filedCol:5,
                layout:  { wrapperCol: { span: 24} },
                key: `ltceil${item_no}`,
                size:'small',
                // rules:[{ required: true }],
                type: 'InputNumber',
                labelAlign: 'left',
                formStyle:{ marginBottom:'5px' }
            },
            { 
                filedCol:1,
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

                    this.state.FormFields_1.fields = this.state.FormFields_1.fields.filter(obj => {
                        return obj.key !== splice_key[0] && obj.key !== splice_key[1] && obj.key !== splice_key[2] && obj.key !== splice_key[3] && obj.key !== splice_key[4];
                    });

                    this.setState({
                        FormFields_1 : this.state.FormFields_1
                    })
                }.bind(this)
            }
        ]
    }

    handleDelete =  (key)=>{
        const dataSource = [...this.state.data];
        this.setState({ data:  dataSource.filter(item => item.key !== key)
        });
    }

    toggelModal =(status)=>{
        this.setState({
            openModal:status
        })

        if (this.state.openModal){
            
            this.dynamoForm_1.current.refs.title_form.resetFields();
            this.dynamoForm_2.current.refs.hours_form.resetFields();
    
            delete this.state.FormFields.initialValues
            delete this.state.FormFields_1.initialValues
            this.state.FormFields_1.fields = this.newField(0)

            this.setState({
                FormFields: this.state.FormFields,
                FormFields_1: this.state.FormFields_1,
                editTimeoff:false
            })
        }
    }

    getRecord = (data, text) => {
        console.log(data)
        let result = Object.keys(data.levels).length/4;
        for (let i=1 ;i<result; i++){
            this.state.FormFields_1.fields = this.state.FormFields_1.fields.concat(this.newField(i))
        }
        
        var obj = {key: data.key, skill:data.skill}
        this.setState({
            FormFields: {...this.state.FormFields, initialValues: {obj:obj}},
            FormFields_1: {...this.state.FormFields_1, initialValues:{obj: data.levels}},
            editTimeoff: data.key
            
        },()=>{
            this.toggelModal(true)
        })
    }

    editRecord = () =>{
        this.state.mergeObj.key =  this.state.editTimeoff
        this.state.data[this.state.editTimeoff-1] = this.state.mergeObj 
        this.setState({
            data: [...this.state.data],
            mergeObj:{}
        },()=>{
            this.toggelModal(false)
        })
    }

    Callback =(vake)=>{ // this will work after I get the Object from the form
        this.setState({
            mergeObj: {
                ...this.state.mergeObj,
                skill: vake.obj.skill,
                // key: vake.obj.key? vake.obj.key:this.state.data.length + 1
            },
            form1Submitted: true,
        }, () => {
            if(this.state.form1Submitted && this.state.form2Submitted) {
                if(!this.state.editTimeoff){
                    console.log('emes')
                    this.renderTable();
                }else{
                    console.log('edit')
                    this.editRecord()
                }
            }
        })
    }

    Callback2 =(vake)=>{ // this will work after I get the Object from the form
        this.setState({
            mergeObj: {
                ...this.state.mergeObj,
                levels: vake.obj
            },
            form2Submitted: true,
        }, () => {
            if(this.state.form1Submitted && this.state.form2Submitted) {
                if(!this.state.editTimeoff){
                    console.log('emes')
                    this.renderTable();
                }else{
                    console.log('edit')
                    this.editRecord()
                }
            }
        });
    }

    renderTable = () => {
        this.state.mergeObj.key = this.state.data[this.state.data.length-1].key+1
        this.state.data.push(this.state.mergeObj)
        console.log(this.state.data)
        this.setState({
            data: [...this.state.data],
            mergeObj: {},
        }, () => {
            this.toggelModal(false)
            console.log(this.state.data)
            console.log("Data Rendered");
        });
    }

    submit = () =>{ 
        this.dynamoForm_1.current.refs.title_form.submit();
        this.dynamoForm_2.current.refs.hours_form.submit();
    }

    render(){
        const skills = this.state.data
        return (
            <>
                <Row justify="space-between">
                    <Col>
                        <Title level={4}>Panel Information</Title>
                    </Col>
                    <Col style={{textAlign:'end'}}>
                        <Button type="primary" onClick={()=>{this.toggelModal(true)}} size="small"> <PlusSquareOutlined />Add Skill</Button>
                    </Col>
                </Row>
                <Table columns={this.columns} dataSource={skills} size="small"/>
                {this.state.openModal?
                    <Modal
                        title="Skill"
                        centered
                        visible={this.state.openModal}
                        onOk={()=>{this.submit()}}
                        okText={this.state.editTimeoff? 'Edit' : 'Save'}
                        onCancel={()=>{this.toggelModal(false)}}
                        width={650}
                    >
                        <Form ref={this.dynamoForm_1} Callback = {this.Callback} FormFields={this.state.FormFields} />
                        <Form ref={this.dynamoForm_2} Callback = {this.Callback2} FormFields={this.state.FormFields_1} />                    </Modal>:null
                }
            </>
        );
    }
}

export default PanelInfo