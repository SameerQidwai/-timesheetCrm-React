import React, { Component } from "react";
import { Modal, Tabs } from "antd";
import { UploadOutlined } from "@ant-design/icons"; //Icons

import Form from "../../../components/Core/Form";

const { TabPane } = Tabs;

class InfoModal extends Component {
    constructor() {
        super();
        this.basicRef = React.createRef();
        this.billingRef = React.createRef();
        this.insuredRef = React.createRef();
        this.state = {
            editOrg: false,
            basicSubmitted: false,
            billingSubmitted: false,
            insuredSubmitted: false,
            data: {
                key: 1,
                name: "One_LM",
                ABN: "098908",
                CTI: "09809",
                EBA: "098098",
                SumIns_PI: 98098,
                SumIns_PL: 90809809,
                SumIns_Wc: "10 30 2020",
                Tax_Code: "09809809",
                address: "098098098",
                contact: "9809809",
                contactName: "90809809",
                email: "098908",
                expiry_PI: "10 06 2020",
                expiry_PL: "10 30 2020",
                insurer_PI: "908908",
                insurer_PL: "980980",
                insurer_WC: "98098",
                invoice_email: "9098",
                phone: "908098",
                policy_PI: "098098",
                policy_PL: "098098",
                policy_WC: "9809809",
                website: "098098098",
            },
            BasicFields: {
                //creating Component
                formId: "basic_form",
                FormCol: 24,
                // FieldSpace:24,
                justifyField: "center",
                FormLayout: "inline",
                layout: { labelCol: { span: 10 }, wrapperCol: { span: 0 } },
                size: "middle",
                fields: [
                    {
                        object: "obj",
                        fieldCol: 12,
                        key: "name",
                        label: "Name",
                        size: "small",
                        // rules:[{ required: true }],
                        type: "input",
                        labelAlign: "left",
                        itemStyle: { marginBottom: "10px" },
                        // labelCol:{flex:1},
                        // wrapperCol:{flex:'auto'},
                    },
                    {
                        object: "obj",
                        fieldCol: 12,
                        key: "parent_id",
                        label: "Parent",
                        size: "small",
                        // rules:[{ required: true }],
                        labelCol: { flex: "1px 0 auto" },
                        wrapperCol: { flex: "auto" },
                        type: "Select",
                        // labelAlign: 'right',
                        itemStyle: { marginBottom: "10px" },
                    },
                    {
                        object: "obj",
                        fieldCol: 12,
                        key: "phone",
                        label: "Phone",
                        size: "small",
                        // rules:[{ required: true }],
                        type: "input",
                        labelAlign: "right",
                        itemStyle: { marginBottom: "10px" },
                        // labelCol:{flex:'1px 0 auto'},
                        // wrapperCol:{flex:2},
                    },
                    {
                        object: "obj",
                        fieldCol: 12,
                        key: "email",
                        label: "Email",
                        size: "small",
                        // rules:[{ required: true }],
                        wrapperCol: { span: 20 },
                        type: "input",
                        labelAlign: "right",
                        fieldStyle: { marginLeft: "5px" },
                        // labelCol:{flex:1},
                        // wrapperCol:{flex:'auto'},
                    },
                    {
                        object: "obj",
                        fieldCol: 12,
                        wrapperCol: { span: 20 },
                        key: "EBA",
                        // label:'Expected Business Amount',
                        label: "EBA",
                        size: "small",
                        // rules:[{ required: true }],
                        type: "input",
                        // labelAlign: 'right',
                        itemStyle: { marginBottom: "10px" },
                        fieldStyle: { marginLeft: "10px" },
                        // labelCol:{flex:1},
                        // wrapperCol:{flex:'auto'},
                    },
                    {
                        Placeholder: "Contact:",
                        size: "small",
                        fieldCol: 24,
                        type: "Title",
                        mode: 5,
                        size: "small",
                        itemStyle: { fontWeight: "bold" },
                        // labelCol:{flex:1},
                        // wrapperCol:{flex:'auto'},
                    },
                    {
                        object: "obj",
                        fieldCol: 12,
                        key: "contactName",
                        label: "Name",
                        size: "small",
                        wrapperCol: { span: 19 },
                        // rules:[{ required: true }],
                        type: "input",
                        labelAlign: "right",
                        itemStyle: { marginBottom: "10px" },
                        fieldStyle: { marginLeft: "13px" },
                        // labelCol:{flex:1},
                        // wrapperCol:{flex:'auto'},
                    },
                    {
                        object: "obj",
                        fieldCol: 12,
                        key: "contact",
                        label: "Mobile",
                        size: "small",
                        // rules:[{ required: true }],
                        type: "input",
                        labelAlign: "right",
                        itemStyle: { marginBottom: "10px" },
                        // labelCol:{flex:1},
                        // wrapperCol:{flex:'auto'},
                    },

                    {
                        object: "obj",
                        fieldCol: 24,
                        key: "address",
                        label: "Address",
                        size: "small",
                        type: "input",
                        itemStyle: { marginBottom: "10px" },
                    },
                    {
                        object: "obj",
                        fieldCol: 24,
                        key: "website",
                        label: "Website",
                        size: "small",
                        type: "input",
                        labelAlign: "right",
                        itemStyle: { marginBottom: "10px" },
                    },
                    {
                        object: "obj",
                        fieldCol: 12,
                        key: "cv",
                        size: "small",
                        valuePropName: "fileList",
                        getValue: true,
                        Placeholder: (
                            <>
                                Click or drag CV <UploadOutlined />
                            </>
                        ),
                        type: "Dragger",
                        labelAlign: "right",
                        itemStyle: { marginBottom: "10px" },
                        rangMax: false,
                        mode: "",
                    },
                    {
                        object: "obj",
                        fieldCol: 12,
                        key: "resume",
                        size: "small",
                        labelCol: { span: 12 },
                        rangMax: true,
                        Placeholder: (
                            <>
                                Click or drag Cover Letter <UploadOutlined />
                            </>
                        ),
                        type: "Dragger",
                        labelAlign: "right",
                        valuePropName: "fileList",
                        getValue: true,
                        mode: "",
                    },
                    {
                        object: "obj",
                        fieldCol: 12,
                        key: "attach",
                        size: "small",
                        mode: "",
                        Placeholder: (
                            <>
                                Click or drag Other Doc <UploadOutlined />
                            </>
                        ),

                        type: "Dragger",
                        labelAlign: "right",
                        valuePropName: "fileList",
                        getValue: true,
                    },
                ],
            },
            BillingFields: {
                formId: "billing_form",
                FormCol: 24,
                FieldSpace: 24,
                justifyField: "center",
                FormLayout: "horizontal",
                layout: { labelCol: { span: 9 }, wrapperCol: { span: 0 } },
                size: "middle",
                fields: [
                    {
                        object: "obj",
                        fieldCol: 12,
                        key: "ABN",
                        label: "ABN",
                        size: "small",
                        // rules:[{ required: true }],
                        type: "input",
                        labelAlign: "left",
                        itemStyle: { marginBottom: "10px" },
                    },
                    {
                        object: "obj",
                        fieldCol: 12,
                        key: "Tax_Code",
                        label: "Tax Code",
                        size: "small",
                        // rules:[{ required: true }],
                        type: "input",
                        labelAlign: "left",
                        itemStyle: { marginBottom: "10px" },
                    },
                    {
                        object: "obj",
                        fieldCol: 12,
                        key: "invoice_email",
                        label: "Invoice Email",
                        size: "small",
                        // rules:[{ required: true }],
                        type: "input",
                        labelAlign: "left",
                        itemStyle: { marginBottom: "10px" },
                    },
                    {
                        object: "obj",
                        fieldCol: 12,
                        key: "CTI",
                        label: "Client Terms Info",
                        size: "small",
                        // rules:[{ required: true }],
                        type: "input",
                        labelAlign: "left",
                        itemStyle: { marginBottom: "10px" },
                    },
                ],
            },
            InsuredFields: {
                formId: "insured_form",
                FormCol: 24,
                FieldSpace: 24,
                justifyField: "center",
                FormLayout: "inline",
                size: "middle",
                fields: [
                    {
                        Placeholder: "Insurer",
                        fieldCol: 24,
                        size: "small",
                        type: "Title",
                        mode: 5,
                        labelAlign: "right",
                        // itemStyle:{marginBottom:'10px'},
                    },
                    {
                        object: "obj",
                        fieldCol: 8,
                        key: "insurer_PI",
                        label: "PI",
                        size: "small",
                        // rules:[{ required: true }],
                        type: "input",
                        labelAlign: "left",
                        itemStyle: { marginBottom: "10px" },
                    },
                    {
                        object: "obj",
                        fieldCol: 8,
                        key: "insurer_PL",
                        label: "PL",
                        size: "small",
                        // rules:[{ required: true }],
                        type: "input",
                        labelAlign: "left",
                        itemStyle: { marginBottom: "10px" },
                    },
                    {
                        object: "obj",
                        fieldCol: 8,
                        key: "insurer_WC",
                        label: "WC",
                        size: "small",
                        // rules:[{ required: true }],
                        type: "input",
                        labelAlign: "left",
                        itemStyle: { marginBottom: "10px" },
                    },
                    {
                        Placeholder: "Policy Number",
                        fieldCol: 24,
                        size: "small",
                        type: "Title",
                        mode: 5,
                        labelAlign: "right",
                        itemStyle: { marginTop: "20px" },
                    },
                    {
                        object: "obj",
                        fieldCol: 8,
                        key: "policy_PI",
                        label: "PI",
                        size: "small",
                        type: "input",
                        labelAlign: "left",
                        itemStyle: { marginBottom: "10px" },
                    },
                    {
                        object: "obj",
                        fieldCol: 8,
                        key: "policy_PL",
                        label: "PL",
                        size: "small",
                        // rules:[{ required: true }],
                        type: "input",
                        labelAlign: "left",
                        itemStyle: { marginBottom: "10px" },
                    },
                    {
                        object: "obj",
                        fieldCol: 8,
                        key: "policy_WC",
                        label: "WC",
                        size: "small",
                        // rules:[{ required: true }],
                        type: "input",
                        labelAlign: "left",
                        itemStyle: { marginBottom: "10px" },
                    },

                    {
                        Placeholder: "Sum Insured ",
                        fieldCol: 24,
                        size: "small",
                        type: "Title",
                        mode: 5,
                        labelAlign: "right",
                        itemStyle: { marginTop: "20px" },
                    },
                    {
                        object: "obj",
                        key: "SumIns_PI",
                        fieldCol: 8,
                        label: "PI",
                        size: "small",
                        type: "InputNumber",
                        labelAlign: "left",
                        itemStyle: { marginBottom: "10px" },
                    },
                    {
                        object: "obj",
                        fieldCol: 8,
                        key: "SumIns_PL",
                        label: "PL",
                        size: "small",
                        // rules:[{ required: true }],
                        type: "InputNumber",
                        labelAlign: "left",
                        itemStyle: { marginBottom: "10px" },
                    },
                    {
                        object: "obj",
                        fieldCol: 8,
                        key: "Covrg_WC",
                        label: "WC",
                        size: "small",
                        // rules:[{ required: true }],
                        type: "Select",
                        labelAlign: "left",
                        itemStyle: { marginBottom: "10px" },
                    },
                    {
                        Placeholder: "Insurance Expiry",
                        fieldCol: 24,
                        size: "small",
                        type: "Title",
                        mode: 5,
                        labelAlign: "right",
                        itemStyle: { marginTop: "20px" },
                    },
                    {
                        object: "obj",
                        fieldCol: 8,
                        key: "expiry_PI",
                        label: "PI",
                        size: "small",
                        type: "DatePicker",
                        labelAlign: "left",
                        itemStyle: { marginBottom: "10px" },
                    },
                    {
                        object: "obj",
                        fieldCol: 8,
                        key: "expiry_PL",
                        label: "PL",
                        size: "small",
                        // rules:[{ required: true }],
                        type: "DatePicker",
                        labelAlign: "left",
                        itemStyle: { marginBottom: "10px" },
                    },
                    {
                        object: "obj",
                        fieldCol: 8,
                        key: "SumIns_Wc",
                        label: "WC",
                        size: "small",
                        // rules:[{ required: true }],
                        type: "DatePicker",
                        labelAlign: "left",
                        itemStyle: { marginBottom: "10px" },
                    },
                ],
            },
        };
    }

