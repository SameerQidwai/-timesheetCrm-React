import React, { Component } from "react";
import { Modal, Tabs } from "antd";
import { LoadingOutlined } from "@ant-design/icons"; //Icons
import moment from "moment";
import Form from "../../../components/Core/Form";

import { addLeadSkill, getLeadSkill, editLeadSkill, addLeadSkillResource, editLeadSkillResource, } from "../../../service/opportunities";
import { getPanelSkills, getStandardLevels, getOrgPersons, } from "../../../service/constant-Apis";

const { TabPane } = Tabs;

class ResModal extends Component {
  constructor() {
    super();
    this.resourceRef = React.createRef();
    this.state = {
      editRex: false,
      resourceSubmitted: false,
      check: false,
      loading: false,

      SKILLS: [],
      STATES: [],
      ORGS: [],

      ResourceFields: {
        formId: "resource_form",
        FormCol: 24,
        FieldSpace: 24,
        justifyField: "center",
        FormLayout: "inline",
        size: "middle",
        initialValues: { obj: { effortRate: 100 } },
        fields: [
          {
            Placeholder: "Resource",
            rangeMin: true,
            fieldCol: 12,
            size: "small",
            type: "Text",
            labelAlign: "right",
            // itemStyle:{marginBottom:'10px'},
          },
          {
            Placeholder: "Effort Rate",
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
            rules: [{ required: true, message: "Resource is Required" }],
            data: [],
            type: "Select",
          },
          {
            object: "obj",
            fieldCol: 12,
            key: "effortRate",
            rules: [{ required: true, message: "Effort Rate is Required" }],
            size: "small",
            shape: "%",
            type: "InputNumber",
            fieldStyle: { width: "100%" },
            rangeMin: 0,
            rangeMax: 100,
          },
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
            object: "obj",
            fieldCol: 12,
            key: "startDate",
            rules: [{ required: true, message: "Start Date is Required" }],
            size: "small",
            type: "DatePicker",
            fieldStyle: { width: "100%" },
          },
          {
            object: "obj",
            fieldCol: 12,
            key: "endDate",
            size: "small",
            rules: [{ required: true, message: "End Date is Required" }],
            type: "DatePicker",
            fieldStyle: { width: "100%" },
          },
          {
            Placeholder: "Buy Cost",
            rangeMin: true,
            fieldCol: 12,
            size: "small",
            type: "Text",
            labelAlign: "right",
            // itemStyle:{marginBottom:'10px'},
          },
          {
            Placeholder: "Sale Cost",
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
            key: "buyingRate",
            shape: '$',
            size: "small",
            rules: [{ required: true, message: "Buying Rate is Required" }],
            type: "InputNumber",
            fieldStyle: { width: "100%" },
          },
          {
            object: "obj",
            fieldCol: 12,
            key: "sellingRate",
            shape: '$',
            size: "small",
            rules: [{ required: true, message: "Selling Rate is Required" }],
            type: "InputNumber",
            fieldStyle: { width: "100%" },
          },
        ],
      },

      SkillFields: {
        formId: "resource_form",
        FormCol: 24,
        FieldSpace: 24,
        justifyField: "center",
        FormLayout: "inline",
        size: "middle",
        fields: [
          {
            Placeholder: "Skill",
            rangeMin: true,
            fieldCol: 12,
            size: "small",
            type: "Text",
            labelAlign: "right",
            // itemStyle:{marginBottom:'10px'},
          },
          {
            Placeholder: "Level",
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
            key: "panelSkillId",
            size: "small",
            rules: [{ required: true, message: "Skill is Required" }],
            data: [],
            type: "Select",
            onChange: function func(e, value) {
              const { SkillFields } = this.state;
              SkillFields.fields[3].data = value ? value.levels : [];
              const {
                obj,
              } = this.resourceRef.current.refs.resource_form.getFieldsValue(); // const
              obj["panelSkillStandardLevelId"] = undefined;
              this.resourceRef.current.refs.resource_form.setFieldsValue({
                obj,
              });
              this.setState({ SkillFields });
            }.bind(this),
          },
          {
            object: "obj",
            fieldCol: 12,
            key: "panelSkillStandardLevelId",
            size: "small",
            rules: [{ required: true, message: "Level is Required" }],
            data: [],
            type: "Select",
            onChange: function func(e, value) {
              this.fetchRes();
            }.bind(this),
          },
          {
            Placeholder: "Work Hours",
            rangeMin: true,
            fieldCol: 24,
            size: "small",
            type: "Text",
            labelAlign: "right",
            // itemStyle:{marginBottom:'10px'},
          },
          {
            object: "obj",
            fieldCol: 12,
            key: "billableHours",
            size: "small",
            rules: [{ required: true, message: "Nillable Hours is Required" }],
            type: "InputNumber",
            fieldStyle: { width: "100%" },
          },
        ],
      },
    };
  }
  componentDidMount = () => {
    const { skillId } = this.props;
    if (skillId) {
      this.fetchRes();
    } else {
      this.skillModal();
    }
  };

  fetchRes = () => {
    const { levelId } = this.props
    const customUrl = `employees/get/by-skills?psslId=${levelId}`
    Promise.all([getOrgPersons(customUrl)])
      .then((res) => {
        const data = res[0].success ? res[0].data :[]
        const { ResourceFields } = this.state;
        const { editRex } = this.props;
        if (editRex) {
          const obj = {
            contactPersonId: editRex.contactPersonId,
            billableHours: editRex.billableHours,
            sellingRate: editRex.sellingRate, 
            effortRate: editRex.effortRate,
            buyingRate: editRex.buyingRate,
            endDate: editRex.endDate ? moment(editRex.endDate) : null,
            startDate: editRex.startDate ? moment(editRex.startDate) : null,
          };
          this.resourceRef.current.refs.resource_form.setFieldsValue({ obj });
        }
        ResourceFields.fields[2].data = data;
        this.setState({ ResourceFields });
      })
      .catch((e) => {
        console.log(e);
      });
  };

  skillModal = () => {
    const { editRex, panelId, leadId } = this.props;
    getPanelSkills(panelId)
      .then((res) => {
        const { SkillFields } = this.state;
        SkillFields.fields[2].data = res.success ? res.data : [];

        if (editRex) {
          // repopulate the fields to edit them to resolve multiple api calling might be do this on every Modal Compenent
          const skillIndex = SkillFields.fields[2].data.findIndex(
            (skill) => skill.value === editRex.panelSkillId
          );
          SkillFields.fields[3].data = SkillFields.fields[2].data
            ? SkillFields.fields[2].data[skillIndex].levels
            : [];
          const obj = {
            panelSkillId: editRex.panelSkillId,
            panelSkillStandardLevelId: editRex.panelSkillStandardLevelId,
            billableHours: editRex.billableHours,
          };
          this.resourceRef.current.refs.resource_form.setFieldsValue({ obj });
        }

        this.setState({ SkillFields });
      })
      .catch((e) => {
        console.log(e);
      });
  };

  submit = () => {
    //submit button click
    this.resourceRef.current &&
      this.resourceRef.current.refs.resource_form.submit();
  };

  ResourceCall = (vake) => {
    // this will work after I get the Object from the form
    const { editRex, skillId } = this.props;
    if (editRex) {
      if (skillId) {
        this.editResource(vake.obj);
      } else {
        this.editSkill(vake.obj);
      }
    } else {
      if (skillId) {
        this.addResourse(vake.obj);
      } else {
        this.addSkill(vake.obj);
      }
    }
  };

  addSkill = (data) => {
    this.setState({ loading: true });
    const { leadId, callBack } = this.props;
    addLeadSkill(leadId, data).then((res) => {
      if (res.success) {
        callBack(res.data);
      }
    });
  };

  addResourse = (data) => {
    this.setState({ loading: true });
    const { callBack, leadId, skillId } = this.props;
    addLeadSkillResource(leadId, skillId, data).then((res) => {
      if (res.success) {
        callBack(res.data);
      }
    });
  };

  editSkill = (data) => {
    this.setState({ loading: true });
    const { editRex, leadId, callBack } = this.props;
    data.id = editRex.id;
    editLeadSkill(leadId, editRex.id, data).then((res) => {
      if (res.success) {
        callBack(res.data);
      }
    });
  };

  editResource = (data) => {
    this.setState({ loading: true });
    const { editRex, leadId, skillId, callBack } = this.props;
    data.id = editRex;
    editLeadSkillResource(leadId, skillId, editRex.id, data).then((res) => {
      if (res.success) {
        callBack(res.data);
      }
    });
  };

  render() {
    const { editRex, visible, close, resource, skillId } = this.props;
    const { ResourceFields, SkillFields, loading } = this.state;
    return (
      <Modal
        title={editRex ? "Edit opportunity" : "Add Resource"}
        maskClosable={false}
        centered
        visible={visible}
        onOk={() => {
          this.submit();
        }}
        okButtonProps={{ disabled: loading }}
        okText={loading ? <LoadingOutlined /> : "Save"}
        onCancel={close}
        width={750}
      >
        <Form
          ref={this.resourceRef}
          Callback={this.ResourceCall}
          FormFields={skillId ? ResourceFields : SkillFields}
        />
      </Modal>
    );
  }
}

export default ResModal;
