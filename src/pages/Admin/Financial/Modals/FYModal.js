import React, { useEffect, useState } from 'react'
import { Form, Modal } from 'antd'
import FormItems from '../../../../components/Core/Forms/FormItems'
import { createFY, updateFY } from '../../../../service/financial-year-apis';
import { formatDate } from '../../../../service/constant';

const FYModal = ({ visible, close, callBack }) => {

    const [loading, setLoading] = useState();
    const [form] = Form.useForm();

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
        setLoading(true)
        let { FY: {dates, ...FYData} } = formValue
        if (dates?.length){
            FYData.startDate = formatDate(dates[0], true)
            FYData.endDate = formatDate(dates[1], true)
        }
        if(visible !== true){
            let {id, rowIndex} = visible
            let {success, data} =  await updateFY(id, FYData)
            setLoading(false)
            if (success){
                callBack(data, rowIndex)
            }
        }else{
            let {success, data} =  await createFY(FYData)
            setLoading(false)
            if (success){
                callBack(data)
            }
        }
    }

    const getData = () => {
        if(visible !== true){
            let {startDate, endDate, label} = visible
            let FY = {
                label,
                dates: [formatDate(startDate), formatDate(endDate)]
            }
            form.setFieldsValue({FY})
        }
    }

  return (
      <Modal
          title={visible !== true ? "Edit Financial Year" : "Create Financial Year"}
          visible={visible}
          width={650}
          onCancel={close}
          okText={"Save"}
          okButtonProps={{ htmlType: 'submit', form: 'my-form', loading}}
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