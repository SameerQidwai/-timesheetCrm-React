import React, { Component } from "react";
import {
    Popconfirm,
    Typography,
    Dropdown,
    Button,
    // Modal, //crating Component
    Table,
    // Tabs, //crating Component
    Menu,
    Row,
    Col,
} from "antd";

import {
    PlusSquareOutlined,
    SettingOutlined,
    FilterOutlined,
    // UploadOutlined,  //crating Component
    DownOutlined,
} from "@ant-design/icons"; //Icons

import { Link } from "react-router-dom";

// import Form from "../../../components/Form"; // creating component
import InfoModal from "./InfoModal";
import "../../styles/table.css";

const { Title } = Typography;

class Organizations extends Component {
    constructor(props) {
        super(props);
        // this.basicRef = React.createRef();  // creating component
        // this.billingRef = React.createRef();
        // this.insuredRef = React.createRef();
        this.columns = [
            {
                title: "Code",
                dataIndex: "key",
                key: "key",
                render: (record) => `00${record}`,
            },
            {
                title: "Name",
                dataIndex: "name",
                key: "name",
            },
            {
                title: "Action",
                key: "action",
                align: "right",
                render: (record) => (
                    <Dropdown
                        overlay={
                            <Menu>
                                <Menu.Item danger>
                                    <Popconfirm
                                        title="Sure to delete?"
                                        onConfirm={() =>
                                            this.handleDelete(record.key)
                                        }
                                    >
                                        Delete
                                    </Popconfirm>
                                </Menu.Item>
                                <Menu.Item
                                    onClick={() => {
                                        this.setState({
                                            infoModal: true,
                                            editOrg: record.key,
                                        });
                                    }}
                                >
                                    Edit
                                </Menu.Item>
                                <Menu.Item>
                                    <Link
                                        to={{
                                            pathname: `/organizations/info/${record.key}`,
                                        }}
                                        className="nav-link"
                                    >
                                        View
                                    </Link>
                                </Menu.Item>
                            </Menu>
                        }
                    >
                        <Button size="small">
                            <SettingOutlined /> Option <DownOutlined />
                        </Button>
                    </Dropdown>
                ),
            },
        ];

        this.state = {
            infoModal: false,
            editOrg: false, //creating Component
            // basicSubmitted: false,
            // billingSubmitted: false,
            // insuredSubmitted: false,
            data: [
                {
                    key: 1,
                    name: "One_LM",
                    // ABN: "098908", //creating Component
                    // CTI: "09809",
                    // EBA: "098098",
                    // SumIns_PI: 98098,
                    // SumIns_PL: 90809809,
                    // SumIns_Wc: "10 30 2020",
                    // Tax_Code: "09809809",
                    // address: "098098098",
                    // contact: "9809809",
                    // contactName: "90809809",
                    // email: "098908",
                    // expiry_PI: "10 06 2020",
                    // expiry_PL: "10 30 2020",
                    // insurer_PI: "908908",
                    // insurer_PL: "980980",
                    // insurer_WC: "98098",
                    // invoice_email: "9098",
                    // phone: "908098",
                    // policy_PI: "098098",
                    // policy_PL: "098098",
                    // policy_WC: "9809809",
                    // website: "098098098",
                },
                {
                    key: 2,
                    name: "Org A",
                },
                {
                    key: 3,
                    name: "Org B",
                },
            ],
            // BasicFields: { //creating Component
            //     formId: "basic_form",
            //     FormCol: 24,
            //     // FieldSpace:24,
            //     justifyField: "center",
            //     FormLayout: "inline",
            //     layout: { labelCol: { span: 10 }, wrapperCol: { span: 0 } },
            //     size: "middle",
            //     fields: [
            //         {
            //             object: "obj",
            //             fieldCol: 12,
            //             key: "name",
            //             label: "Name",
            //             size: "small",
            //             // rules:[{ required: true }],
            //             type: "input",
            //             labelAlign: "left",
            //             itemStyle: { marginBottom: "10px" },
            //             // labelCol:{flex:1},
            //             // wrapperCol:{flex:'auto'},
            //         },
            //         {
            //             object: "obj",
            //             fieldCol: 12,
            //             key: "parent_id",
            //             label: "Parent",
            //             size: "small",
            //             // rules:[{ required: true }],
            //             labelCol: { flex: "1px 0 auto" },
            //             wrapperCol: { flex: "auto" },
            //             type: "Select",
            //             // labelAlign: 'right',
            //             itemStyle: { marginBottom: "10px" },
            //         },
            //         {
            //             object: "obj",
            //             fieldCol: 12,
            //             key: "phone",
            //             label: "Phone",
            //             size: "small",
            //             // rules:[{ required: true }],
            //             type: "input",
            //             labelAlign: "right",
            //             itemStyle: { marginBottom: "10px" },
            //             // labelCol:{flex:'1px 0 auto'},
            //             // wrapperCol:{flex:2},
            //         },
            //         {
            //             object: "obj",
            //             fieldCol: 12,
            //             key: "email",
            //             label: "Email",
            //             size: "small",
            //             // rules:[{ required: true }],
            //             wrapperCol: { span: 20 },
            //             type: "input",
            //             labelAlign: "right",
            //             fieldStyle: { marginLeft: "5px" },
            //             // labelCol:{flex:1},
            //             // wrapperCol:{flex:'auto'},
            //         },
            //         {
            //             object: "obj",
            //             fieldCol: 12,
            //             wrapperCol: { span: 20 },
            //             key: "EBA",
            //             // label:'Expected Business Amount',
            //             label: "EBA",
            //             size: "small",
            //             // rules:[{ required: true }],
            //             type: "input",
            //             // labelAlign: 'right',
            //             itemStyle: { marginBottom: "10px" },
            //             fieldStyle: { marginLeft: "10px" },
            //             // labelCol:{flex:1},
            //             // wrapperCol:{flex:'auto'},
            //         },
            //         {
            //             Placeholder: "Contact:",
            //             size: "small",
            //             fieldCol: 24,
            //             type: "Title",
            //             mode: 5,
            //             size: "small",
            //             itemStyle: { fontWeight: "bold" },
            //             // labelCol:{flex:1},
            //             // wrapperCol:{flex:'auto'},
            //         },
            //         {
            //             object: "obj",
            //             fieldCol: 12,
            //             key: "contactName",
            //             label: "Name",
            //             size: "small",
            //             wrapperCol: { span: 19 },
            //             // rules:[{ required: true }],
            //             type: "input",
            //             labelAlign: "right",
            //             itemStyle: { marginBottom: "10px" },
            //             fieldStyle: { marginLeft: "13px" },
            //             // labelCol:{flex:1},
            //             // wrapperCol:{flex:'auto'},
            //         },
            //         {
            //             object: "obj",
            //             fieldCol: 12,
            //             key: "contact",
            //             label: "Mobile",
            //             size: "small",
            //             // rules:[{ required: true }],
            //             type: "input",
            //             labelAlign: "right",
            //             itemStyle: { marginBottom: "10px" },
            //             // labelCol:{flex:1},
            //             // wrapperCol:{flex:'auto'},
            //         },

            //         {
            //             object: "obj",
            //             fieldCol: 24,
            //             key: "address",
            //             label: "Address",
            //             size: "small",
            //             type: "input",
            //             itemStyle: { marginBottom: "10px" },
            //         },
            //         {
            //             object: "obj",
            //             fieldCol: 24,
            //             key: "website",
            //             label: "Website",
            //             size: "small",
            //             type: "input",
            //             labelAlign: "right",
            //             itemStyle: { marginBottom: "10px" },
            //         },
            //         {
            //             object: "obj",
            //             fieldCol: 12,
            //             key: "cv",
            //             size: "small",
            //             valuePropName: "fileList",
            //             getValue: true,
            //             Placeholder: (
            //                 <>
            //                     Click or drag CV <UploadOutlined />
            //                 </>
            //             ),
            //             type: "Dragger",
            //             labelAlign: "right",
            //             itemStyle: { marginBottom: "10px" },
            //             rangMax: false,
            //             mode: "",
            //         },
            //         {
            //             object: "obj",
            //             fieldCol: 12,
            //             key: "resume",
            //             size: "small",
            //             labelCol: { span: 12 },
            //             rangMax: true,
            //             Placeholder: (
            //                 <>
            //                     Click or drag Cover Letter <UploadOutlined />
            //                 </>
            //             ),
            //             type: "Dragger",
            //             labelAlign: "right",
            //             valuePropName: "fileList",
            //             getValue: true,
            //             mode: "",
            //         },
            //         {
            //             object: "obj",
            //             fieldCol: 12,
            //             key: "attach",
            //             size: "small",
            //             mode: "",
            //             Placeholder: (
            //                 <>
            //                     Click or drag Other Doc <UploadOutlined />
            //                 </>
            //             ),

            //             type: "Dragger",
            //             labelAlign: "right",
            //             valuePropName: "fileList",
            //             getValue: true,
            //         },
            //     ],
            // },
            breakComment_1: true,
            // BillingFields: { //Creating Component
            //     formId: "billing_form",
            //     FormCol: 24,
            //     FieldSpace: 24,
            //     justifyField: "center",
            //     FormLayout: "horizontal",
            //     layout: { labelCol: { span: 9 }, wrapperCol: { span: 0 } },
            //     size: "middle",
            //     fields: [
            //         {
            //             object: "obj",
            //             fieldCol: 12,
            //             key: "ABN",
            //             label: "ABN",
            //             size: "small",
            //             // rules:[{ required: true }],
            //             type: "input",
            //             labelAlign: "left",
            //             itemStyle: { marginBottom: "10px" },
            //         },
            //         {
            //             object: "obj",
            //             fieldCol: 12,
            //             key: "Tax_Code",
            //             label: "Tax Code",
            //             size: "small",
            //             // rules:[{ required: true }],
            //             type: "input",
            //             labelAlign: "left",
            //             itemStyle: { marginBottom: "10px" },
            //         },
            //         {
            //             object: "obj",
            //             fieldCol: 12,
            //             key: "invoice_email",
            //             label: "Invoice Email",
            //             size: "small",
            //             // rules:[{ required: true }],
            //             type: "input",
            //             labelAlign: "left",
            //             itemStyle: { marginBottom: "10px" },
            //         },
            //         {
            //             object: "obj",
            //             fieldCol: 12,
            //             key: "CTI",
            //             label: "Client Terms Info",
            //             size: "small",
            //             // rules:[{ required: true }],
            //             type: "input",
            //             labelAlign: "left",
            //             itemStyle: { marginBottom: "10px" },
            //         },
            //     ],
            // },
            breakComment_2: true,
            // InsuredFields: { //Creating Component
            //     formId: "insured_form",
            //     FormCol: 24,
            //     FieldSpace: 24,
            //     justifyField: "center",
            //     FormLayout: "inline",
            //     size: "middle",
            //     fields: [
            //         {
            //             Placeholder: "Insurer",
            //             fieldCol: 24,
            //             size: "small",
            //             type: "Title",
            //             mode: 5,
            //             labelAlign: "right",
            //             // itemStyle:{marginBottom:'10px'},
            //         },
            //         {
            //             object: "obj",
            //             fieldCol: 8,
            //             key: "insurer_PI",
            //             label: "PI",
            //             size: "small",
            //             // rules:[{ required: true }],
            //             type: "input",
            //             labelAlign: "left",
            //             itemStyle: { marginBottom: "10px" },
            //         },
            //         {
            //             object: "obj",
            //             fieldCol: 8,
            //             key: "insurer_PL",
            //             label: "PL",
            //             size: "small",
            //             // rules:[{ required: true }],
            //             type: "input",
            //             labelAlign: "left",
            //             itemStyle: { marginBottom: "10px" },
            //         },
            //         {
            //             object: "obj",
            //             fieldCol: 8,
            //             key: "insurer_WC",
            //             label: "WC",
            //             size: "small",
            //             // rules:[{ required: true }],
            //             type: "input",
            //             labelAlign: "left",
            //             itemStyle: { marginBottom: "10px" },
            //         },
            //         {
            //             Placeholder: "Policy Number",
            //             fieldCol: 24,
            //             size: "small",
            //             type: "Title",
            //             mode: 5,
            //             labelAlign: "right",
            //             itemStyle: { marginTop: "20px" },
            //         },
            //         {
            //             object: "obj",
            //             fieldCol: 8,
            //             key: "policy_PI",
            //             label: "PI",
            //             size: "small",
            //             type: "input",
            //             labelAlign: "left",
            //             itemStyle: { marginBottom: "10px" },
            //         },
            //         {
            //             object: "obj",
            //             fieldCol: 8,
            //             key: "policy_PL",
            //             label: "PL",
            //             size: "small",
            //             // rules:[{ required: true }],
            //             type: "input",
            //             labelAlign: "left",
            //             itemStyle: { marginBottom: "10px" },
            //         },
            //         {
            //             object: "obj",
            //             fieldCol: 8,
            //             key: "policy_WC",
            //             label: "WC",
            //             size: "small",
            //             // rules:[{ required: true }],
            //             type: "input",
            //             labelAlign: "left",
            //             itemStyle: { marginBottom: "10px" },
            //         },

            //         {
            //             Placeholder: "Sum Insured ",
            //             fieldCol: 24,
            //             size: "small",
            //             type: "Title",
            //             mode: 5,
            //             labelAlign: "right",
            //             itemStyle: { marginTop: "20px" },
            //         },
            //         {
            //             object: "obj",
            //             key: "SumIns_PI",
            //             fieldCol: 8,
            //             label: "PI",
            //             size: "small",
            //             type: "InputNumber",
            //             labelAlign: "left",
            //             itemStyle: { marginBottom: "10px" },
            //         },
            //         {
            //             object: "obj",
            //             fieldCol: 8,
            //             key: "SumIns_PL",
            //             label: "PL",
            //             size: "small",
            //             // rules:[{ required: true }],
            //             type: "InputNumber",
            //             labelAlign: "left",
            //             itemStyle: { marginBottom: "10px" },
            //         },
            //         {
            //             object: "obj",
            //             fieldCol: 8,
            //             key: "Covrg_WC",
            //             label: "WC",
            //             size: "small",
            //             // rules:[{ required: true }],
            //             type: "Select",
            //             labelAlign: "left",
            //             itemStyle: { marginBottom: "10px" },
            //         },
            //         {
            //             Placeholder: "Insurance Expiry",
            //             fieldCol: 24,
            //             size: "small",
            //             type: "Title",
            //             mode: 5,
            //             labelAlign: "right",
            //             itemStyle: { marginTop: "20px" },
            //         },
            //         {
            //             object: "obj",
            //             fieldCol: 8,
            //             key: "expiry_PI",
            //             label: "PI",
            //             size: "small",
            //             type: "DatePicker",
            //             labelAlign: "left",
            //             itemStyle: { marginBottom: "10px" },
            //         },
            //         {
            //             object: "obj",
            //             fieldCol: 8,
            //             key: "expiry_PL",
            //             label: "PL",
            //             size: "small",
            //             // rules:[{ required: true }],
            //             type: "DatePicker",
            //             labelAlign: "left",
            //             itemStyle: { marginBottom: "10px" },
            //         },
            //         {
            //             object: "obj",
            //             fieldCol: 8,
            //             key: "SumIns_Wc",
            //             label: "WC",
            //             size: "small",
            //             // rules:[{ required: true }],
            //             type: "DatePicker",
            //             labelAlign: "left",
            //             itemStyle: { marginBottom: "10px" },
            //         },
            //     ],
            // },
            breakComment_3: true,
        };
    }

