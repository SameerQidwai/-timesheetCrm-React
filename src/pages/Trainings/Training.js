import React, {useEffect,useState} from 'react'
import { Col, Row, Typography, Form, Input, Button } from 'antd'
import { getTraining, upadteTraining } from '../../service/training-Apis';


const  {Title} =Typography

const Training = () =>{
    const [form] = Form.useForm();

    useEffect(() => {
        getTraining().then(res=>{
            if(res.success){
                form.setFieldsValue({notes: res.data})
            }
        })
    }, [])
    

    const onFinish = (value) =>{

        upadteTraining({training: value.notes}).then(res =>{
            if (res.success){
            }
        })
    }


    return (
        <Row>
            <Col span="24">
                <Title level={3}>Training</Title>
            </Col>
            <Col span="24">
                <Form  id={'my-form' } onFinish={onFinish} form={form}>
                    <Form.Item noStyle name={'notes'} >
                        <Input.TextArea
                            placeholder="Enter Your Notes...."
                            autoSize={{ minRows: 10, maxRows: 20 }}
                            allowClear
                        />
                        </Form.Item>
                        <Button type="primary"  htmlType="submit" style={{margin: '10px 15px 0px 0px'}}> Submit </Button>
                </Form>
            </Col>
        </Row>
    )
}

export default Training