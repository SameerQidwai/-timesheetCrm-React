import React, { Component } from "react";
import { Modal, Table, Form, Row, Col, Upload, Typography, Input, InputNumber, message } from "antd";
import { PlusOutlined } from "@ant-design/icons"; //Icons
import FormItems from "../../../components/Core/Forms/FormItems";
import { addFiles } from "../../../service/Attachment-Apis";
import { getUserProjects, getUserLeaveType} from "../../../service/constant-Apis";
import { addRequest, editRequest, getSingleRequest } from "../../../service/leaveRequest-Apis";
import moment from 'moment'
import { formatDate, formatFloat, localStore } from "../../../service/constant";

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
                    <Col> {formatDate(text, true, true)} </Col>
                    <Col style={{marginLeft: 'auto', color: 'red'}} >{records.disabled}</Col>
                </Row>
                ),
            },
            {
                title: 'Hours',
                dataIndex: 'hours',
                key: 'hours',
                render:(text, records, index) =>(
                    <Form.Item noStyle name={['hours', formatDate(records.date, true, 'M/D/YYYY')]}>
                        <InputNumber
                            placeholder= "Hours"
                            size="small" 
                            disabled={props.readOnly}
                            onChange={(value)=>{
                                this.setHours(records, value, index)
                            }}
                        />
                    </Form.Item>
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
                    rangeMin: (current)=>{
                        const { dates } = this.formRef.current.getFieldsValue();
                        const { endDate } = dates;
                        return  endDate && current >  endDate
                    }
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
                    rangeMax: (current)=>{
                        const { dates } = this.formRef.current.getFieldsValue();
                        const { startDate } = dates;
                        return  startDate  && current < startDate
                    }
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
        const {approval} = this.props
        if(approval){
            this.getApprovingData()
        }else{
            this.getSubmittedData();
        }
    }

    setHours = (record, value, index) =>{
        const { data, hoursEntry } = this.state
        data[index].hours = value
        hoursEntry[record.key] = value
        this.setState({ 
            data:[...data], 
            hoursEntry: {...hoursEntry}, 
        })
    }

    getLeaveDetail = (balance,  minimum_balance, minimum_balance_required) =>{
        return {
            Placeholder: <div><div>Current Balance: {balance}</div><div>Required Balance: {minimum_balance_required}</div><div>Overdraw Allowances: {minimum_balance}</div></div>,
            fieldCol: 24,
            note: true, 
            size: "small",
            type: "Text",
            labelAlign: "right",
            itemStyle:{marginBottom:'10px', border: '1px black solid', paddingLeft: '10px'},
        }
    }

    // this function is a mess right now need some fixes so it will be readable
    getDateArray = (start, end, LeaveRequestType, entries) => {
        //try to put your condition to put closer to eachother if they link to eachother
            //so it will be easy to track conditions
        const { showDetails, readOnly } = this.props
        let { BasicFields, contractDetails, holidays, data, hoursEntry } = this.state;
        // const { readOnly } = this.props
        let { include_off_days, balance = -1,  minimum_balance, minimum_balance_required, id: typeId} = LeaveRequestType??{}
        var deFaulthours = contractDetails?.hoursPerDay ?? 0
        // if entries is sent it will only be send on open the modal on edit
        
        if (entries){
            var arr = new Array();
            data = entries.map(el=> {
                var {date, hours } = el // in this conditon this hours value will be replace
                date = formatDate(date)
                const disabled = !include_off_days && ( (date.format('ddd') === 'Sun' || date.format('ddd') === 'Sat') && 'Weekend' || holidays[date.format('M/D/YYYY')] ) 
                    
                if(showDetails ){ balance += hours}

                hoursEntry[date.format('M/D/YYYY')] = `${hours}` // setting the hours object before return 
                return {key: date.format('M/D/YYYY'), date: date.format('YYYY-MM-DD'), hours: disabled? 0: `${hours}`, disabled}
            })
            BasicFields[BasicFields[2].note ? 8: 7].disabled = readOnly // adding an object when select leavetype
                                                                        // and disabling endDate
        }else if (start && end){
            //it will call on change of start and end date and found
            var arr = new Array();
            while(start.isSameOrBefore(end)){
                // need key to push in the table
                const disabled = !include_off_days && ( (start.format('ddd') === 'Sun' || start.format('ddd') === 'Sat') && 'Weekend' || holidays[start.format('M/D/YYYY')] )                                              
                 //hours are getting update on each call
                let newDate = start.format('M/D/YYYY') // newDate  = date for the new row
                const hours = disabled? 0: hoursEntry[newDate] ?? deFaulthours
                // to set it in form for date
                hoursEntry[newDate] = disabled? 0: hoursEntry[newDate] ?? deFaulthours

                arr.push({key: newDate, date: start.format('YYYY-MM-DD'), hours, disabled, })
                start = moment(start).add(1,'d')
            }
            data = arr
            BasicFields[BasicFields[2].note ? 8: 7].disabled = false // adding an object when select leavetype
        }else if (start){
            //if end date is not sent
            const disabled = !include_off_days && ((start.format('ddd') === 'Sun' || start.format('ddd') === 'Sat') && 'Weekend' || holidays[start.format('M/D/YYYY')])
            let newDate = start.format('M/D/YYYY')
            const hours = disabled? 0: hoursEntry[newDate] ?? deFaulthours
            // to set it in form for date
            hoursEntry[newDate] = disabled? 0: hoursEntry[newDate] ?? deFaulthours

            data= [{key: newDate, date: start.format('YYYY-MM-DD'), hours: disabled? 0: hours, disabled,}]
            BasicFields[BasicFields[2].note ? 8: 7].disabled = false // // adding an object when select leavetype

        }else{
            this.formRef.current.setFieldsValue({dates: {startDate: null, endDate: null}})
            BasicFields[BasicFields[2].note ? 8: 7].disabled = true // adding an object when select leavetype
            hoursEntry= {}
            data = []
        }

        // set type detail note
        if(typeId && balance>= 0 && showDetails ){
            if (BasicFields[2].note){
                BasicFields[2] = this.getLeaveDetail(balance,  minimum_balance, minimum_balance_required)
            }else{
                BasicFields.splice(2, 0, this.getLeaveDetail(balance,  minimum_balance, minimum_balance_required))
            }
        }else if(BasicFields[2].note){
            BasicFields.splice(2, 1)
        }

        this.setState({ BasicFields: [...BasicFields], data, LeaveRequestType, hoursEntry })
        this.formRef.current.setFieldsValue({hours: hoursEntry})
        //single hook cal for all the condition
    }

    getApprovingData = () =>{ //Need to be nerge with  getSubmittedData Function for code optimizaiton and ro avoid dupication of code...
        const { BasicFields } = this.state;
        const { edit } = this.props;
        // const {id: userId} = localStore()
        // Get Projects
        getSingleRequest(edit).then(srRes=> {
            if (srRes.success){
                const { employeeId } = srRes.data
                Promise.all([getUserProjects(employeeId, 'O', 0), getUserLeaveType()])
                .then((proRes) => {
                    console.log(proRes);
                    //Destructure proRes[1] to avoid writing proRes[1] repeateadly
                    const {success, contractDetails, holidays, LeaveRequestTypes, fileList, fileIds} = proRes[1] 
                    BasicFields[3].data = proRes[0].success ? proRes[0].data : []; //set projects to select box
                    BasicFields[1].data = success ? LeaveRequestTypes : [] //set LeaveTypes to select box
                    BasicFields.map(el => {
                        if (el.type !== "Text"){
                            el.disabled = true 
                        }
                        return el
                    })

                    this.setState({ 
                        BasicFields,
                        holidays: success ? holidays ?? {} :{}, //holidays to cross of dates if type is not include holidays
                        contractDetails: success ? contractDetails?? {} :{}, //cotract details
                        fileList: srRes.fileList ?? [],
                        fileIds: srRes.fileIds ?? [],
                    });
                    if (edit && srRes?.success){ // run if modal is opened for editing
                        let { entries, data } = srRes 
                        //find holiday type to find if holidays are included or not
                        let selectedLeaveType = LeaveRequestTypes.find(x=> x.id === (data.typeId ?? 0))
                        const formValues = {
                            ...data,
                            description: data.desc,
                            typeId: selectedLeaveType?.id,
                            startDate: formatDate(entries[0].date),
                            endDate: formatDate(entries[entries.length-1].date),
                        }
                        this.getDateArray(formValues.startDate, formValues.endDate, selectedLeaveType, entries)
                        this.formRef.current.setFieldsValue({dates: formValues})
                    }

                })
                .catch((e) => {
                    console.log(e);
                });
            }
        })
    }

    getSubmittedData = () =>{
        const { BasicFields } = this.state;
        const { edit, readOnly } = this.props;
        const {id: userId} = localStore()
        // Get Projects
        Promise.all([getUserProjects(userId, 'O', 0), getUserLeaveType(), edit && getSingleRequest(edit)])
        .then((res) => {
            console.log(res);
            //Destructure res[1] to avoid writing res[1] repeateadly
            const {success, contractDetails, holidays, LeaveRequestTypes, fileList, fileIds} = res[1] 
            BasicFields[3].data = res[0].success ? res[0].data : []; //set projects to select box
            BasicFields[1].data = success ? LeaveRequestTypes : [] //set LeaveTypes to select box
            BasicFields.map(el => {
                if (el.type !== "Text"){
                    el.disabled = readOnly 
                }
                //Set type to default if it is created already
                if (el.key === "typeId" && res[2]){
                    el.disabled = true   //res[2] is get id reaquest if it is false that means new request 
                }                         // don't wanna disable type
                return el
            })

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
                let selectedLeaveType = LeaveRequestTypes.find(x=> x.id === (data.typeId ?? 0))
                const formValues = {
                    ...data,
                    description: data.desc,
                    typeId: selectedLeaveType?.id,
                    startDate: formatDate(entries[0].date),
                    endDate: formatDate(entries[entries.length-1].date),
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
                typeId: dates.typeId || 0,
                workId: dates.workId,
                entries: data,
                attachments: fileIds ?? []
        }

        console.log("newVal--->",newVal);
        if(edit){
            editRequest(edit, newVal).then((res) => {
                this.setState({loading: false})
                if (res.success) {
                    callBack()
                }
            });
        }else{
            // console.log('newVal: ', newVal)
            addRequest(newVal).then((res) => {
                this.setState({loading: false})
                if (res.success) {
                    callBack()
                }
            });
        }
    }

    getTableSummary = (data) => {
        let total = 0;
        data.forEach(({hours})=>{
            total += parseFloat(hours ?? 0); 
        })
        
        return(
            <Table.Summary fixed="top">
                <Table.Summary.Row >
                    <Table.Summary.Cell index={0}>Total</Table.Summary.Cell>
                    <Table.Summary.Cell index={1}>{formatFloat(total)}</Table.Summary.Cell>
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
        const { BasicFields, fileList, data, fileIds, loading, contractDetails } = this.state;
         // for timeBeing 
        let columns = [
            {
                title: 'Date',
                dataIndex: 'date',
                key: 'date',
                render:(text, records) =>(<Row justify="space-between" >
                    <Col> {formatDate(text, true, true)} </Col>
                    <Col style={{marginLeft: 'auto', color: 'red'}} >{records.disabled}</Col>
                </Row>
                ),
            },
            {
                title: 'Hours',
                dataIndex: 'hours',
                key: 'hours',
                render:(text, records, index) =>(
                    <Form.Item noStyle name={['hours', formatDate(records.date, true, 'M/D/YYYY')]} >
                        <InputNumber
                            max={contractDetails?.hoursPerDay ?? false}
                            min={0}
                            placeholder= "Hours"
                            size="small" 
                            disabled={records.disabled|| readOnly}
                            onChange={(value)=>{
                                this.setHours(records, value, index)
                            }}
                        />
                    </Form.Item>
                ),
            },
        ]

        // For time bring
        return(
            <Modal
                title={ readOnly ? 'View Request' :  edit ? "Edit Leave Request" : "New Leave Request"}
                maskClosable
                destroyOnClose={true}
                visible={visible}
                okButtonProps={{ htmlType: 'submit', form: 'my-form', disabled: readOnly, loading: loading }}
                okText={"Submit"}
                onCancel={()=>{
                    message.destroy()
                    close()
                }}
                width={1000}
            >
                <Form
                    id={'my-form'}
                    ref={this.formRef}
                    size="small"
                    layout="inline"
                    onFinish={this.getFormValues}
                    // onFinish={this.checkFunc}
                >
                    <Row className="moz-width">
                        <Col span={12}>
                            <Row>
                                <FormItems FormFields={BasicFields} />
                            </Row>
                            <Text style={{marginTop: 10, marginBottom: 2}}>Attachments</Text>
                            <Upload
                                customRequest={this.handleUpload}
                                // listType="picture"
                                listType="picture-card"
                                maxCount={4}
                                fileList={fileList}
                                onRemove= {this.onRemove}
                                disabled={readOnly}
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
                                columns={columns}
                                dataSource={data}
                                size='small'
                                summary={(data)=>{ return this.getTableSummary(data); }}
                            />
                        </Col>
                    </Row>
                </Form>
            </Modal>
        )
    }
}

export default AddRequestModal;