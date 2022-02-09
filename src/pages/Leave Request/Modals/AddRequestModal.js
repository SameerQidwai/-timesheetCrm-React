import React, { Component } from "react";
import { Modal, Table, Form, Row, Col, Upload, Typography, Input, InputNumber } from "antd";
import { PlusOutlined } from "@ant-design/icons"; //Icons
import FormItems from "../../../components/Core/FormItems";
import { addFiles } from "../../../service/Attachment-Apis";
import { getUserProjects, getUserLeaveType} from "../../../service/constant-Apis";
import { addRequest, editRequest, getSingleRequest } from "../../../service/leaveRequest-Apis";
import moment from 'moment'
import { localStore } from "../../../service/constant";

import "../styles.css"

const { Text } = Typography

class AddRequestModal extends Component{
    constructor(props){
        super(props);
        this.formRef = React.createRef();
        this.attachRef = React.createRef()
        
        this.columns = [
            {
                title: 'Date',
                dataIndex: 'date',
                key: 'date',
                render:(text, records) =>(<Row justify="space-between" >
                    <Col> {moment(text).format('ddd DD MMM yyyy')} </Col>
                    <Col style={{marginLeft: 'auto', color: 'red'}} >{records.disabled}</Col>
                </Row>
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
                        disabled={records.disabled}
                        onChange={(value)=>{
                            this.setHours(records, value, index)
                        }}
                    />
                ),
            },
        ]

        this.state = {
            data: [],
            reRender: false,
            hoursEntry: {}, //need to remeber hours if date is change for now it is setting it to defualt if any date selected
            loading: false,
            fileList: [],
            fileIds: [],
            holidays: {},
            contractDetails: {},
            LeaveRequestType: {},
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
                    fieldNames: {label: 'name', value: 'id'},
                    type: "Select",
                    onChange: (value, option)=>{
                        const { dates } = this.formRef.current.getFieldsValue();
                        const { startDate, endDate } = dates;
                        this.getDateArray(startDate, endDate, option?? {});
                    }
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
                        const { LeaveRequestType } = this.state
                        this.getDateArray(startDate, endDate, LeaveRequestType);
                    },
                },
                {
                    Placeholder: "End Date",
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
                    fieldStyle: { width: "100%" },
                    disabled: true,
                    onChange: (value) => {
                        const { dates } = this.formRef.current.getFieldsValue();
                        const { endDate, startDate } = dates;
                        const { LeaveRequestType } = this.state
                        this.getDateArray(startDate, endDate, LeaveRequestType);
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
                    mode:{ minRows: 2, maxRows:3},
                    fieldStyle: { height: '10vh' },
                },
            ],
        }
        
    }
    componentDidMount = () => {
        this.getData();
    }

    setHours = (record, value, index) =>{
        const { data, hoursEntry } = this.state
        data[index].hours = value
        hoursEntry[record.key] = value
        console.log(hoursEntry);
        this.setState({ 
            data:[...data], 
            hoursEntry: {...hoursEntry}, 
        })
    }

    // this function is a mess right now need some fixes so it will be readable
    getDateArray = (start, end, LeaveRequestType, entries) => {
        //try to put your condition to put closer to eachother if they link to eachother
            //so it will be easy to track conditions
        let { BasicFields, contractDetails, holidays, data, hoursEntry } = this.state;
        const { include_off_days } = LeaveRequestType??{}
        var deFaulthours = contractDetails?.noOfHours ?? 0
        // if entries is sent it will only be send on open the modal on edit
        if (entries){
            var arr = new Array();
            data = entries.map(el=> {
                var {date, hours } = el // in this conditon this hours value will be replace
                date = moment(date)
                const disabled = !include_off_days && ( (date.format('ddd') === 'Sun' || date.format('ddd') === 'Sat') && 'Weekend' || holidays[date.format('M/D/YYYY')] )

                hoursEntry[date.format('M/D/YYYY')] = hours // setting the hours object before return 
                return {key: date.format('M/D/YYYY'), date: date, hours: disabled? 0: hours, disabled}
            })
            BasicFields[7].disabled = false
            
        }else if (start && end){
            //it will call on change of start and end date and found
            var arr = new Array();
            while(start.isSameOrBefore(end)){
                // need key to push in the table
                const disabled = !include_off_days && ( (start.format('ddd') === 'Sun' || start.format('ddd') === 'Sat') && 'Weekend' || holidays[start.format('M/D/YYYY')] )                                              
                 //hours are getting update on each call
                const hours = disabled? 0: hoursEntry[start.format('M/D/YYYY')] ?? deFaulthours
                        
                arr.push({key: start.format('M/D/YYYY'), date: start, hours, disabled, })
                start = moment(start).add(1,'d')
            }
            data = arr
            BasicFields[7].disabled = false
        }else if (start){
            //if end date is not sent
            const disabled = !include_off_days && ((start.format('ddd') === 'Sun' || start.format('ddd') === 'Sat') && 'Weekend' || holidays[start.format('M/D/YYYY')])
            const hours = disabled? 0: hoursEntry[start.format('M/D/YYYY')] ?? deFaulthours
            
            data= [{key: start.format('M/D/YYYY'), date: start, hours: disabled? 0: hours, disabled,}]
            BasicFields[7].disabled = false // disabling the endDate

        }else{
            this.formRef.current.setFieldsValue({dates: {startDate: null, endDate: null}})
            BasicFields[7].disabled = true
            hoursEntry= {}
            data = []
        }
        this.setState({ BasicFields, data, LeaveRequestType, hoursEntry })
        //single hook cal for all the condition
    }

    getData = () =>{
        const { BasicFields } = this.state;
        const { edit } = this.props;
        const {id: userId} = localStore()
        // Get Projects
        Promise.all([getUserProjects(userId, 'O'), getUserLeaveType(), edit && getSingleRequest(edit)])
        .then((res) => {
            //Destructure res[1] to avoid writing res[1] repeateadly
            const {success, contractDetails, holidays, LeaveRequestTypes, fileList, fileIds} = res[1] 
            BasicFields[3].data = res[0].success ? res[0].data : []; //set projects to select box
            BasicFields[1].data = success ? LeaveRequestTypes : [] //set LeaveTypes to select box
            this.setState({ 
                BasicFields,
                holidays: success ? holidays ?? {} :{}, //holidays to cross of dates if type is not include holidays
                contractDetails: success ? contractDetails?? {} :{}, //cotract details
                fileList: res[2].fileList ?? [],
                fileIds: res[2].fileIds ?? [],
            });
            if (edit && res[2]?.success){ // run if modal is opened for editing
                let { entries, data } = res[2] 
                //find holiday type to find if holidays are included or not
                let selectedLeaveType = LeaveRequestTypes.find(x=> x.id === data.typeId)
                const formValues = {
                    ...data,
                    description: data.desc,
                    typeId: data.typeId ?? null,
                    startDate: moment(entries[0].date),
                    endDate: moment(entries[entries.length-1].date),
                }
                this.getDateArray(formValues.startDate, formValues.endDate, selectedLeaveType, entries)
                this.formRef.current.setFieldsValue({dates: formValues})
            }

        })
        .catch((e) => {
            console.log(e);
        });
    }

    getFormValues = (val) => {
        this.setState({loading: true})
        const { dates } = val;
        const { edit, callBack } = this.props
        const { data, fileIds } = this.state
        const newVal = {
                description: dates.description ?? '',
                typeId: dates.typeId || null,
                workId: dates.workId,
                entries: data,
                attachments: fileIds ?? []
        }

        if(edit){
            editRequest(edit, newVal).then((res) => {
                if (res) {
                    this.setState({loading: false})
                    callBack()
                }
            });
        }else{
            // console.log('newVal: ', newVal)
            addRequest(newVal).then((res) => {
                if (res) {
                    this.setState({loading: false})
                    callBack()
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
            <Table.Summary fixed="top">
                <Table.Summary.Row >
                    <Table.Summary.Cell index={0}>Total</Table.Summary.Cell>
                    <Table.Summary.Cell index={1}>{total}</Table.Summary.Cell>
                </Table.Summary.Row>
            </Table.Summary>
        )
    }
    //File
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
                        fileList: [...this.state.fileList, res.file],
                        fileIds: [...this.state.fileIds, res.file.fileId]
                    })
                }else{
                    console.log("Eroor: ", err);
                    const error = new Error("Some error");
                    onError({ err });
                }
            })
    }

    onRemove = (file) => {
        this.setState((state) => {
            const index = state.fileList.indexOf(file);
            const newFileList = state.fileList.slice();
            const fileIds = state.fileIds
            newFileList.splice(index, 1);
            fileIds.splice(index, 1);
            return {
                fileIds,
                fileList: newFileList,
            };
        })
    }
    //File
    render(){
        const { visible, close, edit, readOnly } = this.props;
        const { BasicFields, fileList, data, fileIds, loading } = this.state;

        return(
            <Modal
                title={ edit ? "Edit Request" : "New Request"}
                maskClosable={false}
                visible={visible}
                okButtonProps={{ htmlType: 'submit', form: 'my-form', disabled: readOnly, loading: loading }}
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
                            maxCount={4}
                            fileList={fileList}
                            onRemove= {this.onRemove}
                        >
                            {fileList.length < 4 &&
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
                            rowKey={(data) => data.key} 
                            columns={this.columns}
                            dataSource={data}
                            size='small'
                            summary={(data)=>{ return this.getTableSummary(data); }}
                        />
                    </Col>
                </Row>
            </Modal>
        )
    }
}

export default AddRequestModal;