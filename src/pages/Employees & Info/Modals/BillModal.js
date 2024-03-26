import React, { Component } from "react";
import { Modal, Upload, Form, Popconfirm } from "antd";
import { DeleteOutlined, LoadingOutlined, PlusOutlined } from "@ant-design/icons"; //Icons

import FormItems from "../../../components/Core/Forms/FormItems";

import { addList, editList, getRecord } from "../../../service/employee-contracts";
import { addAttachments, addFiles } from "../../../service/Attachment-Apis";
import { getCalendars, getLeavePolicy } from "../../../service/constant-Apis";
import { dateClosed, dateRange, disableAllFields, formatDate, localStore } from "../../../service/constant";

class BillModal extends Component {
    constructor() {
        super();
        let yearClosed = localStore().closedYears
        yearClosed = yearClosed && JSON.parse(yearClosed)
        this.formRef = React.createRef();

        this.state = {
            editCntrct: false,
            loading: false,
            imgLoading: false,
            fileList: [],
            fileIds:null,
            disabledFY:false,
            disabledSY: false, //disable start Year
            data: { },

            BillingFields: [
                {
                    Placeholder: "Employment Status",
                    rangeMin: true,
                    fieldCol: 6,
                    size: "small",
                    type: "Text",
                    labelAlign: "right",
                    // itemStyle:{marginBottom:'10px'},
                },
                {
                    Placeholder: "Back Office Rate of Effort",
                    rangeMin: true,
                    fieldCol: 6,
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
                    fieldCol: 6,
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
                            BillingFields[13].Placeholder = "Hourly Base Salary"
                            this.setState({BillingFields})
                        }else{
                            BillingFields[13].Placeholder = "Annual Base Salary"
                            this.setState({BillingFields})
                        }
                    },
                    itemStyle: { marginBottom: 1 },
                },
                {
                    object: "billing",
                    fieldCol: 6,
                    key: "bohPercent",
                    size: "small",
                    type: "InputNumber",
                    rules:[{ required: true, message: 'BOH Rate is Required' }],
                    shape: "%",
                    rangeMin: 0,
                    rangeMax: 100,
                    itemStyle: { marginBottom: 10 },
                },
                {
                    object: "billing",
                    fieldCol: 12,
                    key: "payslipEmail",
                    size: "small",
                    type: "input",
                    rules:[ {
                        type: 'email',
                        message: 'The input is not valid e-mail!',
                      }],
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
                    rangeMin: 1,
                    rangeMax: 5,
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
                    return dateRange(current, billing.endDate, 'start', undefined, yearClosed);
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
                    return dateRange(current, billing.startDate, 'end', undefined, yearClosed);
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
                    itemStyle: { marginBottom: 1 },
                },
                {
                    Placeholder: 'Employee Calendar',
                    fieldCol: 24,
                    size: 'small',
                    type: 'Text',
                    labelAlign: 'right',
                },
                {
                    object: 'billing',
                    fieldCol: 12,
                    key: 'calendarId',
                    size: 'small',
                    data: [],
                    type: 'Select',
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

    getData = () => {
        const { editCntrct } = this.props
        Promise.all([getLeavePolicy(), editCntrct && getRecord(editCntrct), getCalendars()])
        .then(res => {
            let{BillingFields, disabledFY, disabledSY} = this.state
            BillingFields[19].data = res[0].success ? res[0].data: [];
            BillingFields[21].data = res[2].success ? res[2].data: [];
            const {success, data} = res[1]
            if (success){
                BillingFields[13].Placeholder = data.type ===1 ? "Hourly Base Salary" : "Annual Base Salary"
                data.startDate =  formatDate(data.startDate)
                data.endDate =  formatDate(data.endDate)
                disabledFY =  dateClosed(data.endDate, data.startDate);

                if (disabledFY) {
                    BillingFields = disableAllFields(BillingFields)
                }else{
                    disabledSY = dateClosed(data.startDate)
                    if (disabledSY)
                    BillingFields = disableAllFields(BillingFields)
                    BillingFields[14].disabled = false
                }

                this.formRef.current.setFieldsValue({ billing: data, });
            }
            this.setState({
                fileIds: success? data.fileId : null,
                fileList: success? data.file: [],
                BillingFields,
                disabledFY,
                disabledSY //disable start year means start year is fallen in previous lock year
            })
        })        
    };

    onFinish = (vake) => {
        // this will work after  getting the Object from level form
        this.setState({loading: true,})
        const {editCntrct, editEmp} = this.props
        const { fileIds } = this.state
        let { billing } = vake;
        billing = { 
            ...billing,
            noOfHoursPer: 1,
            remunerationAmountPer: billing.type === 1 ? 1 : 7,
            startDate: formatDate(billing.startDate, true),
            endDate: formatDate(billing.endDate, true),
            employeeId: editEmp,
            fileId: fileIds,
            leaveRequestPolicyId: billing.leaveRequestPolicyId || null,
    }
    // console.log(billing)

        if (!editCntrct) {
            this.addContract(billing); //add skill
        } else {
            this.editRecord(billing); //edit skill
        }
    };

    addContract = (data) => {
        const { callBack } = this.props;
        addList(data).then(res=>{
            this.setState({loading: false})
            if(res.success){
                callBack();
            }
        });
    };

    

    editRecord = (data) => {
        const { editCntrct, callBack } = this.props;
        editList(editCntrct, data).then((res) => {
            this.setState({loading: false})
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
        const { BillingFields, loading, fileList, disabledFY, disabledSY } = this.state;

        return (
            <Modal
                title={editCntrct ? "Edit Billing" : "Add Billing"}
                maskClosable={false}
                centered
                visible={visible}
                okButtonProps={{ disabled: loading|| disabledFY, loading:loading, htmlType: 'submit', form: 'my-form'  }}
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
                    initialValues={ { billing:{ entryDate: formatDate(new Date()) } } }
                >
                    <FormItems  FormFields={BillingFields} />
                </Form>
                <p style={{marginTop: 10, marginBottom: 2}}>Signed Contract</p>
                <Upload
                    customRequest={this.handleUpload}
                    // listType="picture"
                    disabled={disabledFY||disabledSY}
                    listType="picture-card"
                    maxCount={1}
                    fileList={fileList}
                    showUploadList={{
                        removeIcon: (file) => <Popconfirm
                        title="Are you sure you want to delete ?"
                        onConfirm={() => this.onRemove(file)}
                        okText="Yes"
                        cancelText="No"
                        placement="bottomRight"
                      >
                        <DeleteOutlined />
                      </Popconfirm>
                    }}
                    // onRemove= {this.onRemove}
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
