import React, { Component } from "react";
import { Modal, Tabs, Form } from "antd";
import { LoadingOutlined } from "@ant-design/icons"; //Icons
import FormItems from "../../../components/Core/FormItems";

import { addLeadSkill, getLeadSkill, editLeadSkill, } from "../../../service/projects";
import { getPanelSkills, getOrgPersons, } from "../../../service/constant-Apis";

const { TabPane } = Tabs;

class MileModal extends Component {
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

      ResourceFields: [
          {
            Placeholder: "Title",
            fieldCol: 12,
            size: "small",
            rangeMin: true,
            type: "Text",
            labelAlign: "right",
            // itemStyle:{marginBottom:'10px'},
          },
          {
            Placeholder: "Amount",
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
            key: "title",

            // disabled: true,
            size: "small",
            rules:[{ required: true, message: 'title is Required' }],
            type: "Input",
          },
          {
            object: "obj",
            fieldCol: 12,
            key: "amount",
            // disabled: true,
            size: "small",
            rules:[{ required: true, message: 'amount is Required' }],
            type: "Inputs",
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
            Placeholder: "Progress",
            fieldCol: 12,
            size: "small",
            rangeMin: true,
            type: "Text",
            labelAlign: "right",
            // itemStyle:{marginBottom:'10px'},
          },
          {
            Placeholder: "Approved",
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
            key: "progress",
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
            key: "isApproved",
            size: "small",
            rules:[{ required: true, message: 'Buying Rate is Required' }],
            type: "Select",
            data: [{label: 'True', value: true}, {label: 'False', value: false}],
            fieldStyle: { width: "100%" },
          },
        ],
    };
  }

  componentDidMount = () => {
    const { editRex, panelId } = this.props;
    console.log(editRex);
    // this.openModal();
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

  onFinish = (vake) => {
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
          const customUrl = `employees/get/by-skills?psslId=${resR.data && resR.data.panelSkillStandardLevelId}`
          getOrgPersons(customUrl).then((resP) => {
          const { ResourceFields } = this.state;
          ResourceFields.fields[3].data = skills[skillIndex]
            ? skills[skillIndex].levels
            : [];
          ResourceFields.fields[7].data = resP.success ? resP.data : [];
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
        title={editRex ? "Edit Milestone" : "Add Milestone"}
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
            id={'my-form'}
            ref={this.resourceRef}
            onFinish={this.onFinish}
            scrollToFirstError={true}
            size="small"
            layout="inline"
        >
            <FormItems FormFields={ResourceFields}/>
        </Form>
      </Modal>
    );
  }
}

export default MileModal;
