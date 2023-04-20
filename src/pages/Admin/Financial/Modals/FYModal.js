import React, { useEffect, useState } from 'react'
import { DatePicker, Form, Modal, Typography, Upload } from 'antd'
import { PlusOutlined } from "@ant-design/icons"; //Icons
import FormItems from '../../../../components/Core/Forms/FormItems'
import { createFY, getAllFY } from '../../../../service/financial-year-apis';
import { formatDate } from '../../../../service/constant';

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
            // fieldCol: 6,
            size: "small",
            type: "Text",
            // itemStyle:{marginBottom:'10px'},
        },
        {
            object: "FY",
            fieldCol: 20,
            key: "label",
            size: "small",
            rules:[{ required: true, message: 'Financial Year Name Is Required' }],
            type: "Input",
            itemStyle:{marginBottom: 10},
        },
        {
            Placeholder: 'FY Dates',
            rangeMin: true,
            // fieldCol: 6,
            size: 'small',
            type: 'Text',
            itemStyle: { marginBottom: '10px' },
          },
          {
            object: 'FY',
            fieldCol: 20,
            key: 'dates',
            rangeMin: (current) => {
            //   return (
            //     current && !current.isBetween(monthStart, monthEnd, 'day', '[]')
            //   );
            },
            size: 'small',
            type: 'RangePicker',
            rules: [{ required: true, message: 'Financial Start And End Dates Are Required' }],
            fieldStyle: { width: '100%' },
            ranges: {
            //   'This Month': [monthStart, monthEnd],
            },
          },
    ]
        
    );

    useEffect(() => {
        getData();
    }, []);

    // on submit 
    const onFinish = async(formValue) => {
        let { FY: {dates, ...FYData} } = formValue
        if (dates?.length){
            FYData.startDate = formatDate(dates[0], true)
            FYData.endDate = formatDate(dates[1], true)
        }
        let {success, data} =  await createFY(FYData)
        if (success){
            callBack(data)
        }else{
            close()
        }
    }

    const getData = async() => {
    //     let {success, data} = await getAllFY()
    //     if (success){
    //         d
    //     }
    }

  return (
      <Modal
          title={visible !== true ? "Edit Financial Year" : "Create Financial Year"}
          visible={visible}
          width={650}
          onCancel={close}
          okText={"Save"}
          okButtonProps={{ htmlType: 'submit', form: 'my-form'}}
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