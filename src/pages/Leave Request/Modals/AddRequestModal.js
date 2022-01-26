import React, { Component } from "react";
import { Modal, Table, Form, Row, Col, Upload, Typography, Input, InputNumber } from "antd";
import { PlusOutlined } from "@ant-design/icons"; //Icons
import FormItems from "../../../components/Core/FormItems";
import './AddRequestModal.css';
import { addFiles } from "../../../service/Attachment-Apis";
import { getProjects, } from "../../../service/constant-Apis";
import { addRequest, editRequest, getLeaveTypes, getSingleRequest } from "../../../service/leaveRequest-Apis";
import moment from 'moment'
const { Text } = Typography

class AddRequestModal extends Component{
    constructor(props){
        super(props);
        this.formRef = React.createRef();
        this.state = {
            data: [],
            totalHours: 0,
            // isEditable: Object.keys(this.props.dataReceived).length !== 0,
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
                key: "typeId",
                size: "small",
                rules: [{ required: true, message: "Leave Type is Required" }],
                data: [],
                type: "Select",
            },
            {
                Placeholder: "Project Name",
                fieldCol: 8,
                size: "small",
                type: "Text",
                labelAlign: "right",
                itemStyle:{marginBottom:'10px'},
            },
            {
                object: "dates",
                fieldCol: 16,
                key: "workId",
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
                        let { BasicFields } = this.state;
                        BasicFields[7].disabled = false
                        this.setState({data: [{date: startDate}], BasicFields});
                        
                        if( endDate ){
                            this.getDateArray(startDate, endDate);
                        }
                    }
                    else{
                        this.formRef.current.setFieldsValue({dates: {...dates, endDate: null}})
                        let { BasicFields } = this.state;
                        BasicFields[7].disabled = true
                        this.setState({BasicFields, data: []});
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
                        this.getDateArray(startDate, endDate);
                    }
                    else{
                        this.setState({data: [{date: startDate}]});
                    }
                },
            },
            {
                Placeholder: "Description",
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
                    moment(text).format('ddd DD MM yyyy')
                ),
            },
            {
                title: 'Hours',
                dataIndex: 'hours',
                key: 'hours',
                render:(text, records, index) =>(
                    <InputNumber
                        placeholder= "Hours"
                        value= {text}
                        size="small" 
                        onChange={(e)=>{
                            const { data } = this.state
                            data[index].hours = e
                            this.setState({data})
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
            while(start.isSameOrBefore(end)){
                arr.push({date: start})
                start = moment(start).add(1,'d')
            }
            this.setState({data: arr})
    }

    getData = () =>{
        const { BasicFields, isEditable } = this.state;
        const { dataReceived } = this.props;
        
        // Get Projects
        Promise.all([getProjects(), getLeaveTypes()])
        .then((res) => {
        BasicFields[3].data = res[0].success ? res[0].data : [];
        BasicFields[1].data = res[1].success ? res[1].data : []
        this.setState({ BasicFields });
        })
        .catch((e) => {
            console.log(e);
        });

        // PreFill Data
        // if(isEditable){
        //     const editRequest = {
        //         typeId: dataReceived.typeId,
        //         workId: dataReceived.workId,
        //         description: dataReceived.description,
        //         startDate: moment(dataReceived.entries[0].date),
        //         endDate: moment(dataReceived.entries[dataReceived.entries.length - 1].date)
        //     }

        //     //console.log('Object: ', editRequest)
        //     this.formRef.current.setFieldsValue({dates: editRequest})
        //     this.setState({data: dataReceived.entries})
        // }
        if(dataReceived){   
            getSingleRequest(dataReceived).then(
                (res) => {
                    if(res.success){
                        console.log('[RES]: ', res.data);
                        const editRequest = {
                            typeId: res.data.typeId,
                            workId: res.data.workId,
                            description: res.data.desc,
                            startDate: moment(res.data.entries[0].date),
                            endDate: moment(res.data.entries[res.data.entries.length - 1].date),
                        }
                        
                        var entries = []
                        res.data.entries.map((el) => {
                            entries.push({date: el.date, hours: el.hours})
                        });

                        this.formRef.current.setFieldsValue({dates: editRequest})
                        this.setState({data: entries})
                    } 
                }
            )
        }
    }

    getFormValues = (val) => {
        const { dataReceived } = this.props;
        const dates = val.dates;
        const newVal = {
                description: dates.description,
                typeId: dates.typeId,
                workId: dates.workId,
                entries: this.state.data,
                attachments: []
        }

        console.log("VALUES", newVal)

        // console.log('newVal: ', newVal)
        if(dataReceived){
            editRequest(dataReceived, newVal).then((res) => {
                if (res) {
                    this.props.close()
                }
            });
        }
        else{
            addRequest(newVal).then((res) => {
                if (res) {
                    // this.getData();
                    this.props.close()
                }
            });
        }
    }

    getTableSummary = (data) => {
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
    }

    render(){
        const { visible, close, addRequest, dataReceived } = this.props;
        const { BasicFields, fileList, data, isEditable } = this.state;

        return(
            <Modal
                title={ dataReceived ? "Edit Request" : "New Request"}
                maskClosable={false}
                visible={visible}
                okButtonProps={{ htmlType: 'submit', form: 'my-form'  }}
                okText={"Submit"}
                onCancel={close}
                width={1000}
            >
                <Row>
                    <Col span={12}>
                        <Form
                        id={'my-form'}
                        ref={this.formRef}
                        size="small"
                        layout="inline"
                        onFinish={this.getFormValues}
                        >
                            <FormItems FormFields={BasicFields} />
                        </Form>
                        <Text style={{marginTop: 10, marginBottom: 2}}>Attachments</Text>
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
                                return this.getTableSummary(data);
                            }}
                        />
                    </Col>
                </Row>
            </Modal>
        )
    }
}

export default AddRequestModal;