    handleDelete = (code) => {
        const dataSource = [...this.state.data];
        this.setState({
            data: dataSource.filter((item) => item.code !== code),
        });
    };

    // submit = () => {  //creating Component
    //     //submit button click
    //     this.basicRef.current.refs.basic_form.submit();
    //     this.billingRef.current &&
    //         this.billingRef.current.refs.billing_form.submit();
    //     this.insuredRef.current &&
    //         this.insuredRef.current.refs.insured_form.submit();
    // };

    // BasicCall = (vake) => { //creating Component
    //     // this will work after  got  Object from the skill from
    //     this.setState(
    //         {
    //             mergeObj: {
    //                 ...this.state.mergeObj,
    //                 ...vake.obj,
    //             },
    //             basicSubmitted: true, // skill form submitted
    //         },
    //         () => {
    //             if (
    //                 this.state.basicSubmitted &&
    //                 this.state.billingSubmitted &&
    //                 this.state.insuredSubmitted
    //             ) {
    //                 //check if both form is submittef
    //                 if (!this.state.editOrg) {
    //                     console.log("emes");
    //                     this.addOrganization(this.state.mergeObj); //add skill
    //                 } else {
    //                     console.log("edit");
    //                     this.editRecord(this.state.mergeObj); //edit skill
    //                 }
    //             }
    //         }
    //     );
    // };

