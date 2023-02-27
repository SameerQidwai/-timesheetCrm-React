import { Button, Col, DatePicker, Form } from 'antd'
import React, { useEffect, useState } from 'react'
import { MinusCircleFilled, PlusSquareFilled } from "@ant-design/icons"; //Icons
import { formatDate } from '../../service/constant';

const ShutdownPeriods = () => {
  const [form] = Form.useForm();
  const [disable, setDisable] =useState(0)
  const [saveDisabled, setSaveDisabled] =useState(true)


  useEffect(() => {
    console.log("useEffect run");
  },[])
  
  const onFinish = (value) => {
    let projectShutdown = value?.projectShutdown ?? {}
    let addNewDates = []
    Object.entries(projectShutdown).forEach(([key, value]) => {
      let shutdownPeriod = {
        startDate: formatDate(value["startDate"], true),
        endDate: formatDate(value["endDate"], true)
      }
      console.log("start", formatDate(value["startDate"], true));
      console.log("end", formatDate(value["endDate"], true));
    });
  }
  
  return (
    <Form
        id={'my-form'}
        form={form}
        scrollToFirstError={true}
        size="small"
        layout="inline"
        // onFieldsChange={()=> setSaveDisabled(false)}
        style={{padding: 50, paddingTop:20, textAlign: 'center'}}
        onFinish={onFinish}
    >
        <Form.List name={'projectShutdown'}>
            {(fields, { add, remove }) => (<>
                <Form.Item style={{margin: "0px 20px 10px auto", }}>
                    <Button size="small" onClick={() => add()} type='primary' > <PlusSquareFilled /> Insert Period</Button>
                </Form.Item>
                {fields.map((field, index) => (
                    <span className="ant-row" key={field.key} style={{width: '100%', marginBottom: 10}}>
                        <Col span={11}>
                            <Form.Item
                                {...field}
                                label="Start Date"
                                name={[field.name, 'startDate']}
                                
                            >
                                <DatePicker 
                                    style={{ width: '100%' }} 
                                    size="small"
                                    // onChange={()=>setReload(!reload)}
                                    // disabled={field.name < disable}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={11}>
                            <Form.Item
                                {...field}
                                label="End Date"
                                name={[field.name, 'endDate']}
                            >
                                <DatePicker 
                                    style={{ width: '100%' }} 
                                    size="small" 
                                    // onChange={()=>setReload(!reload)}
                                    // disabled={field.name < disable}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={'auto'} >
                            <MinusCircleFilled 
                                style={{color:"red",margin: 'auto'}} 
                                onClick={() => {
                                        remove(field.name)
                                }} 
                            />
                        </Col>
                    </span>
                ))}
                 <Form.Item style={{marginTop: 8}}>
                    <Button 
                        size="small" 
                        type="primary" 
                        htmlType="submit"
                        // disabled={saveDisabled}
                    > Save  </Button>
                </Form.Item>
            </>)}
        </Form.List>
    </Form>
)
}

export default ShutdownPeriods