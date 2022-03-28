import React, { Component } from "react";
import { Modal, Upload, Form } from "antd";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons"; //Icons
import FormItems from "../../../components/Core/Forms/FormItems";
import { headers } from "../../../service/constant";

import moment from "moment";
import { addList, editList, getRecord } from "../../../service/subContrators-contracts";
import { addFiles } from "../../../service/Attachment-Apis";

class BillModal extends Component {
    constructor() {
        super();
        this.formRef = React.createRef();

        this.state = {
            editCntrct: false,
            loading: false,

            fileList: [],
            fileIds:null,

            data: { },
            
            BillingFields: [
                {
                    Placeholder: "Contract Start Date",
                    rangeMin: true,
                    fieldCol: 12,
                    size: "small",
                    type: "Text",
                    labelAlign: "right",
                },
                {
                    Placeholder: "Contract End Date",
                    fieldCol: 12,
                    size: "small",
                    type: "Text",
                    labelAlign: "right",
                },
                {
                    object: "billing",
                    fieldCol: 12,
                    key: "startDate",
                    size: "small",
                    type: "DatePicker",
                    fieldStyle: { width: "100%" },
                    rules: [ { required: true, message: "Start Date is required", }, ],
                    labelAlign: "right",
                    rangeMin: (current)=>{
                        const { billing } = this.formRef.current.getFieldValue();
                        return  billing.endDate && current >  billing.endDate
                    }
                },
                {
                    object: "billing",
                    fieldCol: 12,
                    key: "endDate",
                    size: "small",
                    type: "DatePicker",
                    fieldStyle: { width: "100%" },
                    rangeMax: (current)=>{
                        const { billing } = this.formRef.current.getFieldValue();
                        return  billing.startDate && current < billing.startDate
                    }
                },
                {
                    Placeholder: "Contract Payment Basis",
                    rangeMin: true,
                    fieldCol: 12,
                    size: "small",
                    type: "Text",
                    labelAlign: "right",
                },
                {
                    Placeholder: `Total Fee`,
                    rangeMin: true,
                    fieldCol: 12,
                    size: "small",
                    type: "Text",
                    labelAlign: "right",
                },
                {
                    object: "billing",
                    fieldCol: 12,
                    key: "remunerationAmountPer",
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
                    onChange: (value, option) => {
                        const { BillingFields } = this.state
                        BillingFields[5].Placeholder = `Total Fee ${value ?option.label: ''}`
                        this.setState({BillingFields})
                    },
                },
                {
                    object: "billing",
                    fieldCol: 12,
                    key: "remunerationAmount",
                    size: "small",
                    type: "InputNumber",
                    shape: "$",
                    fieldStyle: { width: "100%" },
                    rules: [ { required: true, message: "Total Fee is Required", }, ],
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
                    fieldCol: 18,
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
                    fieldStyle: { width: "100%" },
                    rules: [
                        {
                            required: true,
                            message: "Work Hour is Reqired",
                        },
                    ],
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
                    Placeholder: "Comments",
                    fieldCol: 24,
                    size: "small",
                    type: "Text",
                    labelAlign: "right",
                },
                {
                    object: "billing",
                    fieldCol: 24,
                    key: "comments",
                    size: "small",
                    type: "Textarea",
                },
                
            ],
        };
    }

    componentDidMount = () => {
        const { editCntrct } = this.props
        if (editCntrct) {
            this.getRecord(editCntrct);
        }
    };

    onFinish = (vake) => {
        // this will work after  getting the Object from level form
        const { fileIds } = this.state
        const {editCntrct, editEmp} = this.props
        const { billing } = vake;
        // billing.noOfHoursPer = 1; 
        billing.startDate = billing.startDate ? moment(billing.startDate).valueOf(): null
        billing.endDate = billing.endDate ? moment(billing.endDate).valueOf(): null
        billing.subContractorId = editEmp;
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
        this.setState({loading: true})
        console.log(data);
        const { callBack } = this.props;
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
            console.log(res);
            if (success){
                data.startDate = data.startDate && moment(data.startDate)
                data.endDate = data.endDate && moment(data.endDate)
                this.formRef.current.setFieldsValue({ billing: data, });
                this.setState({
                    fileIds: data.fileId,
                    fileList: data.file
                })
            }
        })        
    };

    editRecord = (data) => {
        this.setState({loading: true})
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
        const { BillingFields, loading, fileIds, fileList } = this.state;

        return (
            <Modal
                title={editCntrct ? "Edit Contract" : "Add Contract"}
                maskClosable={false}
                centered
                visible={visible}
                okButtonProps={{ readOnly: loading, htmlType: 'submit', form: 'my-form'  }}
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
                    {!fileIds &&
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
