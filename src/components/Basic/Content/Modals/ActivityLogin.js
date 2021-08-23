import React, { useEffect, useState } from 'react'
import { Redirect } from "react-router-dom"; // Route Library
import { Modal, Form, Typography, Input } from "antd";
import { login } from '../../../../service/Login-Apis';

const { Title } = Typography
const { Password } = Input;


function ActivityLogin(props) {
    const [ logout, setLogout ] = useState(false)
    const [ cancel, setCancel ] = useState(false)
    const [form] = Form.useForm();

    useEffect(() => {
        console.log('ran');
        props.stopTimer()
    },[])
    const loginFunc = (value) => {
        login(value).then(res=>{
            if(res&& res.success){
                form.resetFields();
                props.close()
            }
        })
    };

    return (
        <div>
            <Modal
            destroyOnClose
            closable={false}
            keyboard={false}
            maskClosable={false}
            centered
            visible={props.visible}
            okText={"Login"}
            onOk={()=>{form.submit()}}
            // okButtonProps={{ htmlType: 'submit', form: 'my-form' }}
            cancelText={"Cancel"}
            onCancel={()=> {setLogout(true) 
                localStorage.clear()}}
            >
                <Title level={4} style={{textAlign: 'center'}}>Login</Title>
                    <Form
                        form={form}
                        // {...{ wrapperCol: 24 }}
                        onFinish={loginFunc}
                        layout="vertical"
                    >
                        <Form.Item
                            label="Username"
                            name="email"
                            rules={[ { required: true, message: "Please input your username!", }, ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Password"
                            name="password"
                            rules={[ { required: true, message: "Please input your password!", }, ]}
                        >
                            <Password />
                        </Form.Item>
                    </Form>
            </Modal>
            {logout && <Redirect to={{ pathname: '/'}} />}
        </div>
    )
}

export default ActivityLogin
