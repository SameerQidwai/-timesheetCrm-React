import React, { Component } from 'react'
import { Typography, Row, Col, Popconfirm, Modal, Button, Table, Dropdown, Menu} from 'antd'
import { SettingOutlined, DownOutlined, CloseOutlined} from '@ant-design/icons'; //Icons
import Forms from '../../../components/Form'
const {Title} = Typography

class Skills extends Component {
    constructor (){
        super()
        this.skillForm = React.createRef();
        this.levelForm = React.createRef();
        this.columns = [
            {
                title: 'Skill Name',
                dataIndex: 'skill',
                key: 'skill',
            },
            {
            title: 'Action',
            key: 'action',
            align: 'right',
            render: (record, text) => (
                    <Dropdown overlay={
                        <Menu>
                            <Menu.Item >
                                <Popconfirm title="Sure to delete?" onConfirm={() => this.handleDelete(record.key)}>
                                    Delete
                                </Popconfirm>
                            </Menu.Item >
                            <Menu.Item onClick={()=>this.getRecord(record, text)}>Edit</Menu.Item>
                        </Menu>
                    }>
                        <Button size='small' >
                            <SettingOutlined/> Option <DownOutlined/>
                        </Button>
                    </Dropdown>  
                ),
            },
        ]

        this.priority_data = [
            {
                key:1,
                value: 1,
            },
            {
                key:2,
                value: 2,
            },
            {
                key:3,
                value: 3,
            },
            {
                key:4,
                value: 4,
            },
            {
                key:5,
                value: 5,
            }
        ]

        this.level_data = [
            {
                key:1,
                value: 'Superstar',
            },
            {
                key:2,
                value: 'Senior',
            },
            {
                key:3,
                value: 'Middle',
            },
            {
                key:4,
                value: 'Junior',
            },
            {
                key:5,
                value: 'Trainee',
            }
        ]

        this.state = {
            isVisible: false,
            isLevel:false,
            editSkill:false,
            mergeObj: {},
            formSubmitted: false,
            levelSubmitted: false,
            data_skill:[
                {
                    key:1,
                    skill: 'Developer',
                },
                {
                    key:2,
                    skill: 'Accountant',
                },
                {
                    key:3,
                    skill: 'Carpenter',
                },
                {
                    key:4,
                    skill: 'Software Quality Assurance',
                },
                {
                    key:5,
                    skill: 'Office Boy',
                }
            ],
            skillFields: {
                formId: 'skill_form',
                FormCol: 24,
                FieldSpace: { xs: 12, sm: 16, md: 12},
                layout: {labelCol: { span: 4 }},
                justifyField:'center',
                FormLayout:'inline', 
                size: 'small',
                fields:[
                    { 
                        object:'obj',
                        filedCol:24,
                        layout:  { wrapperCol: { span: 20 } },
                        key: 'skill',
                        label:'Name',
                        size:'small',
                        // rules:[{ required: true, message:'You are not good to go' }],
                        type: 'Input',
                        labelAlign: 'left',
                        itemStyle:{ marginBottom:'5px' }
                    },
                    {
                        filedCol:24,         
                        Placeholder: 'Add Level',
                        type: 'Button',
                        mode: 'primary',
                        style: {textAlign:'right'},
                        size:'small',
                        itemStyle:{ marginBottom:'10px' },
                        func: function func (value, e){
                            let obj = this.state.LevelFields.fields[this.state.LevelFields.fields.length-1]// get the inster number for keys
                            const item_no = obj ? parseInt(obj.key) +1 : 0
                            this.state.LevelFields.fields = this.state.LevelFields.fields.concat(...this.newField(item_no));
                            this.setState({
                                LevelFields: this.state.LevelFields
                            })
                        }.bind(this)
                    },
                    {
                        filedCol:15,
                        Placeholder: 'Level Name',
                        type: 'Span',
                        size:'small',
                    },
                    {
                        filedCol:7,
                        layout:  {
                            wrapperCol: { offset:1}
                        },
                        Placeholder: 'Pirority',
                        type: 'Span',
                        size:'small',
                    },
                ],
            },
            LevelFields: {
                formId: 'level_form',
                FormCol: 24,
                // FieldSpace: { xs: 12, sm: 16, md: 12},
                // layout: {labelCol: { span: 12 }},
                justifyField:'center',
                FormLayout:'inline', 
                size: 'small',
                fields: this.newField(0)
            },
        }
    }

