import React, { Component, createRef } from "react";
import { Modal, Tabs, Form } from "antd";
import { LoadingOutlined } from "@ant-design/icons"; //Icons
import FormItems from "../../../components/Core/Forms/FormItems";
import { addMilestone, editMilestone, getMilestone } from "../../../service/Milestone-Apis";

import { dateRangeAfter, dateRangeBefore, formatDate } from "../../../service/constant";


class MileModal extends Component {
  constructor(props) {
    super(props);
    this.formRef = React.createRef();

    this.state = {
      editMile: false,
      resourceSubmitted: false,
      check: false,
      loading: false,
      SKILLS: [],
      STATES: [],
      ORGS: [],
      data: {},

      PMileFields: [
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
            Placeholder: "Progress",
            fieldCol: 12,
            size: "small",
            // rangeMin: true,
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
            key: "progress",
            // rules:[{ required: true, message: 'Effort Rate is Required' }],
            shape: "%",
            size: "small",
            type: "InputNumber",
            fieldStyle: { width: "100%" },
            rangeMin: 0,
            rangeMax: 100,
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
          // {
          //   Placeholder: "Approved",
          //   fieldCol: 24,
          //   size: "small",
          //   // rangeMin: true,
          //   type: "Text",
          //   labelAlign: "right",
          //   // itemStyle:{marginBottom:'10px'},
          // },
          // {
          //   object: "obj",
          //   fieldCol: 12,
          //   key: "isApproved",
          //   size: "small",
          //   // rules:[{ required: true, message: 'Buying Rate is Required' }],
          //   type: "Select",
          //   data: [{label: 'True', value: true}, {label: 'False', value: false}],
          //   fieldStyle: { width: "100%" },
          // },
          {
            Placeholder: "Description",
            fieldCol: 24,
            size: "small",
            // rangeMin: true,
            type: "Text",
            labelAlign: "right",
            // itemStyle:{marginBottom:'10px'},
          },
          {
            object: "obj",
            fieldCol: 24,
            key: "description",
            size: "small",
            type: "Textarea",
        },
      ],

      LMileFields: [
          {
            Placeholder: "Title",
            fieldCol: 12,
            size: "small",
            rangeMin: true,
            type: "Text",
            labelAlign: "right",
            // itemStyle:{marginBottom:'10px'},
          },
          // {
          //   Placeholder: "Approved",
          //   fieldCol: 12,
          //   size: "small",
          //   // rangeMin: true,
          //   type: "Text",
          //   labelAlign: "right",
          //   // itemStyle:{marginBottom:'10px'},
          // },
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
            key: "title",

            // disabled: true,
            size: "small",
            rules:[{ required: true, message: 'title is Required' }],
            type: "Input",
          },
          // {
          //   object: "obj",
          //   fieldCol: 12,
          //   key: "isApproved",
          //   size: "small",
          //   // rules:[{ required: true, message: 'Buying Rate is Required' }],
          //   type: "Select",
          //   data: [{label: 'True', value: true}, {label: 'False', value: false}],
          //   fieldStyle: { width: "100%" },
          // },
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
            Placeholder: "End Date",
            fieldCol: 24,
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
              return dateRangeBefore(current, obj.startDate, props.pDates)
            }
          },
          {
            Placeholder: "Description",
            fieldCol: 24,
            size: "small",
            // rangeMin: true,
            type: "Text",
            labelAlign: "right",
            // itemStyle:{marginBottom:'10px'},
          },
          {
            object: "obj",
            fieldCol: 24,
            key: "description",
            size: "small",
            type: "Textarea",
        },
      ],
    };
  }

  componentDidMount = () => {
    console.log(this.props.crud);
    this.openModal();
  };

  openModal = () => {
    const { editMile } = this.props;
    if(editMile){
      this.getRecord(editMile)
    }
  };

  onFinish = (vake) => {
    // this will work after I get the Object from the form
    const { editMile } = this.props;
    this.setState({ loading: true });
    let { obj } = vake
    obj = {
      ...obj,
      startDate: formatDate(obj.startDate, true),
      endDate: formatDate(obj.endDate, true)
    }

    if (editMile){
      this.editRecord(obj)
    }else{
      this.addRecord(obj)
    }
  };

  addRecord = (data) => {
    const { proId, callBack, crud } = this.props;
    data.projectId = proId
    addMilestone(crud, data).then(res=>{
      if(res.success){
        callBack(res.data)
      }else{
        this.setState({loading: false})
      }
    })
  };

  getRecord = () => {
    const { editMile } = this.props;
    editMile.startDate = formatDate(editMile.startDate)
    editMile.endDate = formatDate(editMile.endDate)
    this.formRef.current.setFieldsValue({ obj: editMile});
    // getMilestone(editMile.id).then(res=>{
    //   if( res.success ){
    //   }
    // })
  };

  editRecord = (data) => {
    const { editMile, callBack, crud } = this.props;
    editMilestone(crud, editMile.id, data).then(res=>{
      if(res.success){
        callBack(res.data)
      }else{
        this.setState({ loading: false })
      }
    })
  };

  render() {
    const { editMile, visible, close, work, onHold} = this.props;
    const { PMileFields, LMileFields ,loading } = this.state;
    return (
      <Modal
        title={editMile ? "Edit Milestone" : "Add Milestone"}
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
            initialValues={{obj:{progress:0}}}
        >
            <FormItems FormFields={work === 'opportunities' ? LMileFields :PMileFields} />
        </Form>
      </Modal>
    );
  }
}

export default MileModal;
