import React, { Component } from "react";
import { Modal, Tabs } from "antd";
import { LoadingOutlined } from "@ant-design/icons"; //Icons
import moment from "moment";
import Form from "../../../components/Core/Form";

import { addList, getRecord, editList } from "../../../service/projects";
import { getOrganizations, getStates, getOrgPersons, getPanels, getEmployees, } from "../../../service/constant-Apis";

const { TabPane } = Tabs;

class InfoModal extends Component {
  constructor() {
    super();
    this.basicRef = React.createRef();
    this.tenderRef = React.createRef();
    this.billingRef = React.createRef();
    this.datesRef = React.createRef();
    this.manageRef = React.createRef();
    this.state = {
      editPro: false,
      basicSubmitted: false,
      tenderSubmitted: false,
      datesSubmitted: false,
      billingSubmitted: false,
      manageSubmitted: false,
      check: false,
      leadValue: 0,
      SKILLS: [],
      STATES: [],
      ORGS: [],
      loading: false,

      BasicFields: {
        //creating Component
        formId: "basic_form",
        FormCol: 24,
        // FieldSpace:24,
        justifyField: "center",
        FormLayout: "inline",
        contactPerson: [],
        size: "middle",
        fields: [
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
            object: "obj",
            fieldCol: 12,
            key: "panelId",
            size: "small",
            rules: [{ required: true, message: "Panel is Required" }],
            data: [],
            type: "Select",
          },
          {
            object: "obj",
            fieldCol: 12,
            key: "organizationId",
            size: "small",
            rules: [{ required: true, message: "Organisation" }],
            data: [],
            type: "Select",
            onChange: function func(value) {
              if (value) {
                const customUrl = `helpers/contact-persons?organizationId=${value}&associated=1`
                getOrgPersons(customUrl).then((res) => {
                  if (res.success) {
                    const { BasicFields } = this.state;
                    BasicFields.fields[6].data = res.data;
                    this.setState({ BasicFields });
                  }
                });
              } else {
                const { BasicFields } = this.state;
                BasicFields.fields[6].data = [];
                const {
                  obj,
                } = this.basicRef.current.refs.basic_form.getFieldsValue();
                obj.contactPersonId = undefined;
                this.basicRef.current.refs.basic_form.setFieldsValue({
                  obj: obj,
                });
                this.setState({ BasicFields });
              }
            }.bind(this),
          },
          {
            Placeholder: "Delegate Contact Person",
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
            object: "obj",
            fieldCol: 12,
            key: "contactPersonId",
            size: "small",
            // rules:[{ required: true }],
            data: [],
            type: "Select",
          },
          {
            object: "obj",
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
            object: "obj",
            fieldCol: 12,
            key: "type",
            size: "small",
            rules: [{ required: true, message: "Type is Required" }],
            data: [
              { label: "MILESTONE BASE", value: 1 },
              { label: "TIME BASE", value: 2 },
            ],
            type: "Select",
          },
          {
            object: "obj",
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
            fieldCol: 24,
            size: "small",
            type: "Text",
            labelAlign: "right",
            // itemStyle:{marginBottom:'10px'},
          },
          {
            object: "obj",
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
        ],
      },

      tenderFields: {
        //creating Component
        formId: "tender_form",
        FormCol: 24,
        // FieldSpace:24,
        justifyField: "center",
        FormLayout: "inline",
        contactPerson: [],
        size: "middle",
        fields: [
          {
            Placeholder: "Tender/RFQTS Title",
            fieldCol: 12,
            size: "small",
            type: "Text",
            labelAlign: "right",
            // itemStyle:{marginBottom:'10px'},
          },
          {
            Placeholder: "Tender/RFQTS Number",
            size: "small",
            fieldCol: 12,
            type: "Text",
            labelAlign: "right",
            // itemStyle:{marginBottom:'10px'},
          },
          {
            object: "obj",
            fieldCol: 12,
            key: "tender",
            size: "small",
            // rules:[{ required: true }],
            type: "Input",
          },
          {
            object: "obj",
            fieldCol: 12,
            key: "tenderNumber",
            size: "small",
            // rules:[{ required: true }],
            type: "Input",
          },
          // {
          //     Placeholder: "Tender Value",
          //     size: "small",
          //     fieldCol: 24,
          //     type: "Text",
          //     labelAlign: "right",
          //     // itemStyle:{marginBottom:'10px'},
          // },
          // {
          //     object: "obj",
          //     fieldCol: 12,
          //     layout:  { wrapperCol: 12 },
          //     key: "tenderValue",
          //     size: "small",
          //     // rules:[{ required: true }],
          //     type: "Input",
          // },
        ],
      },

      BillingFields: {
        formId: "billing_form",
        FormCol: 24,
        FieldSpace: 24,
        justifyField: "center",
        FormLayout: "inline",
        size: "middle",
        fields: [
          {
            Placeholder: "Estimated Value",
            fieldCol: 12,
            size: "small",
            type: "Text",
            labelAlign: "right",
            // itemStyle:{marginBottom:'10px'},
          },
          {
            Placeholder: "CM",
            size: "small",
            fieldCol: 12,
            type: "Text",
            labelAlign: "right",
            // itemStyle:{marginBottom:'10px'},
          },
          {
            object: "obj",
            fieldCol: 12,
            key: "value",
            size: "small",
            shape: "$",
            // rules:[{ required: true }],
            type: "InputNumber",
            onChange: function setValue(value) {
              const {
                obj,
              } = this.billingRef.current.refs.billing_form.getFieldsValue();
              obj.cm$ = obj.cmPercentage ? (value * obj.cmPercentage) / 100 : 0;
              obj.discount = obj.goget ? (value * obj.goget) / 100 : 0;
              obj.upside = obj.discount ? value - obj.discount : 0;
              this.billingRef.current.refs.billing_form.setFieldsValue({
                obj: obj,
              });
            }.bind(this),
            fieldStyle: { width: "100%" },
          },
          {
            object: "obj",
            fieldCol: 12,
            key: "cmPercentage",
            size: "small",
            shape: "%",
            // rules:[{ required: true }],
            type: "InputNumber",
            rangeMin: 0,
            rangeMax: 100,
            fieldStyle: { width: "100%" },
            onChange: function name(value) {
              const {
                obj,
              } = this.billingRef.current.refs.billing_form.getFieldsValue();
              obj.cm$ = obj.value ? (obj.value * value) / 100 : 0;
              this.billingRef.current.refs.billing_form.setFieldsValue({
                obj: obj,
              });
            }.bind(this),
          },
          {
            Placeholder: "CM",
            size: "small",
            fieldCol: 24,
            type: "Text",
            labelAlign: "right",
            // itemStyle:{marginBottom:'10px'},
          },
          {
            object: "obj",
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
      },

      DatesFields: {
        formId: "dates_form",
        FormCol: 24,
        FieldSpace: 24,
        justifyField: "center",
        FormLayout: "inline",
        size: "middle",
        initialValues: { entryDate: moment(new Date()) },
        fields: [
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
            fieldCol: 12,
            size: "small",
            type: "Text",
            labelAlign: "right",
            // itemStyle:{marginBottom:'10px'},
          },
          {
            object: "obj",
            fieldCol: 12,
            key: "startDate",
            size: "small",
            type: "DatePicker",
            rules: [{ required: true, message: "Start Date is Required" }],
            fieldStyle: { width: "100%" },
          },
          {
            object: "obj",
            fieldCol: 12,
            key: "endDate",
            size: "small",
            type: "DatePicker",
            fieldStyle: { width: "100%" },
          },

          {
            Placeholder: "Daily Hours",
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
            object: "obj",
            fieldCol: 12,
            key: "hoursPerDay",
            size: "small",
            rules: [{ required: true, message: "Dailty Hours is Required" }],
            type: "InputNumber",
            fieldStyle: { width: "100%" },
          },
          {
            object: "obj",
            fieldCol: 12,
            key: "entryDate",
            size: "small",
            type: "DatePicker",
            fieldStyle: { width: "100%" },
          },
        ],
      },

      ManageFields: {
        formId: "manage_form",
        FormCol: 24,
        FieldSpace: 24,
        justifyField: "center",
        FormLayout: "inline",
        size: "middle",
        fields: [
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
            object: "obj",
            fieldCol: 12,
            key: "accountDirectorId",
            size: "small",
            data: [],
            type: "Select",
          },
          {
            object: "obj",
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
            object: "obj",
            fieldCol: 12,
            key: "projectManagerId",
            size: "small",
            data: [],
            type: "Select",
          },
        ],
      },
    };
  }
  componentDidMount = () => {
    this.fetchAll();
  };

