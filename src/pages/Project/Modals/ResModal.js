import React, { Component } from "react";
import { Modal, Tabs, Form } from "antd";
import { LoadingOutlined } from "@ant-design/icons"; //Icons
// import { formatDate } from "../../../service/constant";

import { addLeadSkill, getLeadSkill, editLeadSkill, } from "../../../service/projects";
import { getPanelSkills, getOrgPersons, buyCost, } from "../../../service/constant-Apis";
import FormItems from "../../../components/Core/Forms/FormItems";
import { dateRangeAfter, dateRangeBefore, formatCurrency, formatDate } from "../../../service/constant";
import moment from "moment";

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
            const { obj, } = this.formRef.current.getFieldsValue(); // const
            obj["panelSkillStandardLevelId"] = undefined;
            obj["contactPersonId"] = undefined;
            delete ResourceFields[19].hint
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
          key: "panelSkillStandardLevelId",
          disabled: props.editRex,
          size: "small",
          rules:[{ required: true, message: 'Level is Required' }],
          data: [],
          type: "Select",
          onChange: async (value, option) =>{
            const { ResourceFields } = this.state;
          if (value) {
            const customUrl = `employees/get/by-skills?psslId=${value}&workType=P`;
            // getOrgPersons(customUrl).then((res) => {
            //   ResourceFields[10].data = res.success ? res.data : [];
            let { success, data } = await getOrgPersons(customUrl);
            ResourceFields[7].data = success ? data : [];

            ResourceFields[19].hint = this.ceilHint( option.stceil, option.ltceil );
          } else {
            delete ResourceFields[19].hint;
          }
          const { obj } = this.formRef.current.getFieldsValue(); // const
          obj['contactPersonId'] = undefined;
          this.formRef.current.setFieldsValue({ obj });
            this.setState({ ResourceFields });
          }
           
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
            return dateRangeAfter(current, obj?.endDate, props.pDates)
          },
          onChange: ()=>{
            const { obj } = this.formRef.current.getFieldValue();
            this.setBilHouRate(obj?.startDate, obj?.endDate);
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
            return dateRangeBefore(current, obj?.startDate, props.pDates)
          },
          onChange: ()=>{
            const { obj } = this.formRef.current.getFieldValue();
            this.setBilHouRate(obj?.startDate, obj?.endDate);
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
          Placeholder: "Total Billable Hours",
          fieldCol: 12,
          size: "small",
          type: "Text",
          rangeMin: true,
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
          key: "billableHours",
          size: "small",
          rules:[{ required: true, message: 'Work Hour is Required' }],
          type: "InputNumber",
          fieldStyle: { width: "100%" },
        },
        {
          Placeholder: "Buy Rate (Hourly)",
          fieldCol: 12,
          size: "small",
          rangeMin: true,
          type: "Text",
          labelAlign: "right",
          // itemStyle:{marginBottom:'10px'},
        },
        {
          Placeholder: "Sell Rate (Hourly)",
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

  // shahbaz 
  setBilHouRate = (start,end) =>{
    const {ResourceFields} = this.state
    if (start) {
      let totalDays = moment(end?? start).diff(moment(start), 'days')+1;
      ResourceFields[13].suggestion = totalDays * this.props.hours;
    } else {
      ResourceFields[13].suggestion = "";
    }
    this.setState({ResourceFields: [...ResourceFields] })
  }
  // end 

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
      }
    })
  }

  setRates = (buy, sell) =>{
    const {ResourceFields} = this.state
    ResourceFields[16].suggestion = buy
    ResourceFields[17].suggestion = sell
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
          ResourceFields[7].data = resP.success ? resP.data : [];
          ResourceFields[13].suggestion = (moment(resR.data?.endDate?? resR.data?.startDate).diff(moment(resR.data?.startDate), 'days')+1) * this.props.hours;
          ResourceFields[19].hint = this.ceilHint(resR.data?.stceil, resR.data?.ltceil)
          this.formRef.current.setFieldsValue({ obj: resR.data, });
          this.setState({ ResourceFields, allocationId: resR.data.allocationId, },()=>{
            if (resR?.data?.role) {
              this.checkRates(resR.data.contactPersonId, {label: resR?.data?.role})
            }else{
              this.setRates('No Active Contract', 'No Active Contract')
            }
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
  
  ceilHint = (stceil, ltceil) =>{
      return <div>
      <span style={{float: "left"}}>ST Ceil(hourly): {stceil}</span>
      <span style={{float: "right"}}>LT Ceil(hourly): {ltceil}</span>
    </div>
  }

  render() {
    const { editRex, visible, close, onHold } = this.props;
    const { ResourceFields, loading } = this.state;
    return (
      <Modal
        title={editRex ? "Edit Resource" : "Add Resource"}
        maskClosable={false}
        centered
        visible={visible}
        okButtonProps={{ disabled: loading || onHold, htmlType: 'submit', form: 'my-form' }}
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
