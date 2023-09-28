import React, { Component } from 'react';
import { Modal, Tabs, Row, Col, Button, Input } from 'antd';
import {
  UploadOutlined,
  PlusSquareFilled,
  MinusCircleFilled,
  LoadingOutlined,
} from '@ant-design/icons'; //Icons

import Form from '../../../components/Core/Forms/Form';
import {
  addList,
  getContactRecord,
  editList,
} from '../../../service/conatct-person';
import {
  getStates,
  getStandardSkills,
  getOrganizations,
} from '../../../service/constant-Apis';

import { formatDate } from '../../../service/constant';

const { TabPane } = Tabs;

class InfoModal extends Component {
  constructor() {
    super();
    this.basicRef = React.createRef();
    this.associateRef = React.createRef();
    this.skillRef = React.createRef();
    this.securityRef = React.createRef();
    this.recruitmentRef = React.createRef();

    this.state = {
      editCP: false,
      basicSubmitted: false,
      associateSubmitted: false,
      detailSubmitted: false,
      skillSubmitted: false,
      securitySubmitted: false,
      recruitmentSubmitted: false,
      skill_data: [],
      orgs_data: [],
      loading: false,
      BasicFields: {
        //creating Component
        formId: 'basic_form',
        FormCol: 24,
        // FieldSpace:24,
        justifyField: 'center',
        FormLayout: 'inline',
        layout: { labelCol: { span: 10 }, wrapperCol: { span: 0 } },
        size: 'small',
        fields: [
          {
            Placeholder: 'First Name',
            rangeMin: true,
            fieldCol: 12,
            size: 'small',
            type: 'Text',
            labelAlign: 'right',
            // itemStyle:{marginBottom:'10px'},
          },
          {
            Placeholder: 'Last Name',
            rangeMin: true,
            fieldCol: 12,
            size: 'small',
            type: 'Text',
            labelAlign: 'right',
            // itemStyle:{marginBottom:'10px'},
          },

          {
            object: 'basic',
            fieldCol: 12,
            key: 'firstName',
            size: 'small',
            rules: [{ required: true, message: 'First Name is Required' }],
            type: 'input',
            labelAlign: 'right',
            itemStyle: { marginBottom: 10 },
          },
          {
            object: 'basic',
            fieldCol: 12,
            key: 'lastName',
            size: 'small',
            rules: [{ required: true, message: 'Last Name is Required' }],
            type: 'input',
            labelAlign: 'right',
            itemStyle: { marginBottom: 10 },
          },
          {
            Placeholder: 'Phone',
            fieldCol: 12,
            size: 'small',
            type: 'Text',
            labelAlign: 'right',
            // itemStyle:{marginBottom:'10px'},
          },
          {
            Placeholder: 'Email',
            rangeMin: true,
            fieldCol: 12,
            size: 'small',
            type: 'Text',
            labelAlign: 'right',
            // itemStyle:{marginBottom:'10px'},
          },
          {
            object: 'basic',
            fieldCol: 12,
            key: 'phoneNumber',
            size: 'small',
            // rules:[
            //   {
            //     // pattern: isPhone,
            //     message: 'Must contain 10 digits' 
            //   }
            // ],
            type: 'input',
            labelAlign: 'right',
            itemStyle: { marginBottom: 10 },

          },
          {
            object: 'basic',
            fieldCol: 12,
            key: 'email',
            size: 'small',
            type: 'input',
            labelAlign: 'right',
            itemStyle: { marginBottom: 10 },
            rules:[ {
              type: 'email',
              message: 'The input is not valid e-mail!',
            },
            {
              required: true,
              message: 'Please input your E-mail!',
             }],
          },
          {
            Placeholder: 'Gender',
            // rangeMin: true,
            fieldCol: 12,
            size: 'small',
            type: 'Text',
            labelAlign: 'right',
            // itemStyle:{marginBottom:'10px'},
          },
          {
            Placeholder: 'State For Payroll Tax Purpose',
            // rangeMin: true,
            fieldCol: 12,
            size: 'small',
            type: 'Text',
            labelAlign: 'right',
            // itemStyle:{marginBottom:'10px'},
          },
          {
            object: 'basic',
            fieldCol: 12,
            key: 'gender',
            // rules: [{ required: true, message: 'Gender is Required' }],
            size: 'small',
            data: [
              { label: 'Male', value: 'M' },
              { label: 'Female', value: 'F' },
              { label: 'Other', value: 'O' },
            ],
            // rules: [ { required: true, message: "Gender is Obviously required", }, ],
            type: 'Select',
            itemStyle: { marginBottom: 10 },
          },
          {
            object: 'basic',
            fieldCol: 12,
            key: 'stateId',
            // rules: [{ required: true, message: 'State is Required' }],
            size: 'small',
            // rules:[{ required: true }],
            type: 'Select',
            data: [],
            itemStyle: { marginBottom: 10 },
          },
          {
            Placeholder: "Date Of Birth",
            fieldCol: 12,
            size: "small",
            type: "Text",
            labelAlign: "right",
            itemStyle: { marginBottom: 1 },
          },
          {
            Placeholder: 'Birth Place',
            fieldCol: 12,
            size: 'small',
            type: 'Text',
            labelAlign: 'right',
            // itemStyle: { marginBottom: "10px" },
          },
          {
            object: "basic",
            fieldCol: 12,
            key: "dateOfBirth",
            size: "small",
            type: "DatePicker",
            fieldStyle: { width: "100%" },
            
            itemStyle: { marginBottom: 10 },
        },
          {
            object: 'basic',
            fieldCol: 12,
            key: 'birthPlace',
            size: 'small',
            type: 'Input',
            itemStyle: { marginBottom: 20 },
          },
          {
            Placeholder: 'Address',
            fieldCol: 24,
            size: 'small',
            type: 'Text',
            labelAlign: 'right',
            // itemStyle: { marginBottom: "10px" },
          },
          {
            object: 'basic',
            fieldCol: 24,
            key: 'address',
            size: 'small',
            type: 'Input',
            itemStyle: { marginBottom: 20 },
          },
          
          // {
          //     object: "basic",
          //     fieldCol: 12,
          //     key: "cv",
          //     size: "small",
          //     valuePropName: "fileList",
          //     getValue: true,
          //     Placeholder: (
          //         <>
          //             Click or drag CV <UploadOutlined />
          //         </>
          //     ),
          //     type: "Dragger",
          //     labelAlign: "right",
          //     itemStyle: { marginBottom: "10px" },
          //     rangeMax: false,
          //     mode: "",
          // },
          // {
          //     object: "basic",
          //     fieldCol: 12,
          //     key: "resume",
          //     size: "small",
          //     labelCol: { span: 12 },
          //     rangeMax: true,
          //     Placeholder: (
          //         <>
          //             Click or drag Cover Letter <UploadOutlined />
          //         </>
          //     ),
          //     type: "Dragger",
          //     labelAlign: "right",
          //     valuePropName: "fileList",
          //     getValue: true,
          //     mode: "",
          // },
          // {
          //     object: "basic",
          //     fieldCol: 12,
          //     key: "attach",
          //     size: "small",
          //     mode: "",
          //     Placeholder: (
          //         <>
          //             Click or drag Other Doc <UploadOutlined />
          //         </>
          //     ),

          //     type: "Dragger",
          //     labelAlign: "right",
          //     valuePropName: "fileList",
          //     getValue: true,
          // },
        ],
      },

      associateFields: {
        formId: 'associate_form',
        FormCol: 24,
        FieldSpace: 24,
        justifyField: 'center',
        FormLayout: 'inline',
        size: 'middle',
        preserve:false,
        // fields: this.newAssociateField(0),
        fields: [],
      },
      
      SkillFields: {
        formId: 'skill_form',
        FormCol: 24,
        FieldSpace: 24,
        justifyField: 'center',
        FormLayout: 'inline',
        layout: { labelCol: { span: 9 }, wrapperCol: { span: 0 } },
        size: 'middle',
        // fields: this.newSkillField(0),
        fields: [],
      },

      SecurityFields: {
        //creating Component
        formId: 'security_form',
        FormCol: 24,
        // FieldSpace:24,
        justifyField: 'center',
        FormLayout: 'inline',
        layout: { labelCol: { span: 10 }, wrapperCol: { span: 0 } },
        size: 'small',
        fields: [
          {
            Placeholder: 'Clearance Level',
            fieldCol: 12,
            size: 'small',
            type: 'Text',
            labelAlign: 'right',
            // itemStyle:{marginBottom:'10px'},
          },
          {
            Placeholder: 'Date Granted',
            fieldCol: 12,
            size: 'small',
            type: 'Text',
            labelAlign: 'right',
            // itemStyle:{marginBottom:'10px'},
          },
          {
            object: 'sec',
            fieldCol: 12,
            key: 'clearanceLevel',
            size: 'small',
            data: [
              { label: 'BV - Baseline Vetting', value: 'BV' },
              { label: 'NV1 - Negative Vetting 1', value: 'NV1' },
              { label: 'NV2 - Negative Vetting 2', value: 'NV2' },
              { label: 'PV - Positive Vetting', value: 'PV' },
              { label: 'No clearance', value: 'NC' },
            ],
            // rules: [ { required: true, message: "Gender is Obviously required", }, ],
            type: 'Select',
            itemStyle: { marginBottom: 10 },
            // onChange: (value) => {
            //   const { fields } = this.state.SecurityFields;
            //   if (value) {
            //     fields[1].rangeMin = true;
            //     fields[4].rangeMin = true;
            //     fields[5].rangeMin = true;
            //     fields[8].rangeMin = true;

            //     fields[3].rules = [
            //       { required: true, message: 'Date Granted is required' },
            //     ];
            //     fields[6].rules = [
            //       { required: true, message: 'Expiry Date is required' },
            //     ];
            //     fields[7].rules = [
            //       { required: true, message: 'Current Sponsor is required' },
            //     ];
            //     fields[9].rules = [
            //       { required: true, message: 'CS # is required' },
            //     ];
            //   } else {
            //     fields[1].rangeMin = false;
            //     fields[4].rangeMin = false;
            //     fields[5].rangeMin = false;
            //     fields[8].rangeMin = false;

            //     fields[3].rules = [{ required: false, message: '' }];
            //     fields[6].rules = [{ required: false, message: '' }];
            //     fields[7].rules = [{ required: false, message: '' }];
            //     fields[9].rules = [{ required: false, message: '' }];
            //   }
            //   this.setState({
            //     SecurityFields: {
            //       ...this.state.SecurityFields,
            //       fields: [...fields],
            //     },
            //   });
            // },
          },
          {
            object: 'sec',
            fieldCol: 12,
            key: 'clearanceGrantedDate',
            size: 'small',
            type: 'DatePicker',
            fieldStyle: { width: '100%' },
            // rules: [
            //     {
            //         required: true,
            //         message: "Date of Birth is required",
            //     },
            // ],
            itemStyle: { marginBottom: 10 },
          },
          {
            Placeholder: 'Expiry Date',
            fieldCol: 12,
            size: 'small',
            type: 'Text',
            labelAlign: 'right',
            // itemStyle:{marginBottom:'10px'},
          },
          {
            Placeholder: 'Current Sponsor',
            fieldCol: 12,
            size: 'small',
            type: 'Text',
            labelAlign: 'right',
            // itemStyle:{marginBottom:'10px'},
          },
          {
            object: 'sec',
            fieldCol: 12,
            key: 'clearanceExpiryDate',
            size: 'small',
            // rules:[{ required: true }],
            type: 'DatePicker',
            fieldStyle: { width: '100%' },
            // rules: [
            //     {
            //         required: true,
            //         message: "Date of Birth is required",
            //     },
            // ],
            itemStyle: { marginBottom: 10 },
          },
          {
            object: 'sec',
            fieldCol: 12,
            key: 'clearanceSponsorId',
            size: 'small',
            type: 'Select',
            labelAlign: 'right',
            itemStyle: { marginBottom: 10 },
          },
          {
            Placeholder: 'Clearance Subject ID',
            fieldCol: 24,
            size: 'small',
            type: 'Text',
            labelAlign: 'right',
            // itemStyle:{marginBottom:'10px'},
          },
          {
            object: 'sec',
            fieldCol: 12,
            key: 'csidNumber',
            size: 'small',
            type: 'Input',
            labelAlign: 'right',
            itemStyle: { marginBottom: 10 },
          },
        ],
      },

      RecruitmentFields: {
        //creating Component
        formId: 'recruitment_form',
        FormCol: 24,
        // FieldSpace:24,
        justifyField: 'center',
        FormLayout: 'inline',
        layout: { labelCol: { span: 10 }, wrapperCol: { span: 0 } },
        size: 'small',
        fields: [
          {
            Placeholder: 'Recruitment Prospects',
            fieldCol: 12,
            size: 'small',
            type: 'Text',
            labelAlign: 'right',
            // itemStyle:{marginBottom:'10px'},
          },
          {
            Placeholder: 'Availability',
            fieldCol: 12,
            size: 'small',
            type: 'Text',
            labelAlign: 'right',
            // itemStyle:{marginBottom:'10px'},
          },
          {
            object: 'rec',
            fieldCol: 12,
            key: 'recruitmentProspect',
            size: 'small',
            data: [
              { label: 'Not Considered', value: 'NCO' },
              { label: 'Do Not Hire', value: 'DNH' },
              { label: 'Prospect', value: 'PRO' },
              { label: 'Assigned To Opportunity', value: 'ATO' },
            ],
            // rules: [ { required: true, message: "Gender is Obviously required", }, ],
            type: 'Select',
            itemStyle: { marginBottom: 10 },
          },
          {
            object: 'rec',
            fieldCol: 12,
            key: 'recruitmentAvailability',
            size: 'small',
            data: [
              { label: 'Immediate', value: 'IMM' },
              { label: 'Within A Month', value: 'WMO' },
              { label: 'Over A Month', value: 'OMO' },
              { label: 'Long-term Propect', value: 'LTP' },
            ],
            type: 'Select',
            itemStyle: { marginBottom: 10 },
            
          },
          {
            Placeholder: 'Salary estimate',
            fieldCol: 12,
            size: 'small',
            type: 'Text',
            labelAlign: 'right',
            // itemStyle:{marginBottom:'10px'},
          },
          {
            // need exact terms
            Placeholder: 'Preferred Contract Type',
            fieldCol: 12,
            size: 'small',
            type: 'Text',
            labelAlign: 'right',
            // itemStyle:{marginBottom:'10px'},
          },
          {
            object: 'rec',
            fieldCol: 12,
            key: 'recruitmentSalaryEstimate',
            size: 'small',
            // rules:[{ required: true }],
            shape: "$",
            type: 'InputNumber',
            labelAlign: 'right',
            fieldStyle: { width: '100%' },
            itemStyle: { marginBottom: 10 },
          },
          {
            object: 'rec',
            fieldCol: 12,
            key: 'recruitmentContractType',
            size: 'small',
            type: 'Select',
            labelAlign: 'right',
            data: [
              { label: 'Part Time', value: 'PTI' },
              { label: 'Full Time', value: 'FTI' },
              { label: 'Casual', value: 'CAS' },
              { label: 'Contractor', value: 'CON' },
            ],
            itemStyle: { marginBottom: 10 },
          },
          {
            Placeholder: 'Note',
            fieldCol: 12,
            size: 'small',
            type: 'Text',
            labelAlign: 'right',
            // itemStyle:{marginBottom:'10px'},
          },
          {
            object: 'rec',
            fieldCol: 24,
            key: 'recruitmentNotes',
            // size: 'small',
            type: 'Textarea',
            rows: 6,
            // labelAlign: 'right',
            itemStyle: { marginBottom: 10 },
          },
        ],
      },
    };
  }

