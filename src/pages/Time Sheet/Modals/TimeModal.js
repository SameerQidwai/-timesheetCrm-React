import React, { Component } from "react";
import { Modal, Tabs, Row, Col, Button, Input, Typography } from "antd";
import { LoadingOutlined } from "@ant-design/icons"; //Icons

import Form from "../../../components/Core/Forms/Form";

import moment from "moment";
import { addTime, editTime, deleteTime } from "../../../service/timesheet";
import { localStore } from "../../../service/constant";

class TimeModal extends Component {
    constructor() {
        super();
        this.TimeRef = React.createRef();

        this.state = {
            loading: false,
            permissions: {},
            TimeFields:{
                // Add new Time break and table in time-sheet
                formId: "time_form",
                justify: "center",
                FormCol: 24,
                FieldSpace: { xs: 12, sm: 16, md: 122 },
                // layout: { labelCol: { span: 8 } },
                FormLayout: "inline",
                size: "middle",
                fields: [
                    {
                        object: "obj",
                        fieldCol: 8,
                        // layout: { labelCol: { span: 4 }, wrapperCol: { span: 0 } },
                        key: "startTime",
                        label: "Start",
                        labelAlign: "right",
                        type: "TimePicker",
                        mode: "use12Hours",
                        rangeMax: false,
                        rangeMin: 15,
                        size: "small",
                        showTime: "hh:mm a",
                    },
                    {
                        object: "obj",
                        fieldCol: 8,
                        // layout: { labelCol: { span: 4 }, wrapperCol: { span: 0 } },
                        key: "endTime",
                        label: "End",
                        labelAlign: "right",
                        type: "TimePicker",
                        mode: "use12Hours",
                        rangeMax: false,
                        rangeMin: 15,
                        size: "small",
                        showTime: "hh:mm a",
                    },
                    {
                        object: "obj",
                        fieldCol: 8,
                        // labelCol: { span: 4 },
                        key: "breakHours",
                        label: "Break",
                        labelAlign: "right",
                        rangeMin: 15,
                        rangeMax: false,
                        type: "TimePicker",
                        size: "small",
                        showTime: "HH:mm",
                    },
                    {
                        object: "obj",
                        fieldCol: 24,
                        // labelCol: { span: 4 },
                        style: {
                            marginTop: "2%",
                        },
                        mode: { minRows: 1, maxRows: 3 },
                        key: "notes",
                        label: "notes",
                        labelAlign: "right",
                        type: "Textarea",
                        size: "small",
                    },
                ],
            },
        };
    }

    componentDidMount = () => {
        const { editTime, userId } = this.props
        const { TIMESHEETS }= JSON.parse(localStore().permissions)
        this.setState({ permissions: TIMESHEETS },()=>{
            if (TIMESHEETS['UPDATE']) {
                this.getRecord(userId, editTime ? editTime :{startTime: moment('9:00', ["HH:mm"]), endTime: moment('18:00', ["HH:mm"])} );
            }
        })
    };

    submit = () => {
        this.TimeRef.current && this.TimeRef.current.refs.time_form.submit();
    }

    TimeCall = (vake) => {
        // this will work after  getting the Object from level form
        const {editTime, timeObj, sheetDates } = this.props
        const { startDate} = sheetDates
        const { obj } = vake;
        let sYear = startDate.format('YYYY')
        obj.milestoneEntryId = timeObj.milestoneEntryId;
        obj.entryId = timeObj.entryId;
        obj.milestoneId = timeObj.milestoneId
        obj.date = moment(`${timeObj.col}/${sYear}`, 'D/M/YYYY').format('DD-MM-YYYY')
        obj.startTime = obj.startTime.format('HH:mm')
        obj.endTime = obj.endTime.format('HH:mm')
        obj.breakHours = obj.breakHours ? moment.duration(obj.breakHours.format('HH:mm')).asHours(): 0
        if (editTime) {
            this.editRecord(editTime.entryId,obj); //edit Time
        } else {
            this.addTime(obj); //add Time
        }
    };

    addTime = (data) => {
        this.setState({loading: true})
        const { callBack, sheetDates, user } = this.props;
        const { startDate, endDate} = sheetDates
        const query = {userId: user, startDate: startDate.format('DD-MM-YYYY'), endDate: endDate.endOf("month").format('DD-MM-YYYY')}
        addTime(query, data).then(res=>{
            if(res.success){
                callBack(res.data, true);
            }else{
                this.setState({loading: false})
            }
        });
    };

    editRecord = (entryId, data) =>{
        this.setState({loading: true})
        const { callBack } = this.props;
        editTime(entryId, data).then(res=>{
            if(res.success){
                callBack(res.data, false);
            }
        });
    }

    handleDelete =  () =>{
        const { editTime, callBack} = this.props
        deleteTime(editTime.entryId).then (res =>{
            if(res.success){
                callBack({}, true)
            }
        }) 
    }

    getRecord = (userId, data) => {
        this.TimeRef.current.refs.time_form.setFieldsValue({ obj: data, });
    };

 
    render() {
        const { editTime, visible, close, timeObj } = this.props;
        const { TimeFields, loading, permissions } = this.state;
        const popup = editTime? permissions['UPDATE']&& visible: permissions['ADD']&& visible
        return (
            <Modal
                title={<Row>
                        <Col flex={2}> {editTime ? "Edit Time" : "Add Time"} </Col>
                        <Col flex={3} ><b> {timeObj.title} </b></Col>
                    </Row>}
                maskClosable={false}
                centered
                visible={popup}
                onOk={() => { this.submit(); }}
                okButtonProps={{ disabled: loading }}
                onCancel={close}
                width={540}
                footer={[
                    // <Button type="primary"  danger disabled={!editTime || !permissions['DELETE']} style={{float: "left"}} onClick={this.handleDelete}> Delete </Button>,
                    <Button key="cancel" onClick={close}> Cancel </Button>,
                    <Button key="ok" type="primary" loading={loading}  onClick={() => { this.submit(); }}> Save </Button>,
                    
                  ]}
            >
                <Form
                    ref={this.TimeRef}
                    Callback={this.TimeCall}
                    FormFields={TimeFields}
                />
            </Modal>
        );
    }
}

export default TimeModal;
