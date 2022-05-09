import React, { Component } from "react";
import { Modal, Tabs, Form } from "antd";
import { LoadingOutlined } from "@ant-design/icons"; //Icons

import { addLeadSkill, getLeadSkill, editLeadSkill, } from "../../../service/projects";
import { getPanelSkills, getOrgPersons, } from "../../../service/constant-Apis";
import FormItems from "../../../components/Core/Forms/FormItems";
import { dateRangeAfter, dateRangeBefore } from "../../../service/constant";

const { TabPane } = Tabs;

class ResModal extends Component {
  constructor(props) {
    super(props);
    this.formRef = React.createRef();
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
          disabled: props.editRex,
          size: "small",
          rules:[{ required: true, message: 'Skill is Required' }],
          data: [],
          type: "Select",
          onChange: (e, value) =>{
            const { ResourceFields } = this.state;
            ResourceFields[3].data = value ? value.levels : [];
            const {
              obj,
            } = this.formRef.current.getFieldsValue(); // const
            obj["panelSkillStandardLevelId"] = undefined;
            obj["contactPersonId"] = undefined;
            this.formRef.current.setFieldsValue({
              obj,
            });
            this.setState({ ResourceFields });
          },
        },
        {
          object: "obj",
          fieldCol: 12,
          key: "panelSkillStandardLevelId",
          disabled: props.editRex,
          size: "small",
          rules:[{ required: true, message: 'Level is Required' }],
          data: [],
          type: "Select",
          onChange: (e, value) =>{
            const { ResourceFields } = this.state;
            const customUrl = `employees/get/by-skills?psslId=${value?.value}&workType=P`
            getOrgPersons(customUrl).then((res) => {
              ResourceFields[7].data = res.success ? res.data : [];
              const { obj, } = this.formRef.current.getFieldsValue(); // const
              obj["contactPersonId"] = undefined;
              this.formRef.current.setFieldsValue({ obj, });
              this.setState({ ResourceFields });
            });
          },
        },
        {
          Placeholder: "Total Billable Hours",
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
          disabled: props.editRex,
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
          rangeMin: (current)=>{
            const { obj } = this.formRef.current.getFieldValue();
            return dateRangeAfter(current, obj.endDate, props.pDates)
          }
        },
        {
          object: "obj",
          fieldCol: 12,
          key: "endDate",
          size: "small",
          rules:[{ required: true, message: 'End Date is Required' }],
          type: "DatePicker",
          fieldStyle: { width: "100%" },
          rangeMax: (current)=>{
            const { obj } = this.formRef.current.getFieldValue();
            return dateRangeBefore(current, obj.startDate, props.pDates)
          }
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
  
    };
  }

  componentDidMount = () => {
    this.openModal();
  };

  openModal = () => {
    const { editRex, panelId } = this.props;
    getPanelSkills(panelId).then((res) => {
      const { ResourceFields } = this.state;
      ResourceFields[2].data = res.success ? res.data : [];
      this.setState( { ResourceFields, }, () => {
          if (editRex) {
            this.getRecord(res.data);
          }
        }
      );
    });
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
    const { proId, callBack, crud } = this.props;
    addLeadSkill(crud, data, proId).then((res) => {
      if (res.success) {
        callBack();
      }else{
        this.setState({ loading: false })
      }
    });
  };

  getRecord = (skills) => {
    const { crud, editRex } = this.props;
    getLeadSkill(crud, editRex).then((resR) => {
      console.log(resR.data);
      if (resR.success) {
        const skillIndex = skills.findIndex(
          (skill) => skill.value === resR.data.panelSkillId
        );
          const customUrl = `employees/get/by-skills?psslId=${resR?.data?.panelSkillStandardLevelId}&workType=P`
          getOrgPersons(customUrl).then((resP) => {
          const { ResourceFields } = this.state;
          ResourceFields[3].data = skills[skillIndex]
            ? skills[skillIndex].levels
            : [];
          ResourceFields[7].data = resP.success ? resP.data : [];
          this.formRef.current.setFieldsValue({
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
    const { editRex, crud, callBack } = this.props;
    data.id = editRex;
    editLeadSkill(crud, editRex, data).then((res) => {
      if (res.success) {
        callBack();
      }else{
        this.setState({ loading: false })
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
        okButtonProps={{ disabled: loading, htmlType: 'submit', form: 'my-form' }}
        okText={loading ? <LoadingOutlined /> : "Save"}
        onCancel={close}
        width={900}
      >
        <Form 
            id={'my-form'}
            ref={this.formRef}
            onFinish={this.onFinish}
            scrollToFirstError={true}
            size="small"
            layout="inline"
            initialValues={{obj: {startDate: null}}}
        >
          <FormItems FormFields={ResourceFields} />
        </Form>
      </Modal>
    );
  }
}

export default ResModal;
