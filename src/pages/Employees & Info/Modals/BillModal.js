import React, { Component } from "react";
import { Modal, Upload } from "antd";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons"; //Icons

import Form from "../../../components/Core/Form";

import moment from "moment";
import { addList, editList, getRecord } from "../../../service/employee-contracts";
import { addAttachments, addFiles } from "../../../service/Attachment-Apis";

class BillModal extends Component {
    constructor() {
        super();
        this.billingRef = React.createRef();

        this.state = {
            editCntrct: false,
            basicSubmitted: false,
            billingSubmitted: false,
            detailSubmitted: false,
            kinSubmitted: false,
            skillSubmitted: false,
            loading: false,
            imgLoading: false,
            fileList: [],
            fileIds:null,

            data: {
                pay_email: "Trigger.payme@oneLm.com",
                h_rate: "90",
                mem_ac: "98098",
                b_ac: "CPAL98304829101",
                pay_f: "Weekly",
                startDate: moment("12 26 2020"),
            },
            BillingFields: {
                formId: "billing_form",
                FormCol: 24,
                FieldSpace: 24,
                justifyField: "center",
                FormLayout: "inline",
                layout: { labelCol: { span: 9 }, wrapperCol: { span: 0 } },
                size: "middle",
                fields: [
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
                        Placeholder: "Full Work Hours",
                        rangeMin: true,
                        fieldCol: 12,
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
                        key: "noOfHoursPer",
                        size: "small",
                        type: "Select",
                        // shape: " Hours",
                        data: [
                            { label: "Hourly", value: 1 },
                            { label: "Daily", value: 2 },
                            { label: "Weekly", value: 3 },
                            { label: "Fortnightly", value: 4 },
                            { label: "Monthly", value: 5 },
                        ],
                        fieldStyle: { width: "100%" },
                        rules: [ { required: true, message: "Work Hours is Required", }, ],
                        itemStyle: { marginBottom: 1 },
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
                        fieldCol: 24,
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
            },
        };
    }

    componentDidMount = () => {
        const { editCntrct } = this.props
        if (editCntrct) {
            this.getRecord(editCntrct);
        }
    };

    submit = () => {
        this.billingRef.current && this.billingRef.current.refs.billing_form.submit();
    };

    BillingCall = (vake) => {
        // this will work after  getting the Object from level form
        const {editCntrct, editEmp} = this.props
        const { fileIds } = this.state
        const { billing } = vake;
        billing.noOfHoursPer = 1; 
        billing.type === 1 ? billing.remunerationAmountPer = 1 : billing.remunerationAmountPer = 7
        billing.startDate = billing.startDate ? moment(billing.startDate).valueOf(): null
        billing.endDate = billing.endDate ? moment(billing.endDate).valueOf(): null
        billing.employeeId = editEmp;
        billing.fileId = fileIds

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

    getRecord = (data) => {
        getRecord(data).then(res=>{
            const {success, data} = res
            if (success){
                data.startDate = data.startDate && moment(data.startDate)
                data.endDate = data.endDate && moment(data.endDate)
                this.billingRef.current.refs.billing_form.setFieldsValue({ billing: data, });
                this.setState({
                    fileIds: data.fileId,
                    fileList: data.file
                })
            }
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
                onOk={() => { this.submit(); }}
                okButtonProps={{ disabled: loading }}
                okText={loading ?<LoadingOutlined /> :"Save"}
                onCancel={close}
                width={900}
            >
                <Form ref={this.billingRef} Callback={this.BillingCall} FormFields={BillingFields} />
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
