import React, {Component} from 'react'
import { Row, Button, Space, Popconfirm } from 'antd';

import Form from '../../components/Form';

import '../styles/table.css'

 


class Global extends Component{
    constructor(props){
        super(props);
        this.dynamoForm_1 = React.createRef();
        this.dynamoForm_2 = React.createRef();

        this.state = {
            data: 'sameer',
        }

        this.FormFields_1 = {
            formId: 'globalForm',
            justify : 'center',
            FormCol: 20,
            FieldSpace: { xs: 12, sm: 16, md: 122},
            // layout: {labelCol: { span: 12 }},
            justifyField:'right',
            // FormLayout:'inline', 
            size: 'small',
            // Formstyle:{backgroundColor:'white'},
            // backstyle:{backgroundColor:'green'},
            initialValues:{obj:{email:'@g.com', timezone: '+5',address:'fixed', rpPage:190, displayEmail:'Pakistan@f.com', fromEmail: 'Karachi@g.com' ,country:'A', city:'NewYork', zcode:2123,phone:'xx-xxxxx' }},
            fields:[
                {
                    object:'obj',
                    filedCol:20,
                    layout:  {
                        wrapperCol: { span: 0 }
                    },
                    Placeholder: 'Organization Information',
                    type: 'Title',
                    size:'small',
                    mode:4,
                    style: {'textDecoration': 'underline'}
                },
                {
                    object:'obj',
                    filedCol:20,
                    layout:  {labelCol: { span: 4 },
                    wrapperCol: { span: 0 }},
                    key: 'email',
                    Placeholder: 'Email Address',
                    label:'Email',
                    size:'small',
                    // rules:[{ required: true }],
                    type: 'input',
                    labelAlign: 'left',
                    // hint: 'write your Name',
                },
                {
                    object:'obj',
                    filedCol:20,
                    key: 'country',
                    Placeholder: 'Select Country',
        
                    label:'Country',
                    size:'small',
                    // rules:[{ required: true, message: 'Insert your Password Please' }],
                    type: 'Select',
                    data:[{value:'P',label:'Pakistan'}, {value:'A',label:'America'},{ value:'C',label:'Canada'}],
                    layout: {labelCol: { span: 4}},
                    labelAlign: 'left',
                    func: function func (value, e){
                            switch (value) {
                                case 'P':
                                    this.dynamoForm_1.current.props.FormFields.fields[3].data = this.FormFields_1['fields'][3].data1
                                    break;
        
                                case 'A':
                                    this.dynamoForm_1.current.props.FormFields.fields[3].data = this.FormFields_1['fields'][3].data2
                                    break;
                            
                                default:
                                    this.dynamoForm_1.current.props.FormFields.fields[3].data = this.FormFields_1['fields'][3].data3
                                    break;
                            }
                            this.forceUpdate()
                        }.bind(this)
                    // hidden: false    
                },
                {
                    object:'obj',
                    filedCol:20,
                    key: 'city',
                    Placeholder: 'Select City',
                    label:'City',
                    size:'small',
                    data: '',
                    data1: [{value:'Karachi'}],
                    data2: [{value:'NewYork'}],
                    data3: [{value:'Toronto'}],
                    // rules:[{ required: true, message: 'Insert your Password Please' }],
                    type: 'Select',
                    layout: {labelCol: { span: 4}},
                    labelAlign: 'left',
                    // hidden: false    
                },
                {
                    object:'obj',
                    filedCol:20,
                    key: 'timezone',
                    Placeholder: 'Select Timezone',
                    label:'Timezone',
                    size:'small',
                    // rules:[{ required: true, message: 'Insert your Password Please' }],
                    type: 'Select',
                    layout: {labelCol: { span: 4}},
                    labelAlign: 'left',
                    // hidden: false    
                },
                {
                    object:'obj',
                    filedCol:20,
                    key: 'address',
                    Placeholder: 'Full Address',
                    label:'Address',
                    size:'small',
                    // rules:[{ required: true, message: 'Insert your Password Please' }],
                    type: 'textarea',
                    layout: {labelCol: { span: 4}},
                    labelAlign: 'left',
                    // hidden: false    
                },
                {
                    object:'obj',
                    filedCol:20,
                    key: 'zcode',
                    Placeholder: 'Enter Zip Code',
                    label:'Zip Code',
                    size:'small',
                    // rules:[{ required: true, message: 'Insert your Password Please' }],
                    type: 'input',
                    layout: {labelCol: { span: 4}},
                    labelAlign: 'left',
                    // hidden: false    
                },
                {
                    object:'obj',
                    filedCol:20,
                    key: 'phone',
                    Placeholder: 'Phone Number',
                    label:'Phone No',
                    size:'small',
                    // rules:[{ required: true, message: 'Insert your Password Please' }],
                    type: 'input',
                    layout: {labelCol: { span: 4}},
                    labelAlign: 'left',
                    // hidden: false    
                },
                {
                    // object:'obj',
                    filedCol:20,
                    layout:  {
                        wrapperCol: { span: 0 }
                    },
                    Placeholder: 'General Settings',
                    type: 'Title',
                    mode: 4,
                    style: {'textDecoration': 'underline'}
                },
                {
                    object:'obj',
                    filedCol:20,
                    key: 'rpPage',
                    label:'Records Per Page',
                    size:'small',
                    // rules:[{ required: true, message: 'Insert your Password Please' }],
                    type: 'inputNumber',
                    layout: {labelCol: { span: 4}},
                    labelAlign: 'left',
                    // hidden: false    
                },
                {
                    object:'obj',
                    filedCol:20,
                    key: 'displayEmail',
                    Placeholder: 'Display Name In Email',
                    label:'Display Email',
                    size:'small',
                    // rules:[{ required: true, message: 'Insert your Password Please' }],
                    type: 'input',
                    layout: {labelCol: { span: 4}},
                    labelAlign: 'left',
                    // hidden: false    
                },
                {
                    object:'obj',
                    filedCol:20,
                    key: 'fromEmail',
                    Placeholder: 'From Email Address',
                    label:'From Email',
                    size:'small',
                    // rules:[{ required: true, message: 'Insert your Password Please' }],
                    type: 'input',
                    layout: {labelCol: { span: 4}},
                    labelAlign: 'left',
                    // hidden: false    
                },
                {
                    filedCol:20,
                    mode:'horizontal',
                    type: 'Divider',
                    formStyle:{padding:'0px', margin:'0px'}
                    // hidden: false    
                },
            ]
            // submit: function submit (value){
            //     console.log(value)
            // }
        }
    }

   
    Callback = (childData) =>{
        this.setState({data: childData})    
        console.log(childData)
    }
    
    submit = () =>{
        this.dynamoForm_1.current.refs.globalForm.submit()
    }
    reset = () =>{
        this.dynamoForm_1.current.refs.globalForm.resetFields()
    }

    render (){
        
        return(
            <>
                <Form ref={this.dynamoForm_1} Callback = {this.Callback} FormFields= {this.FormFields_1} />
                <Row justify="end">
                    <Space size="large">
                    <Popconfirm placement="bottom" title='Are you sure want to save new Settings?' onConfirm={()=>this.submit()} okText="Yes" cancelText="No">
                        <Button type="primary"  size='small' >
                            Save
                        </Button>
                    </Popconfirm>
                        
                        <Button    size='small' onClick={()=>this.reset()}>
                            Cancel
                        </Button>
                    </Space>
                </Row>
            </>
        )
    }
}

export default Global