  componentDidMount = () => {
    // const {editCP}= this.props
    this.fetchAll();
  };

  fetchAll = () => {
    const { editCP } = this.props;
    Promise.all([getStates(), getStandardSkills(), getOrganizations()])
      .then((res) => {
        const { BasicFields, SecurityFields } = this.state;
        BasicFields.fields[11].data = res[0].data;
        SecurityFields.fields[7].data = res[2].data;
        this.setState(
          {
            BasicFields,
            SecurityFields,
            skill_data: res[1].data,
            orgs_data: res[2].data,
          },
          () => {
            if (editCP) {
              this.getRecord(editCP);
            } else {
              this.setState({
                associateFields: {
                  ...this.state.associateFields,
                  fields: this.newAssociateField(0),
                },
                SkillFields: {
                  ...this.state.SkillFields,
                  fields: this.newSkillField(0),
                },
              });
            }
          }
        );
      })
      .catch((e) => {
        console.log(e);
      });
  };

  insertSkill = () => {
    const { SkillFields } = this.state;
    let obj = SkillFields.fields[SkillFields.fields.length - 1]; // get the inster number for keys
    const item_no = obj ? parseInt(obj.key) + 1 : 0;
    SkillFields.fields = SkillFields.fields.concat(
      ...this.newSkillField(item_no)
    );
    this.setState({ SkillFields });
  };

