import React, { Component } from "react";
import { Row, Button, Space, Popconfirm } from "antd";
import { getSettings, upadteSettings } from "../../service/global-apis"
import Form from "../../components/Core/Form";

import "../styles/table.css";

class Global extends Component {
    constructor(props) {
        super(props);
        this.dynamoForm_1 = React.createRef();
        this.dynamoForm_2 = React.createRef();

        this.state = {
            data: "sameer",
        };

        this.FormFields_1 = {
            formId: "globalForm",
            justify: "center",
            FormCol: 20,
            FieldSpace: { xs: 12, sm: 16, md: 122 },
            layout: { labelCol: { span: 3 } },
            justifyField: "right",
            size: "small",
            // Formstyle:{backgroundColor:'white'},
            // backstyle:{backgroundColor:'green'},
            initialValues: {
                obj: {
                    email: "@g.com",
                    timezone: "+5",
                    address: "fixed",
                    rpPage: 190,
                    displayEmail: "Pakistan@f.com",
                    fromEmail: "Karachi@g.com",
                    country: "A",
                    city: "NewYork",
                    zcode: 2123,
                    phone: "xx-xxxxx",
                },
            },
            fields: [
                // {
                //     object: "obj",
                //     fieldCol: 20,
                //     Placeholder: "CRM Organisation Information",
                //     type: "Title",
                //     size: "small",
                //     mode: 4,
                //     style: { textDecoration: "underline" },
                // },
                // {
                //     object: "obj",
                //     fieldCol: 20,
                //     key: "email",
                //     Placeholder: "Email Address",
                //     label: "Email",
                //     size: "small",
                //     // rules:[{ required: true }],
                //     type: "input",
                //     labelAlign: "right",
                //     // hint: 'write your Name',
                // },
                // {
                //     object: "obj",
                //     fieldCol: 20,
                //     key: "country",
                //     Placeholder: "Select Country",

                //     label: "Country",
                //     size: "small",
                //     // rules:[{ required: true, message: 'Insert your Password Please' }],
                //     type: "Select",
                //     data: [
                //         { value: "P", label: "Pakistan" },
                //         { value: "A", label: "America" },
                //         { value: "C", label: "Canada" },
                //     ],
                //     labelAlign: "right",
                //     onChange: function func(value, e) {
                //         switch (value) {
                //             case "P":
                //                 this.dynamoForm_1.current.props.FormFields.fields[3].data = this.FormFields_1[
                //                     "fields"
                //                 ][3].data1;
                //                 break;

                //             case "A":
                //                 this.dynamoForm_1.current.props.FormFields.fields[3].data = this.FormFields_1[
                //                     "fields"
                //                 ][3].data2;
                //                 break;

                //             default:
                //                 this.dynamoForm_1.current.props.FormFields.fields[3].data = this.FormFields_1[
                //                     "fields"
                //                 ][3].data3;
                //                 break;
                //         }
                //         this.forceUpdate();
                //     }.bind(this),
                //     // hidden: false
                // },
                // {
                //     object: "obj",
                //     fieldCol: 20,
                //     key: "city",
                //     Placeholder: "Select City",
                //     label: "City",
                //     size: "small",
                //     data: "",
                //     data1: [{ value: "Karachi", label: "Karachi" }],
                //     data2: [{ value: "NewYork", label: "NewYork" }],
                //     data3: [{ value: "Toronto", label: "Toronto" }],
                //     // rules:[{ required: true, message: 'Insert your Password Please' }],
                //     type: "Select",
                //     labelAlign: "right",
                //     // hidden: false
                // },
                // {
                //     object: "obj",
                //     fieldCol: 20,
                //     key: "timezone",
                //     Placeholder: "Select Timezone",
                //     label: "Timezone",
                //     size: "small",
                //     // rules:[{ required: true, message: 'Insert your Password Please' }],
                //     type: "Select",
                //     labelAlign: "right",
                //     // hidden: false
                // },
                // {
                //     object: "obj",
                //     fieldCol: 20,
                //     key: "address",
                //     Placeholder: "Full Address",
                //     label: "Address",
                //     size: "small",
                //     // rules:[{ required: true, message: 'Insert your Password Please' }],
                //     type: "textarea",
                //     labelAlign: "right",
                //     // hidden: false
                // },
                // {
                //     object: "obj",
                //     fieldCol: 20,
                //     key: "zcode",
                //     Placeholder: "Enter Postcode",
                //     label: "Postcode",
                //     size: "small",
                //     // rules:[{ required: true, message: 'Insert your Password Please' }],
                //     type: "input",
                //     labelAlign: "right",
                //     // hidden: false
                // },
                // {
                //     object: "obj",
                //     fieldCol: 20,
                //     key: "phone",
                //     Placeholder: "Phone Number",
                //     label: "Phone No",
                //     size: "small",
                //     // rules:[{ required: true, message: 'Insert your Password Please' }],
                //     type: "input",
                //     labelAlign: "right",
                //     // hidden: false
                // },
                {
                    // object:'obj',
                    fieldCol: 20,
                    Placeholder: "General Settings",
                    type: "Title",
                    mode: 4,
                    style: { textDecoration: "underline" },
                },
                {
                    object: "obj",
                    fieldCol: 20,
                    key: "recordsPerPage",
                    label: "Records Per Page",
                    size: "small",
                    // rules:[{ required: true, message: 'Insert your Password Please' }],
                    type: "inputNumber",
                    labelCol: { span: 4 },
                    labelAlign: "right",
                    // hidden: false
                },
                {
                    object: "obj",
                    fieldCol: 20,
                    key: "displayEmail",
                    Placeholder: "Display Name In Email",
                    label: "Display Email",
                    size: "small",
                    // rules:[{ required: true, message: 'Insert your Password Please' }],
                    type: "input",
                    labelCol: { span: 3 },
                    labelAlign: "right",
                    // hidden: false
                },
                {
                    object: "obj",
                    fieldCol: 20,
                    key: "fromEmail",
                    Placeholder: "From Email Address",
                    label: "From Email",
                    size: "small",
                    // rules:[{ required: true, message: 'Insert your Password Please' }],
                    type: "input",
                    labelCol: { span: 3 },
                    labelAlign: "right",
                    // hidden: false
                },
                {
                    fieldCol: 20,
                    mode: "horizontal",
                    type: "Divider",
                    itemStyle: { padding: "0px", margin: "0px" },
                    // hidden: false
                },
            ],
            // submit: function submit (value){
            //     console.log(value)
            // }
        };
    }
    componentDidMount = () =>{
        this.getApi()
    }
    getApi = () =>{
        getSettings().then(res=>{
            if(res.success){
                this.dynamoForm_1.current.refs.globalForm.setFieldsValue({obj: res.data});
            }
        })
    }

    Callback = (childData) => {
        const value = childData.obj
        upadteSettings(value).then(res=>{
            if(res.success){
                // localStorage.setItem('pageSize', res.data.recordsPerPage)
            }
        })
    };

    submit = () => {
        this.dynamoForm_1.current.refs.globalForm.submit();
    };

    reset = () => {
        this.dynamoForm_1.current.refs.globalForm.resetFields();
    };

    render() {
        return (
            <>
                <Form
                    ref={this.dynamoForm_1}
                    Callback={this.Callback}
                    FormFields={this.FormFields_1}
                />
                <Row justify="end">
                    <Space size="large">
                        <Popconfirm
                            placement="bottom"
                            title="Are you sure want to save new Settings?"
                            onConfirm={() => this.submit()}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button type="primary" size="small">
                                Save
                            </Button>
                        </Popconfirm>

                        <Button size="small" onClick={() => this.reset()}>
                            Cancel
                        </Button>
                    </Space>
                </Row>
            </>
        );
    }
}

export default Global;
