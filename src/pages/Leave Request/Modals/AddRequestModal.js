import React, { Component } from "react";
import { Modal, Table, Form, Row, Col, Upload, Typography, Input } from "antd";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons"; //Icons
import moment from "moment";
import FormItems from "../../../components/Core/FormItems";
import './AddRequestModal.css';

import { addList, editList, getRecord } from "../../../service/employee-contracts";
import { addFiles } from "../../../service/Attachment-Apis";
import { getProjects, } from "../../../service/constant-Apis";

import { localStore } from '../../../service/constant';
const { Title } = Typography

class AddRequestModal extends Component{
    constructor(props){
        super(props);
        this.formRef = React.createRef();
        this.state = {
            data: [],
            leaveType: [],
            loading: false,
            fileList: [],
            fileIds:null,
            BasicFields: [
            {
                Placeholder: "Leave Type",
                rangeMin: true,
                fieldCol: 8,
                size: "small",
                type: "Text",
                labelAlign: "right",
                itemStyle:{marginBottom:'10px'},
            },
            {
                object: "dates",
                fieldCol: 16,
                key: "leaveType",
                size: "small",
                rules: [{ required: true, message: "Leave Type is Required" }],
                data: [
                    {
                        label: 'Annual',
                        value: 0
                    },
                    {
                        label: 'Sick Leave',
                        value: 1
                    },
                    {
                        label: 'Unpaid',
                        value: 2
                    },
                ],
                type: "Select",
            },
            {
                Placeholder: "Project Name",
                rangeMin: true,
                fieldCol: 8,
                size: "small",
                type: "Text",
                labelAlign: "right",
                itemStyle:{marginBottom:'10px'},
            },
            {
                object: "dates",
                fieldCol: 16,
                key: "projectName",
                size: "small",
                data: [],
                type: "Select",
            }, 
            {
                Placeholder: "Start Date",
                rangeMin: true,
                fieldCol: 8,
                size: "small",
                type: "Text",
                labelAlign: "right",
                itemStyle:{marginBottom:'10px'},
            },
            {
                object: "dates",
                fieldCol: 16,
                key: "startDate",
                size: "small",
                type: "DatePicker",
                rules: [{ required: true, message: "Start Date is Required" }],
                fieldStyle: { width: "100%" },
                onChange: (value) => {
                    const { dates } = this.formRef.current.getFieldsValue();
                    const { startDate, endDate } = dates;
                    // console.log('DATES: ', dates)
                    
                    if(startDate){
                        this.setState({data: [{date: startDate._d.toDateString()}]});
                        let { BasicFields } = this.state;
                        BasicFields[7].disabled = false
                        this.setState({BasicFields});
                        
                        if( endDate ){
                            let dateArr = this.getDateArray(startDate._d, endDate._d);
                            let newDateArr = [];
                            for(var i = 0; i < dateArr.length; i++){
                                newDateArr[i] = {date: dateArr[i].toDateString()};
                            }
                            this.setState({data: newDateArr})
                        }
                    }
                    else{
                        this.formRef.current.setFieldsValue({dates: {...dates, endDate: null}})
                        this.setState({data: []});
                        let { BasicFields } = this.state;
                        BasicFields[7].disabled = true
                        this.setState({BasicFields});
                    }
                },
            },
            {
                Placeholder: "End Date",
                rangeMin: true,
                fieldCol: 8,
                size: "small",
                type: "Text",
                labelAlign: "right",
                itemStyle:{marginBottom:'10px'},
            },
            {
                object: "dates",
                fieldCol: 16,
                key: "endDate",
                size: "small",
                type: "DatePicker",
                rules: [{ required: true, message: "End Date is Required" }],
                fieldStyle: { width: "100%" },
                disabled: true,
                onChange: (value) => {
                    const { dates } = this.formRef.current.getFieldsValue();
                    const { endDate, startDate } = dates;
                    // console.log('DATES: ', dates)
                    if(endDate) {
                        let dateArr = this.getDateArray(startDate._d, endDate._d);
                        let newDateArr = [];
                        for(var i = 0; i < dateArr.length; i++){
                            newDateArr[i] = {date: dateArr[i].toDateString()};
                        }
                        this.setState({data: newDateArr})
                    }
                    else{
                        this.setState({data: [{date: startDate._d.toDateString()}]});
                    }
                },
            },
            {
                Placeholder: "Description",
                rangeMin: true,
                fieldCol: 8,
                size: "small",
                type: "Text",
                labelAlign: "right",
                itemStyle:{marginBottom:'10px'},
            },
            {
                object: "dates",
                fieldCol: 24,
                key: "description",
                size: "small",
                rules: [{ required: true, message: "Description is Required" }],
                type: "Textarea",
                fieldStyle: { height: '10vh' },
            },
            ],
        }
        this.columns = [
            {
                title: 'Date',
                dataIndex: 'date',
                key: 'date',
                render:(text, records) =>(
                    <p>{records.date}</p>
                ),
            },
            {
                title: 'Hours',
                dataIndex: 'hours',
                key: 'hours',
                render:(text, records, index) =>(
                    <Input 
                        placeholder="Hours"
                        size="small" 
                        onChange={(e)=>{
                            // console.log("Input is: ", e.target.value);
                            // console.log('Index is: ', index);
                            let data = [...this.state.data];                                // Make Copy..
                            let updatedValue = {...data[index], hours: e.target.value}      // Update Value..
                            data[index] = updatedValue;                                     // Set Value..
                            this.setState({data})                                           // Set State..
                            console.log('New State: ',this.state.data)
                        }}
                    />
                ),
            },
        ]
    }
    componentDidMount = () => {
        this.getData();
    }

