import React, {Component} from 'react'

// import Form from '../../components/Form';

import { Row, Col, Typography, Input, Button, Form  } from 'antd'
const {Title} = Typography
const { Password } = Input
// const FormFields = {
//     Title: 'OneLM CRM',
//     justify : 'center',
//     FormCol: 24,
//     // FieldSpace: { xs: 12, sm: 16, md: 122},
//     // layout: {labelCol: { span: 12 }},
//     justifyField:'center',
//     FormLayout:'vertical', 
//     size: 'middle',
//     // Formstyle:{backgroundColor:'white'},
//     backstyle:{
//         backgroundColor: 'white',
//         /* width: 100%; */
//         padding: '50px 0 50px 0px',
//         border: 'solid black 1px',
//         borderBottom: 'white',
//     },
//     subBtn :{
//         justify: 'center',
//         type:'primary',
//         gutter:{ xs: 8, sm: 16, md: 24},
//         btnLabel: 'Login',
//         shape: "round",
//         size:'middle',
//         block: true,
//         filedCol:20,
//         style:{
//             margin:'7%'
//         },
//         backstyle:{
//             backgroundColor: 'white',
//             border: 'solid black 1px',
//             borderTop: 'white',
//         },
//     },
//     fields:[
//         {
//             object:'obj',
//             filedCol:24,
//             layout:  {
//                 wrapperCol: { span: 0 }
//             },
//             Placeholder: 'OneLM CRM',
//             type: 'Title',
//             style: {'textAlign':'center', paddingTop:'10%'}
//         },
//         {
//             object:'obj',
//             filedCol:13,
//             layout:  {labelCol: { span: 6 },
//             wrapperCol: { span: 0 }},
//             variable: 'name',
//             Placeholder: 'Your Good Name',
//             label:'User Name',
//             //rules:[{ required: true }],
//             type: 'input',
//             labelAlign: 'right',
//             // hint: 'write your Name',
//             hidden: false
//         },
//         {
//             object:'obj',
//             filedCol:13,
//             variable: 'password',
//             Placeholder: 'Your Good Name',
//             label:'Password',
//             //rules:[{ required: true, message: 'Insert your Password Please' }],
//             type: 'password',
//             layout: {labelCol: { span: 0}},
//             labelAlign: 'right',
//             hidden: false
//         },
//     ],
//     btns : {
//         justify: 'center',
//         size:'middle',
//         btn: [
//             {
//                 placeholder: 'Login',
//                 type: 'primary',
//                 shape:'round',
//                 htmlType: 'submit',
//                 block: true,
//             },
//         ]
//     },
//     submit: function submit (value){
//         console.log(value)
//     }
// }

class Login extends Component{
    constructor(props){
        super(props);
        this.state = {
            data: null,
            log: {
                user: '',
                pass: ''
            }
        }
    }
    loginFunc = (value) =>{
        // this.setState({data: childData});
        console.log(value)
    }
    render (){
        return(
            <Row justify="center" align="middle" style={{backgroundColor:'Green', minHeight:"100vh"}}>
                {/* <Form Callback={this.Callback} FormFields= {FormFields}/> */}
                <Col span={8}>
                    <Row justify="center" align="middle" gutter={[24,45]} style={{backgroundColor:'White', border:'1px solid black', padding:'15px 0 '}}>
                        <Col span={24} style={{textAlign:"center"}}>
                            <Title>OneLM CRM</Title>
                        </Col>
                        <Col span={15} style={{textAlign:"center"}}>
                        <Form
                            {...{wrapperCol:24}}
                            initialValues={{ remember: true }}
                            onFinish={this.loginFunc}
                            // onFinishFailed={onFinishFailed}
                            layout="vertical"
                        >
                            <Form.Item
                                label="Username"
                                name="username"
                                rules={[{ required: true, message: 'Please input your username!' }]}
                                >
                                    <Input />
                            </Form.Item>

                            <Form.Item
                                label="Password"
                                name="password"
                                rules={[{ required: true, message: 'Please input your password!' }]}
                            >
                                <Input.Password />
                            </Form.Item>

                            <Form.Item 
                                // {...tailLayout}
                            >
                                <Button type="primary" htmlType="submit">
                                    Login
                                </Button>
                            </Form.Item>
                        </Form>
                        </Col>
                    </Row>
                </Col>
            </Row>
        )
    }
}

export default Login