  fetchAll = () => {
    const { editPro } = this.props;
    const dates = { entryDate: moment(new Date()) };
    this.datesRef.current.refs.dates_form.setFieldsValue({ obj: dates });
    const customUrl = `helpers/contact-persons?active=1&employee=1&associated=1&label=1`
    Promise.all([ getPanels(), getOrganizations(), getStates(), getOrgPersons(customUrl), editPro && this.getRecord(editPro), ])
      .then((res) => {
        if (res[1].success) {
          res[1].data[0].disabled = true;
        }
        const { BasicFields, ManageFields } = this.state;
        BasicFields.fields[2].data = res[0].success ? res[0].data : [];
        BasicFields.fields[3].data = res[1].success ? res[1].data : [];
        BasicFields.fields[11].data = res[2].success ? res[2].data : [];
        BasicFields.fields[6].data = res[4].success ? res[4].data : [];
        
        ManageFields.fields[2].data = res[3].success ? res[3].data : [];
        ManageFields.fields[3].data = res[3].success ? res[3].data : [];
        ManageFields.fields[5].data = res[3].success ? res[3].data : [];
        // ManageFields.fields[7].data = res[4].success ? res[4].data: [];

        this.setState({ BasicFields, ManageFields });
      })
      .catch((e) => {
        console.log(e);
      });
  };

