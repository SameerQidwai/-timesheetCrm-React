import React, { useEffect, useState } from 'react';
import { DatePicker, Form, Modal, Typography, Upload } from 'antd';
import { PlusOutlined } from '@ant-design/icons'; //Icons
import FormItems from '../../../components/Core/Forms/FormItems';

import { Api, formatDate, localStore } from '../../../service/constant';
import ATable from '../../../components/Core/Table/TableFilter';
import { gettoolOrganizations } from '../../../service/integration-Apis';
import { getOrgProjects } from '../../../service/Organizations';
import { getInvoiceData } from '../../../service/invoice-Apis';

const { Text } = Typography;

const InvoiceModal = ({ visible, close, callBack }) => {
  const [form] = Form.useForm();
  const [fields, setFields] = useState([
    {
      Placeholder: 'Organization',
      rangeMin: true,
      fieldCol: 12,
      size: 'small',
      type: 'Text',
      // itemStyle:{marginBottom:'10px'},
    },
    {
      Placeholder: 'Reference',
      // rangeMin: true,
      fieldCol: 12,
      size: 'small',
      type: 'Text',
      // itemStyle:{marginBottom:'10px'},
    },
    {
      object: 'basic',
      fieldCol: 12,
      key: 'organizaionId',
      size: 'small',
      rules: [{ required: true, message: 'type is Required' }],
      data: [],
      type: 'Select',
      onChange: (value) => getProjects(value),
    },
    {
      object: 'basic',
      fieldCol: 12,
      key: 'reference',
      size: 'small',
      rules: [{ required: true, message: 'type is Required' }],
      initialValue: null,
      type: 'Input',
    },
    {
      Placeholder: 'Issue Date',
      rangeMin: true,
      fieldCol: 12,
      size: 'small',
      type: 'Text',
      // itemStyle:{marginBottom:'10px'},
    },
    {
      Placeholder: 'Due Date',
      rangeMin: true,
      fieldCol: 12,
      size: 'small',
      type: 'Text',
      // itemStyle:{marginBottom:'10px'},
    },
    {
      object: 'basic',
      fieldCol: 12,
      key: 'issue_date', // when-api change it to projectId
      size: 'small',
      rules: [{ required: true, message: 'Date is Required' }],
      // customValue: (value, option) => option, // when-api remove this
      type: 'DatePicker',
      fieldStyle: { width: '100%' },
    },
    {
      object: 'basic',
      fieldCol: 12,
      key: 'due_date', // when-api change it to projectId
      size: 'small',
      rules: [{ required: true, message: 'Date is Required' }],
      // customValue: (value, option) => option, // when-api remove this
      type: 'DatePicker',
      fieldStyle: { width: '100%' },
    },
    {
      Placeholder: 'Project',
      // rangeMin: true,
      fieldCol: 12,
      size: 'small',
      type: 'Text',
      // itemStyle:{marginBottom:'10px'},
    },
    {
      Placeholder: 'Months',
      // rangeMin: true,
      fieldCol: 12,
      size: 'small',
      type: 'Text',
      // itemStyle:{marginBottom:'10px'},
    },
    {
      object: 'basic',
      fieldCol: 12,
      key: 'projectId',
      size: 'small',
      rules: [{ required: true, message: 'type is Required' }],
      data: [],
      type: 'Select',
      onChange: (value, record) => {
        getEntries(value, record);
      },
    },
    {
      object: 'basic',
      fieldCol: 12,
      key: 'months', // when-api change it to projectId
      mode: 'month',
      size: 'small',
      disabled: true,
      rules: [{ required: true, message: 'Month Are Required' }],
      // customValue: (value, option) => option, // when-api remove this
      type: 'RangePicker',
      onChange: () => {
        invoiceData();
      },
    },
    {
      Placeholder: 'Invoice Number',
      // rangeMin: true,
      fieldCol: 24,
      size: 'small',
      type: 'Text',
      // itemStyle:{marginBottom:'10px'},
    },
    {
      object: 'basic',
      fieldCol: 12,
      key: 'invoice_number',
      disabled: true,
      size: 'small',
      type: 'Input',
    },
  ]);

  let projectTypeField = {
    1: {
      label: {
        Placeholder: 'Schedule',
        // rangeMin: true,
        fieldCol: 12,
        size: 'small',
        type: 'Text',
        // itemStyle:{marginBottom:'10px'},
      },
      field: {
        object: 'basic',
        fieldCol: 12,
        key: 'scheduleId',
        size: 'small',
        rules: [{ required: true, message: 'type is Required' }],
        data: [],
        type: 'Select',
        // onChange: (value, record)=> {setEntries(record)}
      },
    },
    2: {
      label: {
        Placeholder: 'Months',
        // rangeMin: true,
        fieldCol: 12,
        size: 'small',
        type: 'Text',
        // itemStyle:{marginBottom:'10px'},
      },
      field: {
        object: 'basic',
        fieldCol: 12,
        key: 'months', // when-api change it to projectId
        mode: 'month',
        size: 'small',
        rules: [{ required: true, message: 'Month Are Required' }],
        // customValue: (value, option) => option, // when-api remove this
        type: 'RangePicker',
        onChange: () => {
          invoiceData();
        },
      },
    },
  };

  useEffect(() => {
    getData();
    if (visible !== true) {
      visible.date = formatDate(visible.date);
      form.setFieldsValue({ basic: visible });
    }
  }, []);
  // on submit
  const onFinish = (data) => {};

  const getData = () => {
    Promise.all([gettoolOrganizations('xero')]).then((res) => {
      let tempFields = fields;
      tempFields[2].data = res[0].success ? res[0].data : [];
      setFields([...tempFields]);
    });
  };

  const getProjects = (orgId) => {
    if (orgId) {
      getOrgProjects(orgId).then((res) => {
        if (res.success) {
          let tempFields = fields;
          tempFields[10].data = res.data;
          tempFields[11].disabled = true;
          setFields([...tempFields]);
        }
      });
    }
    let { basic } = form.getFieldsValue();
    form.setFieldsValue({
      basic: {
        ...basic,
        projectId: null,
        months: [null, null],
        scheduleId: null,
      },
    });
  };

  const getEntries = (value, record) => {
    let tempFields = fields;
    if (record){
        let {type} = record
        tempFields[9] = projectTypeField[type]['label'];
        tempFields[11] = projectTypeField[type]['field'];
        setFields([...tempFields]);
          invoiceData(type);
    }
  };

  const invoiceData = (type) => {
    let { projectId, months = [] } = form.getFieldsValue().basic;
    if (type || (months[0] && months[1])) {
      getInvoiceData(
        projectId,
        formatDate(months[0], true),
        formatDate(months[1], true)
      ).then((res) => {
        if (res.success) {
          if (type === 1) {
            let tempFields = fields;
            tempFields[11].data = res.data;
            setFields([...tempFields]);
          } else {
            console.log(res.data);
          }
        }
      });
    }
  };

  return (
    <Modal
      title={visible !== true ? 'Edit Invoice' : 'Add Invoice'}
      visible={visible}
      width={800}
      onCancel={close}
      okText={'Save'}
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
        <FormItems FormFields={fields} />
      </Form>
      <ATable rowKey="id" dataSource={[]} columns={[]} />
    </Modal>
  );
};

export default InvoiceModal;
