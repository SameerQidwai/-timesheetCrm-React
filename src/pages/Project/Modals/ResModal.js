import React, { Component } from "react";
import { Modal, Tabs } from "antd";
import { LoadingOutlined } from "@ant-design/icons"; //Icons
import Form from "../../../components/Core/Form";

import {
  addLeadSkill,
  getLeadSkill,
  editLeadSkill,
} from "../../../service/projects";
import {
  getPanelSkills,
  getStandardLevels,
  getContactPersons,
  getOrgPersons,
} from "../../../service/constant-Apis";

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
      data: {},

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
            Placeholder: "Skill",
            fieldCol: 12,
            size: "small",
            rangeMin: true,
            type: "Text",
            labelAlign: "right",
            // itemStyle:{marginBottom:'10px'},
          },
          {
            Placeholder: "Level",
            fieldCol: 12,
            size: "small",
            rangeMin: true,
            type: "Text",
            labelAlign: "right",
            // itemStyle:{marginBottom:'10px'},
          },
          {
            object: "obj",
            fieldCol: 12,
            key: "panelSkillId",

            // disabled: true,
            size: "small",
            rules:[{ required: true, message: 'Skill is Required' }],
            data: [],
            type: "Select",
            onChange: (e, value) =>{
              const { ResourceFields } = this.state;
              ResourceFields.fields[3].data = value ? value.levels : [];
              const {
                obj,
              } = this.resourceRef.current.refs.resource_form.getFieldsValue(); // const
              obj["panelSkillStandardLevelId"] = undefined;
              obj["userId"] = undefined;
              this.resourceRef.current.refs.resource_form.setFieldsValue({
                obj,
              });
              this.setState({ ResourceFields });
            },
          },
          {
            object: "obj",
            fieldCol: 12,
            key: "panelSkillStandardLevelId",
            // disabled: true,
            size: "small",
            rules:[{ required: true, message: 'Level is Required' }],
            data: [],
            type: "Select",
            onChange: (e, value) =>{
              const { ResourceFields } = this.state;
              const customUrl = `employees/get/by-skills?psslId=${value.value}`
              getOrgPersons(customUrl).then((res) => {
                ResourceFields.fields[7].data = res.success ? res.data : [];
                const { obj, } = this.resourceRef.current.refs.resource_form.getFieldsValue(); // const
                obj["userId"] = undefined;
                this.resourceRef.current.refs.resource_form.setFieldsValue({ obj, });
                this.setState({ ResourceFields });
              });
            },
          },
          {
            Placeholder: "Work Hours",
            fieldCol: 12,
            size: "small",
            type: "Text",
            rangeMin: true,
            labelAlign: "right",
            // itemStyle:{marginBottom:'10px'},
          },
          {
            Placeholder: "Resource",
            fieldCol: 12,
            rangeMin: true,
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
            rules:[{ required: true, message: 'Work Hour is Required' }],
            type: "InputNumber",
            fieldStyle: { width: "100%" },
          },
          {
            object: "obj",
            fieldCol: 12,
            key: "contactPersonId",
            // disabled: true,
            size: "small",
            rules:[{ required: true, message: 'Resource is Required' }],
            data: [],
            type: "Select",
          },
          {
            Placeholder: "Start Date",
            fieldCol: 12,
            size: "small",
            rangeMin: true,
            type: "Text",
            labelAlign: "right",
            // itemStyle:{marginBottom:'10px'},
          },
          {
            Placeholder: "End Date",
            fieldCol: 12,
            size: "small",
            rangeMin: true,
            type: "Text",
            labelAlign: "right",
            // itemStyle:{marginBottom:'10px'},
          },
          {
            object: "obj",
            fieldCol: 12,
            key: "startDate",
            size: "small",
            rules:[{ required: true, message: 'Start Date is Required' }],
            type: "DatePicker",
            fieldStyle: { width: "100%" },
          },
          {
            object: "obj",
            fieldCol: 12,
            key: "endDate",
            size: "small",
            rules:[{ required: true, message: 'End Date is Required' }],
            type: "DatePicker",
            fieldStyle: { width: "100%" },
          },
          {
            Placeholder: "Effort Rate",
            fieldCol: 12,
            size: "small",
            rangeMin: true,
            type: "Text",
            labelAlign: "right",
            // itemStyle:{marginBottom:'10px'},
          },
          {
            Placeholder: "Buy Cost",
            fieldCol: 12,
            size: "small",
            rangeMin: true,
            type: "Text",
            labelAlign: "right",
            // itemStyle:{marginBottom:'10px'},
          },
          {
            object: "obj",
            fieldCol: 12,
            key: "effortRate",
            rules:[{ required: true, message: 'Effort Rate is Required' }],
            shape: "%",
            size: "small",
            type: "InputNumber",
            fieldStyle: { width: "100%" },
            rangeMin: 0,
            rangeMax: 100,
          },
          {
            object: "obj",
            fieldCol: 12,
            key: "buyingRate",
            shape: "$",
            size: "small",
            rules:[{ required: true, message: 'Buying Rate is Required' }],
            type: "InputNumber",
            fieldStyle: { width: "100%" },
          },
          {
            Placeholder: "Sale Cost",
            fieldCol: 24,
            rangeMin: true,
            size: "small",
            type: "Text",
            labelAlign: "right",
            // itemStyle:{marginBottom:'10px'},
          },
          {
            object: "obj",
            fieldCol: 12,
            key: "sellingRate",
            shape: "$",
            size: "small",
            rules:[{ required: true, message: 'Selling Rate is Required' }],
            type: "InputNumber",
            fieldStyle: { width: "100%" },
          },
        ],
      },
    };
  }

  componentDidMount = () => {
    const { editRex, panelId } = this.props;
    this.openModal();
  };

  openModal = () => {
    const { editRex, panelId } = this.props;
    getPanelSkills(panelId).then((res) => {
      const { ResourceFields } = this.state;
      ResourceFields.fields[2].data = res.success ? res.data : [];
      this.setState(
        {
          ResourceFields,
        },
        () => {
          if (editRex) {
            this.getRecord(res.data);
          }
        }
      );
    });
  };

  submit = () => {
    //submit button click
    this.resourceRef.current &&
      this.resourceRef.current.refs.resource_form.submit();
  };

  ResourceCall = (vake) => {
    // this will work after I get the Object from the form
    this.setState({ loading: true });
    const { editRex } = this.props;
    vake = vake.obj;
    vake.isMarkedAsSelected = true;
    if (editRex) {
      console.log("edit");
      this.editRecord(vake);
    } else {
      console.log("add");
      this.addRecord(vake);
    }
  };

  addRecord = (data) => {
    const { ProId, callBack } = this.props;
    addLeadSkill(ProId, data).then((res) => {
      if (res.success) {
        callBack();
      }
    });
  };

  getRecord = (skills) => {
    const { ProId, editRex } = this.props;
    getLeadSkill(ProId, editRex).then((resR) => {
      // console.log(resR.data);
      if (resR.success) {
        const skillIndex = skills.findIndex(
          (skill) => skill.value === resR.data.panelSkillId
        );
        getContactPersons().then((resP) => {
          const { ResourceFields } = this.state;
          ResourceFields.fields[3].data = skills[skillIndex]
            ? skills[skillIndex].levels
            : [];
          ResourceFields.fields[6].data = resP.success ? resP.data : [];
          this.resourceRef.current.refs.resource_form.setFieldsValue({
            obj: resR.data,
          });
          this.setState({
            ResourceFields,
            allocationId: resR.data.allocationId,
          });
        });
      }
    });
  };

  editRecord = (data) => {
    const { editRex, ProId, callBack } = this.props;
    data.id = editRex;
    editLeadSkill(ProId, editRex, data).then((res) => {
      if (res.success) {
        callBack();
      }
    });
  };

  render() {
    const { editRex, visible, close } = this.props;
    const { ResourceFields, loading } = this.state;
    return (
      <Modal
        title={editRex ? "Edit Resource" : "Add Resource"}
        maskClosable={false}
        centered
        visible={visible}
        onOk={() => { this.submit(); }}
        okButtonProps={{ disabled: loading }}
        okText={loading ? <LoadingOutlined /> : "Save"}
        onCancel={close}
        width={900}
      >
        <Form
          ref={this.resourceRef}
          Callback={this.ResourceCall}
          FormFields={ResourceFields}
        />
      </Modal>
    );
  }
}

export default ResModal;
