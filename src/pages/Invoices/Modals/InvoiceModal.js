import React, { useEffect, useState } from 'react';
import {
  Checkbox,
  Col,
  DatePicker,
  Descriptions,
  Divider,
  Dropdown,
  Form,
  Menu,
  Modal,
  Row,
  Typography,
  Upload,
  message,
} from 'antd';
import { PlusOutlined, CaretDownOutlined } from '@ant-design/icons'; //Icons
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
  // getToolOrganizations,
} from '../../../service/integration-Apis';
// import { getOrgProjects } from '../../../service/Organizations';
import {
  createInvoice,
  getInvoice,
  getInvoiceData,
  updateInvoice,
} from '../../../service/invoice-Apis';
import '../../styles/modal.css';
import { entityProjects } from '../../../service/constant-Apis';

const InvoiceModal = ({ visible, close, callBack }) => {
  const disabled = visible !== true
  const [form] = Form.useForm();
  const [lineItems, setLineItems] = useState([{}]);
  const [updateData, setUpdateData] = useState({
    refresh: false,
    rateKey: 0,
    visible: false,
    rateLable: 'Hourly Sell Rate',
  });
  const [attachments, seAttachments] = useState([]);
  const [totalAmounts, setTotalAmounts] = useState({});
  const [selectedLineItems, setSelectedLineItems] = useState([]);
  const [fields, setFields] = useState([
    {
      Placeholder: 'Project',
      rangeMin: true,
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
      rules: [{ required: true, message: 'Project is Required' }],
      data: [],
      type: 'Select',
      // fieldNames: { value: 'id', label: 'title' },
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
      rangeMin: true,
      fieldCol: 12,
      size: 'small',
      type: 'Text',
      // itemStyle:{marginBottom:'10px'},
    },
    {
      Placeholder: 'Purchase Order',
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
      rules: [{ required: true, message: 'Months Are Required' }],
      type: 'RangePicker',
      onChange: () => {
        invoiceData();
      },
    },
    {
      object: 'basic',
      fieldCol: 12,
      key: 'purchaseOrderId',
      size: 'small',
      rules: [{ required: true, message: 'Purchase Order is Required' }],
      data: [],
      type: 'Select',
      onChange: (value, record) => {
        let { basic } = form.getFieldsValue();
        form.setFieldsValue({ basic: { ...basic, reference: record.label } });
      },
    },
    {
      Placeholder: 'Account',
      rangeMin: true,
      fieldCol: 12,
      size: 'small',
      type: 'Text',
      // itemStyle:{marginBottom:'10px'},
    },
    {
      Placeholder: 'Reference',
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
      // rules: [{ required: true, message: 'Account is Required' }],
      data: [],
      fieldNames: { value: 'code', label: 'name' },
      type: 'Select',
      onChange: () => {
        setUpdateData((prev) => ({ ...prev, refresh: true }));
      },
    },
    {
      object: 'basic',
      fieldCol: 12,
      key: 'reference',
      size: 'small',
      rules: [{ required: true, message: 'Reference is Required' }],
      initialValue: null,
      type: 'Input',
    },
    {
      Placeholder: 'Tax Code',
      rangeMin: true,
      fieldCol: 12,
      size: 'small',
      type: 'Text',
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
      key: 'taxType',
      size: 'small',
      // rules: [{ required: true, message: 'Tax Code is Required' }],
      data: [],
      type: 'Select',
      fieldNames: { value: 'taxType', label: 'name' },
      onChange: (_, record) => {
        setUpdateData((prev) => ({
          ...prev,
          effectiveRate: record?.effectiveRate,
          refresh: true,
        }));
      },
    },
    {
      object: 'basic',
      fieldCol: 12,
      key: 'issueDate',
      size: 'small',
      rules: [{ required: true, message: 'Issue Date is Required' }],
      type: 'DatePicker',
      fieldStyle: { width: '100%' },
    },
    {
      Placeholder: 'Amounts Are',
      rangeMin: true,
      fieldCol: 12,
      size: 'small',
      type: 'Text',
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
      key: 'lineAmountTypes',
      size: 'small',
      rules: [{ required: true, message: 'Required' }],
      data: [
        { label: 'Tax Exclusive', value: 'Exclusive' },
        { label: 'Tax Inclusive', value: 'Inclusive' },
        { label: 'No Tax', value: 'NoTax' },
      ],
      type: 'Select',
      onChange: () => {
        setUpdateData((prev) => ({ ...prev, refresh: true }));
      },
    },
    {
      object: 'basic',
      fieldCol: 12,
      key: 'dueDate',
      size: 'small',
      rules: [{ required: true, message: 'Due Date is Required' }],
      type: 'DatePicker',
      fieldStyle: { width: '100%' },
    },
  ]);

  const columns = [
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      width: '40%',
    },
    {
      title: updateData.rateKey ===2 ? 'Days' : 'Hours',
      dataIndex: 'quantity',
      key: 'quantity',
      align: 'right',
      render: (value) => (value === '-' ? value : formatFloat(value)),
    },
    {
      // title: 'Sell Rate',
      title: updateData.rateLable,
      filterSearch: false,
      filterDropdownVisible: updateData.visible,
      filterDropdown: !disabled&&(
        <Menu>
          <Menu.Item
            key="1"
            className="pop-confirm-menu"
            onClick={() =>
              setUpdateData({
                rateKey: 1,
                visible: true,
                rateLable: 'Hourly Sell Rate',
                refresh: true,
              })
            }
          >
            Hourly Sell Rate
          </Menu.Item>
          <Menu.Item
            key="2"
            className="pop-confirm-menu"
            onClick={() =>
              setUpdateData({
                rateKey: 2,
                visible: true,
                rateLable: 'Daily Sell Rate',
                refresh: true,
              })
            }
          >
            Daily Sell Rate
          </Menu.Item>
        </Menu>
      ),
      filterIcon: (filtered) => !disabled&&(
        <CaretDownOutlined
          onClick={() =>
            setUpdateData((prev) => ({ ...prev, visible: !prev.visible }))
          }
        />
      ),
      dataIndex: 'unitAmount',
      key: 'unitAmount',
      align: 'right',
      render: (value) => formatCurrency(value),
    },
    {
      title: 'Tax Amount',
      dataIndex: 'taxAmount',
      key: 'taxAmount',
      align: 'right',
      render: (value) => formatCurrency(value),
    },
    {
      title: 'Amount',
      dataIndex: 'lineAmount',
      key: 'lineAmount',
      align: 'right',
      render: (value) => formatCurrency(value),
    },
  ];

  let projectTypeField = {
    1: {
      label: {
        Placeholder: 'Schedule',
        rangeMin: true,
        fieldCol: 12,
        size: 'small',
        type: 'Text',
      },
      field: {
        object: 'basic',
        fieldCol: 12,
        key: 'scheduleId',
        size: 'small',
        rules: [{ required: true, message: 'Schedule is Required' }],
        data: [],
        type: 'Select',
        fieldNames: { value: 'id', label: 'description' },
        onChange: (value, record) => {
          let recordArray = record ? [record] : [];
          //if record is not null put it in array to save
          setUpdateData((prev) => ({
            ...prev,
            records: recordArray,
            refresh: true,
          }));
        },
      },
    },
    2: {
      label: {
        Placeholder: 'Months',
        rangeMin: true,
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
        rules: [{ required: true, message: 'Months Are Required' }],
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

  useEffect(() => {
    if (updateData.refresh) {
      setTableData(updateData);
    }
  }, [updateData]);

  const getData = () => {
    const toolsQuery = {
      account: 'Class=="REVENUE"',
      taxType: 'CanApplyToRevenue=true AND status=="ACTIVE"',
    };
    Promise.all([
      entityProjects('helpers/work?type=P', true), //call organization
      getToolAssets('xero', toolsQuery), //get all assets belong from ttol
      visible !== true && getInvoice(visible.id), //for Edit api get Invoice
    ]).then((res) => {
      let tempFields = fields;
      tempFields[2].data = res[0].success ? res[0].options : []; //set data in select box
      tempFields[10].data = res[1].success ? res[1]?.data?.accounts ?? [] : []; //set data in select box
      tempFields[14].data = res[1].success ? res[1]?.data?.taxRates ?? [] : []; //set data in select box

      //if getInvoice api hit
      if (res?.[2]?.success) {
        // give temporary data to project to avoid delay response
        // tempFields[2].data = [res[2]?.data?.project];

        //testing project type for scheule or Range picker field select
        let projectType = res[2]?.data?.project?.type;

        //If project is milestone change scheduleId
        if (projectType === 1) {
          tempFields[4] = projectTypeField[1]['label'];
          tempFields[6] = projectTypeField[1]['field'];
          tempFields[6].data = res[2]?.data?.lineItems; // set tempoary field change to this field
        }
        //setting form field
        form.setFieldsValue({ basic: res[2]?.data });
        //setting table data to show invoice line
        setLineItems(res[2]?.data?.lineItems);

        //setting total amount to show below table
        setTotalAmounts(res[2]?.data?.totalAmounts);
        seAttachments(res[2]?.data?.attachments ?? []);
        // simultaneously getting real project data after avoiding delay response
        // getProjects(res[2]?.data?.organization, true)
        if (projectType === 1) {
          // simultaneously getting real project data after avoiding delay response if project is milestone
          invoiceData(1);
        } else {
          tempFields[6].disabled = true;
        }
      }

      //set useState fields
      setFields([...tempFields]);
    });
  };

  const changeTypeFields = (value, record) => {
    let tempFields = fields;
    if (record) {
      let { type } = record;
      tempFields[4] = projectTypeField[type]['label'];
      tempFields[6] = projectTypeField[type]['field'];
      setFields([...tempFields]); //change project fields based on type // projectTypeField
      setLineItems([{}]);
      let { basic } = form.getFieldsValue();
      form.setFieldsValue({
        basic: {
          ...basic,
          months: [null, null],
          scheduleId: null,
        },
      });
      if (type === 1) {
        invoiceData(type); // if project is milestone call the api
      }
    }
  };

  const invoiceData = (type) => {
    let { projectId, months = [] } = form.getFieldsValue().basic;
    //check if project type is milestone call api
    if (type || (months?.[0] && months?.[1])) {
      //else wait for date range for timebase
      getInvoiceData(
        projectId,
        formatDate(months?.[0], true, 'YYYY-MM-DD'),
        formatDate(months?.[1], true, 'YYYY-MM-DD')
      ).then((res) => {
        if (res.success) {
          let tempFields = fields;
          if (type === 1) {
            tempFields[6].data = res.resources; // if api called on milestone add schedule to select schedule
          } else {
            setUpdateData({
              refresh: true,
              records: res.resources,
              hours: res.noOfHours,
              rateKey: 0,
              visible: false,
              rateLable: 'Hourly Sell Rate',
            }); // Else if api called for timebase (after selecting date range) //show data to table
            seAttachments(res.attachments ?? []);
          }
          tempFields[7].data = res.purchaseOrders; // setting up purchaseOrders in dopdown
          setFields([...tempFields]);
        }
      });
    }
  };

  const setTableData = ({ records, effectiveGst, selectedKeys, hours, rateKey }) => {
    // can call a function from two ways after api called after selecting dateRange for timebase
    // OR
    // if selecting schedule from selectbox
    let { basic } = form.getFieldsValue();
    let { accountCode, lineAmountTypes, taxType } = basic;
    let { gstRate = 0, workingHours = 8 } = totalAmounts;

    gstRate = (effectiveGst ?? 0) / 100 || gstRate;
    workingHours = hours || workingHours;
    let selected = selectedKeys ?? selectedLineItems;
    let tableItems = records ?? lineItems;

    let subTotal = 0;
    let totalTax = 0;
    let total = 0;

    tableItems = tableItems.map((record) => {
      record.hours = parseFloat(record.hours)
      record.perHours = parseFloat(record.perHours)
      
      if (rateKey === 2) {
        // daily rates
        
        record.quantity = record.hours / workingHours;
        record.unitAmount = record.perHours * workingHours;

      } else if (rateKey === 1) {
        //hourly rates
        record.quantity = record.hours 
        record.unitAmount = record.perHours
      }
      let lineAmount = record.perHours * record.hours;
      let taxAmount =
        lineAmountTypes !== 'NoTax' ? lineAmount * parseFloat(gstRate) : 0;

        if (selected.includes(record.id)) {
        subTotal += lineAmount;
        totalTax += taxAmount;
        total += lineAmount + (lineAmountTypes === 'Exclusive' ? taxAmount : 0);
      }

      return {
        ...record,
        taxAmount: taxAmount,
        accountCode: accountCode,
        lineAmount: lineAmount,
        taxType: taxType,
      };
    });
    // console.log(selected)

    setLineItems([...tableItems]);
    setTotalAmounts({ subTotal, totalTax, total, gstRate, workingHours });
    setSelectedLineItems(selected);
    setUpdateData((prev) => ({
      refresh: false,
      visible:false,
      rateKey: prev.rateKey,
      rateLable: prev.rateLable,
    }));
  };

  // on submit
  const onFinish = ({ basic: formData }) => {
    if (selectedLineItems.length) {
      let data = {
        ...formData,
        startDate: formatDate(formData['months']?.[0], true),
        endDate: formatDate(formData['months']?.[1], true),
        dueDate: formatDate(formData.dueDate, true),
        issueDate: formatDate(formData.issueDate, true),
        lineItems: lineItems.filter((item) =>
          selectedLineItems.includes(item.id)
        ),
        attachments,
      };
      // console.log(data)
      if (visible === true) {
        createInvoice(data).then((res) => {
          if (res.success) {
            callBack();
          }
        });
      } else {
        updateInvoice(visible.id, data).then((res) => {
          if (res.success) {
            callBack();
          }
        });
      }
    } else {
      message.error('Empty Invoice Not Allowed', 3);
    }
  };

  const selectFiles = (key, fileObj) => {
    let index = attachments.findIndex((file) => file.fileId === fileObj.fileId);
    let tempAttachment = attachments;
    tempAttachment[index][key] = !tempAttachment[index][key];
    seAttachments([...tempAttachment]);
  };

  const onSelectChange = (rowKeys) => {
    // setSelectedLineItems(selectedRows);
    setUpdateData((prev) => ({
      ...prev,
      refresh: true,
      selectedKeys: rowKeys,
    }));
  };

  const rowSelection = {
    selectedLineItems,
    onChange: onSelectChange,
    preserveSelectedRowKeys: false,
    getCheckboxProps: (item) => ({ disabled: !item.id }),
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
      <Row justify="space-between" gutter={[0, 20]} style={{ marginTop: 20 }}>
        <Col span={24}>
          <ATable
            rowKey="id"
            dataSource={lineItems}
            columns={columns}
            rowSelection={!disabled&& rowSelection }
          />
        </Col>
        <Col span={10}>
          <Row justify="space-between">
            <Col span={13}>File name</Col>
            <Col>Send</Col>
            <Col style={{ marginRight: 10 }}>Attach</Col>
          </Row>
          <Upload
            // customRequest={(option) => handleUpload(option, 'tfnFile')}
            style={{
              maxHeight: 120,
              position: 'relative',
              overflowY: 'scroll',
            }}
            listType="text"
            className="invoice-upload"
            // maxCount={1}
            fileList={attachments}
            name={`TFN Declaration`}
            // onRemove={() => onRemove('tfnFile')}
            itemRender={(originNode, file, fileList, actions) => (
              <Row justify="space-between" align="center" key={file.fileId}>
                <Col span={13}>{originNode}</Col>
                <Col style={{ textAlign: 'right' }}>
                  <Checkbox
                    checked={file.includeOnline}
                    disabled={!file.attachXero}
                    onChange={() => selectFiles('includeOnline', file)}
                  />
                </Col>
                <Col style={{ textAlign: 'center', marginRight: 10 }}>
                  <Checkbox
                    checked={file.attachXero}
                    onChange={() => selectFiles('attachXero', file)}
                  />
                </Col>
              </Row>
            )}
          >
            {/* {files.tfnFile.length < 1 && (
              <Button icon={<UploadOutlined />} loading={files.tfnFile_loading}>
                Upload TFN Declaration
              </Button>
            )} */}
          </Upload>
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
              {formatCurrency(totalAmounts.subTotal)}
            </Descriptions.Item>
            <Descriptions.Item label="GST">
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
