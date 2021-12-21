import React, { Component } from "react";
import { Modal, Tabs, Row, Col, Select, Input, Form, Upload } from "antd";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons"; //Icons
import moment from "moment";
import FormItems from "../../../components/Core/FormItems";
import { addList, getRecord, editList } from "../../../service/contractors";
import { getContactRecord } from "../../../service/conatct-person";
import { getOrganizations, getOrgPersons, getRoles, getStates } from "../../../service/constant-Apis";
import { addFiles } from "../../../service/Attachment-Apis";

const { TabPane } = Tabs;

class InfoModal extends Component {
    constructor() {
        super();
        this.formRef = React.createRef();

        this.state = {
            editCont: false,

            CONTACTS:[],
            sContact: null,
            ORGS: [],
            sOrg: null,
            sUsername: null,
            loading: false,
            activeKey: 'basic',
            fileIds: null,
            fileList: [],

            data: {},

            BasicFields: [
                {
                    fieldCol: 12, // this is only label 1
                    size: "small",
                    Placeholder: "Contact person Code",
                    rangeMin: true,
                    type: "Text",
                    labelAlign: "left",
                },
                {
                    Placeholder: "Date Of Birth",
                    fieldCol: 12,
                    size: "small",
                    type: "Text",
                    labelAlign: "right",
                    itemStyle: { marginBottom: 1 },
                },
                {
                    object: "basic", //this is field 3
                    fieldCol: 12,
                    key: "cpCode",
                    size: "small",
                        rules: [
                        {
                            required: true,
                            message: "Code is Required",
                        },
                    ],
                
                    type: "Input",
                    readOnly: true,
                    labelAlign: "left",
                    itemStyle: { marginBottom: 10 },
                },
                {
                    object: "basic",
                    fieldCol: 12,
                    key: "dateOfBirth",
                    size: "small",
                    type: "DatePicker",
                    fieldStyle: { width: "100%" },
                    
                    itemStyle: { marginBottom: 10 },
                },
                {
                    fieldCol: 12, // this is only label 5
                    size: "small",
                    Placeholder: "First Name",
                    disabled: false,
                    type: "Text",
                    labelAlign: "left",
                },
                {
                    fieldCol: 12, // this is only label 8
                    size: "small",
                    Placeholder: "Last Name",
                    disabled: false,
                    type: "Text",
                    labelAlign: "left",
                },
                {
                    object: "basic", //this is field 7
                    fieldCol: 12,
                    key: "firstName",
                    size: "small",
                    type: "Input",
                    labelAlign: "left",
                    disabled: false,
                    itemStyle: { marginBottom: 10 },
                },
                {
                    object: "basic", //this is field 9
                    fieldCol: 12,
                    key: "lastName",
                    size: "small",
                    // rules:[{ required: true }],
                    type: "Input",
                    labelAlign: "left",
                    disabled: false,
                    itemStyle: { marginBottom: 5 },
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
                    fieldCol: 12, // this is only label 4
                    size: "small",
                    Placeholder: "Email",
                    disabled: false,
                    type: "Text",
                    labelAlign: "left",
                },
                {
                    object: "basic",
                    fieldCol: 12,
                    key: "phoneNumber",
                    size: "small",
                    // rules:[{ required: true }],
                    type: "input",
                    itemStyle: { marginBottom: 10 },
                },
                {
                    object: "basic", //this is field 6
                    fieldCol: 12,
                    key: "email",
                    size: "small",
                    // rules:[{ required: true }],
                    type: "Input",
                    disabled: false,
                    itemStyle: { marginBottom: 10 },
                },
                {
                    Placeholder: "Gender",
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
                    object: "basic",
                    fieldCol: 12,
                    key: "gender",
                    size: "small",
                    data: [
                        { label: "Male", value: "M" },
                        { label: "Female", value: "F" },
                        { label: "Others", value: "O" },
                    ],
                    itemStyle: { marginBottom: 10 },
                    // rules:[{ required: true }],
                    type: "Select",
                },
                {
                    object: "basic",
                    fieldCol: 12,
                    key: "stateId",
                    size: "small",
                    // rules:[{ required: true }],
                    type: "Select",
                    data: [],
                    itemStyle: { marginBottom: 10 },
                },
                {
                    Placeholder: "Role",
                    rangeMin: true,
                    fieldCol: 24,
                    size: "small",
                    type: "Text",
                    labelAlign: "right",
                },
                {
                    object: "basic",
                    fieldCol: 12,
                    key: "roleId",
                    size: "small",
                    rules:[{ required: true, message: 'Role is required!!' }],
                    type: "Select",
                    data: [],
                    itemStyle: { marginBottom: 10 },
                },
                {
                    Placeholder: "Address",
                    fieldCol: 24,
                    size: "small",
                    type: "Text",
                    labelAlign: "right",
                },
                {
                    object: "basic",
                    fieldCol: 24,
                    key: "address",
                    size: "small",
                    // rules:[{ required: true }],
                    type: "Input",
                    itemStyle: { marginBottom: "10px" },
                },
            ],

            KinFields: [
                {
                    Placeholder: "Name",
                    fieldCol: 12,
                    size: "small",
                    type: "Text",
                    labelAlign: "right",
                    
                },
                {
                    Placeholder: "Phone",
                    fieldCol: 12,
                    size: "small",
                    type: "Text",
                    labelAlign: "right",
                    
                },
                {
                    object: "kin",
                    fieldCol: 12,
                    key: "nextOfKinName",
                    size: "small",
                    
                    type: "input",
                    itemStyle: { marginBottom: 1 },
                },
                {
                    object: "kin",
                    fieldCol: 12,
                    key: "nextOfKinPhoneNumber",
                    size: "small",
                    
                    type: "input",
                    itemStyle: { marginBottom: 1 },
                },
                {
                    Placeholder: "Email",
                    fieldCol: 12,
                    size: "small",
                    type: "Text",
                    labelAlign: "right",
                    
                },
                {
                    Placeholder: "Relationship to Contractor",
                    fieldCol: 12,
                    size: "small",
                    type: "Text",
                    labelAlign: "right",
                    
                },
                {
                    object: "kin",
                    fieldCol: 12,
                    key: "nextOfKinEmail",
                    size: "small",
                    
                    type: "input",
                    itemStyle:{marginBottom:10},
                },
                {
                    object: "kin",
                    fieldCol: 12,
                    key: "nextOfKinRelation",
                    size: "small",
                    
                    data:[
                        {label: 'Spouse', value: 'Spouse' },
                        {label: 'Partner', value: 'Partner' },
                        {label: 'Sibling', value: 'Sibling' },
                        {label: 'Parent', value: 'Parent' },
                        {label: 'Child', value: 'Child' },
                        {label: 'Friend', value: 'Friend' },
                    ],
                    type: "Select",
                },
            ],            

            BillingFields: [
                {
                    Placeholder: "Contract Start Date",
                    rangeMin: true,
                    fieldCol: 12,
                    size: "small",
                    type: "Text",
                    labelAlign: "right",
                    
                },
                {
                    Placeholder: "Contract End Date",
                    fieldCol: 12,
                    size: "small",
                    rangeMin: true,
                    type: "Text",
                    labelAlign: "right",
                    
                },
                {
                    object: "billing",
                    fieldCol: 12,
                    key: "startDate",
                    size: "small",
                    type: "DatePicker",
            
                    fieldStyle: { width: "100%" },
                    rules: [
                        {
                            required: true,
                            message: "Start Date is Required",
                        },
                    ],
                    itemStyle: { marginBottom: 1 },
                    rangeMin: (current)=>{
                        const { billing } = this.formRef.current.getFieldValue();
                        return  billing.endDate && current < billing.endDate
                    }
                },
                {
                    object: "billing",
                    fieldCol: 12,
                    key: "endDate",
                    size: "small",
                    type: "DatePicker",
                    fieldStyle: { width: "100%" },
                    rules: [
                        {
                            required: true,
                            message: "End Date is Required",
                        },
                    ],
                    itemStyle: { marginBottom: 1 },
                    rangeMax: (current)=>{
                        const { billing } = this.formRef.current.getFieldValue();
                        return  billing.startDate && current < billing.startDate
                    }
                },
            
                {
                    Placeholder: "Contract Payment Basis",
                    fieldCol: 12,
                    rangeMin: true,
                    size: "small",
                    type: "Text",
                    labelAlign: "right",
                    
                },
                {
                    Placeholder: `Total Fee`,
                    fieldCol: 12,
                    size: "small",
                    rangeMin: true,
                    type: "Text",
                    labelAlign: "right",
                    
                },
                {
                    object: "billing",
                    fieldCol: 12,
                    key: "remunerationAmountPer",
                    size: "small",
                    data: [
                        { label: "Hourly", value: 1 },
                        { label: "Daily", value: 2 },
                        { label: "Weekly", value: 3 },
                        { label: "Fortnightly", value: 4 },
                        { label: "Monthly", value: 5 },
                    ],
                    type: "Select",
                    rules: [
                        {
                            required: true,
                            message: "Payment Frequncy is Required",
                        },
                    ],
                    onChange: (value, option) =>{
                        const { BillingFields } = this.state
                        BillingFields[5].Placeholder = `Total Fee ${value ?option.label: ''}`
                        this.setState({BillingFields})
                    },
                    itemStyle: { marginBottom: 1 },
                },
                {
                    object: "billing",
                    fieldCol: 12,
                    key: "remunerationAmount",
                    size: "small",
                    type: "InputNumber",
                    shape: "$",
                    fieldStyle: { width: "100%" },
                    rules: [
                        {
                            required: true,
                            message: "Total Fee is Required",
                        },
                    ],
                    itemStyle: { marginBottom: 1 },
                },
                {
                    Placeholder: "Full Work Hours",
                    fieldCol: 24,
                    size: "small",
                    rangeMin: true,
                    type: "Text",
                    labelAlign: "right",
                    
                },
                {
                    object: "billing",
                    fieldCol: 6,
                    key: "noOfHours",
                    size: "small",
                    type: "InputNumber",
                    fieldStyle: { width: "100%" },
                    rules: [
                        {
                            required: true,
                            message: "Work Hour is Reqired",
                        },
                    ],
                    itemStyle: { marginBottom: 1 },
                },
                {
                    object: "billing",
                    fieldCol: 6,
                    key: "noOfHoursPer",
                    size: "small",
                    type: "Select",
                    data: [
                        { label: "Daily", value: 2 },
                        { label: "Weekly", value: 3 },
                        { label: "Fortnightly", value: 4 },
                        { label: "Monthly", value: 5 },
                    ],
                    fieldStyle: { width: "100%" },
                    rules: [
                        {
                            required: true,
                            message: "Work Frequency is Required",
                        },
                    ],
                    itemStyle: { marginBottom: 1 },
                },
                {
                    Placeholder: "Comments",
                    fieldCol: 24,
                    size: "small",
                    type: "Text",
                    labelAlign: "right",
                    
                },
                {
                    object: "billing",
                    fieldCol: 24,
                    key: "comments",
                    size: "small",
                    type: "Textarea",
                    itemStyle: { marginBottom: 1 },
                },
            ],

        };
    }

