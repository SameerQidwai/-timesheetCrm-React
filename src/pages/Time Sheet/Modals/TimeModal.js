import React, { Component } from "react";
import { Modal, Tabs, Row, Col, Button, Input } from "antd";
import { LoadingOutlined } from "@ant-design/icons"; //Icons

import Form from "../../../components/Core/Form";

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
                        size: "small",
                        showTime: "hh:mm a",
                    },
                    {
                        object: "obj",
                        fieldCol: 6,
                        // labelCol: { span: 4 },
                        key: "breakHours",
                        label: "Break",
                        labelAlign: "right",
                        type: "InputNumber",
                        size: "small",
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
            if (editTime && TIMESHEETS['UPDATE']) {
                this.getRecord(userId, editTime);
            }
        })
    };

    submit = () => {
        this.TimeRef.current && this.TimeRef.current.refs.time_form.submit();
    }

    TimeCall = (vake) => {
        // this will work after  getting the Object from level form
        const {editTime, timeObj } = this.props
        const { obj } = vake;
        obj.projectEntryId = timeObj.projectEntryId;
        obj.entryId = timeObj.entryId;
        obj.projectId = timeObj.projectId
        obj.date = moment(timeObj.col, 'D/M').format('DD-MM-YYYY')
        obj.startTime = obj.startTime.format('HH:mm')
        obj.endTime = obj.endTime.format('HH:mm')
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
                callBack(res.data);
            }
        });
    };

    editRecord = (entryId, data) =>{
        this.setState({loading: true})
        const { callBack } = this.props;
        editTime(entryId, data).then(res=>{
            if(res.success){
                callBack(res.data);
            }
        });
    }

    handleDelete = () =>{
        const { editTime, callBack} = this.props
        deleteTime(editTime.entryId).then (res =>{
            if(res.success){
                callBack({})
            }
        }) 
    }

    getRecord = (userId, data) => {
        this.TimeRef.current.refs.time_form.setFieldsValue({ obj: data, });
    };

 
    render() {
        const { editTime, visible, close } = this.props;
        const { TimeFields, loading, permissions } = this.state;
        const popup = editTime? permissions['UPDATE']&& visible: permissions['ADD']&& visible
        return (
            <Modal
                title={editTime ? "Edit Time" : "Add Time"}
                maskClosable={false}
                centered
                visible={popup}
                onOk={() => { this.submit(); }}
                okButtonProps={{ disabled: loading }}
                onCancel={close}
                width={540}
                footer={[
                    <Button type="primary"  danger disabled={!editTime || !permissions['DELETE']} style={{float: "left"}} onClick={this.handleDelete}> Delete </Button>,
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
