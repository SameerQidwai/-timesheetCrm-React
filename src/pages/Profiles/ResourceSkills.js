import React, { useEffect, useState } from 'react'
import { Button, Col, Form, Row, Select, Space } from 'antd';
import { MinusCircleFilled, PlusSquareFilled } from "@ant-design/icons"; //Icons
import { getStandardSkills } from '../../service/constant-Apis';
import { addNewSill } from '../../service/Login-Apis';


const ResourceSkills = (props) =>{
    const [form] = Form.useForm();
    const [skillArray, setSkillArray] = useState([])
    const [levelArray, setLevelArray] = useState({})
    const [reload, setReload] = useState({})
    const [disable, setDisable] =useState(0)
    const [saveDisabled, setSaveDisabled] =useState(true)

    useEffect(() => {
        getStandardSkills().then(res=>{
            if(res.success){
                setSkillArray(res.data)
                let levels = {}
                res.data.forEach(el=>{
                    levels[el.value] = el?.levels
                })
                setLevelArray(levels)
                setDisable(props.data.length)
                form.setFieldsValue({resource: props.data})
            }
        })
    },[])

    const dynamicLevelOptions = (name) =>{
        if(!isNaN(name)){{
            const {resource} = form.getFieldsValue()
            const levelIndex = resource?.[name]?.['standardSkillId']
            return isNaN(levelIndex) ? [] : levelArray[levelIndex]}
        } 
        return []
    }

    const onFinish=(value) =>{
        let resource = value?.resource ?? {}
          let addNewSkill = []
        Object.entries(resource).forEach(([key, value]) => {
            if (!value['standardLevelId'] && value['id']){
                addNewSkill.push(value['id'])
            }
          });

        addNewSill({standardSkillStandardLevelIds: addNewSkill}).then(res=>{
            if(res.success){
                setDisable(res.data.length)
                setSaveDisabled(true)
            }
        })
    }

    return (
        <Form
            id={'my-form'}
            form={form}
            scrollToFirstError={true}
            size="small"
            layout="inline"
            onFieldsChange={()=> setSaveDisabled(false)}
            style={{padding: 50, paddingTop:20, textAlign: 'center'}}
            onFinish={onFinish}
        >
            <Form.List name={'resource'}>
                {(fields, { add, remove }) => (<>
                    <Form.Item style={{margin: "0px 20px 10px auto", }}>
                        <Button size="small" onClick={() => add()} type='primary' > <PlusSquareFilled /> Insert Skill</Button>
                    </Form.Item>
                    {fields.map((field, index) => (
                        <span className="ant-row" key={field.key} style={{width: '100%', marginBottom: 10}}>
                            <Col span={11}>
                                <Form.Item
                                    {...field}
                                    label="Standard Skill"
                                    name={[field.name, 'standardSkillId']}
                                    
                                >
                                    <Select 
                                        style={{ width: '100%' }} 
                                        size="small"
                                        options={skillArray}
                                        onChange={()=>setReload(!reload)}
                                        disabled={field.name < disable}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={11}>
                            <Form.Item
                                {...field}
                                label="Standard Level"
                                name={[field.name, 'id']}
                            >
                                <Select 
                                    style={{ width: '100%' }} 
                                    size="small" 
                                    disabled={field.name < disable}
                                    options={dynamicLevelOptions(field.name)}

                                />
                            </Form.Item>
                            </Col>
                            <Col span={'auto'} >
                                <MinusCircleFilled 
                                    style={{color:`${field.name < disable? "grey" :"red"}`,margin: 'auto'}} 
                                    onClick={() => {
                                        if(field.name > disable -1){
                                            remove(field.name)
                                        }
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
                            disabled={saveDisabled}
                        > Save  </Button>
                    </Form.Item>
                </>)}
            </Form.List>
        </Form>
    )
}

export default ResourceSkills