  newSkillField = (item_no, level_data) => {
    //inserting new fields in modals
    const { skill_data } = this.state;
    const splice_key = [`skill${item_no}`, `level${item_no}`, item_no];
    return [
      {
        object: 'skill',
        fieldCol: 11,
        layout: { wrapperCol: { span: 23 } },
        key: splice_key[0],
        size: 'small',
        // rules:[{ required: true }],
        data: skill_data ? skill_data : [],
        type: 'Select',
        labelAlign: 'left',
        // rules: [
        //     {
        //         required: true,
        //         message: "skill is required",
        //     },
        // ],
        onChange: (e, value) => {
          const { SkillFields } = this.state;
          SkillFields.fields.map((el) => {
            if (el.key === splice_key[1]) {
              el.data = value ? value.levels : [];
              return el;
            } else {
              return el;
            }
          });
          let { skill } =
            this.skillRef.current.refs.skill_form.getFieldsValue(); // const
          skill[splice_key[1]] = undefined;
          this.skillRef.current.refs.skill_form.setFieldsValue({ skill });
          this.setState({ SkillFields });
        },
      },
      {
        object: 'skill',
        fieldCol: 11,
        layout: { wrapperCol: { span: 20 } },
        key: splice_key[1],
        size: 'small',
        // rules:[{ required: true }],
        data: level_data ? level_data : [],
        type: 'Select',
        labelAlign: 'left',
        itemStyle: { marginBottom: '5px' },
      },
      {
        fieldCol: 2,
        size: 'small',
        Placeholder: (
          <MinusCircleFilled style={{ color: 'red', margin: 'auto' }} />
        ),
        key: item_no,
        // rules:[{ required: true }],
        type: 'Text',
        style: {
          textAlign: 'right',
        },
        fieldStyle: {
          cursor: 'pointer',
        },
        onClick: (value, e) => {
          const { SkillFields } = this.state;
          SkillFields.fields = SkillFields.fields.filter((obj) => {
            return (
              obj.key !== splice_key[0] &&
              obj.key !== splice_key[1] &&
              obj.key !== splice_key[2]
            );
          });
          const { skill } =
            this.skillRef.current.refs.skill_form.getFieldsValue(); // const
          skill[splice_key[0]] = undefined;
          skill[splice_key[1]] = undefined;
          skill[splice_key[2]] = undefined;
          this.skillRef.current.refs.skill_form.setFieldsValue({ skill });
          this.setState({ SkillFields });
        },
      },
    ];
  };

