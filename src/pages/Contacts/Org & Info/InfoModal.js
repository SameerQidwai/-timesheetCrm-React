import React, { Component } from "react";
import { Modal, Tabs } from "antd";
import { UploadOutlined } from "@ant-design/icons"; //Icons
import moment from "moment";
import Form from "../../../components/Core/Form";

import { addList, getOrgRecord, editList } from "../../../service/Organizations";
import { getContactPersons, getOrganizations } from "../../../service/constant-Apis";

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
            check: false,
            BasicFields: {
                //creating Component
                formId: "basic_form",
                FormCol: 24,
                // FieldSpace:24,
                justifyField: "center",
                FormLayout: "inline",
                contactPerson: [],
                layout: { labelCol: { span: 10 }, wrapperCol: { span: 0 } },
                size: "middle",
                fields: [
                    {
                        Placeholder: "Name *",
                        fieldCol: 12,
                        size: "small",
                        type: "Text",
                        labelAlign: "right",
                        // itemStyle:{marginBottom:'10px'},
                    },
                    {
                        Placeholder: "Parent",
                        fieldCol: 12,
                        size: "small",
                        type: "Text",
                        labelAlign: "right",
                        // itemStyle:{marginBottom:'10px'},
                    },
                    {
                        object: "obj",
                        fieldCol: 12,
                        key: "name",
                        size: "small",
                        rules:[{ required: true, message: 'Name is mandatory' }],
                        type: "Input",
                        itemStyle:{marginBottom: 1},
                    },
                    {
                        object: "obj",
                        fieldCol: 12,
                        key: "parent",
                        size: "small",
                        // rules:[{ required: true }],
                        data: [],
                        type: "Select",
                    },
                    {
                        Placeholder: "Phone",
                        fieldCol: 12,
                        size: "small",
                        type: "Text",
                        labelAlign: "right",
                        // itemStyle:{marginBottom:'10px'},
                    },
                    {
                        Placeholder: "Email",
                        fieldCol: 12,
                        size: "small",
                        type: "Text",
                        labelAlign: "right",
                        // itemStyle:{marginBottom:'10px'},
                    },
                    {
                        object: "obj",
                        fieldCol: 12,
                        key: "phone",
                        size: "small",
                        // rules:[{ required: true }],
                        type: "Input",
                    },
                    {
                        object: "obj",
                        fieldCol: 12,
                        key: "email",
                        size: "small",
                        // rules:[{ required: true }],
                        type: "Input",
                    },
                    {
                        Placeholder: "Expected Business Amount",
                        fieldCol: 12,
                        size: "small",
                        type: "Text",
                        labelAlign: "right",
                        // itemStyle:{marginBottom:'10px'},
                    },
                    {
                        Placeholder: "Delegate Contact person",
                        fieldCol: 12,
                        size: "small",
                        type: "Text",
                        labelAlign: "right",
                        // itemStyle:{marginBottom:'10px'},
                    },
                    {
                        object: "obj",
                        fieldCol: 12,
                        key: "EBA",
                        size: "small",
                        // rules:[{ required: true }],
                        type: "Input",
                    },
                    {
                        object: "obj",
                        fieldCol: 12,
                        key: "delegate_cp",
                        size: "small",
                        // rules:[{ required: true }],
                        data: this.state? this.state.contactPerson : [],
                        type: "Select",
                        itemStyle: { marginBottom: "10px" },
                    },
                    {
                        Placeholder: "Address",
                        fieldCol: 24,
                        size: "small",
                        type: "Text",
                        labelAlign: "right",
                        // itemStyle:{marginBottom:'10px'},
                    },
                    {
                        object: "obj",
                        fieldCol: 24,
                        key: "address",
                        size: "small",
                        // rules:[{ required: true }],
                        type: "Input",
                    },
                    {
                        Placeholder: "Website",
                        fieldCol: 24,
                        size: "small",
                        type: "Text",
                        labelAlign: "right",
                        // itemStyle:{marginBottom:'10px'},
                    },
                    {
                        object: "obj",
                        fieldCol: 24,
                        key: "website",
                        size: "small",
                        // rules:[{ required: true }],
                        type: "Input",
                        itemStyle: { marginBottom: "20px" },
                    },
                    // {
                    //     object: "obj",
                    //     fieldCol: 24,
                    //     key: "attach",
                    //     size: "small",
                    //     mode: "",
                    //     Placeholder: (
                    //         <>
                    //             Click or drag Other Doc <UploadOutlined />
                    //         </>
                    //     ),

                    //     type: "Dragger",
                    //     labelAlign: "right",
                    //     valuePropName: "fileList",
                    //     getValue: true,
                    // },
                ],
            },
            BillingFields: {
                formId: "billing_form",
                FormCol: 24,
                FieldSpace: 24,
                justifyField: "center",
                FormLayout: "inline",
                layout: { labelCol: { span: 9 }, wrapperCol: { span: 0 } },
                size: "middle",
                fields: [
                    {
                        Placeholder: "ABN",
                        fieldCol: 12,
                        size: "small",
                        type: "Text",
                        labelAlign: "right",
                        // itemStyle:{marginBottom:'10px'},
                    },
                    {
                        Placeholder: "Tax Code",
                        fieldCol: 12,
                        size: "small",
                        type: "Text",
                        labelAlign: "right",
                        // itemStyle:{marginBottom:'10px'},
                    },
                    {
                        object: "obj",
                        fieldCol: 12,
                        key: "ABN",
                        size: "small",
                        // rules:[{ required: true }],
                        type: "Input",
                    },
                    {
                        object: "obj",
                        fieldCol: 12,
                        key: "tax_Code",
                        size: "small",
                        // rules:[{ required: true }],
                        type: "Input",
                    },
                    {
                        Placeholder: "Invoice Email",
                        fieldCol: 24,
                        size: "small",
                        type: "Text",
                        labelAlign: "right",
                        // itemStyle:{marginBottom:'10px'},
                    },
                    {
                        object: "obj",
                        fieldCol: 12,
                        key: "invoice_email",
                        size: "small",
                        // rules:[{ required: true }],
                        type: "Input",
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
                        type: "Input",
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
                        type: "Input",
                        labelAlign: "left",
                        itemStyle: { marginBottom: 10 },
                    },
                    {
                        object: "obj",
                        fieldCol: 8,
                        key: "insurer_WC",
                        label: "WC",
                        size: "small",
                        // rules:[{ required: true }],
                        type: "Input",
                        labelAlign: "left",
                        itemStyle: { marginBottom: 10 },
                    },
                    {
                        Placeholder: "Policy Number",
                        fieldCol: 24,
                        size: "small",
                        type: "Title",
                        mode: 5,
                        labelAlign: "right",
                        itemStyle: { marginTop: 20 },
                    },
                    {
                        object: "obj",
                        fieldCol: 8,
                        key: "policy_PI",
                        label: "PI",
                        size: "small",
                        type: "Input",
                        labelAlign: "left",
                        itemStyle: { marginBottom: 10 },
                    },
                    {
                        object: "obj",
                        fieldCol: 8,
                        key: "policy_PL",
                        label: "PL",
                        size: "small",
                        // rules:[{ required: true }],
                        type: "Input",
                        labelAlign: "left",
                        itemStyle: { marginBottom: 10 },
                    },
                    {
                        object: "obj",
                        fieldCol: 8,
                        key: "policy_WC",
                        label: "WC",
                        size: "small",
                        // rules:[{ required: true }],
                        type: "Input",
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
                        itemStyle: { marginTop: 20 },
                    },
                    {
                        object: "obj",
                        key: "SumIns_PI",
                        fieldCol: 8,
                        label: "PI",
                        size: "small",
                        type: "InputNumber",
                        labelAlign: "left",
                        itemStyle: { marginBottom: 10 },
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
                        itemStyle: { marginBottom: 10 },
                    },
                    {
                        object: "obj",
                        fieldCol: 8,
                        key: "SumIns_WC",
                        label: "WC",
                        size: "small",
                        // rules:[{ required: true }],
                        type: "InputNumber",
                        labelAlign: "left",
                        itemStyle: { marginBottom: 10 },
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
                        key: "expiry_WC",
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
    componentDidMount = () =>{
        const { editOrg } = this.props
        if (!editOrg){
            this.getOrgs(editOrg)
            this.callAdd_Edit()
        }else{
            this.fetchAll()
        }
    }

    fetchAll = () =>{
        const {editOrg}= this.props;
        Promise.all([ getOrganizations(editOrg), getContactPersons() ])
        .then(res => {
            const { BasicFields } = this.state;
            BasicFields.fields[3].data = res[0].data;
            BasicFields.fields[11].data = res[1].data;
            this.setState({ BasicFields, })
            this.getRecord(editOrg)
        })
        .catch(e => {
            console.log(e);
        })
    }

    getOrgs = (id) => {
        getOrganizations(id).then((res) => {
            if (res.success) {
                const { BasicFields } = this.state;
                BasicFields.fields[3].data = res.data;
                this.setState({ BasicFields });
            }
        });
    };

    callAdd_Edit = ()=>{
        const { BasicFields } = this.state
        this.setState({
            BasicFields: {
                ...BasicFields,
                fields: BasicFields.fields.filter(el =>{
                    if (el.Placeholder === 'Expected Business Amount'){
                        el.fieldCol = 24
                        return el
                    }else if (el.Placeholder !=='Delegate Contact person' && el.key !== "delegate_cp"){
                        return el
                    }
                })
            }
        })
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
        ;
        vake = vake.obj
        this.setState(
            {
                mergeObj: {
                    ...this.state.mergeObj,
                    ...{
                        name: vake.name? vake.name : '',
                        parentOrganizationId: vake.parent? vake.parent : null,
                        phoneNumber: vake.phone? vake.phone : '',
                        delegateContactPersonOrganizationId: vake.delegate_cp? vake.delegate_cp: null,
                        email: vake.email? vake.email : '',
                        expectedBusinessAmount: vake.EBA? vake.EBA : 0,
                        address: vake.address? vake.address : '',
                        website: vake.website? vake.website: '',
                    },
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
                        
                        this.addOrganization(this.state.mergeObj); //add skill
                    } else {
                        
                        this.editRecord(this.state.mergeObj); //edit skill
                    }
                }
            }
        );
    };

    BillingCall = (vake) => {
        // this will work after  getting the Object from level form
        ;
        vake = vake.obj
        this.setState(
            {
                mergeObj: {
                    ...this.state.mergeObj,
                    ...{
                        abn: vake.ABN? vake.ABN : '',
                        taxCode: vake.tax_Code? vake.tax_Code : '',
                        invoiceEmail: vake.invoice_email? vake.invoice_email: '',
                        cti: vake.CTI? vake.CTI : '',
                    },
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
                        
                        this.addOrganization(this.state.mergeObj); //add skill
                    } else {
                        
                        this.editRecord(this.state.mergeObj); //edit skill
                    }
                }
            }
        );
    };

    InsuredCall = (vake) => {
        // this will work after I get the Object from the form
        ;
        vake = vake.obj
        this.setState(
            {
                mergeObj: {
                    ...this.state.mergeObj,
                    ...{
                        piInsurer: vake.insurer_PI? vake.insurer_PI : '',
                        plInsurer: vake.insurer_PL? vake.insurer_PL : '',
                        wcInsurer: vake.insurer_WC? vake.insurer_WC : '',
                        piPolicyNumber: vake.policy_PI? vake.policy_PI : '',
                        plPolicyNumber: vake.policy_PL? vake.policy_PL : '',
                        wcPolicyNumber: vake.policy_WC? vake.policy_WC : '',
                        piSumInsured: vake.SumIns_PI? vake.SumIns_PI : 0,
                        plSumInsured: vake.SumIns_PL? vake.SumIns_PL : 0,
                        wcSumInsured: vake.SumIns_WC? vake.SumIns_WC : 0,
                        piInsuranceExpiry: vake.expiry_PI? vake.expiry_PI : null,
                        plInsuranceExpiry: vake.expiry_PL? vake.expiry_PL : null,
                        wcInsuranceExpiry: vake.expiry_WC? vake.expiry_WC : null,
                    },
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
                        
                        this.addOrganization(this.state.mergeObj); //add skill
                    } else {
                        
                        this.editRecord(this.state.mergeObj); //edit skill
                    }
                }
            }
        );
    };

    addOrganization = (value) => {
        const { callBack } = this.props;
        console.log(value);
        addList(value).then((res) => {
            if(res.success){
                callBack()
            }
        });
    };

    getRecord = (id) => {
        // const { editOrg } = this.props;
        getOrgRecord(id).then((res) => {
            if (res.success){
                const vake = res.data
                ;
                let basic = {
                    name: vake.name,
                    parent: vake.parentOrganization && vake.parentOrganization.id,
                    phone: vake.phoneNumber,
                    delegate_cp: vake.delegateContactPersonOrganization && vake.delegateContactPersonOrganization.id,
                    email: vake.email,
                    EBA: vake.expectedBusinessAmount,
                    address: vake.address,
                    website: vake.website,
                }
                let billing = {
                    ABN: vake.abn,
                    tax_Code: vake.taxCode,
                    invoice_email: vake.invoiceEmail,
                    CTI: vake.cti,
                }
                let insured = {
                    insurer_PI: vake.piInsurer,
                    insurer_PL: vake.plInsurer,
                    insurer_WC: vake.wcInsurer,
                    policy_PI: vake.piPolicyNumber,
                    policy_PL: vake.plPolicyNumber,
                    policy_WC: vake.wcPolicyNumber,
                    SumIns_PI: vake.piSumInsured,
                    SumIns_PL: vake.plSumInsured,
                    SumIns_WC: vake.wcSumInsured,
                    expiry_PI: moment(vake.piInsuranceExpiry),
                    expiry_PL: moment(vake.plInsuranceExpiry),
                    expiry_WC: moment(vake.wcInsuranceExpiry),
                }
                this.basicRef.current.refs.basic_form.setFieldsValue({ obj: basic, });
        
                this.billingRef.current.refs.billing_form.setFieldsValue({ obj: billing, });
        
                this.insuredRef.current.refs.insured_form.setFieldsValue({ obj: insured, });
            }
        })

    };

    editRecord = (value) => {
        const { editOrg, callBack } = this.props;
        value.id = editOrg
        editList(value).then((res) => {
            console.log(res);
            if(res.success){
                console.log('hereh');
                callBack()
            }
        });
    };

    render() {
        const { editOrg, visible } = this.props;
        return (
            <Modal
                title={editOrg? "Edit Organization" : "Add New Organization"}
                centered
                visible={visible}
                onOk={() => {
                    this.submit();
                }}
                okText={"Save"}
                onCancel={this.props.close}
                width={700}
            >
                <Tabs type="card">
                    <TabPane tab="Basic Informantion" key="1" forceRender>
                        <Form
                            ref={this.basicRef}
                            Callback={this.BasicCall}
                            FormFields={this.state.BasicFields}
                        />
                    </TabPane>
                    <TabPane tab="Billing Information" key="2" forceRender>
                        <Form
                            ref={this.billingRef}
                            Callback={this.BillingCall}
                            FormFields={this.state.BillingFields}
                        />
                    </TabPane>
                    <TabPane tab="Insured Information" key="3" forceRender>
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
