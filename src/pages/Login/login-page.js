import React, {Component} from 'react'

import Form from '../../components/Form';

const FormFields = {
    Title: 'OneLM CRM',
    justify : 'center',
    FormCol: 10,
    FieldSpace: { xs: 12, sm: 16, md: 122},
    layout: {labelCol: { span: 12 }},
    justifyField:'center',
    FormLayout:'vertical', 
    size: 'middle',
    Formstyle:{backgroundColor:'white'},
    backstyle:{backgroundColor:'green'},
    subBtn :{
        justify: 'center',
        type:'primary',
        gutter:{ xs: 8, sm: 16, md: 24},
        btnLabel: 'Login',
        shape: "round",
        size:'middle',
        block: true,
        filedCol:20,
        style:{margin:'7%'}
    },
    fields:[
        {
            object:'obj',
            filedCol:20,
            layout:  {
                wrapperCol: { span: 0 }
            },
            Placeholder: 'OneLM CRM',
            type: 'Title',
            style: {'textAlign':'center', paddingTop:'10%'}
        },
        {
            object:'obj',
            filedCol:20,
            layout:  {labelCol: { span: 6 },
            wrapperCol: { span: 0 }},
            variable: 'name',
            Placeholder: 'Your Good Name',
            label:'User Name',
            //rules:[{ required: true }],
            type: 'input',
            labelAlign: 'right',
            // hint: 'write your Name',
            hidden: false
        },
        {
            object:'obj',
            filedCol:20,
            variable: 'password',
            Placeholder: 'Your Good Name',
            label:'Password',
            //rules:[{ required: true, message: 'Insert your Password Please' }],
            type: 'password',
            layout: {labelCol: { span: 0}},
            labelAlign: 'right',
            hidden: false
        },
    ],
    btns : {
        justify: 'center',
        size:'middle',
        btn: [
            {
                placeholder: 'Login',
                type: 'primary',
                shape:'round',
                htmlType: 'submit',
                block: true,
            },
        ]
    },
    submit: function submit (value){
        console.log(value)
    }
}

class Login extends Component{
    constructor(props){
        super(props);
        this.state = {
            data: null
        }
    }
    Callback = (value) =>{
        // this.setState({data: childData});
        console.log(value)
    }
    render (){
        return(
            <div style={{backgroundColor:'green'}}>
                <Form Callback={this.Callback} FormFields= {FormFields}/>
            </div>
        )
    }
}

export default Login