    componentDidMount = () => {
        const { editCont } = this.state
        if (editCont) {
            this.getRecord(editCont);
        }

        getOrganizations().then(res=>{
            if (res.success){
                this.setState({
                    ORGS: res.data.filter((item) => item.value !== 1)
                })
            }
        })
    };

    componentDidMount = () => {
        const { editCont } = this.props
        this.fetchAll(editCont)
    };

    fetchAll = (edit) =>{
        Promise.all([ getStates(), getRoles(), edit ? this.getRecord(edit) : getOrganizations()])
        .then(res => {
            const { BasicFields } = this.state
            BasicFields[15].data = res[0].data;
            BasicFields[17].data = res[1].data;
                this.setState({
                    BasicFields,
                    sUsername: edit ? res[2].username: null,
                    ORGS: !edit ? res[2].data.filter((item) => item.value !== 1): [],
                })
        })
        .catch(e => {
            console.log(e);
        })
    }
    

    onFinish = (formValues) =>{
        const {editCont} = this.props;
        this.setState({loading: true})
        const { fileIds } = this.state
        const { basic, billing, kin } = formValues
        billing.fileId = fileIds
        const values  = {
            ...basic,
            ...kin,
            latestContract: billing,
        } 

        if (!editCont) {
            this.addContactor(values); //add skill
        } else {
            this.editRecord(values); //edit skill
        }
    }

