import React, { Component } from "react";
import { Modal, Upload, Form, Popconfirm } from "antd";
import { DeleteOutlined, LoadingOutlined, PlusOutlined } from "@ant-design/icons"; //Icons
import FormItems from "../../../components/Core/Forms/FormItems";
import { dateClosed, dateRange, disableAllFields, formatDate, headers, localStore } from "../../../service/constant";

import { addList, editList, getRecord } from "../../../service/subContrators-contracts";
import { addFiles } from "../../../service/Attachment-Apis";
import { getCalendars } from "../../../service/constant-Apis";

class BillModal extends Component {
    constructor() {
        super();
        let yearClosed = localStore().closedYears
        yearClosed = yearClosed && JSON.parse(yearClosed)
        this.formRef = React.createRef();

        this.state = {
            editCntrct: false,
            loading: false,

            fileList: [],
            fileIds:null,

            disabledFY:false,
            disabledSY: false, //disable start Year

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
                    // rangeMin: true,
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
                        return dateRange(current, billing.endDate, 'start', undefined, yearClosed);
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
                        return dateRange(current, billing.startDate, 'end', undefined, yearClosed);
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
                    Placeholder: `Rate`,
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
                    fieldCol: 6,
                    size: "small",
                    type: "Text",
                    labelAlign: "right",
                    // itemStyle:{marginBottom:'10px'},
                },
                {
                    Placeholder: 'Employee Calendar',
                    fieldCol: 12,
                    size: 'small',
                    type: 'Text',
                    labelAlign: 'right',
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
        this.getData()
    };

    getData = () => {
        const { editCntrct } = this.props
        Promise.all([editCntrct && getRecord(editCntrct), getCalendars()])
        .then(res => {
            const {success, data} = res[0]
            let { BillingFields, disabledFY, disabledSY } = this.state
            BillingFields[13].data = res[1].data // calendar
            
            if (success){
                data.startDate = formatDate(data.startDate)
                data.endDate =  formatDate(data.endDate)
                disabledFY =  dateClosed(data.endDate, data.startDate);

                if (disabledFY) {
                    BillingFields = disableAllFields(BillingFields)
                }else{
                    disabledSY = dateClosed(data.startDate)
                    if (disabledSY)
                    BillingFields = disableAllFields(BillingFields)
                    BillingFields[3].disabled = false
                }

                this.formRef.current.setFieldsValue({ billing: data, });
                this.setState({
                    fileIds: data.fileId,
                    fileList: data.file,
                    BillingFields,
                    disabledFY,
                    disabledSY
                })
            }
        })
    }

    // getRecord = (data) => {
    //     getRecord(data).then(res=>{
            
    //     })        
    // };


    onFinish = (vake) => {
        // this will work after  getting the Object from level form
        this.setState({loading: true})
        const { fileIds } = this.state
        const {editCntrct, editEmp} = this.props
        const { billing } = vake;
        // billing.noOfHoursPer = 1; 
        billing.startDate = formatDate(billing.startDate, true)
        billing.endDate = formatDate(billing.endDate, true)
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
        console.log(data);
        const { callBack } = this.props;
        addList(data).then(res=>{
            this.setState({loading: false})
            console.log(res);
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
        const { BillingFields, loading, fileIds, fileList, disabledFY, disabledSY } = this.state;

        return (
            <Modal
                title={editCntrct ? "Edit Contract" : "Add Contract"}
                maskClosable={false}
                centered
                visible={visible}
                okButtonProps={{ disabled: loading|| disabledFY, loading, htmlType: 'submit', form: 'my-form'  }}
                okText={"Save"}
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
