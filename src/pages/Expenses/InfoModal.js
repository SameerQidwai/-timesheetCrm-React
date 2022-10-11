import { Form, Modal } from 'antd'
import axios from 'axios'
import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import FormItems from '../../components/Core/Forms/FormItems'
import { getOrgPersons, getProjects } from '../../service/constant-Apis'

const InfoModal = ({ visible, close, callBack }) => {
    const [form] = Form.useForm();
    console.log("visible--> ", visible);

    const onFinish = (data) => {
        console.log('dasic-->', data);

        let { basic } = data;
        basic.code = 'AR389'; // when-api remove this
        basic.projectId = basic.project?.value // when-api remove this
        callBack(basic,visible?.index);

    }

    const [basicFields, setBasicFields] = useState([
        {
            Placeholder: "Title",
            rangeMin: true,
            fieldCol: 24,
            size: "small",
            type: "Text",
            // itemStyle:{marginBottom:'10px'},
        },
        {
            object: "basic",
            fieldCol: 24,
            key: "title",
            size: "small",
            rules: [{ required: true, message: 'Title is Required' }],
            type: "Input",
            },
            {
            Placeholder: "Project",
            rangeMin: true,
            fieldCol: 24,
            size: "small",
            type: "Text",
            // itemStyle:{marginBottom:'10px'},
            },
            {
            object: "basic",
            fieldCol: 24,
            key: "project", // when-api change it to projectId
            size: "small",
            rules:[{ required: true, message: 'Project is Required' }],
            data: [],
            customValue: (value, option) => option, // when-api remove this
            type: "Select",
          },
    ]
        
    );

    useEffect(() => {
        gettingProject();
        if (visible !== true) {
            form.setFieldsValue({ basic: visible })
        }
    }, []);

    const gettingProject = () => {
        getProjects().then((res) => {
            if (res.success) {
                let basic = basicFields
                basic[3].data = res.data
                setBasicFields([...basic]); 
            }
            
        })
    }

  return (
      <Modal
          title={visible !== true ? "Edit Expense" : "Add Expense"}
          visible={visible}
        //   width={450}
          onCancel={close}
          okText={"Save"}
          okButtonProps={{ htmlType: 'submit', form: 'my-form' }}
      >
          <Form
            id={'my-form'}
            form={form}
            // ref={formRef}
            onFinish={onFinish}
            scrollToFirstError={true}
            size="small"
            layout="inline"
          >
              <FormItems FormFields={basicFields}/>
          </Form>
      </Modal>
  )
}

export default InfoModal