  submit = () => {
    //submit button click
    this.basicRef.current.refs.basic_form.submit();
    this.tenderRef.current.refs.tender_form.submit();
    this.billingRef.current &&
      this.billingRef.current.refs.billing_form.submit();
    this.datesRef.current && this.datesRef.current.refs.dates_form.submit();
    this.manageRef.current && this.manageRef.current.refs.manage_form.submit();
  };

  BasicCall = (vake) => {
    // this will work after  got  Object from the skill from
    vake = vake.obj;
    this.setState(
      {
        mergeObj: {
          ...this.state.mergeObj,
          ...{
            panelId: vake.panelId ?? null,
            organizationId: vake.organizationId ?? null,
            contactPersonId: vake.contactPersonId ?? null,
            title: vake.title ?? "",
            type: vake.type ?? "",
            stateId: vake.stateId ?? null,
            qualifiedOps: vake.qualifiedOps ?? false,
          },
        },
        basicSubmitted: true, // skill form submitted
      }, ()=>{
        this.vaildateForm()
      }
    );
  };

  tenderCall = (vake) => {
    // this will work after  got  Object from the skill from
    vake = vake.obj;
    this.setState(
      {
        mergeObj: {
          ...this.state.mergeObj,
          ...{
            tender: vake.tender ?? "",
            tenderNumber: vake.tenderNumber ?? "",
          },
        },
        tenderSubmitted: true, // skill form submitted
      }, ()=>{
        this.vaildateForm()
      }
    );
  };

  BillingCall = (vake) => {
    // this will work after  getting the Object from level form
    vake = vake.obj;
    this.setState(
      {
        mergeObj: {
          ...this.state.mergeObj,
          ...{
            value: vake.value ?? 0,
            cmPercentage: vake.cmPercentage ?? 0,
            goPercentage: vake.goPercentage ?? 0,
            getPercentage: vake.getPercentage ?? 0,
          },
        },
        billingSubmitted: true, // level form submitted
      }, ()=>{
        this.vaildateForm()
      }
    );
  };

