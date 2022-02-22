import React, { useEffect, useState } from 'react'
import { Button, Form, Select, Space } from 'antd';
import { MinusCircleFilled } from "@ant-design/icons"; //Icons


const ResourceSkills = (props) =>{
    const [form] = Form.useForm();

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
        console.log(props.data);
        // form.setFieldsValue({security: props.data})
    }, [])


    return (
        <Form
            id={'my-form'}
            form={form}
            scrollToFirstError={true}
            size="small"
            layout="inline"
            style={{padding: 50, paddingTop:20}}
        >
            <Form.List name={['resource', "skillLevel"]}>
                {(fields, { add, remove }) => (<>
                    <Form.Item style={{textAlign: "right"}}>
                        <Button size="small" onClick={() => add()} > Add Skill </Button>
                    </Form.Item>
                        {fields.map((field, index) => (
                        <Space key={field.key} align="baseline">
                            <Form.Item
                                {...field}
                                label="Skill"
                                name={[field.name, 'skill']}
                            >
                                <Select style={{ width: 130 }}  size="small"/>
                            </Form.Item>
                            <Form.Item
                                {...field}
                                label="Level"
                                name={[field.name, 'level']}
                            >
                                <Select style={{ width: 130 }}  size="small"/>
                            </Form.Item>
                            <MinusCircleFilled style={{color:"red",margin: 'auto'}} onClick={() => remove(field.name)} />
                        </Space>
                    ))}
                </>)}
            </Form.List>
        </Form>
    )
}

export default ResourceSkills