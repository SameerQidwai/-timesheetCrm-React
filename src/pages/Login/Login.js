import React, { Component } from "react";

// import Form from '../../components/Form';

import { Row, Col, Typography, Input, Button, Form } from "antd";
const { Title } = Typography;
const { Password } = Input;

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      log: {
        user: "",
        pass: "",
      },
    };
  }
  loginFunc = (value) => {
    // this.setState({data: childData});
    console.log(value);
  };
  render() {
    return (
      <Row
        justify="center"
        align="middle"
        style={{ backgroundColor: "Green", minHeight: "100vh" }}
      >
        {/* <Form Callback={this.Callback} FormFields= {FormFields}/> */}
        <Col span={8}>
          <Row
            justify="center"
            align="middle"
            gutter={[24, 45]}
            style={{
              backgroundColor: "White",
              border: "1px solid black",
              padding: "15px 0 ",
            }}
          >
            <Col span={24} style={{ textAlign: "center" }}>
              <Title>OneLM CRM</Title>
            </Col>
            <Col span={15} style={{ textAlign: "center" }}>
              <Form
                {...{ wrapperCol: 24 }}
                initialValues={{ remember: true }}
                onFinish={this.loginFunc}
                // onFinishFailed={onFinishFailed}
                layout="vertical"
              >
                <Form.Item
                  label="Username"
                  name="username"
                  rules={[
                    { required: true, message: "Please input your username!" },
                  ]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  label="Password"
                  name="password"
                  rules={[
                    { required: true, message: "Please input your password!" },
                  ]}
                >
                  <Password />
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
    );
  }
}

export default Login;
