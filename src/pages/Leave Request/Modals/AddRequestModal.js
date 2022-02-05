import React, { Component } from "react";
import { Modal, Table, Form, Row, Col, Upload, Typography, Input, InputNumber } from "antd";
import { PlusOutlined } from "@ant-design/icons"; //Icons
import FormItems from "../../../components/Core/FormItems";
import { addFiles } from "../../../service/Attachment-Apis";
import { getUserProjects, getUserLeaveType} from "../../../service/constant-Apis";
import { addRequest } from "../../../service/leaveRequest-Apis";
import moment from 'moment'
import { localStore } from "../../../service/constant";
const { Text } = Typography

class AddRequestModal extends Component{
    constructor(props){
        super(props);
        this.formRef = React.createRef();

        this.columns = [
            {
                title: 'Date',
                dataIndex: 'date',
                key: 'date',
                render:(text, records) =>(<Row justify="space-between" >
                    <Col> {moment(text).format('ddd DD MM yyyy')} </Col>
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
                        onChange={(e)=>{
                            const { data } = this.state
                            data[index].hours = e
                            this.setState({data})
                        }}
                    />
                ),
            },
        ]

        this.state = {
            data: [],
            loading: false,
            fileList: [],
            fileIds: null,
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
                    fieldStyle: { height: '10vh' },
                },
            ],
        }
        
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

    getDateArray = (start, end, LeaveRequestType) => {
        //try to put your condition to put closer to eachother if they link to eachother
            //so it will be easy to track conditions
        let { BasicFields, contractDetails, holidays, data } = this.state;
        const hours = contractDetails?.noOfHours ?? 0
        const { include_off_days } = LeaveRequestType
        console.log({start, end, include_off_days});
        if (start && end){
            var arr = new Array();
            while(start.isSameOrBefore(end)){
                // need key to push in the table
                const disabled = include_off_days && (
                    (start.format('ddd') === 'Sun' || start.format('ddd') === 'Sat') && 'Weekend' ||
                    holidays[start.format('M/D/YYYY')]
                )
                arr.push({id: start.format('D/M'), date: start, hours: disabled? 0: hours, disabled, })
                start = moment(start).add(1,'d')
            }
            data = arr
        }else if (start){
            const disabled = include_off_days && ((start.format('ddd') === 'Sun' || start.format('ddd') === 'Sat') && 'Weekend' || holidays[start.format('M/D/YYYY')])
            BasicFields[7].disabled = false // disabling the endDate
            data= [{id: start.format('D/M'), date: start, hours: disabled? 0: hours, disabled,}]

        }else{
            this.formRef.current.setFieldsValue({dates: {startDate: null, endDate: null}})
            BasicFields[7].disabled = true
            data = []
        }
        this.setState({ BasicFields, data, LeaveRequestType })
        //single hook cal for all the state
    }

    getData = () =>{
        const { BasicFields } = this.state;
        const { dataReceived } = this.props;
        const {id: userId} = localStore()
        // Get Projects
        Promise.all([getUserProjects(userId), getUserLeaveType()])
        .then((res) => {
            const {success, contractDetails, holidays, LeaveRequestTypes} = res[1]
            BasicFields[3].data = res[0].success ? res[0].data : [];
            BasicFields[1].data = success ? LeaveRequestTypes : []
        this.setState({ 
            BasicFields,
            holidays: success ? holidays :{},
            contractDetails: success ? contractDetails :{},
         });
        })
        .catch((e) => {
            console.log(e);
        });

        // PreFill Data
        if(dataReceived){
            const editRequest = {
                typeId: dataReceived.typeId,
                workId: dataReceived.workId,
                description: dataReceived.description,
                startDate: moment(dataReceived.entries[0].date),
                endDate: moment(dataReceived.entries[dataReceived.entries.length - 1].date)
            }

            //console.log('Object: ', editRequest)
            this.formRef.current.setFieldsValue({dates: editRequest})
            this.setState({data: dataReceived.entries})
        }
    }

    getFormValues = (val) => {
        const dates = val.dates;
        const newVal = {
                description: dates.description,
                typeId: dates.typeId,
                workId: dates.workId,
                entries: this.state.data,
                attachments: []
        }

        // console.log('newVal: ', newVal)
        addRequest(newVal).then((res) => {
            if (res) {
                // this.getData();
                this.props.close()
            }
        });
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

    render(){
        const { visible, close, dataReceived } = this.props;
        const { BasicFields, fileList, data } = this.state;

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