  insertAssociate = () => {
    const { associateFields } = this.state;
    let obj = associateFields.fields[associateFields.fields.length - 1]; //get the insert number for keys
    const item_no = obj ? parseInt(obj.key) + 1 : 0;
    associateFields.fields = associateFields.fields.concat(
      ...this.newAssociateField(item_no)
    );
    this.setState({ associateFields });
  };

  newAssociateField = (item_no) => {
    const { orgs_data } = this.state;
    const splice_key = [
      `organizationId${item_no}`,
      `designation${item_no}`,
      `startDate${item_no}`,
      `endDate${item_no}`,
      `id${item_no}`,
      item_no,
    ];
    return [
      {
        object: 'asso',
        fieldCol: 6,
        layout: { wrapperCol: { span: 23 } },
        key: splice_key[0],
        size: 'small',
        data: orgs_data,
        // rules:[{ required: true }],
        type: 'Select',
        onChange: (value)=>{
          const { associateFields } = this.state;
          this.setState({
            associateFields: {
              ...associateFields,
              fields: (associateFields?.fields?? []).map((el) => {
                if (el['key'] === splice_key[2]) {
                  if (value) {
                    el['rules'][0]['required'] = true
                    return el;
                  }
                  el['rules'][0]['required'] = false
                  return el;
                }
                return el;
              }),
            },
          });
          let { asso } = this.associateRef.current.refs.associate_form.getFieldsValue(); // const
          console.log("asso", asso);
          asso[`id${item_no}`] = undefined
          this.associateRef.current.refs.associate_form.setFieldsValue({asso})
        }
      },
      {
        object: 'asso',
        fieldCol: 6,
        layout: { wrapperCol: { span: 23 } },
        key: splice_key[1],
        size: 'small',
        type: 'Input',
      },
      {
        object: 'asso',
        fieldCol: 5,
        layout: { wrapperCol: { span: 23 } },
        key: splice_key[2],
        size: 'small',
        rules: [{ required: false, message: 'Start Date Required' }],
        // rules:[{ required: true }],
        type: 'DatePicker',
      },
      {
        object: 'asso',
        fieldCol: 5,
        layout: { wrapperCol: { span: 23 } },
        key: splice_key[3],
        size: 'small',
        // rules:[{ required: true }],
        type: 'DatePicker',
      },
      {
        object: 'asso',
        fieldCol: 6,
        key: splice_key[4],
        hidden: true,
        size: 'small',
        // rules:[{ required: true }],
        type: 'Input',
      },
      {
        fieldCol: 2,
        size: 'small',
        Placeholder: (
          <MinusCircleFilled style={{ color: 'red', margin: 'auto' }} />
        ),
        key: item_no,
        // rules:[{ required: true }],
        type: 'Text',
        style: { textAlign: 'right' },
        fieldStyle: { cursor: 'pointer' },
        onClick: (value, e) => {
          const { associateFields } = this.state;
          associateFields.fields = associateFields.fields.filter((obj) => {
            return (
              obj.key !== splice_key[0] &&
              obj.key !== splice_key[1] &&
              obj.key !== splice_key[2] &&
              obj.key !== splice_key[3] &&
              obj.key !== splice_key[4] &&
              obj.key !== splice_key[5]
            );
          });
          this.setState({ associateFields });
        },
      },
    ];
  };

