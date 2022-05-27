import React, { Component } from "react";
import { Modal, Upload, Form } from "antd";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons"; //Icons

import FormItems from "../../../components/Core/Forms/FormItems";

import moment from "moment";
import { addList, editList, getRecord } from "../../../service/employee-contracts";
import { addAttachments, addFiles } from "../../../service/Attachment-Apis";
import { getLeavePolicy } from "../../../service/constant-Apis";

class BillModal extends Component {
    constructor() {
        super();
        this.formRef = React.createRef();

        this.state = {
            editCntrct: false,
            loading: false,
            imgLoading: false,
            fileList: [],
            fileIds:null,

            data: { },

            BillingFields: [
                {
                    Placeholder: "Employment Status",
                    rangeMin: true,
                    fieldCol: 12,
                    size: "small",
                    type: "Text",
                    labelAlign: "right",
                    // itemStyle:{marginBottom:'10px'},
                },
                {
                    Placeholder: "Payslip Email",
                    fieldCol: 12,
                    size: "small",
                    type: "Text",
                    labelAlign: "right",
                    // itemStyle:{marginBottom:'10px'},
                },
                {
                    object: "billing",
                    fieldCol: 12,
                    key: "type",
                    size: "small",
                    data: [
                        { label: "Casual", value: 1 },
                        { label: "Part Time", value: 2 },
                        { label: "Full Time", value: 3 },
                    ],
                    type: "Select",
                    rules: [ { required: true, message: "Status is Required", }, ],
                    onChange: (value) => {
                        const { BillingFields } = this.state
                        if (value === 1){
                            BillingFields[11].Placeholder = "Hourly Base Salary"
                            this.setState({BillingFields})
                        }else{
                            BillingFields[11].Placeholder = "Annual Base Salary"
                            this.setState({BillingFields})
                        }
                    },
                    itemStyle: { marginBottom: 1 },
                },
                {
                    object: "billing",
                    fieldCol: 12,
                    key: "payslipEmail",
                    size: "small",
                    type: "input",
                    // rules: [
                    //     {
                    //         required: true,
                    //         message: "Payment Email is required",
                    //     },
                    // ],
                    itemStyle: { marginBottom: 1 },
                },
                {
                    Placeholder: "Work Hours In A Week",
                    rangeMin: true,
                    fieldCol: 6,
                    size: "small",
                    type: "Text",
                    labelAlign: "right",
                    // itemStyle:{marginBottom:'10px'},
                },
                {
                    Placeholder: "Work Days In A Week",
                    rangeMin: true,
                    fieldCol: 6,
                    size: "small",
                    type: "Text",
                    labelAlign: "right",
                    // itemStyle:{marginBottom:'10px'},
                },
                {
                    Placeholder: "Contract Start Date",
                    rangeMin: true,
                    fieldCol: 12,
                    size: "small",
                    type: "Text",
                    labelAlign: "right",
                    // itemStyle:{marginBottom:'10px'},
                },
                
                {
                    object: "billing",
                    fieldCol: 6,
                    key: "noOfHours",
                    size: "small",
                    type: "InputNumber",
                    // shape: " Hours",
                    fieldStyle: { width: "100%" },
                    rules: [ { required: true, message: "Work Hours is Required", }, ],
                    itemStyle: { marginBottom: 1 },
                },
                {
                    object: "billing",
                    fieldCol: 6,
                    key: "noOfDays",
                    size: "small",
                    type: "InputNumber",
                    // shape: " Hours",
                    // data: [
                    //     // { label: "Daily", value: 2 },
                    //     { label: "Weekly", value: 3 },
                    //     // { label: "Fortnightly", value: 4 },
                    //     // { label: "Monthly", value: 5 },
                    // ],
                    fieldStyle: { width: "100%" },
                    rules: [ { required: true, message: "Work Days are Required", }, ],
                    itemStyle: { marginBottom: 10 },
                },
                {
                    object: "billing",
                    fieldCol: 12,
                    key: "startDate",
                    size: "small",
                    type: "DatePicker",
                    fieldStyle: { width: "100%" },
                    rules: [ { required: true, message: "Start Date is Required", }, ],
                    itemStyle: { marginBottom: 1 },
                    rangeMin: (current)=>{
                    const { billing } = this.formRef.current.getFieldValue();
                    return  billing.endDate && current > billing.endDate
                }
                },
                {
                    Placeholder: "Contract End Date",
                    fieldCol: 12,
                    size: "small",
                    type: "Text",
                    labelAlign: "right",
                    // itemStyle:{marginBottom:'10px'},
                },
                {
                    Placeholder: "Annual Base Salary",
                    rangeMin: true,
                    fieldCol: 12,
                    size: "small",
                    type: "Text",
                    labelAlign: "right",
                    // itemStyle:{marginBottom:'10px'},
                },
                {
                    object: "billing",
                    fieldCol: 12,
                    key: "endDate",
                    size: "small",
                    type: "DatePicker",
                    fieldStyle: { width: "100%" },
                    itemStyle: { marginBottom: 1 },
                    rangeMax: (current)=>{
                    const { billing } = this.formRef.current.getFieldValue();
                    return  billing.startDate && current < billing.startDate
                }
                },
                {
                    object: "billing",
                    fieldCol: 12,
                    key: "remunerationAmount",
                    size: "small",
                    type: "InputNumber",
                    shape: "$",
                    fieldStyle: { width: "100%" },
                    rules: [ { required: true, message: "Salary is Required", }, ],
                    itemStyle: { marginBottom: 1 },
                },  
                {
                    Placeholder: "Pay Frequence",
                    rangeMin: true,
                    fieldCol: 12,
                    size: "small",
                    type: "Text",
                    labelAlign: "right",
                    // itemStyle:{marginBottom:'10px'},
                },
                {
                    Placeholder: "Leave Policy",
                    rangeMin: true,
                    fieldCol: 12,
                    size: "small",
                    type: "Text",
                    labelAlign: "right",
                    // itemStyle:{marginBottom:'10px'},
                },
                {
                    object: "billing",
                    fieldCol: 12,
                    key: "payFrequency",
                    size: "small",
                    data: [
                        { label: "Hourly", value: 1 },
                        { label: "Daily", value: 2 },
                        { label: "Weekly", value: 3 },
                        { label: "Fortnightly", value: 4 },
                        { label: "Monthly", value: 5 },
                    ],
                    type: "Select",
                    rules: [ { required: true, message: "Payment Frequncy is required", }, ],
                    itemStyle: { marginBottom: 1 },
                },
                {
                    object: "billing",
                    fieldCol: 12,
                    key: "leaveRequestPolicyId",
                    size: "small",
                    data: [],
                    type: "Select",
                    rules: [ { required: true, message: "Policy is required", }, ],
                    itemStyle: { marginBottom: 10 },
                },
                {
                    Placeholder: "Comments",
                    fieldCol: 24,
                    size: "small",
                    type: "Text",
                    labelAlign: "right",
                    // itemStyle:{marginBottom:'10px'},
                },
                {
                    object: "billing",
                    fieldCol: 24,
                    key: "comments",
                    size: "small",
                    type: "Textarea",
                    itemStyle: { marginBottom: 1 },
                },
            ],
        };
    }

