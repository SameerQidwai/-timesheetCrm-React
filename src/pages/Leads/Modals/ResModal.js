import React, { Component } from "react";
import { Modal, Tabs, Form  } from "antd";
import { LoadingOutlined } from "@ant-design/icons"; //Icons
import FormItems from "../../../components/Core/Forms/FormItems";

import { addLeadSkill, editLeadSkill, addLeadSkillResource, editLeadSkillResource, } from "../../../service/opportunities";
import { getPanelSkills, getOrgPersons, buyCost, } from "../../../service/constant-Apis";
import { dateRange, dateRangeAfter, dateRangeBefore, formatCurrency, formatDate } from "../../../service/constant";

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
          Placeholder: "Rate Of Effort",
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
          onChange: (value, option)=> { this.checkRates(value, option) }
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
          Placeholder: "Buy Rate (Hourly)",
          rangeMin: true,
          fieldCol: 12,
          size: "small",
          type: "Text",
          labelAlign: "right",
          // itemStyle:{marginBottom:'10px'},
        },
        {
          Placeholder: "Sale Rate (Hourly)",
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
          Placeholder: "Position Title",
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
          rules: [{ required: true, message: "Title is Required" }],
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
          Placeholder: "Skill Level",
          rangeMin: true,
          fieldCol: 12,
          size: "small",
          type: "Text",
          labelAlign: "right",
          // itemStyle:{marginBottom:'10px'},
        },
        {
          Placeholder: "Total Billable Hours",
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
            return dateRangeAfter(current, obj?.endDate, props.pDates)
            // return dateRange(current, obj?.endDate, true, props.pDates)
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
            return dateRangeBefore(current, obj?.startDate, props.pDates)
            // return dateRange(current, obj?.startDate, false, props.pDates)
          }
        },
      ],
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
    const { levelId, editRex, cmRate } = this.props
    console.log(editRex);
    const customUrl = `employees/get/by-skills?psslId=${levelId}&workType=O`
    Promise.all([getOrgPersons(customUrl)])
      .then((res) => {
        const data = res[0].success ? res[0].data :[]
        const { ResourceFields } = this.state;
        if (editRex) {
          const obj = {
            contactPersonId: editRex.contactPersonId,
            billableHours: editRex.billableHours,
            sellingRate: editRex.sellingRate, 
            effortRate: editRex.effortRate,
            buyingRate: editRex.buyingRate,
          };
          ResourceFields[2].data = data;
          this.setState({ ResourceFields },()=>{
            // if (editRex.role) {
            //   this.checkRates(obj.contactPersonId, {label: editRex.role})
            // }else{
            //   this.setRates('No Active Contract', 'No Active Contract')
            // }
          });
          
          this.formRef.current.setFieldsValue({ obj:obj });
        }
        
      })
      .catch((e) => {
        console.log(e);
      });
  };

  checkRates = (value, option)=>{
    if (value){
      if (option.label.includes('Employee')){
        this.getRates('employees', value)
      }else if (option.label.includes('Sub Contractor')){
        this.getRates('sub-contractors', value)
      }else{
        this.setRates('No Active Contract', 'No Active Contract')
      }
    }else{
      this.setRates(undefined, undefined)
    }
    
  }

  getRates = (crud, id) =>{
    const {cmRate} = this.props
    buyCost(crud, id, 'contactPerson').then(res=>{
      if(res.success){
          let {employeeBuyRate} = res.data
          this.setRates(formatCurrency(employeeBuyRate), formatCurrency(employeeBuyRate/(1- (cmRate/100))))
      }else{
        this.setRates('No Active Contract', 'No Active Contract')
      }
    })
  }

  setRates = (buy, sell) =>{
    const {ResourceFields} = this.state
    ResourceFields[4].suggestion = buy
    ResourceFields[5].suggestion = sell
    this.setState({ResourceFields: [...ResourceFields] })
  }

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
            endDate: formatDate(editRex.endDate),
            startDate: formatDate(editRex.startDate),

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
    this.setState({ loading: true });
    const { editRex, skillId } = this.props;
    let { obj } = vake
    if (!skillId){
      obj = {
        ...obj,
        startDate: formatDate(obj.startDate, true),
        endDate: formatDate(obj.endDate, true),
      }
    }

    if (editRex) {
      if (skillId) {
        this.editResource(obj);
      } else {
        this.editSkill(obj);
      }
    } else {
      if (skillId) {
        this.addResourse(obj);
      } else {
        this.addSkill(obj);
      }
    }
  };

  addSkill = (data) => {
    const { leadId, callBack, crud } = this.props;
    addLeadSkill(crud, data, leadId).then((res) => {
      if (res.success) {
        callBack(res.data);
      }else{
        this.setState({ loading: false })
      }
    });
  };

  addResourse = (data) => {
    const { callBack, leadId, skillId, crud } = this.props;
    addLeadSkillResource(crud, skillId, data).then((res) => {
      if (res.success) {
        callBack(res.data);
      }else{
        this.setState({ loading: false })
      }
    });
  };

  editSkill = (data) => {
    const { editRex, leadId, callBack, crud } = this.props;
    data.id = editRex.id;
    console.log(data);
    editLeadSkill(crud, editRex.id, data).then((res) => {
      if (res.success) {
        callBack(res.data);
      }else{
        this.setState({ loading: false })
      }
    });
  };

  editResource = (data) => {
    const { editRex, callBack, leadId, skillId, crud } = this.props;
    data.id = editRex;
    editLeadSkillResource(crud, skillId, editRex.id, data).then((res) => {
      if (res.success) {
        callBack(res.data);
      }else{
        this.setState({ loading: false })
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
