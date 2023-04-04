import React, { useEffect, useState } from 'react';
import { Button, Col, Form, Upload, message } from 'antd';
import FormItems from '../../components/Core/Forms/FormItems';
import { upadteSettings } from '../../service/Login-Apis';
import { UploadOutlined } from '@ant-design/icons'; //Icons

import { localStore } from '../../service/constant';
import { addFiles } from '../../service/Attachment-Apis';

function OtherDetails(props) {
  const [form] = Form.useForm();
  const [files, setFiles] = useState({
    detailFile: [],
    detailFile_loading: false,
    bankFile: [],
    bankFile_loading: false,
  });

  const [detailFields, setDetailsFields] = useState([
    {
      Placeholder: 'Superannuation',
      fieldCol: 24,
      size: 'small',
      type: 'Title',
      mode: 3,
      labelAlign: 'right',
    },
    {
      Placeholder: 'Superannuation Fund/ SMSF Name',
      fieldCol: 12,
      size: 'small',
      type: 'Text',
      labelAlign: 'right',
    },
    {
      Placeholder: 'Account type',
      fieldCol: 12,
      size: 'small',
      type: 'Text',
      labelAlign: 'right',
    },
    {
      object: 'detail',
      fieldCol: 12,
      key: 'superannuationName',
      size: 'small',
      // rules:[{ required: true }],
      type: 'Input',
      itemStyle: { marginBottom: 20 },
    },
    {
      object: 'detail',
      fieldCol: 12,
      key: 'superannuationType',
      size: 'small',
      data: [
        { label: 'Public', value: 'P' },
        { label: 'SMSF', value: 'S' },
      ],
      // rules: [ { required: true, message: "Gender is Obviously required", }, ],
      type: 'Select',
      itemStyle: { marginBottom: 20 },
      onChange: (value) => {
        onFundType(value);
      },
    },
  ]);

  const [kinFields, setKinFields] = useState([
    {
      Placeholder: 'Next Of Kin',
      fieldCol: 24,
      size: 'small',
      type: 'Title',
      mode: 3,
      labelAlign: 'right',
      // itemStyle:{marginBottom:'20px'},
    },
    {
      Placeholder: 'Name',
      fieldCol: 12,
      size: 'small',
      type: 'Text',
      labelAlign: 'right',
      // itemStyle:{marginBottom:'20px'},
    },
    {
      Placeholder: 'Phone',
      fieldCol: 12,
      size: 'small',
      type: 'Text',
      labelAlign: 'right',
      // itemStyle:{marginBottom:'20px'},
    },
    {
      object: 'kin',
      fieldCol: 12,
      key: 'nextOfKinName',
      size: 'small',
      // rules:[{ required: true }],
      type: 'input',
      // rules: [
      //     {
      //         // required: true,
      //         type: "string",
      //         message: "Enter minimum 8 Numbers",
      //         min: 6,
      //     },
      // ],
      itemStyle: { marginBottom: 20 },
    },
    {
      object: 'kin',
      fieldCol: 12,
      key: 'nextOfKinPhoneNumber',
      size: 'small',
      // rules:[{ required: true }],
      type: 'input',
      // rules: [
      //     {
      //         required: true,
      //         message: "First Name is required",
      //     },
      // ],
      itemStyle: { marginBottom: 20 },
    },
    {
      Placeholder: 'Email',
      fieldCol: 12,
      size: 'small',
      type: 'Text',
      labelAlign: 'right',
      // itemStyle:{marginBottom:'20px'},
    },
    {
      Placeholder: 'Relationship to Employee',
      fieldCol: 12,
      size: 'small',
      type: 'Text',
      labelAlign: 'right',
      // itemStyle:{marginBottom:'20px'},
    },
    {
      object: 'kin',
      fieldCol: 12,
      key: 'nextOfKinEmail',
      size: 'small',
      // rules:[{ required: true }],
      type: 'input',
      itemStyle: { marginBottom: 20 },
    },
    {
      object: 'kin',
      fieldCol: 12,
      key: 'nextOfKinRelation',
      size: 'small',
      // rules:[{ required: true }],
      data: [
        { label: 'Spouse', value: 'Spouse' },
        { label: 'Partner', value: 'Partner' },
        { label: 'Sibling', value: 'Sibling' },
        { label: 'Parent', value: 'Parent' },
        { label: 'Child', value: 'Child' },
        { label: 'Friend', value: 'Friend' },
      ],
      type: 'Select',
    },
  ]);

  const [bankFields, setBankFields] = useState([
    {
      Placeholder: 'Bank Details',
      fieldCol: 24,
      size: 'small',
      type: 'Title',
      mode: 3,
      labelAlign: 'right',
    },
    {
      Placeholder: 'Bank Account Name',
      fieldCol: 12,
      size: 'small',
      type: 'Text',
      labelAlign: 'right',
    },
    {
      Placeholder: 'Bank Account Number',
      fieldCol: 12,
      size: 'small',
      type: 'Text',
      labelAlign: 'right',
    },
    {
      object: 'bank',
      fieldCol: 12,
      key: 'bankName',
      size: 'small',
      type: 'Input',
      onChange: (e) => {
        setBankReq(e);
      },
      itemStyle: { marginBottom: 20 },
    },
    {
      object: 'bank',
      fieldCol: 12,
      key: 'bankAccountNo',
      size: 'small',
      type: 'Input',
      onChange: (e) => {
        setBankReq(e);
      },
      itemStyle: { marginBottom: 20 },
    },
    {
      Placeholder: 'BSB Number',
      fieldCol: 12,
      size: 'small',
      type: 'Text',
      labelAlign: 'right',
    },
    {
      Placeholder: 'Tax File Number',
      fieldCol: 12,
      size: 'small',
      type: 'Text',
      labelAlign: 'right',
    },
    {
      object: 'bank',
      fieldCol: 12,
      key: 'bankBsb',
      size: 'small',
      type: 'Input',
      onChange: (e) => {
        setBankReq(e);
      },
      itemStyle: { marginBottom: 20 },
    },
    {
      object: 'bank',
      fieldCol: 12,
      key: 'tfn',
      size: 'small',
      type: 'Input',
      onChange: (e) => {
        setBankReq(e);
      },
      itemStyle: { marginBottom: 20 },
    },
    {
      Placeholder: 'Tax-free Threshold',
      fieldCol: 12,
      size: 'small',
      type: 'Text',
      labelAlign: 'right',
    },
    {
      Placeholder: 'HELP (HECS)',
      fieldCol: 12,
      size: 'small',
      type: 'Text',
      labelAlign: 'right',
    },
    {
      object: 'bank',
      fieldCol: 12,
      key: 'taxFreeThreshold',
      size: 'small',
      data: [
        { label: 'Yes', value: true },
        { label: 'No', value: false },
      ],
      // rules: [ { required: true, message: "Gender is Obviously required", }, ],
      type: 'Select',
      // mode: "button",
      // shape: "solid",
      itemStyle: { marginBottom: 20 },
    },
    {
      object: 'bank',
      fieldCol: 12,
      key: 'helpHECS',
      size: 'small',
      data: [
        { label: 'Yes', value: true },
        { label: 'No', value: false },
      ],
      // rules: [ { required: true, message: "Gender is Obviously required", }, ],
      type: 'Select',
      // mode: "button",
      // shape: "solid",
      itemStyle: { marginBottom: 20 },
    },
  ]);
  const [permissions, setPermissions] = useState({});
  // const [trainField, setTrainFields] = useState([
  //     {
  //         Placeholder: "Training",
  //         fieldCol: 24,
  //         size: "small",
  //         type: "Title",
  //         mode: 3,
  //         labelAlign: "right",
  //     },
  //     {
  //         object: "train",
  //         fieldCol: 24,
  //         key: "training",
  //         size: "small",
  //         mode:{ minRows: 8, maxRows:12},
  //         // rules:[{ required: true }],
  //         type: "Textarea",
  //     },
  // ]);

  useEffect(() => {
    const { train, bank, kin, detail } = props.data;
    form.setFieldsValue({ train, bank, kin, detail });
    onFundType();
    setBankReq();
    setFiles({
        detailFile: detail.file,
        detailFile_loading: false,
        bankFile: bank.file,
        bankFile_loading: false,
    });
    
  }, []);

  const onFundType = (value) => {
    const superannuation = [
      {
        Placeholder: 'Membership / Account',
        rangeMin: true,
        fieldCol: 12,
        size: 'small',
        type: 'Text',
        labelAlign: 'right',
      },
      {
        Placeholder: 'USI Number',
        rangeMin: true,
        fieldCol: 12,
        size: 'small',
        type: 'Text',
        labelAlign: 'right',
      },
      {
        object: 'detail',
        fieldCol: 12,
        key: 'superannuationBankAccountOrMembershipNumber',
        size: 'small',
        type: 'Input',
        rules: [
          { required: true, message: 'Membership / Account is required' },
        ],
        itemStyle: { marginBottom: 20 },
      },
      {
        object: 'detail',
        fieldCol: 12,
        key: 'superannuationAbnOrUsi',
        size: 'small',
        type: 'Input',
        rules: [{ required: true, message: 'USI Number is required' }],
        itemStyle: { marginBottom: 20 },
      },
    ];

    const smsf = [
      {
        Placeholder: 'SMSF ABN',
        rangeMin: true,
        fieldCol: 12,
        size: 'small',
        type: 'Text',
        labelAlign: 'right',
      },
      {
        Placeholder: 'ESA Address',
        rangeMin: true,
        fieldCol: 12,
        size: 'small',
        type: 'Text',
        labelAlign: 'right',
      },
      {
        object: 'detail',

        fieldCol: 12,
        key: 'superannuationAbnOrUsi',
        size: 'small',
        type: 'Input',
        rules: [{ required: true, message: 'SMSF ABN is required' }],
        itemStyle: { marginBottom: 20 },
      },
      {
        object: 'detail',
        fieldCol: 12,
        key: 'superannuationAddress',
        size: 'small',
        type: 'Input',
        rules: [{ required: true, message: 'ESA Address is required' }],
        itemStyle: { marginBottom: 20 },
      },
      {
        Placeholder: 'Bank Account Name',
        rangeMin: true,
        fieldCol: 12,
        size: 'small',
        type: 'Text',
        labelAlign: 'right',
      },
      {
        Placeholder: 'BSB Number',
        rangeMin: true,
        fieldCol: 12,
        size: 'small',
        type: 'Text',
        labelAlign: 'right',
      },
      {
        object: 'detail',
        fieldCol: 12,
        key: 'superannuationBankName',
        size: 'small',
        type: 'Input',
        rules: [{ required: true, message: 'Account Name is required' }],
        itemStyle: { marginBottom: 20 },
      },
      {
        object: 'detail',
        fieldCol: 12,
        key: 'superannuationBankBsb',
        size: 'small',
        type: 'Input',
        rules: [{ required: true, message: 'BSB Number is required' }],
        itemStyle: { marginBottom: 20 },
      },
      {
        Placeholder: 'Bank Account Number',
        rangeMin: true,
        fieldCol: 24,
        size: 'small',
        type: 'Text',
        labelAlign: 'right',
      },
      {
        object: 'detail',
        fieldCol: 12,
        key: 'superannuationBankAccountOrMembershipNumber',
        size: 'small',
        type: 'Input',
        rules: [{ required: true, message: 'Account Number is required' }],
        itemStyle: { marginBottom: '20px' },
      },
    ];
    const { detail } = form.getFieldsValue(); // get the values from from data
    const { superAnnuationName, superannuationType } = detail;
    let newFields = detailFields;
    if (superannuationType === 'P') {
      newFields.splice(5, newFields.length);
      newFields = newFields.concat(superannuation);
    } else if (superannuationType === 'S') {
      newFields.splice(5, newFields.length);
      newFields = newFields.concat(smsf);
    } else {
      newFields.splice(5, newFields.length);
    }
    const details = {
      superAnnuationName: superAnnuationName,
      superannuationType: superannuationType,
    };
    form.setFieldsValue({ detail: details });
    setDetailsFields(newFields);
  };

  const setBankReq = () => {
    const { PROFILE } = JSON.parse(localStore().permissions);
    const { bank } = form.getFieldsValue(); // const
    const { bankAccountNo, bankBsb, bankName, tfn } = bank;
    let newFields = bankFields;
    if (bankAccountNo || bankBsb || bankName || tfn) {
      newFields[1].rangeMin = true;
      newFields[2].rangeMin = true;
      newFields[5].rangeMin = true;
      newFields[6].rangeMin = true;

      newFields[3].rules = [
        { required: true, message: 'Account Name is required' },
      ];
      newFields[4].rules = [
        { required: true, message: 'Account Number is required' },
      ];
      newFields[7].rules = [
        { required: true, message: 'BSB Number is required' },
      ];
      newFields[8].rules = [
        { required: true, message: 'Tax File Number is required' },
      ];
    } else {
      newFields[1].rangeMin = false;
      newFields[2].rangeMin = false;
      newFields[5].rangeMin = false;
      newFields[6].rangeMin = false;

      newFields[3].rules = [{ required: false, message: '' }];
      newFields[4].rules = [{ required: false, message: '' }];
      newFields[7].rules = [{ required: false, message: '' }];
      newFields[8].rules = [{ required: false, message: '' }];
    }
    setBankFields([...newFields]);
    setPermissions(PROFILE);
  };

  const changeSetings = (values) => {
    const obj = {
      ...values.detail,
      ...values.kin,
      ...values.bank,
      superannuationFileId: files.detailFile?.[0]?.fileId,
      bankAccountFileId: files.bankFile?.[0]?.fileId,
    };
    console.log({files, obj})
    upadteSettings(obj).then((res) => {
      if (res.success) {
        // console.log(res.data);
      }
    });
  };

  const handleUpload = async (
    { onSuccess, onError, file, onProgress },
    key_file
  ) => {
    setFiles((prev) => ({ ...prev, [`${key_file}_loading`]: true }));
    let ext = file.name.split('.');
    if ('pdf' === ext[ext.length - 1]) {
      const formData = new FormData();
      const config = {
        headers: { 'content-type': 'multipart/form-data' },
      };
      formData.append('files', file);
      addFiles(formData, config).then((res, err) => {
        if (res.success) {
          onSuccess('Ok');
          setFiles((prev) => ({
            ...prev,
            [key_file]: [res.file],
            [`${key_file}_loading`]: false,
          }));
        } else {
          console.log('Eroor: ', err);
          const error = new Error('Some error');
          setFiles((prev) => ({ ...prev, [`${key_file}_loading`]: false }));
          onError({ error });

        }
      });
    } else {
      message.error({
        content: 'Only Pdfs Files Are Allowed ',
        key: 1,
      });
      setFiles((prev) => ({ ...prev, [`${key_file}_loading`]: false }));
    }
  };

  const onRemove = (key_file) => {
    setFiles((prev) => ({ ...prev, [key_file]: [] }));
  };

  return (
    <Form
      id={'my-form'}
      form={form}
      scrollToFirstError={true}
      size="small"
      layout="inline"
      style={{ padding: 50, paddingTop: 20 }}
      onFinish={changeSetings}
    >
      <FormItems FormFields={detailFields} />
      <Col span={12} style={{ marginBottom: 20 }}>
        <Upload
          customRequest={(option) =>
            handleUpload(option, 'detailFile')
          }
          listType="text"
          maxCount={1}
          name={'super form'}
          fileList={files.detailFile}
          onRemove={() => onRemove('detailFile')}
        >
          {files.detailFile.length < 1 && (
            <Button
              icon={<UploadOutlined />}
              loading={files.detailFile_loading}
            >
              Upload Superannuation
            </Button>
          )}
        </Upload>
      </Col>
      <FormItems FormFields={kinFields} />
      <FormItems FormFields={bankFields} />
      <Col span={12} style={{ marginBottom: 10 }}>
        <Upload
          customRequest={(option) => handleUpload(option, 'bankFile')}
          listType="text"
          maxCount={1}
          fileList={files.bankFile}
          name={`TFN Declaration`}
          onRemove={() => onRemove('bankFile')}
        >
          {files.bankFile.length < 1 && (
            <Button icon={<UploadOutlined />} loading={files.bankFile_loading}>
              Upload Bank Details
            </Button>
          )}
        </Upload>
      </Col>
      <Col span={24} style={{ padding: 20 }}>
        <Button
          htmlType={'submit'}
          type="primary"
          size="middle"
          style={{ float: 'right' }}
        >
          Save
        </Button>
      </Col>
    </Form>
  );
}

export default OtherDetails;