  submit = () => {
    //submit button click

    this.basicRef.current && this.basicRef.current.refs.basic_form.submit();
    this.associateRef.current &&
      this.associateRef.current.refs.associate_form.submit();
    this.skillRef.current && this.skillRef.current.refs.skill_form.submit();
    this.securityRef.current &&
      this.securityRef.current.refs.security_form.submit();
      this.recruitmentRef.current && this.recruitmentRef.current.refs.recruitment_form.submit();
  };

  BasicCall = (vake) => {
    // this will work after  got  Object from the skill from
    // vake.basic.stateId = null
    let basic = {
      ...vake.basic,
      dateOfBirth: formatDate(vake?.basic?.dateOfBirth, true)
    }
    this.setState(
      {
        mergeObj: {
          ...this.state.mergeObj,
          ...vake.basic,
        },
        basicSubmitted: true, // skill form submitted
      },
      () => {
        const {
          basicSubmitted,
          associateSubmitted,
          skillSubmitted,
          securitySubmitted,
          mergeObj,
        } = this.state;
        if (
          basicSubmitted &&
          associateSubmitted &&
          skillSubmitted &&
          securitySubmitted
        ) {
          //check if both form is submittef
          if (!this.props.editCP) {
            this.addPerson(mergeObj); //add skill
          } else {
            this.editRecord(mergeObj); //edit skill
          }
        }
      }
    );
  };

