import React, { Component } from "react";
import { Modal } from "antd";
import { LoadingOutlined, UploadOutlined } from "@ant-design/icons"; //Icons

import Form from "../../components/Core/Forms/Form";
import moment from "moment";

class InfoModal extends Component {
    constructor() {
        super();
        this.timeRef = React.createRef();
        this.state = {
            loading: false,
            data: {
                name: "001",
                code: "002",
                state: "003",
                client: "001",
                project: "001",
                d_date: moment("Nov 25 2020"),
                a_date: moment("Nov 25 2020"),
                desc: "Meeting",
            },
            Fields: {
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
                        Placeholder: "Employee",
                        fieldCol: 12,
                        size: "small",
                        type: "Text",
                        labelAlign: "right",
                        // itemStyle:{marginBottom:'10px'},
                    },
                    {
                        object: "obj",
                        fieldCol: 24,
                        key: "name",
                        size: "small",
                        // rules:[{ required: true }],
                        type: "Select",
                        data: [
                            { value: "001", label: "Albert Einstein" },
                            { value: "002", label: "Nikola Teslo" },
                            { value: "003", label: "Jeff Hardy" },
                        ],
                    },
                    {
                        Placeholder: "Code",
                        fieldCol: 12,
                        size: "small",
                        type: "Text",
                        labelAlign: "right",
                        // itemStyle:{marginBottom:'10px'},
                    },
                    {
                        Placeholder: "State",
                        fieldCol: 12,
                        size: "small",
                        type: "Text",
                        labelAlign: "right",
                        // itemStyle:{marginBottom:'10px'},
                    },
                    {
                        object: "obj",
                        fieldCol: 12,
                        key: "code",
                        size: "small",
                        // rules:[{ required: true }],
                        type: "InputNumber",
                        fieldStyle: { width: "100%" },
                    },
                    {
                        object: "obj",
                        fieldCol: 12,
                        key: "state",
                        size: "small",
                        // rules:[{ required: true }],
                        type: "Select",
                        data: [
                            { value: "001", label: "Alabama" },
                            { value: "002", label: "Georgia" },
                            { value: "003", label: "California" },
                            { value: "004", label: "Colorado" },
                            { value: "005", label: "Connecticut" },
                        ],
                    },
                    {
                        Placeholder: "Client",
                        fieldCol: 12,
                        size: "small",
                        type: "Text",
                        labelAlign: "right",
                        // itemStyle:{marginBottom:'10px'},
                    },
                    {
                        Placeholder: "Project",
                        fieldCol: 12,
                        size: "small",
                        type: "Text",
                        labelAlign: "right",
                        // itemStyle:{marginBottom:'10px'},
                    },
                    {
                        object: "obj",
                        fieldCol: 12,
                        key: "client",
                        size: "small",
                        // rules:[{ required: true }],
                        type: "Select",
                        fieldStyle: { width: "100%" },
                        data: [{ value: "001", label: "Micheal Boltyz" }],
                    },
                    {
                        object: "obj",
                        fieldCol: 12,
                        key: "project",
                        size: "small",
                        // rules:[{ required: true }],
                        type: "Select",
                        fieldStyle: { width: "100%" },
                        data: [
                            { value: "001", label: "Project A" },
                            { value: "002", label: "Project B" },
                        ],
                    },
                    {
                        Placeholder: "Departure Date",
                        fieldCol: 12,
                        size: "small",
                        type: "Text",
                        labelAlign: "right",
                        // itemStyle:{marginBottom:'10px'},
                    },
                    {
                        Placeholder: "Arrival Date Date",
                        fieldCol: 12,
                        size: "small",
                        type: "Text",
                        labelAlign: "right",
                        // itemStyle:{marginBottom:'10px'},
                    },
                    {
                        object: "obj",
                        fieldCol: 12,
                        key: "d_date",
                        size: "small",
                        // rules:[{ required: true }],
                        type: "DatePicker",
                        fieldStyle: { width: "100%" },
                    },
                    {
                        object: "obj",
                        fieldCol: 12,
                        key: "a_date",
                        size: "small",
                        // rules:[{ required: true }],
                        type: "DatePicker",
                        fieldStyle: { width: "100%" },
                    },
                    {
                        Placeholder: "Descriptions",
                        fieldCol: 12,
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
        if (this.props.edit) {
            this.getRecord(this.state.data);
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
        if (!this.props.edit) {
            console.log("emes");
            this.addTravel(value); //add skill
        } else {
            console.log("edit");
            this.editRecord(value); //edit skill
        }
    };

    addTravel = (value) => {
        this.setState({loading: true})
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
        this.setState({loading: true})
        const { edit, callBack } = this.props;
        value.key = edit;
        callBack(value, edit);
        this.onCancel();
    };

    onCancel = () => {
        const { Fields } = this.state;
        delete Fields.initialValues; // delete initialValues of fields on close
        this.setState(
            {
                basicSubmitted: false,
                Fields: { ...Fields }, //delete Formfields on Close
            },
            () => {
                this.props.close();
            }
        );
    };

    render() {
        const { edit, visible } = this.props;
        const { loading, Fields } = this.state
        return (
            <Modal
                title={edit ? "Edit Travel" : "Add Travel"}
                maskClosable={false}
                centered
                visible={visible}
                onOk={() => { this.submit(); }}
                okButtonProps={{ disabled: loading }}
                okText={loading ?<LoadingOutlined /> :"Save"}
                onCancel={this.onCancel}
                width={900}
            >
                <Form
                    ref={this.timeRef}
                    Callback={this.BasicCall}
                    FormFields={Fields}
                />
            </Modal>
        );
    }
}

export default InfoModal;