    componentDidMount = () => {
        this.getData();
    };

    onFinish = (vake) => {
        // this will work after  getting the Object from level form
        const {editCntrct, editEmp} = this.props
        const { fileIds } = this.state
        const { billing } = vake;
        billing.noOfHoursPer = 1; 
        billing.type === 1 ? billing.remunerationAmountPer = 1 : billing.remunerationAmountPer = 7;
        billing.startDate = billing.startDate ? moment(billing.startDate).valueOf(): null;
        billing.endDate = billing.endDate ? moment(billing.endDate).valueOf(): null;
        billing.employeeId = editEmp;
        billing.fileId = fileIds;
        billing.leaveRequestPolicyId = billing.leaveRequestPolicyId || null; 

        if (!editCntrct) {
            console.log("emes");
            this.addContract(billing); //add skill
        } else {
            console.log("edit");
            this.editRecord(billing); //edit skill
        }
    };

    addContract = (data) => {
        this.setState({loading: true,})
        const { callBack } = this.props;
        console.log(data);
        addList(data).then(res=>{
            console.log(res);
            if(res.success){
                callBack();
            }
        });
    };

    getData = () => {
        const { editCntrct } = this.props
        Promise.all([getLeavePolicy(), editCntrct && getRecord(editCntrct)])
        .then(res => {
            const{BillingFields} = this.state
            BillingFields[17].data = res[0].success ? res[0].data:[];
            const {success, data} = res[1]
            if (success){
                BillingFields[11].Placeholder = data.type ===1 ? "Hourly Base Salary" : "Annual Base Salary"
                data.startDate = data.startDate && moment(data.startDate)
                data.endDate = data.endDate && moment(data.endDate)
                this.formRef.current.setFieldsValue({ billing: data, });
            }
            this.setState({
                fileIds: success? data.fileId : null,
                fileList: success? data.file: [],
                BillingFields
            })
        })        
    };

