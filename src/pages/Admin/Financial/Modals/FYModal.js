import React, { useEffect, useState } from 'react'
import { DatePicker, Form, Modal, Typography, Upload } from 'antd'
import { PlusOutlined } from "@ant-design/icons"; //Icons
import FormItems from '../../../../components/Core/Forms/FormItems'

const { Text } = Typography


const FYModal = ({ visible, close, callBack }) => {

    const [progress, setProgress] = useState();
    const [form] = Form.useForm();

    // console.log("fileList", fileList);
    // fields 
    const [basicFields, setBasicFields] = useState([
        {
            Placeholder: "FY Name",
            rangeMin: true,
            fieldCol: 6,
            size: "small",
            type: "Text",
            // itemStyle:{marginBottom:'10px'},
        },
        {
            object: "obj",
            fieldCol: 18,
            key: "name",
            size: "small",
            rules:[{ required: true, message: 'Name is Required' }],
            type: "Input",
            itemStyle:{marginBottom: 10},
        },
        {
            Placeholder: 'Dates',
            rangeMin: true,
            fieldCol: 6,
            size: 'small',
            type: 'Text',
            itemStyle: { marginBottom: '10px' },
          },
          {
            object: 'dates',
            fieldCol: 18,
            key: 'dateRange',
            rangeMin: (current) => {
            //   return (
            //     current && !current.isBetween(monthStart, monthEnd, 'day', '[]')
            //   );
            },
            size: 'small',
            type: 'RangePicker',
            rules: [{ required: true, message: 'Dates Are Required' }],
            fieldStyle: { width: '100%' },
            ranges: {
            //   'This Month': [monthStart, monthEnd],
            },
            onChange: (values = []) => {
            //   const {
            //     times,
            //     dates: { dateRange = [] },
            //     include,
            //   } = this.formRef.current.getFieldsValue();
            //   values = values || [];
            //   this.getDateArray(values[0], values[1], times);
            },
          },
    ]
        
    );

    useEffect(() => {
        getData();
    }, []);

    // on submit 
    const onFinish = (data) => {

    }

    const getData = () => {
        
    }

  return (
      <Modal
          title={visible !== true ? "Edit Expense" : "Add Expense"}
          visible={visible}
          width={650}
          onCancel={close}
          okText={"Save"}
          okButtonProps={{ htmlType: 'submit', form: 'my-form', disabled: editDisabled || !permission['UPDATE'] || !permission['ADD'] }}
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
            <FormItems FormFields={basicFields} />
                        
          </Form>
      </Modal>
  )
}

export default FYModal