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
import { createValue, upadteVariables, updateValue } from '../../../../service/global-apis';

const GlobalVarsModal = ({ visible, onClose, callBack, minDate, keyName }) => {
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
        return dateRange(current, endDate, 'end', undefined, yearClosed) //||
        // dateRange(current, minDate, 'end', undefined)
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
        return dateRange(current, startDate, 'start', undefined, yearClosed);
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
      // rangeMax: 24,
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

  const onFinish = ({taxes}) =>{
    if (visible.id){
      taxes = {
        name: keyName,
        value: taxes.value,
        startDate: formatDate(taxes.startDate, true),
        endDate: formatDate(taxes.endDate, true),
      }
      updateValue(visible.id, taxes).then(res=>{
        if (res.success){
          callBack(res.data, visible.index)
        }
      })
    }else{
      let variables = {
        name: keyName,
        value: taxes.value,
        startDate: formatDate(taxes.startDate, true),
        endDate: formatDate(taxes.endDate, true),
      }
      
      createValue(variables).then(res=>{
        if(res.success){
          callBack(res.data)
        }
      })
      // console.log(taxes)
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
        form: 'value-form',
      }}
      okText={'Save'}
      style={{marginTop: '35px'}}
      onCancel={onClose}
    >
      <Form
        id={'value-form'}
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