    editRecord = (data) => {
        this.setState({loading: true,})
        const { editCntrct, callBack } = this.props;
        editList(editCntrct, data).then((res) => {
            if(res.success){
                callBack()
            }
        });
    };

     //file upload testing

     handleUpload = async option=>{
        const { onSuccess, onError, file, onProgress } = option;
        const formData = new FormData();
        const  config = {
            headers: {"content-type": "multipart/form-data"},
            onUploadProgress: event =>{
                const percent = Math.floor((event.loaded / event.total) * 100);
                this.setState({progress: percent});
                if (percent === 100) {
                  setTimeout(() => this.setState({progres: 0}), 1000);
                }
                onProgress({ percent: (event.loaded / event.total) * 100 });
              }
            }
            formData.append('files', file)
            addFiles(formData, config).then((res,err)=>{
                if (res.success){
                    onSuccess("Ok");
                    this.setState({
                        fileList: [res.file],
                        fileIds: res.file.fileId
                    })
                }else{
                    console.log("Eroor: ", err);
                    const error = new Error("Some error");
                    onError({ err });
                }
            })
    }

    onRemove = (file) => {
        this.setState({
            fileIds: null,
            fileList: []
        })  
    }

    //file upload testing

    render() {
        const { editCntrct, visible, close } = this.props;
        const { BillingFields, loading, fileList } = this.state;

        return (
            <Modal
                title={editCntrct ? "Edit Billing" : "Add Billing"}
                maskClosable={false}
                centered
                visible={visible}
                okButtonProps={{ disabled: loading, htmlType: 'submit', form: 'my-form'  }}
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
                    initialValues={ { billing:{ entryDate: moment(new Date()) } } }
                >

                    <FormItems  FormFields={BillingFields} />
                </Form>
                <p style={{marginTop: 10, marginBottom: 2}}>Signed Contract</p>
                <Upload
                    customRequest={this.handleUpload}
                    // listType="picture"
                    listType="picture-card"
                    maxCount={1}
                    fileList={fileList}
                    onRemove= {this.onRemove}
                >
                    {fileList.length < 1 &&
                        <div style={{marginTop: 10}} >
                            <PlusOutlined />
                            <div style={{ marginTop: 8 }}>Upload</div>
                        </div>
                    }
                    {/* <Button icon={<UploadOutlined />} style={{marginTop: 10}} loading={imgLoading}>Upload Contract</Button> */}
                </Upload>
            </Modal>
        );
    }
}

export default BillModal;