  AssociateCall = (vake) => {
    // this will work after  getting the Object from level form
    const { asso } = vake;
    const vars = [];
    let result = asso ? Object.keys(asso).length / 5 : 0;
    if (asso && Object.keys(asso).length > 0) {
      for (let i = 0; i < result; i++) {
        if (asso[`organizationId${i}`]) {
          vars.push({
            id: asso[`id${i}`] ?? 0,
            designation: asso[`designation${i}`],
            organizationId: asso[`organizationId${i}`],
            startDate: formatDate(asso[`startDate${i}`], true),
            endDate: formatDate(asso[`endDate${i}`], true),
          });
        }
      }
    }
    this.setState(
      {
        mergeObj: { ...this.state.mergeObj, contactPersonOrganizations: vars },
        associateSubmitted: true, // level form submitted
      },
      () => this.validateForm()
    );
  };

  SkillCall = (vake) => {
    // this will work after I get the Object from the form
    const { skill } = vake;
    const vars = [];

    for (const [key, value] of Object.entries(skill?? {})) {
      if (key.includes('level') && value) {
        vars.push(value);
      }
    }
    this.setState(
      {
        mergeObj: {
          ...this.state.mergeObj,
          standardSkillStandardLevelIds: vars,
        },
        skillSubmitted: true, // level form submitted
      },
      () => this.validateForm()
    );
  };

  SecurityCall = (vake) => {
    // this will work after  got  Object from the skill from
    // vake.basic.stateId = null
    let sec = {
      ...vake.sec,
      clearanceGrantedDate: formatDate(vake?.sec?.clearanceGrantedDate, true),
      clearanceExpiryDate: formatDate(vake?.sec?.clearanceExpiryDate, true),
    };

    this.setState(
      {
        mergeObj: {
          ...this.state.mergeObj,
          ...sec,
        },
        securitySubmitted: true, // skill form submitted
      },
      () => this.validateForm()
    );
  };