    // BillingCall = (vake) => {
    //     // this will work after  getting the Object from level form
    //     this.setState(
    //         {
    //             mergeObj: {
    //                 ...this.state.mergeObj,
    //                 ...vake.obj,
    //             },
    //             billingSubmitted: true, // level form submitted
    //         },
    //         () => {
    //             if (
    //                 this.state.basicSubmitted &&
    //                 this.state.billingSubmitted &&
    //                 this.state.insuredSubmitted
    //             ) {
    //                 //check if both form is submittef
    //                 if (!this.state.editOrg) {
    //                     console.log("emes");
    //                     this.addOrganization(this.state.mergeObj); //add skill
    //                 } else {
    //                     console.log("edit");
    //                     this.editRecord(this.state.mergeObj); //edit skill
    //                 }
    //             }
    //         }
    //     );
    // };

    // InsuredCall = (vake) => {
    //     // this will work after I get the Object from the form
    //     this.setState(
    //         {
    //             mergeObj: {
    //                 ...this.state.mergeObj,
    //                 ...vake.obj,
    //             },
    //             insuredSubmitted: true, // level form submitted
    //         },
    //         () => {
    //             if (
    //                 this.state.basicSubmitted &&
    //                 this.state.billingSubmitted &&
    //                 this.state.insuredSubmitted
    //             ) {
    //                 //check if both form is submittef
    //                 if (!this.state.editOrg) {
    //                     console.log("emes");
    //                     this.addOrganization(this.state.mergeObj); //add skill
    //                 } else {
    //                     console.log("edit");
    //                     this.editRecord(this.state.mergeObj); //edit skill
    //                 }
    //             }
    //         }
    //     );
    // };