    submit = () => {
        //submit button click
        this.basicRef.current.refs.basic_form.submit();
        this.billingRef.current &&
            this.billingRef.current.refs.billing_form.submit();
        this.insuredRef.current &&
            this.insuredRef.current.refs.insured_form.submit();
    };

    BasicCall = (vake) => {
        // this will work after  got  Object from the skill from
        this.setState(
            {
                mergeObj: {
                    ...this.state.mergeObj,
                    ...vake.obj,
                },
                basicSubmitted: true, // skill form submitted
            },
            () => {
                if (
                    this.state.basicSubmitted &&
                    this.state.billingSubmitted &&
                    this.state.insuredSubmitted
                ) {
                    //check if both form is submittef
                    if (!this.props.editOrg) {
                        console.log("emes");
                        this.addOrganization(this.state.mergeObj); //add skill
                    } else {
                        console.log("edit");
                        this.editRecord(this.state.mergeObj); //edit skill
                    }
                }
            }
        );
    };

    BillingCall = (vake) => {
        // this will work after  getting the Object from level form
        this.setState(
            {
                mergeObj: {
                    ...this.state.mergeObj,
                    ...vake.obj,
                },
                billingSubmitted: true, // level form submitted
            },
            () => {
                if (
                    this.state.basicSubmitted &&
                    this.state.billingSubmitted &&
                    this.state.insuredSubmitted
                ) {
                    //check if both form is submittef
                    if (!this.props.editOrg) {
                        console.log("emes");
                        this.addOrganization(this.state.mergeObj); //add skill
                    } else {
                        console.log("edit");
                        this.editRecord(this.state.mergeObj); //edit skill
                    }
                }
            }
        );
    };