    addContactor = (data) => {
        const { callBack } = this.props;
        const { sContact, sOrg } = this.state
        this.setState({ loading: true, })
        console.log(data);
        addList(data).then(res=>{
            if(res.success){
                callBack();
            }
        })
    };

    getRecord = (id) => {
        return getRecord(id).then(res=>{
            if (res.success){
                const {basic, kin, billing } = res
                this.formRef.current.setFieldsValue({ basic, kin, billing });
                this.setState({
                    fileIds: billing.fileId,
                    fileList: billing.file
                })
                return {username: basic.username}
            }
        })
    };

    editRecord = (value) => {
        const { editCont, callBack } = this.props;
        this.setState({ loading: true, })
        editList(editCont, value).then((res) => {
            if(res.success){
                callBack()
            }
        });
    };

    onCancel = () => {
        this.props.close();
    };

    onOrg = (value) => {
        const customUrl = `helpers/contact-persons?organizationId=${value}&active=0&associated=1`
        getOrgPersons(customUrl).then(res=>{
            if(res.success){
                this.setState({
                    sOrg: value,
                    CONTACTS: res.data
                })
            }
        })
    };

    onPerson = (value) => {
        getContactRecord(value).then(res=>{
            if(res.success){
                res.data.cpCode = `Con-00${res.data.id}`
                res.data.dateOfBirth = res.data.dateOfBirth && moment(res.data.dateOfBirth) 
                this.formRef.current.setFieldsValue({ basic: res.data, });
                this.setState({sContact: value})
            }
        })
    };

