import React, { Component } from "react";
import { Modal, Tabs, Form, Upload } from "antd";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons"; //Icons

import FormItems from "../../../components/Core/Forms/FormItems";
import { addFiles } from "../../../service/Attachment-Apis";
import { addOrder, getOrder, editOrder } from "../../../service/projects";
import { formatDate } from "../../../service/constant";


const { TabPane } = Tabs;

class OrderModal extends Component {
    constructor() {
        super();
        this.formRef = React.createRef();
        this.state = {
            editRex: false,
            orderSubmitted: false,
            check: false,
            loading: false,
            SKILLS: [],
            STATES: [],
            ORGS: [],
            fileList: [],
            fileIds:null,

            OrderFields: [
                {
                    Placeholder: "Order Number",
                    fieldCol: 12,
                    size: "small",
                    rangeMin: true,
                    type: "Text",
                    labelAlign: "right",
                    // itemStyle:{marginBottom:'10px'},
                },
                {
                    Placeholder: "Issue Date",
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
                    key: 'orderNo',
                    size: "small",
                    rules:[{ required: true, message: 'Order Number is Required' }],
                    type: "Input",
                }, 
                {
                    object: "obj",
                    fieldCol: 12,
                    key: 'issueDate',
                    size: "small",
                    rules:[{ required: true, message: 'Issue Date is Required' }],
                    type: "DatePicker",
                    fieldStyle: { width: "100%" },
                }, 
                {
                    Placeholder: "Expiry Date",
                    fieldCol: 12,
                    rangeMin: true,
                    size: "small",
                    type: "Text",
                    labelAlign: "right",
                    // itemStyle:{marginBottom:'10px'},
                },
                {
                    Placeholder: "Value",
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
                    key: 'expiryDate',
                    size: "small",
                    rules:[{ required: true, message: 'Expiry Date is Required' }],
                    type: "DatePicker",
                    fieldStyle: { width: "100%" },
                },
                {
                    object: "obj",
                    fieldCol: 12,
                    key: 'value',
                    size: "small",
                    rules:[{ required: true, message: 'Value is Required' }],
                    shape:"$",
                    type: "InputNumber",
                    fieldStyle: { width: "100%" },
                }, 
                {
                    Placeholder: "Expense",
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
                    key: 'expense',
                    size: "small",
                    rules:[{ required: true, message: 'Expense is Required' }],
                    shape:"$",
                    type: "InputNumber",
                    fieldStyle: { width: "100%" },
                },
                {
                    Placeholder: "Description",
                    fieldCol: 24,
                    size: "small",
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
                    object: "obj",
                    fieldCol: 24,
                    key: "comment",
                    size: "small",
                    type: "Textarea",
                    itemStyle: { marginBottom: 1 },
                },
                
            ],
        };
    }
    componentDidMount = () =>{
        this.getRecord()
    }

    OrderCall = (vake) => {
        // this will work after I get the Object from the form
        const { editRex } = this.props
        let { obj } = vake
        obj = {
            ...obj,
            fileId: this.state.fileIds,
            issueDate: formatDate(obj.issueDate, true),
            expiryDate: formatDate(obj.expiryDate, true),
        }
        if (editRex){
            this.editRecord(obj)

        }else{
            this.addRecord(obj)
        }
    };

    addRecord = (data) =>{
        this.setState({loading: true})
        const { ProId, callBack } = this.props
        console.log(ProId, data);
        addOrder(ProId, data).then(res=>{
            if(res.success){
                callBack(res.data)
            }
        })
    }
    
    
    getRecord = () => {
        const { ProId, editRex } = this.props;
        if (editRex){
            getOrder(ProId, editRex).then((resR) => {
                const {success, data} = resR
                if (success){
                    this.formRef.current.setFieldsValue({ obj: data })
                    this.setState({
                        fileIds: success? data.fileId : null,
                        fileList: success ? data.file : []
                    })
                }
            })
        }

    };

    editRecord = (data) => {
        this.setState({loading: true})
        const { editRex, ProId, callBack } = this.props;
        data.id = editRex
        editOrder(ProId, editRex, data).then((res) => {
            if(res.success){
                callBack(res.data)
            }
        });
    };

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
    
    render() {
        const { editRex, visible, close } = this.props;
        const { OrderFields, loading, fileList } = this.state
        return (
            <Modal
                title={editRex? "Edit Purchase Order" : "Add Purchase Order"}
                maskClosable={false}
                centered
                visible={visible}
                okButtonProps={{ disabled: loading, htmlType: 'submit', form: 'my-form'  }}
                okText={loading ?<LoadingOutlined /> :"Save"}
                onCancel={close}
                width={900}
            >
                 <Form
                    id={'my-form'}
                    ref={this.formRef}
                    onFinish={this.OrderCall}
                    scrollToFirstError={true}
                    size="small"
                    layout="inline"
                >

                    <FormItems  FormFields={OrderFields} />
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
                </Upload>
            </Modal>
        );
    }
}

export default OrderModal;