    InsuredCall = (vake) => {
        // this will work after I get the Object from the form
        this.setState(
            {
                mergeObj: {
                    ...this.state.mergeObj,
                    ...vake.obj,
                },
                insuredSubmitted: true, // level form submitted
            },
            () => {
                if (
                    this.state.basicSubmitted &&
                    this.state.billingSubmitted &&
                    this.state.insuredSubmitted
                ) {
                    //check if both form is submittef
                    if (!this.props.editOrg) {
                        console.log("emes");
                        this.addOrganization(this.state.mergeObj); //add skill
                    } else {
                        console.log("edit");
                        this.editRecord(this.state.mergeObj); //edit skill
                    }
                }
            }
        );
    };

    addOrganization = (value) => {
        const { rows, callBack } = this.props;
        value.key = rows; // get new key
        callBack(value, false);
        this.onCancel();
    };

    getRecord = (data) => {
        let basic = {};
        let billing = {};
        let insured = {};
        this.setState({
            // editOrg: data.key,
            BasicFields: {
                ...this.state.BasicFields,
                initialValues: { obj: basic },
            },
            BillingFields: {
                ...this.state.BillingFields,
                initialValues: { obj: billing },
            },
            InsuredFields: {
                ...this.state.InsuredFields,
                initialValues: { obj: insured },
            },
        });
    };

