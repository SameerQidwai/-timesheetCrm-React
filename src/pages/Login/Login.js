import React, { useState, useEffect } from "react";
import { Redirect, useLocation } from "react-router-dom";
import { Row, Col, Typography, Input, Button, Form } from "antd";
import { login, loggedIn } from '../../service/Login-Apis'
import { localStore } from "../../service/constant";
import { getSettings } from "../../service/global-apis";
import Text from "antd/lib/typography/Text";
const { Title } = Typography;
const { Password } = Input;

function Login(props) {
    const { state } = useLocation();
    const { from } = state || { from: { pathname: "/dashboard" } };
    const [redirectToReferrer, setRedirectToReferrer] = useState(false);

    useEffect(() => {
        checkLogin()
    },[])

    const loginFunc = (value) => {
        
        login(value).then(res=>{
            if(res&& res.success){
                //set local storage
                getSettings().then(res=>{
                    if(res.success){
                        localStorage.setItem('pageSize', res.data.recordsPerPage)
                    }
                    window.location.href="/dashboard"
                })
                // setRedirectToReferrer(true)
            }
        })
    };

    const checkLogin = () =>{
        if(loggedIn() === true){
            setRedirectToReferrer(true)
        }
    }

  return (
    <Row
        justify="center"
        align="middle"
        style={{ backgroundColor: "#DDDEDE", minHeight: "100vh" }}
    >
        {/* <Form Callback={this.Callback} FormFields= {FormFields}/> */}
        <Col span={8}>
            <Row
                justify="center"
                align="middle"
                gutter={[24, 45]}
                style={{ backgroundColor: "White", border: "1px solid black", padding: "15px 0 ", }}
            >
                <Col span={24} style={{ textAlign: "center" }}>
                    <Title>OneLM CRM</Title>
                </Col>
                <Col span={15} style={{ textAlign: "center" }}>
                    <Form
                        {...{ wrapperCol: 24 }}
                        initialValues={{ remember: true }}
                        onFinish={loginFunc}
                        // onFinishFailed={onFinishFailed}
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

                        <Form.Item >
                            <Button type="primary" htmlType="submit">
                                Login
                            </Button>
                        </Form.Item>
                        <Form.Item noStyle>
                            <Text type="danger">If you are experiencing any problems, please contact support@timewize.com.au</Text>
                        </Form.Item>
                    </Form>
                </Col>
            </Row>
        </Col>
        {redirectToReferrer && <Redirect to={ from } />}
    </Row>
  );
}

export default Login;
