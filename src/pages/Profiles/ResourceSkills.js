import React, { useEffect, useState } from 'react'
import { Button, Col, Form, Row, Select, Space } from 'antd';
import { MinusCircleFilled } from "@ant-design/icons"; //Icons
import { getStandardLevels } from '../../service/constant-Apis';


const ResourceSkills = (props) =>{
    const [form] = Form.useForm();
    const [skillArray, setSkillArray] = useState([])
    const [levelArray, setLevelArray] = useState({})
    const [reload, setReload] = useState({})

    useEffect(() => {
        console.log(props.data);
        getStandardLevels().then(res=>{
            if(res.success){
                setSkillArray(res.data)
                let levels = {}
                res.data.forEach(el=>{
                    levels[el.value] = el?.levels
                })
                setLevelArray(levels)
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
        // let oldSkill = []
        // Object.entries(resource).forEach(([key, value]) => {
        //     if (value['standardLevelId'] && value['id']){
        //         oldSkill.push(value['id'])
        //     }
        // });
        
        let addNewSkill = []
        Object.entries(resource).forEach(([key, value]) => {
            if (!value['standardLevelId'] && value['id']){
                addNewSkill.push(value['id'])
            }
          });
        //   let compelete = []
        // Object.entries(resource).forEach(([key, value]) => {
        //     if (value['id']){
        //         compelete.push(value['id'])
        //     }
        //   });
        //   console.log('these are old skills that are already were added', oldSkill,);
          console.log('these are new skills added', addNewSkill,);
        //   console.log('this is whole array', compelete);
    }

    return (
        <Form
            id={'my-form'}
            form={form}
            scrollToFirstError={true}
            size="small"
            layout="inline"
            style={{padding: 50, paddingTop:20, textAlign: 'center'}}
            onFinish={onFinish}
        >
            <Form.List name={'resource'}>
                {(fields, { add, remove }) => (<>
                    <Form.Item style={{margin: "0px 20px 10px auto", }}>
                        <Button size="small" onClick={() => add()}  > Add Skill </Button>
                    </Form.Item>
                    {fields.map((field, index) => (
                        <span className="ant-row" key={field.key} style={{width: '100%', marginBottom: 10}}>
                            <Col span={11}>
                                <Form.Item
                                    {...field}
                                    label="Skill"
                                    name={[field.name, 'standardSkillId']}
                                    
                                >
                                    <Select 
                                        style={{ width: '100%' }} 
                                        size="small"
                                        options={skillArray}
                                        onChange={()=>setReload(!reload)}
                                        disabled={field.name < props.data.length}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={11}>
                            <Form.Item
                                {...field}
                                label="Level"
                                name={[field.name, 'id']}
                            >
                                <Select 
                                    style={{ width: '100%' }} 
                                    size="small" 
                                    disabled={field.name < props.data.length}
                                    options={dynamicLevelOptions(field.name)}

                                />
                            </Form.Item>
                            </Col>
                            <Col span={'auto'} >
                                <MinusCircleFilled style={{color:`${field.name < props.data.length? "grey" :"red"}`,margin: 'auto'}} onClick={() => {if(field.name > props.data.length -1)remove(field.name)}} />
                            </Col>
                        </span>
                    ))}
                     <Form.Item style={{marginTop: 8}}>
                        <Button size="small" type="primary" htmlType="submit"> Add New Skill </Button>
                    </Form.Item>
                </>)}
            </Form.List>
        </Form>
    )
}

export default ResourceSkills