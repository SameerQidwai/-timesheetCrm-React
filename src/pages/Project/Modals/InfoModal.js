import React, { Component } from "react";
import { Modal, Tabs, Form } from "antd";
import { LoadingOutlined } from "@ant-design/icons"; //Icons
import FormItems from "../../../components/Core/Forms/FormItems";

import { addList, getRecord, editList } from "../../../service/projects";
import { getOrganizations, getStates, getOrgPersons, getPanels, getProjects, } from "../../../service/constant-Apis";
import { formatDate } from "../../../service/constant";

const { TabPane } = Tabs;

class InfoModal extends Component {
  constructor() {
    super();
    this.formRef = React.createRef();

    this.state = {
      editPro: false,
      basicSubmitted: false,

      check: false,
      leadValue: 0,
      SKILLS: [],
      STATES: [],
      ORGS: [],
      loading: false,

      BasicFields: [
        {
          Placeholder: "Panel",
          rangeMin: true,
          fieldCol: 12,
          size: "small",
          type: "Text",
          labelAlign: "right",
          // itemStyle:{marginBottom:'10px'},
        },
        {
          Placeholder: "Organisation",
          rangeMin: true,
          fieldCol: 12,
          size: "small",
          type: "Text",
          labelAlign: "right",
          // itemStyle:{marginBottom:'10px'},
        },
        {
          object: "basic",
          fieldCol: 12,
          key: "panelId",
          size: "small",
          rules: [{ required: true, message: "Panel is Required" }],
          data: [],
          type: "Select",
        },
        {
          object: "basic",
          fieldCol: 12,
          key: "organizationId",
          size: "small",
          rules: [{ required: true, message: "Organisation" }],
          data: [],
          type: "Select",
          onChange: (value) => {
            if (value) {
              const customUrl = `helpers/contact-persons?organizationId=${value}&associated=1`
              getOrgPersons(customUrl).then((res) => {
                if (res.success) {
                  const { BasicFields } = this.state;
                  BasicFields[6].data = res.data;
                  this.setState({ BasicFields });
                }
              });
            } else {
              const { BasicFields } = this.state;
              BasicFields[6].data = [];
              const { basic, } = this.formRef.current.getFieldsValue();
              basic.contactPersonId = undefined;
              this.formRef.current.setFieldsValue({ basic: basic, });
              this.setState({ BasicFields });
            }
          },
        },
        {
          Placeholder: "Customer Representative",
          fieldCol: 12,
          size: "small",
          type: "Text",
          labelAlign: "right",
          // itemStyle:{marginBottom:'10px'},
        },
        {
          Placeholder: "Name",
          rangeMin: true,
          fieldCol: 12,
          size: "small",
          type: "Text",
          labelAlign: "right",
          // itemStyle:{marginBottom:'10px'},
        },
        {
          object: "basic",
          fieldCol: 12,
          key: "contactPersonId",
          size: "small",
          // rules:[{ required: true }],
          data: [],
          type: "Select",
        },
        {
          object: "basic",
          fieldCol: 12,
          key: "title",
          size: "small",
          rules: [{ required: true, message: "Name is Required" }],
          type: "Input",
        },
        {
          Placeholder: "Type",
          rangeMin: true,
          fieldCol: 12,
          size: "small",
          type: "Text",
          labelAlign: "right",
          // itemStyle:{marginBottom:'10px'},
        },
        {
          Placeholder: "State",
          fieldCol: 12,
          size: "small",
          type: "Text",
          labelAlign: "right",
          // itemStyle:{marginBottom:'10px'},
        },
        {
          object: "basic",
          fieldCol: 12,
          key: "type",
          size: "small",
          rules: [{ required: true, message: "Type is Required" }],
          data: [
            { label: "Milestone", value: 1 },
            { label: "Time & Materials", value: 2 },
          ],
          type: "Select",
        },
        {
          object: "basic",
          fieldCol: 12,
          key: "stateId",
          size: "small",
          // rules:[{ required: true }],
          data: [],
          type: "Select",
          itemStyle: { marginBottom: "10px" },
        },
        {
          Placeholder: "Qualified Ops",
          fieldCol: 12,
          size: "small",
          type: "Text",
          labelAlign: "right",
          // itemStyle:{marginBottom:'10px'},
        },
        {
          Placeholder: "Linked Project",
          fieldCol: 12,
          size: "small",
          type: "Text",
          labelAlign: "right",
          // itemStyle:{marginBottom:'10px'},
      },
        {
          object: "basic",
          fieldCol: 12,
          key: "qualifiedOps",
          // label: "Qualified Ops",
          size: "small",
          data: [
            { label: "True", value: true },
            { label: "False", value: false },
          ],
          // rules: [
          //     {
          //         required: true,
          //         message: "Gender is Obviously required",
          //     },
          // ],
          itemStyle: { marginBottom: 1 },
          // rules:[{ required: true }],
          type: "Select",
        },
      {
          object: "basic",
          fieldCol: 12,
          key: "linkedWorkId",
          // label: "Qualified Ops",
          size: "small",
          data: [ ],
          // rules: [
          //     {
          //         required: true,
          //         message: "Gender is Obviously required",
          //     },
          // ],
          itemStyle: { marginBottom: 1 },
          type: "Select",
      },     
      ],
      
      tenderFields: [
        {
          Placeholder: "Tender Title",
          fieldCol: 12,
          size: "small",
          type: "Text",
          labelAlign: "right",
          // itemStyle:{marginBottom:'10px'},
        },
        {
          Placeholder: "Tender Number",
          size: "small",
          fieldCol: 12,
          type: "Text",
          labelAlign: "right",
          // itemStyle:{marginBottom:'10px'},
        },
        {
          object: "tender",
          fieldCol: 12,
          key: "tender",
          size: "small",
          // rules:[{ required: true }],
          type: "Input",
        },
        {
          object: "tender",
          fieldCol: 12,
          key: "tenderNumber",
          size: "small",
          // rules:[{ required: true }],
          type: "Input",
        },
      ],

      
      BillingFields: [
        {
          Placeholder: "Estimated Value",
          fieldCol: 12,
          size: "small",
          type: "Text",
          labelAlign: "right",
          // itemStyle:{marginBottom:'10px'},
        },
        {
          Placeholder: "Contribution Margin as a %",
          size: "small",
          fieldCol: 12,
          type: "Text",
          labelAlign: "right",
          // itemStyle:{marginBottom:'10px'},
        },
        {
          object: "billing",
          fieldCol: 12,
          key: "value",
          size: "small",
          shape: "$",
          // rules:[{ required: true }],
          type: "InputNumber",
          onChange: (value) => {
            const { billing, } = this.formRef.current.getFieldsValue();
            billing.cm$ = (billing.cmPercentage ? (value * billing.cmPercentage) / 100 : 0).toFixed(2);
            billing.discount = billing.goget ? (value * billing.goget) / 100 : 0;
            billing.upside = billing.discount ? value - billing.discount : 0;
            this.formRef.current.setFieldsValue({ billing: billing, });
          },
          fieldStyle: { width: "100%" },
        },
        {
          object: "billing",
          fieldCol: 12,
          key: "cmPercentage",
          size: "small",
          shape: "%",
          // rules:[{ required: true }],
          type: "InputNumber",
          rangeMin: 0,
          rangeMax: 100,
          fieldStyle: { width: "100%" },
          onChange: (value) => {
            const { billing, } = this.formRef.current.getFieldsValue();
            billing.cm$ = (billing.value ? (billing.value * value) / 100 : 0).toFixed(2);
            this.formRef.current.setFieldsValue({ billing: billing, });
          },
        },
        {
          Placeholder: "Contribution Margin",
          size: "small",
          fieldCol: 24,
          type: "Text",
          labelAlign: "right",
          // itemStyle:{marginBottom:'10px'},
        },
        {
          object: "billing",
          fieldCol: 12,
          key: "cm$",
          size: "small",
          shape: "$",
          readOnly: true,
          // rules:[{ required: true }],
          type: "InputNumber",
          fieldStyle: { width: "100%" },
        },
        // {
      ],

      DatesFields: [
        {
          Placeholder: "Start Date",
          rangeMin: true,
          fieldCol: 12,
          size: "small",
          type: "Text",
          labelAlign: "right",
          // itemStyle:{marginBottom:'10px'},
        },
        {
          Placeholder: "End Date",
          rangeMin: true,
          fieldCol: 12,
          size: "small",
          type: "Text",
          labelAlign: "right",
          // itemStyle:{marginBottom:'10px'},
        },
        {
          object: "dates",
          fieldCol: 12,
          key: "startDate",
          size: "small",
          type: "DatePicker",
          rules: [{ required: true, message: "Start Date is Required" }],
          fieldStyle: { width: "100%" },
          rangeMin: (current)=>{
              const { dates } = this.formRef.current.getFieldValue();
              return  dates.endDate && current > dates.endDate
          }
        },
        {
          object: "dates",
          fieldCol: 12,
          key: "endDate",
          rules: [{ required: true, message: "End Date is Required" }],
          size: "small",
          type: "DatePicker",
          fieldStyle: { width: "100%" },
          rangeMax: (current)=>{
              const { dates } = this.formRef.current.getFieldValue();
              return  dates.startDate && current < dates.startDate
          }
        },
  
        {
          Placeholder: "Work Hours Per Day",
          rangeMin: true,
          fieldCol: 12,
          size: "small",
          type: "Text",
          labelAlign: "right",
          // itemStyle:{marginBottom:'10px'},
        },
        {
          Placeholder: "Entry Date",
          fieldCol: 12,
          size: "small",
          type: "Text",
          labelAlign: "right",
          // itemStyle:{marginBottom:'10px'},
        },
        {
          object: "dates",
          fieldCol: 12,
          key: "hoursPerDay",
          size: "small",
          rangeMin: 0,
          rangeMax: 24,
          rules: [{ required: true, message: "Dailty Hours is Required" }],
          type: "InputNumber",
          fieldStyle: { width: "100%" },
        },
        {
          object: "dates",
          fieldCol: 12,
          key: "entryDate",
          size: "small",
          type: "DatePicker",
          fieldStyle: { width: "100%" },
        },
      ],

      ManageFields: [
        {
          Placeholder: "Account Director",
          fieldCol: 12,
          size: "small",
          type: "Text",
          labelAlign: "right",
        },
        {
          Placeholder: "Account Manager",
          fieldCol: 12,
          size: "small",
          type: "Text",
          labelAlign: "right",
        },
        {
          object: "manage",
          fieldCol: 12,
          key: "accountDirectorId",
          size: "small",
          data: [],
          type: "Select",
        },
        {
          object: "manage",
          fieldCol: 12,
          key: "accountManagerId",
          size: "small",
          data: [],
          type: "Select",
        },
        {
          Placeholder: "Project Manager",
          fieldCol: 24,
          size: "small",
          type: "Text",
          labelAlign: "right",
        },
        {
          object: "manage",
          fieldCol: 12,
          key: "projectManagerId",
          size: "small",
          data: [],
          type: "Select",
        },
      ],  
    };
  }
  componentDidMount = () => {
    this.fetchAll();
  };