    onClear = (org, person) =>{
        this.setState({
            sContact: person,
            sOrg: org, // if onPerson is select Organization won't get null, but if organizaion get clear both values get null
        },()=>{
            this.formRef.current.resetFields();
        })
    }


    //file upload testing

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

    onFinishFailed = ({ values, errorFields, outOfDate })=>{// open the tab with error field
        this.setState({
            activeKey: errorFields[0].name[0]
        })
    }
    

    //file upload testing

    render() {
        const { editCont, visible } = this.props;
        const { BasicFields, BillingFields, KinFields, sContact, CONTACTS, ORGS, sOrg, fileIds, loading, fileList, activeKey } = this.state;

        return (
            <Modal
            title={editCont ? "Edit Contractor" : "Add Contractor"}
            maskClosable={false}
            centered
            visible={visible}
            okButtonProps={{ disabled: loading, htmlType: 'submit', form: 'my-form' }}
            okText={loading ?<LoadingOutlined /> :"Save"}
            onCancel={this.onCancel}
            width={900}
        >
            <Form
                id={'my-form'}
                ref={this.formRef}
                onFinish={this.onFinish}
                onFinishFailed={this.onFinishFailed}
                scrollToFirstError={true}
                size="small"
                layout="inline"
                initialValues={{billing: {startDate: null}}}
            > 
            {/* <Row style={{marginBottom:"1em"}} justify="space-between"> */}
                {!editCont &&<Col span={7} style={{marginBottom: '1em'}}>
                <Form.Item
                    name={['basic', 'organizationId']}
                >
                    <Select
                        value={sOrg}
                        placeholder="Organization"
                        options={ORGS}
                        showArrow
                        size="small"
                        allowClear
                        onChange={this.onOrg}
                        onClear={()=>this.onClear(null, null)}
                        showSearch
                        optionFilterProp="label"
                        filterOption={
                            (input, option) =>
                                option.label
                                    .toLowerCase()
                                    .indexOf(input.toLowerCase()) >= 0
                        }
                        style={{width:"100%"}}
                    />
                    </Form.Item>
                </Col>
                }
                {!editCont &&<Col span={7} style={{marginLeft: 'auto'}}>
                    <Form.Item
                        name={['basic', 'contactPersonId']}
                    >
                    <Select
                        value={sContact}
                        placeholder="Contact Person"
                        options={CONTACTS}
                        showArrow
                        disabled={!sOrg}
                        size="small"
                        allowClear
                        onChange={this.onPerson}
                        onClear={()=>this.onClear(sOrg, null)}
                        showSearch
                        optionFilterProp="label"
                        filterOption={
                            (input, option) =>
                                option.label
                                    .toLowerCase()
                                    .indexOf(input.toLowerCase()) >= 0
                        }
                        style={{width:"100%"}}
                    />
                    </Form.Item>
                </Col> }
                <Col span={7} style={{marginLeft: 'auto'}}>
                    <Form.Item
                    name={['basic', 'username']}
                    rules={[{required: true, type: 'email', message: 'Email is Required'}]}
                    >
                        <Input
                            placeholder="Email"
                            size="small"
                            style={{width:"100%"}}
                        /> 
                    </Form.Item>
                </Col>
            {/* </Row> */}
                <Tabs type="card" activeKey={activeKey} onChange={(activeKey)=>{this.setState({activeKey})}} >
                    <TabPane tab="Contractor Details" key="basic" forceRender className="ant-form ant-form-inline ant-form-small">
                        <FormItems FormFields={BasicFields} />
                    </TabPane>
                    <TabPane tab="Subcontractor Contracts" key="billing" forceRender className="ant-form ant-form-inline ant-form-small">
                        <FormItems FormFields={BillingFields} />
                        <p style={{marginTop: 10, marginBottom: 2}}>Signed Contract</p>
                        <Upload
                            customRequest={this.handleUpload}
                            // listType="picture"
                            listType="picture-card"
                            maxCount={1}
                            fileList={fileList}
                            onRemove= {this.onRemove}
                        >
                            {!fileIds &&
                                <div style={{marginTop: 10}} >
                                    <PlusOutlined />
                                    <div style={{ marginTop: 8 }}>Upload</div>
                                </div>
                            }
                            {/* <Button icon={<UploadOutlined />} style={{marginTop: 10}} loading={imgLoading}>Upload Contract</Button> */}
                        </Upload>
                    </TabPane>
                    <TabPane tab="Next of Kin" key="kin" forceRender className="ant-form ant-form-inline ant-form-small">
                        <FormItems FormFields={KinFields} />
                    </TabPane>
                </Tabs>
            </Form>
        </Modal>
        );
    }
}

export default InfoModal;
