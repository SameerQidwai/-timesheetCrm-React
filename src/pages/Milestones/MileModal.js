import React, { Component } from "react";
import { Modal, Tabs, Form } from "antd";
import { LoadingOutlined } from "@ant-design/icons"; //Icons
import FormItems from "../../components/Core/FormItems";
import { addMilestone, editMilestone, getMilestone } from "../../service/Milestone-Apis";



class MileModal extends Component {
  constructor() {
    super();
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
            shape: '$',
            // disabled: true,
            size: "small",
            rules:[{ required: true, message: 'amount is Required' }],
            type: "InputNumber",
            fieldStyle: { width: "100%" },
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
            key: "dueDate",
            size: "small",
            rules:[{ required: true, message: 'End Date is Required' }],
            type: "DatePicker",
            fieldStyle: { width: "100%" },
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
            Placeholder: "Approved",
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
            fieldCol: 12,
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
    const { proId, callBack } = this.props;
    data.projectId = proId
    addMilestone(data).then(res=>{
      if(res.success){
        callBack(res.data)
      }
    })
  };

  getRecord = () => {
    const { editMile } = this.props;
    getMilestone(editMile).then(res=>{
      if( res.success ){
          this.setState({
              data: res.data,
              proId: editMile,
          })
      }
    })
  };

  editRecord = (data) => {
    const { editMile, callBack } = this.props;
    data.id = editMile;
    editMilestone(data).then(res=>{
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
            onFinish={this.onFinish}
            scrollToFirstError={true}
            size="small"
            layout="inline"
        >
            <FormItems FormFields={MileFields} />
        </Form>
      </Modal>
    );
  }
}

export default MileModal;