  fetchAll = () => {
    const { editPro } = this.props;
    const customUrl = `helpers/contact-persons?active=1&employee=1&associated=1&label=1`
    Promise.all([ getPanels(), getOrganizations(1), getStates(), getOrgPersons(customUrl), editPro && this.getRecord(editPro), getProjects()])
      .then((res) => {
        // if (res[1].success) {
        //   res[1].data[0].disabled = true;
        // }
        const { BasicFields, ManageFields } = this.state;
        BasicFields[2].data = res[0].success ? res[0].data : [];
        BasicFields[3].data = res[1].success ? res[1].data : [];
        BasicFields[11].data = res[2].success ? res[2].data : [];
        BasicFields[6].data = res[4].success ? res[4].data : [];
        BasicFields[15].data = res[5].success ? res[5].data : [];
        
        ManageFields[2].data = res[3].success ? res[3].data : [];
        ManageFields[3].data = res[3].success ? res[3].data : [];
        ManageFields[5].data = res[3].success ? res[3].data : [];
        // ManageFields[7].data = res[4].success ? res[4].data: [];

        this.setState({ BasicFields, ManageFields });
    })
    .catch((e) => {
    console.log(e);
    });
  };

  onFinish = (vake) => { 
    // this will work after  got  Object from the skill from
    const { basic, tender, dates, billing, manage } = vake
    const { editPro } = this.props

    const form_value = {
        panelId: basic.panelId ?? null,
        organizationId: basic.organizationId ?? null,
        contactPersonId: basic.contactPersonId ?? null,
        title: basic.title ?? '',
        type: basic.type ?? '',
        stateId: basic.stateId ?? null,
        qualifiedOps: basic.qualifiedOps ?? false,
        linkedWorkId: basic.linkedWorkId?? null,

        tender: tender.tender ?? '',
        tenderNumber: tender.tenderNumber ?? '',

        value: billing.value ?? 0,
        cmPercentage: billing.cmPercentage ?? 0,
        goPercentage: billing.goPercentage ?? 0,
        getPercentage: billing.getPercentage ?? 0,

        accountDirectorId: manage.accountDirectorId ?? null,
        accountManagerId: manage.accountManagerId ?? null,
        projectManagerId: manage.projectManagerId ?? null, 

        hoursPerDay: dates.hoursPerDay,
        startDate: formatDate(dates.startDate, true),
        endDate: formatDate(dates.endDate, true),
        entryDate: formatDate(dates.entryDate, true),
    }

    if (!editPro) {
            
        this.addProject(form_value); //add skill
    } else {
        
        this.editRecord(form_value); //edit skill
    }
  };

