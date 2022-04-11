import React, { useEffect, useState } from 'react'
import { Button, Col, Form, Row, Select, Space } from 'antd';
import { MinusCircleFilled } from "@ant-design/icons"; //Icons
import { getStandardLevels } from '../../service/constant-Apis';


const ResourceSkills = (props) =>{
    const [form] = Form.useForm();
    const [skillArray, setSkillArray] = useState([])
    const [levelArray, setLevelArray] = useState({})
    const [fields, setFields] = useState([
        {
            object: "skill",
            fieldCol: 11,
            layout: { wrapperCol: { span: 23 } },
            key: 'skill',
            size: "small",
            type: "Select",
            labelAlign: "left",
            onChange: (e, value) => {
            //    const { SkillFields } = this.state
            //     SkillFields.fields.map(el=>{
            //         if (el.key ===splice_key[1]){
            //             el.data = value? value.levels: []
            //             return el
            //        }else{
            //            return el
            //        }
            //    })
            //    this.setState({SkillFields})
            },
        },
        {
            object: "skill",
            fieldCol: 11,
            layout: { wrapperCol: { span: 20 } },
            key: 'level',
            size: "small",
            // rules:[{ required: true }],
            type: "Select",
            labelAlign: "left",
            itemStyle: { marginBottom: "5px" },
        },
    ])

    useEffect(() => {
        getStandardLevels().then(res=>{
            if(res.success){
                setSkillArray(res.data)
                console.log('I want standardSkillStandardLevel table Id as well')
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
        console.log(isNaN(name))
        if(!isNaN(name)){{
            const {resource} = form.getFieldsValue()
            const levelIndex = resource[name]['standardSkillId']
            console.log(levelArray[levelIndex]);
            return isNaN(levelIndex) ? [] : levelArray[levelIndex]}
        } 
        return []
    }

    return (
        <Form
            id={'my-form'}
            form={form}
            scrollToFirstError={true}
            size="small"
            layout="inline"
            style={{padding: 50, paddingTop:20}}
        >
            <Form.List name={'resource'}>
                {(fields, { add, remove }) => (<>
                    <Form.Item style={{textAlign: "right"}}>
                        <Button size="small" onClick={() => add()} > Add Skill </Button>
                    </Form.Item>
                    {fields.map((field, index) => (
                        <span className="ant-row" key={field.key} style={{width: '100%'}}>
                            <Form.Item
                                {...field}
                                label="Skill"
                                name={[field.name, 'standardSkillId']}
                            >
                                <Select 
                                    style={{ width: '100%' }} 
                                    size="small"
                                    options={skillArray}
                                />
                            </Form.Item>
                            <Form.Item
                                {...field}
                                label="Level"
                                name={[field.name, 'standardLevelId']}
                                wrapperCol={{span: 20}}
                            >
                                <Select 
                                    style={{ width: '100%' }} 
                                    size="small" 
                                    options={dynamicLevelOptions(field.name)}
                                />
                            </Form.Item>
                            <MinusCircleFilled style={{color:"red",margin: 'auto'}} onClick={() => remove(field.name)} />
                        </span>
                    ))}
                </>)}
            </Form.List>
        </Form>
    )
}

export default ResourceSkills