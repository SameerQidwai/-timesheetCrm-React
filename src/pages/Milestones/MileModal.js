import React, { Component, createRef } from "react";
import { Modal, Tabs, Form } from "antd";
import { LoadingOutlined } from "@ant-design/icons"; //Icons
import FormItems from "../../components/Core/Forms/FormItems";
import { addMilestone, editMilestone, getMilestone } from "../../service/Milestone-Apis";

import moment from "moment";


class MileModal extends Component {
  constructor() {
    super();
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

      MileFields: [
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
                return  obj.endDate && current > obj.endDate
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
                return  obj.startDate && current < obj.startDate
            }
          },
          {
            Placeholder: "Approved",
            fieldCol: 24,
            size: "small",
            // rangeMin: true,
            type: "Text",
            labelAlign: "right",
            // itemStyle:{marginBottom:'10px'},
          },
          {
            object: "obj",
            fieldCol: 12,
            key: "isApproved",
            size: "small",
            // rules:[{ required: true, message: 'Buying Rate is Required' }],
            type: "Select",
            data: [{label: 'True', value: true}, {label: 'False', value: false}],
            fieldStyle: { width: "100%" },
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
    vake = vake.obj
    if (editMile){
      this.editRecord(vake)
    }else{
      this.addRecord(vake)
    }
  };

  addRecord = (data) => {
    const { proId, callBack, crud } = this.props;
    data.projectId = proId
    addMilestone(crud, data).then(res=>{
      if(res.success){
        callBack(res.data)
      }
    })
  };

  getRecord = () => {
    const { editMile } = this.props;
    editMile.startDate = editMile.startDate && moment(editMile.startDate)
    editMile.endDate = editMile.endDate&& moment(editMile.endDate)
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
      }
    })
  };

  render() {
    const { editMile, visible, close } = this.props;
    const { MileFields, loading } = this.state;
    return (
      <Modal
        title={editMile ? "Edit Milestone" : "Add Milestone"}
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
            initialValues={{obj:{progress:0}}}
        >
            <FormItems FormFields={MileFields} />
        </Form>
      </Modal>
    );
  }
}

export default MileModal;