  DatesCall = (vake) => {
    // this will work after I get the Object from the form
    vake = vake.obj;
    this.setState(
      {
        mergeObj: {
          ...this.state.mergeObj,
          ...vake,
        },
        datesSubmitted: true, // level form submitted
      }, ()=>{
        this.vaildateForm()
      }
    );
  };

  ManageCall = (vake) => {
    // this will work after I get the Object from the form
    vake = vake.obj;

    this.setState(
      {
        mergeObj: {
          ...this.state.mergeObj,
          ...{ accountDirectorId: vake.accountDirectorId ?? null,
            accountManagerId: vake.accountManagerId ?? null,
            projectManagerId: vake.projectManagerId ?? null, 
          },
        },
        manageSubmitted: true, // level form submitted
      }, ()=>{
        this.vaildateForm()
      }
    );
  };

  vaildateForm = () => {
    const { basicSubmitted, tenderSubmitted, billingSubmitted, datesSubmitted, manageSubmitted, mergeObj, } = this.state;
    const { editPro } = this.props
    if ( basicSubmitted && tenderSubmitted && billingSubmitted && datesSubmitted && manageSubmitted ) {
      //check if both form is submittef
      if (!editPro) {
        this.addProject(mergeObj); //add skill
      } else {
        this.editRecord(mergeObj); //edit skill
      }
    }
  }

  addProject = (value) => {
    const { callBack } = this.props;
    this.setState({
      basicSubmitted: false,
      tenderSubmitted: false,
      billingSubmitted: false,
      datesSubmitted: false,
      manageSubmitted: false,
      loading: true,
    });
    addList(value).then((res) => {
      if (res.success) {
        callBack();
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
        this.basicRef.current.refs.basic_form.setFieldsValue({ obj: basic });
        this.tenderRef.current.refs.tender_form.setFieldsValue({ obj: tender });
        this.billingRef.current.refs.billing_form.setFieldsValue({ obj: billing, });
        this.datesRef.current.refs.dates_form.setFieldsValue({ obj: dates });
        this.manageRef.current.refs.manage_form.setFieldsValue({ obj: manage });
        return contactPersons;
      }
    });
  };

  editRecord = (data) => {
    const { editPro, callBack } = this.props;
    console.log(this.props);
    data.id = editPro;
    this.setState({
      basicSubmitted: false,
      tenderSubmitted: false,
      billingSubmitted: false,
      datesSubmitted: false,
      manageSubmitted: false,
      loading: true,
    });
    editList(data).then((res) => {
      console.log(res);
      if (res.success) {
        callBack();
      }
    });
  };

  render() {
    const { editPro, visible, close } = this.props;
    const { BasicFields, tenderFields, DatesFields, BillingFields, ManageFields, loading, } = this.state;
    return (
      <Modal
        title={editPro ? "Edit Project" : "Add Project"}
        maskClosable={false}
        centered
        visible={visible}
        onOk={() => {
          this.submit();
        }}
        okButtonProps={{ readOnly: loading }}
        okText={loading ? <LoadingOutlined /> : "Save"}
        onCancel={close}
        width={750}
      >
        <Tabs type="card">
          <TabPane tab="Project Info" key="basic" forceRender>
            <Form
              ref={this.basicRef}
              Callback={this.BasicCall}
              FormFields={BasicFields}
            />
          </TabPane>
          <TabPane tab="Tender/RFQTS Info" key="tender" forceRender>
            <Form
              ref={this.tenderRef}
              Callback={this.tenderCall}
              FormFields={tenderFields}
            />
          </TabPane>
          <TabPane tab="Date Info" key="dates" forceRender>
            <Form
              ref={this.datesRef}
              Callback={this.DatesCall}
              FormFields={DatesFields}
            />
          </TabPane>
          <TabPane tab="Forecast" key="forecast" forceRender>
            <Form
              ref={this.billingRef}
              Callback={this.BillingCall}
              FormFields={BillingFields}
            />
          </TabPane>
          <TabPane tab="Manage" key="manage" forceRender>
            <Form
              ref={this.manageRef}
              Callback={this.ManageCall}
              FormFields={ManageFields}
            />
          </TabPane>
        </Tabs>
      </Modal>
    );
  }
}

export default InfoModal;
