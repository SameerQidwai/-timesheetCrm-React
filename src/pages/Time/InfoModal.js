import React, { Component } from "react";
import { Modal } from "antd";
import { UploadOutlined } from "@ant-design/icons"; //Icons

import Form from "../../components/Core/Form";
import moment from "moment";

class InfoModal extends Component {
    constructor() {
        super();
        this.timeRef = React.createRef();
        this.state = {
            data: {
                type: "Sick Leave",
                b_date: moment("Nov 25 2020"),
                e_date: moment("Nov 25 2020"),
                h_off: 8,
                d_off: 1,
                desc: "I was sick",
            },
            default_hour: 8, // change this acording to the employeee to get days
            hasChanged: false,
            timeFields: {
                //creating Component
                formId: "off_form",
                FormCol: 24,
                // FieldSpace:24,
                justifyField: "center",
                FormLayout: "inline",
                layout: { labelCol: { span: 10 }, wrapperCol: { span: 0 } },
                size: "middle",
                fields: [
                    {
                        Placeholder: "TimeOff Type",
                        fieldCol: 12,
                        size: "small",
                        type: "Text",
                        labelAlign: "right",
                        // itemStyle:{marginBottom:'10px'},
                    },
                    {
                        object: "obj",
                        fieldCol: 24,
                        key: "type",
                        size: "small",
                        // rules:[{ required: true }],
                        type: "Select",
                        data: [
                            { value: "Sick Leave", label: "Sick Leave" },
                            { value: "Vacations", label: "Vacations" },
                            { value: "Training", label: "Training" },
                        ],
                    },
                    {
                        Placeholder: "Begin Date",
                        fieldCol: 12,
                        size: "small",
                        type: "Text",
                        labelAlign: "right",
                        // itemStyle:{marginBottom:'10px'},
                    },
                    {
                        Placeholder: "End Date",
                        fieldCol: 12,
                        size: "small",
                        type: "Text",
                        labelAlign: "right",
                        // itemStyle:{marginBottom:'10px'},
                    },
                    {
                        object: "obj",
                        fieldCol: 12,
                        key: "b_date",
                        size: "small",
                        // rules:[{ required: true }],
                        type: "DatePicker",
                        fieldStyle: { width: "100%" },
                        onBlur: function func(e) {
                            const { default_hour, hasChanged } = this.state;
                            if (hasChanged) {
                                const {
                                    obj,
                                } = this.timeRef.current.refs.off_form.getFieldsValue(); // get the values from from data

                                const start = obj.b_date.format("YYYY MMM D");
                                obj.d_off = obj.e_date.diff(start, "days") + 1;
                                console.log(obj.d_off);
                                obj.h_off = obj.d_off * default_hour;
                                this.timeRef.current.refs.off_form.setFieldsValue(
                                    { obj: obj }
                                );
                                this.setState({ hasChanged: false });
                            }
                        }.bind(this),
                        onChange: function func(e) {
                            this.setState({ hasChanged: true });
                        }.bind(this),
                    },
                    {
                        object: "obj",
                        fieldCol: 12,
                        key: "e_date",
                        size: "small",
                        // rules:[{ required: true }],
                        type: "DatePicker",
                        fieldStyle: { width: "100%" },
                        onBlur: function func(e) {
                            const { default_hour, hasChanged } = this.state;
                            if (hasChanged) {
                                const {
                                    obj,
                                } = this.timeRef.current.refs.off_form.getFieldsValue(); // get the values from from data

                                obj.b_date = !obj.b_date
                                    ? moment()
                                    : obj.b_date;
                                const start = obj.b_date.format("YYYY MMM D");
                                obj.d_off = obj.e_date.diff(start, "days") + 1;
                                console.log(obj.d_off);
                                obj.h_off = obj.d_off * default_hour;
                                this.timeRef.current.refs.off_form.setFieldsValue(
                                    { obj: obj }
                                );
                                this.setState({ hasChanged: false });
                            }
                        }.bind(this),
                        onChange: function func(e) {
                            this.setState({ hasChanged: true });
                        }.bind(this),
                    },
                    {
                        Placeholder: "Hours",
                        fieldCol: 12,
                        size: "small",
                        type: "Text",
                        labelAlign: "right",
                        // itemStyle:{marginBottom:'10px'},
                    },
                    {
                        Placeholder: "Days",
                        fieldCol: 12,
                        size: "small",
                        type: "Text",
                        labelAlign: "right",
                        // itemStyle:{marginBottom:'10px'},
                    },
                    {
                        object: "obj",
                        fieldCol: 12,
                        key: "h_off",
                        size: "small",
                        // rules:[{ required: true }],
                        type: "InputNumber",
                        fieldStyle: { width: "100%" },
                        onBlur: function func(e) {
                            const { default_hour, hasChanged } = this.state;
                            if (hasChanged) {
                                const {
                                    obj,
                                } = this.timeRef.current.refs.off_form.getFieldsValue(); // get the values from from data

                                obj.d_off = obj.h_off / default_hour;
                                obj.b_date = !obj.b_date
                                    ? moment()
                                    : obj.b_date;
                                const addDay =
                                    obj.d_off <= 1
                                        ? 0
                                        : Math.ceil(obj.d_off) - 1;

                                obj.e_date = moment(obj.b_date).add(
                                    addDay,
                                    "d"
                                );

                                this.timeRef.current.refs.off_form.setFieldsValue(
                                    { obj: obj }
                                );
                                this.setState({ hasChanged: false });
                            }
                        }.bind(this),

                        onChange: function func(e) {
                            this.setState({ hasChanged: true });
                        }.bind(this),
                    },
                    {
                        object: "obj",
                        fieldCol: 12,
                        key: "d_off",
                        size: "small",
                        // rules:[{ required: true }],
                        type: "InputNumber",
                        fieldStyle: { width: "100%" },
                        onBlur: function func(e) {
                            const { default_hour, hasChanged } = this.state;
                            if (hasChanged) {
                                const {
                                    obj,
                                } = this.timeRef.current.refs.off_form.getFieldsValue(); // get the values from from data

                                obj.h_off = obj.d_off * default_hour;
                                obj.b_date = !obj.b_date
                                    ? moment()
                                    : obj.b_date;
                                const addDay =
                                    obj.d_off <= 1
                                        ? 0
                                        : Math.ceil(obj.d_off) - 1;

                                obj.e_date = moment(obj.b_date).add(
                                    addDay,
                                    "d"
                                );

                                this.timeRef.current.refs.off_form.setFieldsValue(
                                    {
                                        obj: obj,
                                    }
                                );
                            }
                        }.bind(this),

                        onChange: function func(e) {
                            this.setState({ hasChanged: true });
                        }.bind(this),
                    },
                    {
                        Placeholder: "Descriptions",
                        fieldCol: 24,
                        size: "small",
                        type: "Text",
                        labelAlign: "right",
                        // itemStyle:{marginBottom:'10px'},
                    },
                    {
                        object: "obj",
                        fieldCol: 24,
                        key: "desc",
                        size: "small",
                        // rules:[{ required: true }],
                        type: "Textarea",
                    },
                    {
                        Placeholder: "Attachments",
                        fieldCol: 24,
                        size: "small",
                        type: "Text",
                        labelAlign: "right",
                        // itemStyle:{marginBottom:'10px'},
                    },
                    {
                        object: "obj",
                        fieldCol: 24,
                        key: "attach",
                        size: "small",
                        mode: "",
                        Placeholder: (
                            <>
                                Click or drag & Drop <UploadOutlined />
                            </>
                        ),

                        type: "Dragger",
                        labelAlign: "right",
                        valuePropName: "fileList",
                        getValue: true,
                    },
                ],
            },
        };
    }