    editRecord = (value) => {
        const { editOrg, callBack } = this.props;
        value.key = editOrg;
        callBack(value, editOrg);
        this.onCancel();
    };

    onCancel = () => {
        const { BasicFields, BillingFields, InsuredFields } = this.state;
        delete BasicFields.initialValues; // delete initialValues of fields on close
        delete BillingFields.initialValues;
        delete InsuredFields.initialValues;
        this.setState(
            {
                basicSubmitted: false,
                billingSubmitted: false,
                insuredSubmitted: false,
                BasicFields: { ...BasicFields }, //delete Formfields on Close
                BillingFields: { ...BillingFields },
                InsuredFields: { ...InsuredFields },
                mergeObj: {},
            },
            () => {
                this.props.close();
            }
        );
    };

    render() {
        const { editOrg, visible } = this.props;
        return (
            <Modal
                title={editOrg ? "Edit Organization" : "Add New Organization"}
                centered
                visible={visible}
                onOk={() => {
                    this.submit();
                }}
                okText={editOrg ? "Edit" : "Save"}
                onCancel={this.onCancel}
                width={700}
            >
                <Tabs type="card">
                    <TabPane tab="Basic Informantion" key="1">
                        <Form
                            ref={this.basicRef}
                            Callback={this.BasicCall}
                            FormFields={this.state.BasicFields}
                        />
                    </TabPane>
                    <TabPane tab="Billing Information" key="2">
                        <Form
                            ref={this.billingRef}
                            Callback={this.BillingCall}
                            FormFields={this.state.BillingFields}
                        />
                    </TabPane>
                    <TabPane tab="Insured Information" key="3">
                        <Form
                            ref={this.insuredRef}
                            Callback={this.InsuredCall}
                            FormFields={this.state.InsuredFields}
                        />
                    </TabPane>
                </Tabs>
            </Modal>
        );
    }
}

export default InfoModal;