    newField = (item_no) =>{ //inserting new fields in modals
        const splice_key = [`level${item_no}`, `pirority${item_no}`, item_no] 
        return [
            { 
                object: 'obj',
                filedCol: 15,
                layout:  { wrapperCol: { span: 23 } },
                key: `level${item_no}`,
                size: 'small',
                // rules:[{ required: true }],
                data: this.level_data,
                type: 'Select',
                labelAlign: 'left',
                itemStyle:{ marginBottom:'5px' },
            },
            { 
                object:'obj',
                filedCol: 7,
                layout: { wrapperCol: { span: 20} },
                key: `pirority${item_no}`,
                size:'small',
                // rules:[{ required: true }],
                data: this.priority_data,
                type: 'Select',
                labelAlign: 'left',
                itemStyle:{ marginBottom:'5px' }
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

                    this.state.LevelFields.fields = this.state.LevelFields.fields.filter(obj => {
                        return obj.key !== splice_key[0] && obj.key !== splice_key[1] && obj.key !== splice_key[2] && obj.key !== splice_key[3] && obj.key !== splice_key[4];
                    });

                    this.setState({
                        LevelFields : this.state.LevelFields
                    })
                }.bind(this)
            }
        ]
    }

    handleDelete =  (key)=>{
        this.setState({ data: this.state.data_skill.filter(item => item.key !== key) });
    }

    submit = () =>{
        this.skillForm.current.refs.skill_form.submit();
        this.levelForm.current.refs.level_form.submit();
    }

    skillCall =(vake)=>{ // this will work after I get the Object from the form
        this.setState({
            mergeObj: {
                ...this.state.mergeObj,
                skill: vake.obj.skill,
                // key: vake.obj.key? vake.obj.key:this.state.data.length + 1
            },
            form1Submitted: true,
        }, () => {
            if(this.state.form1Submitted && this.state.form2Submitted) {
                if(!this.state.editSkill){
                    console.log('emes')
                    this.addSkill(this.state.mergeObj);
                }else{
                    console.log('edit')
                    this.editRecord(this.state.mergeObj)
                }
            }
        })
    }

    levelCall =(vake)=>{ // this will work after I get the Object from the form
        this.setState({
            mergeObj: {
                ...this.state.mergeObj,
                levels: vake.obj
            },
            form2Submitted: true,
        }, () => {
            if(this.state.form1Submitted && this.state.form2Submitted) {
                if(!this.state.editSkill){
                    console.log('emes')
                    this.addSkill(this.state.mergeObj);
                }else{
                    console.log('edit')
                    this.editRecord(this.state.mergeObj)
                }
            }
        });
    }

    addSkill = (value)=>{
        value.key = this.state.data_skill[this.state.data_skill.length-1].key+1
        this.setState({
            data_skill: [...this.state.data_skill, value],
            isVisible: false,
        },()=>{
            this.onCancel()
        })
    }

    getRecord = (data) => {

        let result = data.levels? Object.keys(data.levels).length/2 : 0

        for (let i=1 ;i<result; i++){
            this.state.LevelFields.fields = this.state.LevelFields.fields.concat(this.newField(i))
        }

        var obj = {key: data.key, skill:data.skill}

        this.setState({
            skillFields: {...this.state.skillFields, initialValues: {obj:obj}},
            LevelFields: {...this.state.LevelFields, initialValues:{obj: data.levels}},
            editSkill: data.key,
            isVisible:true
        },()=>{
            console.log(this.state.editSkill)
        })
    }
    
    editRecord = (value) =>{
        value.key =  this.state.editSkill
        this.state.data_skill[value.key-1] = value

        this.setState({
            data_skill: [...this.state.data_skill],
        },()=>{
            this.onCancel()
        })
    }

    onCancel = () =>{
        delete this.state.skillFields.initialValues // delete initialValues of fields on close
        delete this.state.LevelFields.initialValues
        this.setState({ 
            isVisible: false,  //close
            skillFields: {...this.state.skillFields}, //delete Formfields on Close
            LevelFields: {
                ...this.state.LevelFields,
                fields: this.newField(0)
            },
            editSkill:false,
            isVisible:false,
         });
    }

    render(){
        const { data_skill } = this.state
        return (
            <>
                <Row justify="space-between">
                    <Col>
                        <Title level={3}>
                            Standard Skills
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
                <Table columns={this.columns} dataSource={data_skill} size="small"/>
                { this.state.isVisible &&
                    <Modal
                        title={this.state.editSkill ? 'Edit Skill': 'Add Skill'}
                        centered
                        visible={this.state.isVisible}
                        okText={this.state.editSkill ? 'Edit': 'Save'}
                        width={400}
                        onCancel={() => {this.onCancel()}}
                        onOk={() => {
                            this.submit();
                        }}
                    >
                        <Row justify="center">
                        <Forms
                            ref={this.skillForm}
                            Callback={this.skillCall}
                            FormFields={this.state.skillFields}
                        />
                        </Row>
                        <Row style={{maxHeight:'85px',overflowY: 'auto'}}>
                            <Forms
                                ref={this.levelForm}
                                Callback={this.levelCall}
                                FormFields={this.state.LevelFields}
                            />
                        </Row>
                    </Modal>
                }
            </>
        )
    }
}

export default Skills