    componentDidMount = () => {
        console.log(this.props);
        if (this.props.editOff) {
            this.getRecord(this.state.data);
            const { default_hour } = this.state; // change this acording to the employeee to get days}
        }
    };

    submit = () => {
        //submit button click
        this.timeRef.current.refs.off_form.submit();
    };

    BasicCall = (vake) => {
        // this will work after  got  Object from the skill from
        const value = vake.obj;
        //check if both form is submittef
        if (!this.props.editOff) {
            console.log("emes");
            this.addTimeOff(value); //add skill
        } else {
            console.log("edit");
            this.editRecord(value); //edit skill
        }
    };

    addTimeOff = (value) => {
        const { rows, callBack } = this.props;
        value.key = rows; // get new key
        callBack(value, false);
        this.onCancel();
    };

    getRecord = (data) => {
        let basic = data;
        console.log(basic);
        this.timeRef.current.refs.off_form.setFieldsValue({
            obj: basic,
        });
    };

    editRecord = (value) => {
        const { editOff, callBack } = this.props;
        value.key = editOff;
        callBack(value, editOff);
        this.onCancel();
    };

    onCancel = () => {
        const { timeFields } = this.state;
        delete timeFields.initialValues; // delete initialValues of fields on close
        this.setState(
            {
                basicSubmitted: false,
                timeFields: { ...timeFields }, //delete Formfields on Close
            },
            () => {
                this.props.close();
            }
        );
    };

    render() {
        const { editOff, visible } = this.props;
        return (
            <Modal
                title={editOff ? "Edit Time Off" : "Add New Time Off"}
                centered
                visible={visible}
                onOk={() => {
                    this.submit();
                }}
                okText={"Save"}
                onCancel={this.onCancel}
                width={900}
            >
                <Form
                    ref={this.timeRef}
                    Callback={this.BasicCall}
                    FormFields={this.state.timeFields}
                />
            </Modal>
        );
    }
}

export default InfoModal;
