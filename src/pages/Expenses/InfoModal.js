import { Form, Modal } from 'antd'
import React from 'react'
import { useState } from 'react'
import FormItems from '../../components/Core/Forms/FormItems'
import { getOrgPersons } from '../../service/constant-Apis'

const InfoModal = ({ visible, close }) => {
    
    const [data, setData] = useState({
        BasicFields : [
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
            key: "titleId",
            size: "small",
            rules: [{ required: true, message: 'Title is Required' }],
            data: [],
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
            key: "ProjectId",
            size: "small",
            rules:[{ required: true, message: 'Project is Required' }],
            data: [],
            type: "Select",
            // onChange: (value)=> {
            //     if (value){
            //         const customUrl = `helpers/contact-persons?organizationId=${value}&associated=1`
            //         getOrgPersons(customUrl).then(res=>{
            //             if(res.success){
            //                 // const { BasicFields } = basicFields
            //                 BasicFields[6].data = res.data
            //                 this.setState({ BasicFields })
            //             }
            //         })
            //     }else{
            //         // const { BasicFields } = basicFields
            //         basicFields[6].data = []
            //         const { basic } = this.formRef.current.getFieldsValue();
            //         basic.contactPersonId = undefined
            //         this.formRef.current.setFieldsValue({ basic: basic, });
            //         this.setState({ BasicFields })
            //     }
            // }
        },
    ],
        }
    );
    const { BasicFields } = data;
  return (
      <Modal
          visible={visible}
        //   width={450}
          onCancel={close}
      >
          <Form
            id={'my-form'}
            // ref={formRef}
            // onFinish={onFinish}
            scrollToFirstError={true}
            size="small"
            layout="inline"
            //   need some change 
            // style={{flexDirection:"column"}}
          >
              <FormItems FormFields={BasicFields}/>
          </Form>
      </Modal>
  )
}

export default InfoModal