    // addOrganization = (value) => {
    //     console.log("addOrg:", value);
    //     value.key = this.state.data[this.state.data.length - 1].key + 1; // get new key
    //     this.setState(
    //         {
    //             data: [...this.state.data, value],
    //         },
    //         () => {
    //             this.onCancel();
    //         }
    //     );
    // };

    // getRecord = (data) => { //Creating Componeny
    //     console.log(data);
    //     let basic = {};
    //     let billing = {};
    //     let insured = {};
    //     this.setState({
    //         openModal: true,
    //         editOrg: data.key,
    //         BasicFields: {
    //             ...this.state.BasicFields,
    //             initialValues: { obj: basic },
    //         },
    //         BillingFields: {
    //             ...this.state.BillingFields,
    //             initialValues: { obj: billing },
    //         },
    //         InsuredFields: {
    //             ...this.state.InsuredFields,
    //             initialValues: { obj: insured },
    //         },
    //     });
    // };

    // editRecord = (obj) => { //creating Componenet
    //     obj.key = this.state.editOrg;
    //     this.state.data[obj.key - 1] = obj;

    //     this.setState(
    //         {
    //             mergeObj: {},
    //             data: [...this.state.data],
    //         },
    //         () => {
    //             this.onCancel();
    //         }
    //     );
    // };

