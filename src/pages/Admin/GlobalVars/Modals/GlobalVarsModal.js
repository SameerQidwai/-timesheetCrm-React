import React, { useState, useEffect } from 'react';
import { Form, Modal } from 'antd';
import {
  dateClosed,
  dateRange,
  disableAllFields,
  formatDate,
  localStore,
} from '../../../../service/constant';
import FormItems from '../../../../components/Core/Forms/FormItems';

const GlobalVarsModal = ({ visible, onClose, callBack }) => {
  const [form] = Form.useForm();
  let yearClosed = localStore().closedYears;
  yearClosed = yearClosed && JSON.parse(yearClosed);
  const [disable, setDisable] = useState(false)
  const [loading, setLoading] = useState(false);
  let [fields,setFields] = useState([
    {
      Placeholder: 'Start Date',
      rangeMin: true,
      fieldCol: 12,
      size: 'small',
      type: 'Text',
      labelAlign: 'right',
      // itemStyle:{marginBottom:'10px'},
    },
    {
      Placeholder: 'End Date',
      rangeMin: true,
      fieldCol: 12,
      size: 'small',
      type: 'Text',
      labelAlign: 'right',
      // itemStyle:{marginBottom:'10px'},
    },
    {
      object: 'taxes',
      fieldCol: 12,
      key: 'startDate',
      size: 'small',
      type: 'DatePicker',
      rules: [{ required: true, message: 'Start Date is Required' }],
      fieldStyle: { width: '100%' },
      rangeMin: (current) => {
        const { taxes: { endDate } } = form.getFieldValue();
        return dateRange(current, endDate, 'start', undefined, yearClosed);
      },
    },
    {
      object: 'taxes',
      fieldCol: 12,
      key: 'endDate',
      rules: [{ required: true, message: 'End Date is Required' }],
      size: 'small',
      type: 'DatePicker',
      fieldStyle: { width: '100%' },
      rangeMax: (current) => {
        const { taxes: { startDate }, } = form.getFieldValue();
        return dateRange(current, startDate, 'end', undefined, yearClosed);
      },
    },
    {
      Placeholder: 'Value',
      rangeMin: true,
      fieldCol: 24,
      size: 'small',
      type: 'Text',
      labelAlign: 'right',
      // itemStyle:{marginBottom:'10px'},
    },
    {
      object: 'taxes',
      fieldCol: 12,
      key: 'value',
      size: 'small',
      rangeMin: 0,
      rangeMax: 24,
      rules: [{ required: true, message: 'Value is Required' }],
      type: 'InputNumber',
      fieldStyle: { width: '100%' },
    },
  ]);

  useEffect(() => {
    if (visible !== true){
      let tempFields = [...fields]
      let {startDate, endDate, value} = visible
      let disabledFY =  dateClosed(endDate, startDate);
      setDisable(disabledFY)
      if (disabledFY){
        tempFields = disableAllFields(tempFields)
        setFields(tempFields)
      }
      let taxes = {
        startDate: formatDate(startDate), 
        endDate: formatDate(endDate),
        value
      }
      form.setFieldsValue({taxes})
    }
  }, []);

  const onFinish = (value) =>{
    if (visible.id){
      value.id = visible.id
      callBack(value, visible.index)
    }else{
      callBack(value)
    }
  }

  return (
    <Modal
      title={visible === true ? 'Add Modal' : 'Edit Modal'}
      visible={visible}
      width={500}
      okButtonProps={{
        disabled: loading || disable,
        loading,
        htmlType: 'submit',
        form: 'my-form',
      }}
      okText={'Save'}
      style={{marginTop: '35px'}}
      onCancel={onClose}
    >
      <Form
        id={'my-form'}
        form={form}
        onFinish={onFinish}
        size="small"
        layout="inline"
        initialValues={{ taxes: {} }}
      >
        <FormItems FormFields={fields} />
      </Form>
    </Modal>
  );
};

export default GlobalVarsModal;
