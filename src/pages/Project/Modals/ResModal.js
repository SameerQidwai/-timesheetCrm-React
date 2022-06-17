import React, { Component } from "react";
import { Modal, Tabs, Form } from "antd";
import { LoadingOutlined } from "@ant-design/icons"; //Icons

import { addLeadSkill, getLeadSkill, editLeadSkill, } from "../../../service/projects";
import { getPanelSkills, getOrgPersons, buyCost, } from "../../../service/constant-Apis";
import FormItems from "../../../components/Core/Forms/FormItems";
import { dateRangeAfter, dateRangeBefore, formatDate } from "../../../service/constant";

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
          Placeholder: "Position Title",
          fieldCol: 12,
          size: "small",
          type: "Text",
          labelAlign: "right",
          // itemStyle:{marginBottom:'10px'},
        },
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
          object: "obj",
          fieldCol: 12,
          key: "title",
          size: "small",
          type: "Input",
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
            ResourceFields[6].data = value ? value.levels : [];
            const {
              obj,
            } = this.formRef.current.getFieldsValue(); // const
            obj["panelSkillStandardLevelId"] = undefined;
            obj["contactPersonId"] = undefined;
            this.formRef.current.setFieldsValue({ obj, });
            this.setState({ ResourceFields });
          },
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
          Placeholder: "Total Billable Hours",
          fieldCol: 12,
          size: "small",
          type: "Text",
          rangeMin: true,
          labelAlign: "right",
          // itemStyle:{marginBottom:'10px'},
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
              ResourceFields[10].data = res.success ? res.data : [];
              const { obj, } = this.formRef.current.getFieldsValue(); // const
              obj["contactPersonId"] = undefined;
              this.formRef.current.setFieldsValue({ obj, });
              this.setState({ ResourceFields });
            });
          },
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
          Placeholder: "Resource",
          fieldCol: 12,
          rangeMin: true,
          size: "small",
          type: "Text",
          labelAlign: "right",
          // itemStyle:{marginBottom:'10px'},
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
          object: "obj",
          fieldCol: 12,
          key: "contactPersonId",
          disabled: props.editRex,
          size: "small",
          rules:[{ required: true, message: 'Resource is Required' }],
          data: [],
          type: "Select",
          onChange: (value, option)=> { this.checkRates(value, option) }
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
            return dateRangeAfter(current, obj?.endDate, props.pDates)
          }
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
          Placeholder: "Effort Rate",
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
          key: "endDate",
          size: "small",
          rules:[{ required: true, message: 'End Date is Required' }],
          type: "DatePicker",
          fieldStyle: { width: "100%" },
          rangeMax: (current)=>{
            const { obj } = this.formRef.current.getFieldValue();
            return dateRangeBefore(current, obj?.startDate, props.pDates)
          }
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
          Placeholder: "Buy Cost",
          fieldCol: 12,
          size: "small",
          rangeMin: true,
          type: "Text",
          labelAlign: "right",
          // itemStyle:{marginBottom:'10px'},
        },
        {
          Placeholder: "Sale Cost",
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
          key: "buyingRate",
          shape: "$",
          size: "small",
          rules:[{ required: true, message: 'Buying Rate is Required' }],
          type: "InputNumber",
          fieldStyle: { width: "100%" },
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

  checkRates = (value, option)=>{
    if (value){
      if (option.label.includes('Employee')){
        this.getRates('employee', value)
      }else if (option.label.includes('Sub-Contractor')){
        this.getRates('sub-contractors', value)
      }else{
        this.setRates('No Active Contract', 'No Active Contract')
      }
    }else{
      this.setRates(undefined, undefined)
    }
    
  }

  getRates = (crud, id) =>{
    buyCost(crud, id).then(res=>{
      if(res.success){
          let {employeeBuyRate} = res.data
          this.setRates(employeeBuyRate, employeeBuyRate*2)
      }
    })
  }

  setRates = (buy, sell) =>{
    const {ResourceFields} = this.state
    ResourceFields[18].hint = buy
    ResourceFields[19].hint = sell
    this.setState({ResourceFields: [...ResourceFields] })
  }

  openModal = () => {
    const { editRex, panelId } = this.props;
    getPanelSkills(panelId).then((res) => {
      const { ResourceFields } = this.state;
      ResourceFields[3].data = res.success ? res.data : [];
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
    
    let { obj } = vake
    obj = {
      ...obj,
      startDate: formatDate(obj.startDate, true),
      endDate: formatDate(obj.endDate, true),
      isMarkedAsSelected: true,
    }

    if (editRex) {
      this.editRecord(obj);
    } else {
      this.addRecord(obj);
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
      if (resR.success) {
        const skillIndex = skills.findIndex(
          (skill) => skill.value === resR.data.panelSkillId
        );
          const customUrl = `employees/get/by-skills?psslId=${resR?.data?.panelSkillStandardLevelId}&workType=P`
          getOrgPersons(customUrl).then((resP) => {
          const { ResourceFields } = this.state;
          ResourceFields[6].data = skills[skillIndex]
            ? skills[skillIndex].levels
            : [];
          ResourceFields[10].data = resP.success ? resP.data : [];
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
            initialValues={{obj: {effortRate: 100}}}

        >
          <FormItems FormFields={ResourceFields} />
        </Form>
      </Modal>
    );
  }
}

export default ResModal;