    // onCancel = () => { //Creating Modal
    //     delete this.state.BasicFields.initialValues; // delete initialValues of fields on close
    //     delete this.state.BillingFields.initialValues;
    //     delete this.state.InsuredFields.initialValues;

    //     this.setState({
    //         editOrg: false,
    //         openModal: false,
    //         basicSubmitted: false,
    //         billingSubmitted: false,
    //         insuredSubmitted: false,
    //         BasicFields: { ...this.state.BasicFields }, //delete Formfields on Close
    //         BillingFields: { ...this.state.BillingFields },
    //         InsuredFields: { ...this.state.InsuredFields },
    //     });
    // };

    closeModal = () => {
        this.setState({
            infoModal: false,
            editOrg: false,
        });
    };
    callBack = (value, key) => {
        const { data } = this.state;
        if (key === false) {
            this.setState({
                data: [...data, value],
            });
        } else {
            data[key] = value;
            this.setState({
                data,
            });
        }
    };

    render() {
        const { data, infoModal, editOrg } = this.state;
        const columns = this.columns;
        return (
            <>
                <Row justify="space-between">
                    <Col>
                        <Title level={4}>Organizations</Title>
                    </Col>
                    <Col style={{ textAlign: "end" }} span={4}>
                        <Row justify="space-between">
                            <Col>
                                <Button type="default" size="small">
                                    {" "}
                                    <FilterOutlined />
                                    Filter
                                </Button>
                            </Col>
                            <Col>
                                <Button
                                    type="primary"
                                    onClick={() => {
                                        this.setState({ infoModal: true });
                                    }}
                                    size="small"
                                >
                                    {" "}
                                    <PlusSquareOutlined />
                                    Organizations
                                </Button>
                            </Col>
                        </Row>
                    </Col>
                    <Col span={24}>
                        <Table
                            columns={columns}
                            dataSource={data}
                            size="small"
                        />
                    </Col>
                </Row>
                {infoModal && (
                    <InfoModal
                        visible={infoModal}
                        editOrg={editOrg}
                        close={this.closeModal}
                        callBack={this.callBack}
                        rows={data.length + 1} //Just for time Being till we call the Api's to rernder data while add and edit
                    />
                )}
                {/* {this.state.openModal ? ( 
                    <Modal // creating component
                        title={
                            this.state.editOrg
                                ? "Edit Organization"
                                : "Add New Organization"
                        }
                        centered
                        visible={this.state.openModal}
                        onOk={() => {
                            this.submit();
                        }}
                        okText={this.state.editOrg ? "Edit" : "Save"}
                        onCancel={() => {
                            this.onCancel();
                        }}
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
                ) : null} */}
            </>
        );
    }
}

export default Organizations;
