import React, { useState, useEffect } from 'react';
import { Redirect, useLocation, useParams } from 'react-router-dom';
import { Row, Col, Typography, Input, Button, Form } from 'antd';
import {
  loggedIn,
  forgotPassword,
  resetPassword,
} from '../../service/Login-Apis';
import Text from 'antd/lib/typography/Text';
const { Title } = Typography;
const { Password } = Input;

function ResetPassword(props) {
  const { state } = useLocation();
  const { from } = state || { from: { pathname: '/dashboard' } };
  const [redirectToReferrer, setRedirectToReferrer] = useState(false);
  const [token] = useState(useParams().token);

  useEffect(() => {
    checkLogin();
    console.log(state);
  }, []);

  const resetPasswordFunc = (value) => {
    resetPassword(token, value).then((res) => {
      if (res && res.success) {
        console.log(res);
        //set local storage
        window.location.href = '/login';
        // setRedirectToReferrer(true)
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
            style={{ backgroundImage: `url(${'/Z-logo.png'})` }}
            className="app-title-image"
          ></Col>
          <Col span={16} className="txt-center">
            <Form
              {...{ wrapperCol: 24 }}
              initialValues={{ remember: true }}
              onFinish={resetPasswordFunc}
              layout="vertical"
            >
              <Form.Item
                label="New Password"
                name="password"
                rules={[
                  {
                    required: true,
                    message: 'Please Enter your new password!',
                  },
                ]}
              >
                <Password />
              </Form.Item>
              <Form.Item
                label="Confirm New Password"
                name="confirmPassword"
                dependencies={['password']}
                rules={[
                  {
                    required: true,
                    message: 'Please Enter your new password!',
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error('Passwords do not match!')
                      );
                    },
                  }),
                ]}
              >
                <Password />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Reset
                </Button>
              </Form.Item>
              <Form.Item noStyle>
                <Text type="danger">
                  If you are experiencing any problems, please contact
                  support@timewize.com.au
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

export default ResetPassword;