  addProject = (value) => {
    const { callBack } = this.props;
    this.setState({ loading: true, });
    addList(value).then((res) => {
      if (res.success) {
        callBack();
      }else{
        this.setState({ loading: false })
      }
    });
  };

  getRecord = (id) => {
    const { ManageFields } = this.state;
    return getRecord(id).then((res) => {
      if (res.success) {
        const { basic, tender, billing, dates, manage } = res;

        const customUrl = `helpers/contact-persons?organizationId=${basic.organizationId}&associated=1` 
        const contactPersons = getOrgPersons(customUrl)
        this.formRef.current.setFieldsValue({ basic: basic, tender: tender, billing: billing, dates: dates, manage: manage });
        return contactPersons;
      }
    });
  };

  editRecord = (data) => {
    const { editPro, callBack } = this.props;
    data.id = editPro;
    this.setState({ loading: true, });
    editList(data).then((res) => {
      if (res.success) {
        callBack();
      }else{
        this.setState({ loading: false })
      }
    });
  };

  render() {
    const { editPro, visible, close, onHold } = this.props;
    const { BasicFields, tenderFields, DatesFields, BillingFields, ManageFields, loading, } = this.state;
    return (
      <Modal
        title={editPro ? "Edit Project" : "Add Project"}
        maskClosable={false}
        centered
        visible={visible}
        okButtonProps={{ disabled: loading || onHold, htmlType: 'submit', form: 'my-form'  }}
        okText={loading ? <LoadingOutlined /> : "Save"}
        onCancel={close}
        width={750}
      >
        <Form
          id={'my-form'}
          ref={this.formRef}
          onFinish={this.onFinish}
          scrollToFirstError={true}
          size="small"
          layout="inline"
          initialValues={ { dates:{ entryDate: formatDate(new Date()) } } }
        >
          <Tabs type="card">
              <TabPane tab="Project Info" key="basic" forceRender className="ant-form ant-form-inline ant-form-small" >
                  <FormItems FormFields={BasicFields} />
              </TabPane>
              <TabPane tab="Tender Info" key="tender" forceRender className="ant-form ant-form-inline ant-form-small" >
                  <FormItems FormFields={tenderFields} />
              </TabPane>
              <TabPane tab="Key Dates" key="dates" forceRender className="ant-form ant-form-inline ant-form-small" >
                  <FormItems FormFields={DatesFields} />
              </TabPane>
              <TabPane tab="Forecast" key="billing" forceRender className="ant-form ant-form-inline ant-form-small" >
                  <FormItems FormFields={BillingFields} />
              </TabPane>                    
              <TabPane tab="Manage" key="manage" forceRender className="ant-form ant-form-inline ant-form-small" >
                  <FormItems FormFields={ManageFields} />
              </TabPane>                    
          </Tabs>
        </Form>
      </Modal>
    );
  }
}

export default InfoModal;
