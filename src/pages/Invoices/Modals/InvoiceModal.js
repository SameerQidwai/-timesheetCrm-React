import React, { useEffect, useState } from 'react';
import {
  Col,
  DatePicker,
  Descriptions,
  Divider,
  Form,
  Modal,
  Row,
  Typography,
  Upload,
  message,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons'; //Icons
import FormItems from '../../../components/Core/Forms/FormItems';

import {
  Api,
  formatCurrency,
  formatDate,
  formatFloat,
  localStore,
} from '../../../service/constant';
import ATable from '../../../components/Core/Table/TableFilter';
import {
  getToolAssets,
  getToolOrganizations,
} from '../../../service/integration-Apis';
import { getOrgProjects } from '../../../service/Organizations';
import { createInvoice, getInvoiceData } from '../../../service/invoice-Apis';
import '../../styles/modal.css';
const { Text } = Typography;

const InvoiceModal = ({ visible, close, callBack }) => {
  const [form] = Form.useForm();
  const [lineItems, setLineItems] = useState([{}]);
  const [totalData, setTotalData] = useState({});
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
      key: 'organization',
      size: 'small',
      rules: [{ required: true, message: 'type is Required' }],
      data: [],
      type: 'Select',
      customValue: (_, option) => option,
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
      Placeholder: 'Project',
      // rangeMin: true,
      fieldCol: 12,
      size: 'small',
      type: 'Text',
      // itemStyle:{marginBottom:'10px'},
    },
    {
      Placeholder: 'Invoice Number',
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
        changeTypeFields(value, record);
      },
    },
    {
      object: 'basic',
      fieldCol: 12,
      key: 'invoice_number',
      disabled: true,
      size: 'small',
      type: 'Input',
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
      Placeholder: 'Issue Date',
      rangeMin: true,
      fieldCol: 12,
      size: 'small',
      type: 'Text',
      // itemStyle:{marginBottom:'10px'},
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
      Placeholder: 'Account',
      // rangeMin: true,
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
      key: 'accountCode',
      size: 'small',
      rules: [{ required: true, message: 'type is Required' }],
      data: [],
      fieldNames: { value: 'code', label: 'name' },
      type: 'Select',
      onChange: () => {
        setTableData();
      },
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
      Placeholder: 'Tax Rates',
      // rangeMin: true,
      fieldCol: 12,
      size: 'small',
      type: 'Text',
      // itemStyle:{marginBottom:'10px'},
    },
    {
      Placeholder: 'Amounts Are',
      // rangeMin: true,
      fieldCol: 12,
      size: 'small',
      type: 'Text',
      // itemStyle:{marginBottom:'10px'},
    },
    {
      object: 'basic',
      fieldCol: 12,
      key: 'taxType',
      size: 'small',
      rules: [{ required: true, message: 'type is Required' }],
      data: [],
      type: 'Select',
      fieldNames: { value: 'taxType', label: 'name' },
      onChange: (_, record) => {
        setTableData(undefined, record?.effectiveRate);
      },
    },
    {
      object: 'basic',
      fieldCol: 12,
      key: 'amountAre',
      size: 'small',
      rules: [{ required: true, message: 'type is Required' }],
      data: [
        { label: 'Tax Exclusive', value: 'Exclusive' },
        { label: 'Tax Inclusive', value: 'Inclusive' },
        { label: 'No Tax', value: 'NoTax' },
      ],
      type: 'Select',
      onChange: () => {
        setTableData();
      },
    },
  ]);
  const columns = [
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Qty.',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (value) => formatFloat(value),
    },
    {
      title: 'Price',
      dataIndex: 'unit_amount',
      key: 'unit_amount',
      render: (value) => formatCurrency(value),
    },
    {
      title: 'Tax Amount',
      dataIndex: 'tax_amount',
      key: 'tax_amount',
      render: (value) => formatCurrency(value),
    },
    {
      title: 'Amount.',
      dataIndex: 'amount',
      key: 'amount',
      render: (value) => formatCurrency(value),
    },
  ];
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
        onChange: (value, record) => {
          let recordArray = record ? [record] : [];
          //if record is not null put it in array to save
          setTableData(recordArray);
        },
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
        // mode: 'month',
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
 

  const getData = () => {
    const toolsQuery = {
      account: 'Class=="REVENUE"',
      taxType: 'CanApplyToRevenue=true AND status=="ACTIVE"',
    };
    Promise.all([
      getToolOrganizations('xero'),
      getToolAssets('xero', toolsQuery),
    ]).then((res) => {
      let tempFields = fields;
      tempFields[2].data = res[0].success ? res[0].data : [];
      tempFields[14].data = res[1].success ? res[1]?.data?.accounts ?? [] : [];
      tempFields[18].data = res[1].success ? res[1]?.data?.taxRates ?? [] : [];
      setFields([...tempFields]);
    });
  };

  const getProjects = (orgId) => {
    if (orgId) {
      getOrgProjects(orgId).then((res) => {
        if (res.success) {
          let tempFields = fields;
          tempFields[6].data = res.data;
          tempFields[10].disabled = true;
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
    setLineItems([{}]);
  };

  const changeTypeFields = (value, record) => {
    let tempFields = fields;
    if (record) {
      let { type } = record;
      tempFields[8] = projectTypeField[type]['label'];
      tempFields[10] = projectTypeField[type]['field'];
      setFields([...tempFields]); //change project fields based on type // projectTypeField
      setLineItems([{}]);
      if (type === 1) {
        invoiceData(type); // if project is milestone call the api
      }
    }
  };

  const invoiceData = (type) => {
    let { projectId, months = [] } = form.getFieldsValue().basic;
    //check if project type is milestone call api
    if (type || (months[0] && months[1])) {
      //else wait for date range for timebase
      getInvoiceData(
        projectId,
        formatDate(months[0], true),
        formatDate(months[1], true)
      ).then((res) => {
        if (res.success) {
          if (type === 1) {
            let tempFields = fields;
            tempFields[10].data = res.data; // if api called on milestone add schedule to select schedule
            setFields([...tempFields]);
          } else {
            setTableData(res.data); // Else if api called for timebase (after selecting date range) //show data to table
          }
        }
      });
    }
  };

    const setTableData = (records, effectiveGst) => {
        // can call a function from two ways after api called after selecting dateRange for timebase
        // OR
        // if selecting schedule from selectbox
        let { basic } = form.getFieldsValue();
        let { accountCode, amountAre, taxType } = basic;
        setTotalData((prev) => {
        let gstRate = (effectiveGst ?? 0) / 100 || prev.gstRate || 0;
        let subtotal = 0;
        let totalTaxAmount = 0;
        let totalAmount = 0;
        setLineItems((previousRecords) => {
            return (records ?? previousRecords).map((record) => {
            console.log(record);
            let recordAmount =
                parseFloat(record.unit_amount) * parseFloat(record.quantity);
            let recordTaxAmount =
                amountAre !== 'NOTAX' ? recordAmount * parseFloat(gstRate) : 0;
            subtotal += recordAmount;
            totalTaxAmount += recordTaxAmount;
            totalAmount += recordAmount + (amountAre === 'EXCLUSIVE' ? recordTaxAmount : 0)
            return {
                ...record,
                tax_amount: recordTaxAmount,
                account_code: accountCode,
                amount: recordAmount,
                tax_type: taxType
            };
            });
        });
        return { subtotal, totalTaxAmount, totalAmount, gstRate };
        });
    };

    // on submit
    const onFinish = (formData) => {
        if (lineItems?.[0]?.unit_amount){
            delete formData['undefined']
            let data = { 
                ...formData,
                due_date: formatDate(formData.due_date, true),
                issue_date: formatDate(formData.issue_date, true),
                 lineItems 
            }
            console.log(data)
            createInvoice(data).then(res=>{
                if(res.success){
                    close()
                }
            })
        }else{
            message.error('Empty Invoice Not Allowed', 3)
        }
    };

  return (
    <Modal
      title={visible !== true ? 'Edit Invoice' : 'Add Invoice'}
      visible={visible}
      //   width={800}
      onCancel={close}
      okText={'Save'}
      okButtonProps={{ htmlType: 'submit', form: 'my-invoive' }}
      className="modal-top"
    >
      <Form
        id={'my-invoive'}
        form={form}
        // ref={formRef}
        onFinish={onFinish}
        scrollToFirstError={true}
        size="small"
        layout="inline"
      >
        <FormItems FormFields={fields} />
      </Form>
      <Row justify="end" gutter={[0, 20]} style={{ marginTop: 10 }}>
        <Col span={24}>
          <ATable rowKey="id" dataSource={lineItems} columns={columns} />
        </Col>
        <Col span={10}>
          <Descriptions
            column={1}
            labelStyle={{ color: '#404756' }}
            contentStyle={{
              textAlign: 'right',
              display: 'block',
              color: '#404756',
            }}
          >
            <Descriptions.Item label="Subtotal">
              {formatCurrency(totalData.subtotal)}
            </Descriptions.Item>
            <Descriptions.Item label="Total GST">
              {formatCurrency(totalData.totalTaxAmount)}
            </Descriptions.Item>
            <Descriptions.Item style={{ borderTop: '1px solid' }} />
            <Descriptions.Item
              label="Total"
              contentStyle={{ fontSize: 18, fontWeight: 900 }}
            >
              {formatCurrency(totalData.totalAmount)}
            </Descriptions.Item>
          </Descriptions>
        </Col>
      </Row>
    </Modal>
  );
};

export default InvoiceModal;