  RecruitmentCall = (vake) => {
    // this will work after  got  Object from the skill from
    // vake.basic.stateId = null
    let rec = {
      ...vake.rec,
    };

    this.setState(
      {
        mergeObj: {
          ...this.state.mergeObj,
          ...rec,
        },
        recruitmentSubmitted: true, // skill form submitted
      },
      () => this.validateForm()
    );
  };
  
  validateForm = () => {
    const {
      basicSubmitted,
      associateSubmitted,
      skillSubmitted,
      securitySubmitted,
      recruitmentSubmitted,
      mergeObj,
    } = this.state;
    if (
      basicSubmitted &&
      associateSubmitted &&
      skillSubmitted &&
      securitySubmitted && 
      recruitmentSubmitted
    ) {
      //check if both form is submittef
      if (!this.props.editCP) {
        this.addPerson(mergeObj); //add skill
      } else {
        console.log('edit');
        this.editRecord(mergeObj); //edit skill
      }
    }
  };

  addPerson = (value) => {
    const { callBack } = this.props;
    this.setState({
      basicSubmitted: false,
      associateSubmitted: false,
      detailSubmitted: false,
      skillSubmitted: false,
      securitySubmitted: false,
      recruitmentSubmitted:false,
      loading: true,
    });
    addList(value).then((res) => {
      this.setState({ loading: false });
      if (res.success) {
        callBack(res.data);
      }
    });
  };

  getRecord = (id) => {
    getContactRecord(id).then((res) => {
      if (res.success) {
        const { data } = res;
        const { SkillFields, associateFields, skill_data } = this.state;
        let skill = {};
        let asso = {};
        const skillArray = data.standardSkillStandardLevels;
        const assoArray = data.contactPersonOrganizations;
        let result =
          skillArray.length < assoArray.length
            ? assoArray.length
            : skillArray.length; // check the largest length to run loop only once not twice for two array
        for (let i = 0; i < result; i++) {
          let skillEl = skillArray[i];
          let assoEl = assoArray[i];
          if (skillEl) {
            // checking if the next skillEl have obj to insert value and fields into form
            skill_data.map((El) => {
              El.levels.map((lEl) => {
                if (lEl.value === skillEl.id) {
                  // options for level select fields
                  SkillFields.fields = SkillFields.fields.concat(
                    this.newSkillField(i, El.levels)
                  );
                  skill[`level${i}`] = lEl.value;
                  skill[`skill${i}`] = El.value;
                }
              });
            });
          }
          if (assoEl) {
            // checking if the next assoEl have obj to insert value and fields into form
            associateFields.fields = associateFields.fields.concat(
              this.newAssociateField(i)
            );
            asso[`id${i}`] = assoEl.id;
            asso[`designation${i}`] = assoEl.designation;
            asso[`organizationId${i}`] = assoEl.organizationId;
            asso[`startDate${i}`] =
              assoEl.startDate && formatDate(assoEl.startDate);
            asso[`endDate${i}`] = assoEl.endDate && formatDate(assoEl.endDate);
          }
        }
        if (skillArray.length === 0) {
          // checking if skill is not have any data when getting record to edited and insert an new Empty fields
          SkillFields.fields = SkillFields.fields.concat(this.newSkillField(0));
        }
        if (assoArray.length === 0) {
          // checking if assosiation is not have any data when getting record to edited and insert an new Empty fields
          associateFields.fields = associateFields.fields.concat(
            this.newAssociateField(0)
          );
        }
        let basic = {
          // exist: true,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          gender: data.gender,
          phoneNumber: data.phoneNumber,
          address: data.address,
          birthPlace: data.birthPlace,
          dateOfBirth: formatDate(data.dateOfBirth),
          stateId: data.stateId,
        };
        let sec = {
          clearanceLevel: data.clearanceLevel,
          clearanceGrantedDate:
            data.clearanceGrantedDate && formatDate(data.clearanceGrantedDate),
          clearanceExpiryDate:
            data.clearanceExpiryDate && formatDate(data.clearanceExpiryDate),
          clearanceSponsorId: data.clearanceSponsorId,
          csidNumber: data.csidNumber,
        };
        let rec = {
          recruitmentProspect: data.recruitmentProspect ,
          recruitmentAvailability: data.recruitmentAvailability ,
          recruitmentSalaryEstimate: data.recruitmentSalaryEstimate ,
          recruitmentNotes: data.recruitmentNotes ,
          recruitmentContractType: data.recruitmentContractType,
        };

        this.basicRef.current.refs.basic_form.setFieldsValue({ basic: basic });
        this.associateRef.current.refs.associate_form.setFieldsValue({
          asso: asso,
        });
        this.skillRef.current.refs.skill_form.setFieldsValue({ skill: skill });
        this.securityRef.current.refs.security_form.setFieldsValue({ sec });
        this.recruitmentRef.current.refs.recruitment_form.setFieldsValue({ rec });
        this.setState({ associateFields, SkillFields });
      }
    });
  };

