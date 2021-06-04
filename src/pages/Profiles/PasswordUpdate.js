import React, { useState } from 'react'
import { Input, Form, Row, Col, Typography, Button, message } from 'antd'
import { Redirect } from 'react-router'

const { Password } = Input
const { Title } = Typography
const PasswordUpdate = (props) => {
    const [logout, setLogout] = useState(false)    
    const changePassword = (values) =>{
        if ('12341234' === values.oldPassword){
            message.success({ content: 'Passowrd Changed'})
            localStorage.clear()
            setLogout(true)
            return 
        }else{
            message.error({ content: 'Passowrd is Incorrect'})
        }
    }
    return(
        <Row style={{padding: 50, paddingTop:20}} >
            <Col span={6}>
                
                <Title level={2}>Password</Title>

                <Title level={5}>
                    After a successful password update, 
                    you will be redirected to the login 
                    page where you can log in with your 
                    new password.
                </Title>

            </Col>
            <Col span={12}>
                <Form 
                    id={'sdsda'}
                    scrollToFirstError={true}
                    size="small"
                    layout="vertical"
                    {...{wrapperCol: { span: 16 } }}
                    onFinish={changePassword}
                >
                    <Form.Item 
                        name="oldPassword"
                        label="Current Password" 
                        rules={[{
                            required: true,
                            message: 'Please input your current password!',
                        }]}
                    >
                        <Password  autoComplete="new-password" />
                    </Form.Item>
                    <Form.Item 
                        name="password" 
                        label="New Password"
                        rules={[{
                                required: true,
                                message: 'Please input your New password!',
                            },{
                                min: 6,
                                message: "New Password Should have atleast 6 Character"
                            }
                        ]}
                        hasFeedback
                    >
                        <Password autoComplete="new-password" />
                    </Form.Item>
                    <Form.Item 
                        name="confirm"
                        label="Confirm Password"
                        dependencies={['password']}
                        hasFeedback
                        rules={[
                        {
                            required: true,
                            message: 'Please confirm your password!',
                        },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                            if (!value || getFieldValue('password') === value) {
                                return Promise.resolve();
                            }
                            return Promise.reject(new Error('The two passwords that you entered do not match!'));
                            },
                        }),
                        ]}
                    >
                        <Password autoComplete="new-password" />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" > Reset Password </Button>
                    </Form.Item>
                </Form>
            </Col>
            {logout && <Redirect to={{ pathname: '/'}} /> }
        </Row>
    )
}

export default PasswordUpdate