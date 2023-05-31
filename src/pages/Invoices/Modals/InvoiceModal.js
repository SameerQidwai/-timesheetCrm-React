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
import {
  createInvoice,
  getInvoice,
  getInvoiceData,
  updateInvoice,
} from '../../../service/invoice-Apis';
import '../../styles/modal.css';
const { Text } = Typography;

const InvoiceModal = ({ visible, close, callBack }) => {
  const [form] = Form.useForm();
  const [lineItems, setLineItems] = useState([{}]);
  const [totalAmounts, setTotalAmounts] = useState({});
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
      getValueProps: (value)=>  ({value: value?.id}),
      fieldNames: { value: 'id', label: 'name' },
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
      fieldNames: { value: 'id', label: 'name' },
      onChange: (value, record) => {
        changeTypeFields(value, record);
      },
    },
    {
      object: 'basic',
      fieldCol: 12,
      key: 'invoiceNumber',
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
      key: 'months',
      mode: 'month',
      size: 'small',
      disabled: true,
      rules: [{ required: true, message: 'Month Are Required' }],
      type: 'RangePicker',
      onChange: () => {
        invoiceData();
      },
    },
    {
      object: 'basic',
      fieldCol: 12,
      key: 'issueDate',
      size: 'small',
      rules: [{ required: true, message: 'Date is Required' }],
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
      key: 'dueDate',
      size: 'small',
      rules: [{ required: true, message: 'Date is Required' }],
      type: 'DatePicker',
      fieldStyle: { width: '100%' },
    },
    {
      Placeholder: 'Tax Rates',
      fieldCol: 12,
      size: 'small',
      type: 'Text',
    },
    {
      Placeholder: 'Amounts Are',
      fieldCol: 12,
      size: 'small',
      type: 'Text',
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
      key: 'lineAmountTypes',
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
      dataIndex: 'unitAmount',
      key: 'unitAmount',
      render: (value) => formatCurrency(value),
    },
    {
      title: 'Tax Amount',
      dataIndex: 'taxAmount',
      key: 'taxAmount',
      render: (value) => formatCurrency(value),
    },
    {
      title: 'Amount.',
      dataIndex: 'lineAmount',
      key: 'lineAmount',
      render: (value) => formatCurrency(value),
    },
  ];
  let projectTypeField = {
    1: {
      label: {
        Placeholder: 'Schedule',
        fieldCol: 12,
        size: 'small',
        type: 'Text',
      },
      field: {
        object: 'basic',
        fieldCol: 12,
        key: 'scheduleId',
        size: 'small',
        rules: [{ required: true, message: 'type is Required' }],
        data: [],
        type: 'Select',
        fieldNames: { value: 'id', label: 'description' },
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
        key: 'months',
        // mode: 'month',
        size: 'small',
        rules: [{ required: true, message: 'Month Are Required' }],
        type: 'RangePicker',
        onChange: () => {
          invoiceData();
        },
      },
    },
  };

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    const toolsQuery = {
      account: 'Class=="REVENUE"',
      taxType: 'CanApplyToRevenue=true AND status=="ACTIVE"',
    };
    Promise.all([
      getToolOrganizations('xero'), //call organization 
      getToolAssets('xero', toolsQuery), //get all assets belong from ttol
      visible !== true && getInvoice(visible.id), //for Edit api get Invoice
    ]).then((res) => {
      let tempFields = fields;
      tempFields[2].data = res[0].success ? res[0].data : []; //set data in select box
      tempFields[14].data = res[1].success ? res[1]?.data?.accounts ?? [] : [];//set data in select box
      tempFields[18].data = res[1].success ? res[1]?.data?.taxRates ?? [] : []; //set data in select box

      //if getInvoice api hit
      if (res?.[2]?.success) {
        // give temporary data to project to avoid delay response
        tempFields[6].data = [res[2]?.data?.project];

        //testing project type for scheule or Range picker field select
        let projectType = res[2]?.data?.project?.type

        //If project is milestone change scheduleId
        if (projectType ===1){
            tempFields[8] = projectTypeField[1]['label'];
            tempFields[10] = projectTypeField[1]['field'];
            tempFields[10].data = res[2]?.data?.lineItems // set tempoary field change to this field
        }
        //setting form field
        form.setFieldsValue({ basic: res[2]?.data });
        //setting table data to show invoice line
        setLineItems(res[2]?.data?.lineItems);

        //setting total amount to show below table
        setTotalAmounts(res[2]?.data?.totalAmounts);

        // simultaneously getting real project data after avoiding delay response
        getProjects(res[2]?.data?.organization, true)
        if (projectType ===1){
            // simultaneously getting real project data after avoiding delay response if project is milestone
            invoiceData(1)
        }
      }

      //set useState fields
      setFields([...tempFields]);
    });
  };

  const getProjects = (orgId, noReset) => {
    if (orgId) {
      getOrgProjects(orgId).then((res) => {
        if (res.success) {
          let tempFields = fields;
          tempFields[6].data = res.data;
        //   tempFields[10].disabled = true;
          setFields([...tempFields]);
        }
      });
    }
    if (!noReset){
        let { basic } = form.getFieldsValue();
        form.setFieldsValue({
          basic: {
            ...basic,
            projectId: null,
            months: [null, null],
            scheduleId: null,
          },
        });
        setTotalAmounts({})
        setLineItems([{}]);
    }
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
    let { accountCode, lineAmountTypes, taxType } = basic;
    setTotalAmounts((prev) => {
      let gstRate = (effectiveGst ?? 0) / 100 || prev.gstRate || 0;
      let subTotal = 0;
      let totalTax = 0;
      let total = 0;
      setLineItems((previousRecords) => {
        return (records ?? previousRecords).map((record) => {
          console.log(record);
          let lineAmount =
            parseFloat(record.unitAmount) * parseFloat(record.quantity);
          let taxAmount =
            lineAmountTypes !== 'NoTax' ? lineAmount * parseFloat(gstRate) : 0;
          subTotal += lineAmount;
          totalTax += taxAmount;
          total +=
            lineAmount + (lineAmountTypes === 'Exclusive' ? taxAmount : 0);
          return {
            ...record,
            taxAmount: taxAmount,
            accountCode: accountCode,
            lineAmount: lineAmount,
            taxType: taxType,
          };
        });
      });
      return { subTotal, totalTax, total, gstRate };
    });
  };

  // on submit
  const onFinish = ({basic: formData}) => {
    if (lineItems?.[0]?.unitAmount) {
      let data = {
        ...formData,
        startDate: formatDate(formData['months']?.[0], true),
        endDate: formatDate(formData['months']?.[1], true),
        dueDate: formatDate(formData.dueDate, true),
        issueDate: formatDate(formData.issueDate, true),
        lineItems,
      };
      console.log(formData)
      if (visible === true){
          createInvoice(data).then((res) => {
            if (res.success) {
                callBack()
            }
          });
      }else{
        updateInvoice(visible.id, data).then((res) => {
            if (res.success) {
              callBack()
            }
          });
      }
    } else {
      message.error('Empty Invoice Not Allowed', 3);
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
      <Row justify="end" gutter={[0, 20]} style={{ marginTop: 20 }}>
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
            <Descriptions.Item label="subTotal">
              {formatCurrency(totalAmounts.subTotal)}
            </Descriptions.Item>
            <Descriptions.Item label="Total GST">
              {formatCurrency(totalAmounts.totalTax)}
            </Descriptions.Item>
            <Descriptions.Item style={{ borderTop: '1px solid' }} />
            <Descriptions.Item
              label="Total"
              contentStyle={{ fontSize: 18, fontWeight: 900 }}
            >
              {formatCurrency(totalAmounts.total)}
            </Descriptions.Item>
          </Descriptions>
        </Col>
      </Row>
    </Modal>
  );
};

export default InvoiceModal;