  editRecord = (value) => {
    const { editCP, callBack } = this.props;
    value.id = editCP;
    this.setState({
      basicSubmitted: false,
      associateSubmitted: false,
      detailSubmitted: false,
      skillSubmitted: false,
      securitySubmitted: false,
      recruitmentSubmitted:false,
      loading: true,
    });
    editList(value).then((res) => {
      this.setState({ loading: false });
      if (res.success) {
        callBack(res.data);
      }
    });
  };

  onCancel = () => {
    const { BasicFields, associateFields, SkillFields } = this.state;

    delete BasicFields.initialValues; // delete initialValues of fields on close
    delete associateFields.initialValues;
    delete SkillFields.initialValues;
    this.setState(
      {
        basicSubmitted: false,
        associateSubmitted: false,
        skillSubmitted: false,
        recruitmentSubmitted: false,
        BasicFields: { ...BasicFields }, //delete Formfields on Close
        associateFields: { ...associateFields },
        SkillFields: { ...SkillFields },
        mergeObj: {},
      },
      () => {
        this.props.close();
      }
    );
  };

  render() {
    const { editCP, visible, contactStatus= 'Contact Person' } = this.props;
    const {
      BasicFields,
      associateFields,
      SkillFields,
      SecurityFields,
      RecruitmentFields,
      loading,
    } = this.state;
    return (
      <Modal
        title={editCP ? 'Edit Contact' : 'Add Contact'}
        maskClosable={false}
        centered
        visible={visible}
        onOk={() => {
          this.submit();
        }}
        okButtonProps={{ disabled: loading }}
        okText={loading ? <LoadingOutlined /> : 'Save'}
        onCancel={this.onCancel}
        width={900}
      >
        <Tabs type="card">
          <TabPane tab="Basic" key="basic" forceRender>
            <Form
              ref={this.basicRef}
              Callback={this.BasicCall}
              FormFields={BasicFields}
            />
          </TabPane>
          <TabPane tab="Association" key="association" forceRender>
            <Row justify="end">
              <Col>
                <Button
                  type="primary"
                  size="small"
                  onClick={this.insertAssociate}
                >
                  <PlusSquareFilled /> Insert Association
                </Button>
              </Col>
              <Col span="24">
                <Row>
                  <Col span="6">Organisation</Col>
                  <Col span="6">Designation</Col>
                  <Col span="5">Start Date</Col>
                  <Col span="5">End Date</Col>
                </Row>
              </Col>
            </Row>
            <Row>
              <Form
                ref={this.associateRef}
                Callback={this.AssociateCall}
                FormFields={associateFields}
              />
            </Row>
          </TabPane>
          <TabPane tab="Skill" key="skill" forceRender>
            <Row justify="end">
              <Col>
                <Button type="primary" size="small" onClick={this.insertSkill}>
                  <PlusSquareFilled /> Insert Skill
                </Button>
              </Col>
              <Col span="24">
                <Row>
                  <Col span="11">Standard Skill</Col>
                  <Col span="11">Standard Level</Col>
                </Row>
              </Col>
            </Row>
            <Row>
              <Form
                ref={this.skillRef}
                Callback={this.SkillCall}
                FormFields={SkillFields}
              />
            </Row>
          </TabPane>
          <TabPane tab="Security Clearance" key="security" forceRender>
            <Form
              ref={this.securityRef}
              Callback={this.SecurityCall}
              FormFields={SecurityFields}
            />
          </TabPane>
          {/* //temp work// */}
          <TabPane tab="Recruitment" key="recruitment" forceRender disabled={contactStatus !=='Contact Person'}>
            <Form
              ref={this.recruitmentRef}
              Callback={this.RecruitmentCall}
              FormFields={RecruitmentFields}
            />
          </TabPane>
        </Tabs>
      </Modal>
    );
  }
}

export default InfoModal;