    handleUpload = async (option) => {
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

    getDateArray = (start, end) => {
            var arr = new Array();
            var dt = new Date(start);
            while (dt <= end) {
                arr.push(new Date(dt));
                dt.setDate(dt.getDate() + 1);
            }
            return arr;
    }

    getData = () =>{
    Promise.all([getProjects()])
    .then((res) => {
    const { BasicFields } = this.state;
    BasicFields[3].data = res[0].success ? res[0].data : [];
    this.setState({ BasicFields });
    })
    .catch((e) => {
        console.log(e);
    });
    }

    render(){
        const { visible, close } = this.props;
        const { BasicFields, fileList, data } = this.state;
        return(
            <Modal
                title="New Request"
                maskClosable={false}
                centered
                visible={visible}
                // okButtonProps={{ readOnly: loading, htmlType: 'submit', form: 'my-form'  }}
                okText={"Submit"}
                onCancel={close}
                width={1000}
            >
                <Row>
                    <Col span={12}>
                        <Form
                        id={'my-form'}
                        ref={this.formRef}
                        scrollToFirstError={true}
                        size="small"
                        layout="inline"
                        >
                            <FormItems FormFields={BasicFields} />
                        </Form>
                        <p style={{marginTop: 10, marginBottom: 2}}>Attachments</p>
                        <Upload
                        customRequest={this.handleUpload}
                        listType="picture"
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
                    </Col>
                    <Col span={12}>
                        <Table sticky
                            style={{maxHeight: "40vh", overflowY: 'scroll', position: 'relative'}}
                            pagination={false}
                            rowKey={(data) => data.id} 
                            columns={this.columns}
                            dataSource={data}
                            size='small'
                            summary={(data)=>{
                                let total = 0;
                                data.forEach(({hours})=>{
                                    total += parseInt(hours ? hours : 0); 
                                })

                                return(
                                    <Table.Summary.Row>
                                        <Table.Summary.Cell>Total</Table.Summary.Cell>
                                        <Table.Summary.Cell>{total}</Table.Summary.Cell>
                                    </Table.Summary.Row>
                                )
                            }}
                        />
                    </Col>
                </Row>
            </Modal>
        )
    }
}

export default AddRequestModal;