import React, { useState, useEffect } from 'react';
import { Link, NavLink, Redirect, useLocation } from 'react-router-dom';
import { Row, Col, Typography, Input, Button, Form } from 'antd';
import { login, loggedIn } from '../../service/Login-Apis';
import { localStore } from '../../service/constant';
import { getSettings } from '../../service/global-apis';
import { getAllFY } from '../../service/financial-year-apis';
const { Title, Text } = Typography;
const { Password } = Input;

function Login(props) {
  const { state } = useLocation();
  const { from } = state || { from: { pathname: '/dashboard' } };
  const [redirectToReferrer, setRedirectToReferrer] = useState(false);

  useEffect(() => {
    checkLogin();
  }, []);

  const loginFunc = (value) => {
    login(value).then((res) => {
      if (res && res.success) {
        //set local storage
        // getSettings()
        Promise.all([getSettings(), getAllFY()])
        .then((res) => {
          if (res[0]?.success) {
            localStorage.setItem('pageSize', res[0]?.data?.recordsPerPage);
          }
          // console.log(res[1])
          if(res[1]?.success){
            let closedYears = [null, null]; //selecting Empty financial year
            (res[1]?.data??[]).forEach(({closed, startDate, endDate}) => {
              if(closed){ 
                if(!closedYears[0]){ //check if startDate is already been set
                  closedYears[0] = startDate
                }
                closedYears[1] = endDate // 
              }
            });
            localStorage.setItem('closedYears', JSON.stringify(closedYears));
          }
          window.location.href = '/dashboard';
        });
      }
    });
  };

  const checkLogin = () => {
    if (loggedIn() === true) {
      setRedirectToReferrer(true);
    }
  };

  return (
    <Row
      justify="center"
      align="middle"
      className="app-login app-login-background"
      style={{ backgroundImage: `url(${'/Z-avatar.svg'})` }}
    >
      {/* <Form Callback={this.Callback} FormFields= {FormFields}/> */}
      <Col span={8}>
        <Row
          justify="center"
          align="middle"
          gutter={[24, 10]}
          className="form-row"
        >
          <Col 
            span={24} 
            style={{backgroundImage: `url(${"/z-logo.png"})`}} 
                    className="app-title-image"
            >
            </Col>
          <Col span={16} className="txt-center">
            <Form
              {...{ wrapperCol: 24 }}
              initialValues={{ remember: true }}
              onFinish={loginFunc}
              layout="vertical"
            >
              <Form.Item
                label="Username"
                name="email"
                rules={[
                  { required: true, message: 'Please input your username!' },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Password"
                name="password"
                rules={[
                  { required: true, message: 'Please input your password!' },
                ]}
              >
                <Password />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Login
                </Button>
              </Form.Item>
              <Form.Item>
                <Text type="secondary">
                  <Link to="/forgot-password"> Forgot Password </Link>
                </Text>
              </Form.Item>
              <Form.Item noStyle>
                <Text type="danger">
                  If you are experiencing any problems, please contact
                  support@timewize.au
                </Text>
              </Form.Item>
            </Form>
          </Col>
        </Row>
      </Col>
      {redirectToReferrer && <Redirect to={from} />}
    </Row>
  );
}

export default Login;
