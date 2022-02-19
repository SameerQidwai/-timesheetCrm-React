import React, { Component } from "react";
import { Modal, Tabs, Form  } from "antd";
import { LoadingOutlined } from "@ant-design/icons"; //Icons
import moment from "moment";
import FormItems from "../../../components/Core/Forms/FormItems";

import { addLeadSkill, editLeadSkill, addLeadSkillResource, editLeadSkillResource, } from "../../../service/opportunities";
import { getPanelSkills, getOrgPersons, } from "../../../service/constant-Apis";

const { TabPane } = Tabs;

class ResModal extends Component {
  constructor() {
    super();
    this.formRef = React.createRef();
    this.state = {
      editRex: false,
      resourceSubmitted: false,
      check: false,
      loading: false,

      SKILLS: [],
      STATES: [],
      ORGS: [],

      ResourceFields: [
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
  
      SkillFields: [
        {
          Placeholder: "Title",
          rangeMin: true,
          fieldCol: 12,
          size: "small",
          type: "Text",
          labelAlign: "right",
          // itemStyle:{marginBottom:'10px'},
        },
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
          object: "obj",
          fieldCol: 12,
          key: "title",
          size: "small",
          rules: [{ required: true, message: "Skill is Required" }],
          type: "Input",
        },
        {
          object: "obj",
          fieldCol: 12,
          key: "panelSkillId",
          size: "small",
          rules: [{ required: true, message: "Skill is Required" }],
          data: [],
          type: "Select",
          onChange: (e, value) =>{
            const { SkillFields } = this.state;
            SkillFields[6].data = value ? value.levels : [];
            const { obj, } = this.formRef.current.getFieldsValue(); // const
            obj["panelSkillStandardLevelId"] = undefined;
            this.formRef.current.setFieldsValue({ obj, });
            this.setState({ SkillFields });
          },
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
          Placeholder: "Work Hours",
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
          key: "panelSkillStandardLevelId",
          size: "small",
          rules: [{ required: true, message: "Level is Required" }],
          data: [],
          type: "Select",
          onChange: (e, value) =>{
            this.fetchRes();
          },
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
          rangeMin: (current)=>{
              const { obj } = this.formRef.current.getFieldValue();
              return   obj.endDate && current > obj.endDate
          }
        },
        {
          object: "obj",
          fieldCol: 12,
          key: "endDate",
          size: "small",
          rules: [{ required: true, message: "End Date is Required" }],
          type: "DatePicker",
          fieldStyle: { width: "100%" },
          rangeMax: (current)=>{
              const { obj } = this.formRef.current.getFieldValue();
              return  obj.startDate && current < obj.startDate
          }
        },
      ],
    };
  }
  componentDidMount = () => {
    const { skillId, editRex } = this.props;
    console.log(editRex);
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
          };
          console.log(obj);
          this.formRef.current.setFieldsValue({ obj:obj });
        }
        ResourceFields[2].data = data;
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
        SkillFields[3].data = res.success ? res.data : [];

        if (editRex) {
          // repopulate the fields to edit them to resolve multiple api calling might be do this on every Modal Compenent
          const skillIndex = SkillFields[3].data.findIndex(
            (skill) => skill.value === editRex.panelSkillId
          );
          SkillFields[6].data = SkillFields[3].data
            ? SkillFields[3].data[skillIndex].levels
            : [];
          const obj = {
            panelSkillId: editRex.panelSkillId,
            panelSkillStandardLevelId: editRex.panelSkillStandardLevelId,
            billableHours: editRex.billableHours,
            title: editRex.title,
            endDate: editRex.endDate ? moment(editRex.endDate) : null,
            startDate: editRex.startDate ? moment(editRex.startDate) : null,

          };
          this.formRef.current.setFieldsValue({ obj });
        }

        this.setState({ SkillFields });
      })
      .catch((e) => {
        console.log(e);
      });
  };

  onFinish = (vake) => {
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
    const { leadId, callBack, crud } = this.props;
    addLeadSkill(crud, data, leadId).then((res) => {
      if (res.success) {
        callBack(res.data);
      }
    });
  };

  addResourse = (data) => {
    this.setState({ loading: true });
    const { callBack, leadId, skillId, crud } = this.props;
    addLeadSkillResource(crud, skillId, data).then((res) => {
      if (res.success) {
        callBack(res.data);
      }
    });
  };

  editSkill = (data) => {
    this.setState({ loading: true });
    const { editRex, leadId, callBack, crud } = this.props;
    data.id = editRex.id;
    console.log(data);
    editLeadSkill(crud, editRex.id, data).then((res) => {
      if (res.success) {
        callBack(res.data);
      }
    });
  };

  editResource = (data) => {
    this.setState({ loading: true });
    const { editRex, callBack, leadId, skillId, crud } = this.props;
    data.id = editRex;
    console.log(data);
    editLeadSkillResource(crud, skillId, editRex.id, data).then((res) => {
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
        title={skillId ? ((editRex) ?"Edit Resource" : "Add Resource") : ((editRex) ?"Edit Position" : "Add Position") }
        maskClosable={false}
        centered
        visible={visible}
        okButtonProps={{ disabled: loading, htmlType: 'submit', form: 'my-form' }}
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
            initialValues={skillId? { obj:{effortRate: 100}}: { obj:{startDate: null}}}
        >
        <FormItems FormFields={skillId ? ResourceFields : SkillFields} />
        </Form>
      </Modal>
    );
  }
}

export default ResModal;
