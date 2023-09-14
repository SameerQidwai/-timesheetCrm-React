import React, { Component } from "react";
import { Modal, Tabs, Row, Col, Select, Input, Form, Upload, Popconfirm } from "antd";
import { DeleteOutlined, LoadingOutlined, PlusOutlined } from "@ant-design/icons"; //Icons
import FormItems, { phoneNormalize } from "../../../components/Core/Forms/FormItems";
import { addList, getRecord, editList } from "../../../service/contractors";
import { getContactRecord } from "../../../service/conatct-person";
import { getOrganizations, getOrgPersons, getRoles, getStates } from "../../../service/constant-Apis";
import { addFiles } from "../../../service/Attachment-Apis";
import { DURATION, dateClosed, dateRange, disableAllFields, formatDate, localStore } from "../../../service/constant";

const { TabPane } = Tabs;

class InfoModal extends Component {
    constructor() {
        super();
        let yearClosed = localStore().closedYears
        yearClosed = yearClosed && JSON.parse(yearClosed)
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

            disabledFY:false,
            disabledSY: false, //disable start Year

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
                    Placeholder: "Role",
                    rangeMin: true,
                    fieldCol: 12,
                    size: "small",
                    type: "Text",
                    labelAlign: "right",
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
                    key: "roleId",
                    size: "small",
                    rules:[{ required: true, message: 'Role is required!!' }],
                    type: "Select",
                    data: [],
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
                    // !isPhone
                    type: "input",
                    itemStyle: { marginBottom: 10 },
                },
                {
                    object: "basic", //this is field 6
                    fieldCol: 12,
                    key: "email",
                    size: "small",
                     rules:[ {
                        type: 'email',
                        message: 'The input is not valid e-mail!',
                    }],
                    type: "Input",
                    disabled: false,
                    itemStyle: { marginBottom: 10 },
                },
                {
                    Placeholder: "Gender",
                    // rangeMin: true,
                    fieldCol: 12,
                    size: "small",
                    type: "Text",
                    labelAlign: "right",
                    // itemStyle:{marginBottom:'10px'},
                },
                {
                    Placeholder: "State For Payroll Tax Purpose",
                    // rangeMin: true,
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
                    // rules: [{ required: true, message: 'Gender is Required' }],
                    type: "Select",
                },
                {
                    object: "basic",
                    fieldCol: 12,
                    key: "stateId",
                    size: "small",
                    // rules: [{ required: true, message: 'State is Required' }],
                    type: "Select",
                    data: [],
                    itemStyle: { marginBottom: 10 },
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
                    Placeholder: 'Birth Place',
                    fieldCol: 12,
                    size: 'small',
                    type: 'Text',
                    labelAlign: 'right',
                    // itemStyle: { marginBottom: "10px" },
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
                    object: 'basic',
                    fieldCol: 12,
                    key: 'birthPlace',
                    size: 'small',
                    type: 'Input',
                    itemStyle: { marginBottom: 20 },
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
                    // !isPhone
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
                    rules:[ {
                        type: 'email',
                        message: 'The input is not valid e-mail!',
                    }],
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
                        return dateRange(current, billing?.endDate, 'start', undefined, yearClosed);

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
                        return dateRange(current, billing?.startDate, 'end', undefined, yearClosed);

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
                    Placeholder: "Work Hours In A Week",
                    rangeMin: true,
                    fieldCol: 6,
                    size: "small",
                    type: "Text",
                    labelAlign: "right",
                    // itemStyle:{marginBottom:'10px'},
                },
                {
                    Placeholder: "Work Days In A Week",
                    rangeMin: true,
                    fieldCol: 18,
                    size: "small",
                    type: "Text",
                    labelAlign: "right",
                    // itemStyle:{marginBottom:'10px'},
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
                    key: "noOfDays",
                    size: "small",
                    type: "InputNumber",
                    // shape: " Hours",
                    // data: [
                    //     // { label: "Daily", value: 2 },
                    //     { label: "Weekly", value: 3 },
                    //     // { label: "Fortnightly", value: 4 },
                    //     // { label: "Monthly", value: 5 },
                    // ],
                    fieldStyle: { width: "100%" },
                    rules: [ { required: true, message: "Work Days are Required", }, ],
                    itemStyle: { marginBottom: 10 },
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
            
            ManagerFields: [
                {
                    Placeholder: "Contractor Manager",
                    fieldCol: 24,
                    size: "small",
                    type: "Text",
                    labelAlign: "right",
                },
                {
                    object: "basic",
                    fieldCol: 12,
                    key: "lineManagerId",
                    size: "small",
                    data: [],
                    type: "Select",
                    itemStyle: { marginBottom: 10 },
                },
            ],

        };
    }

    // componentDidMount = () => {
    //     const { editCont } = this.state
    //     if (editCont) {
    //         this.getRecord(editCont);
    //     }

    //     getOrganizations().then(res=>{
    //         if (res.success){
    //             this.setState({
    //                 ORGS: res.data.filter((item) => item.value !== 1)
    //             })
    //         }
    //     })
    // };

    componentDidMount = () => {
        const { editCont } = this.props
        this.fetchAll(editCont)
    };

    fetchAll = (edit) =>{
        const getManagerUrl = `helpers/contact-persons?organizationId=1`
        Promise.all([ getStates(), getRoles(), edit ? this.getRecord(edit) : getOrganizations(), getOrgPersons(getManagerUrl)])
        .then(res => {
            const { BasicFields, ManagerFields, BillingFields } = this.state
            BasicFields[15].data = res[0].data;
            BasicFields[3].data = res[1].data;
            ManagerFields[1].data = res[3].data;
            BillingFields[5].Placeholder = edit &&`Total Fee ${DURATION[res[2].paymentBase]}`
                this.setState({
                    BasicFields,
                    ManagerFields,
                    BillingFields,
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
        
        
        const values  = {
            ...basic,
            dateOfBirth: formatDate(basic.dateOfBirth, true),
            ...kin,
            latestContract: {
                ...billing,
                fileId: fileIds,
                startDate: formatDate(billing.startDate, true),
                endDate:formatDate(billing.endDate, true)
            },
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
        console.log(data);
        addList(data).then(res=>{
            this.setState({ loading: false, })
            if(res.success){
                callBack();
            }
        })
    };

    getRecord = (id) => {
        return getRecord(id).then(res=>{
            if (res.success){
                let { BillingFields, disabledFY, disabledSY } = this.state; //disable start Year

                const {basic, kin, billing } = res
                this.formRef.current.setFieldsValue({ basic, kin, billing });

                disabledFY =  dateClosed(res.billing?.endDate, res.billing?.startDate);
                if (disabledFY) {
                    BillingFields = disableAllFields(BillingFields)
                }else{
                    disabledSY = dateClosed(billing.startDate)
                    if (disabledSY)
                    BillingFields = disableAllFields(BillingFields)
                    BillingFields[4].disabled = false
                }

                this.setState({
                    fileIds: billing.fileId,
                    fileList: billing.file,
                    BillingFields, 
                    disabledFY, 
                    disabledSY
                })
                return {username: basic.username, paymentBase: billing.remunerationAmountPer}
            }
        })
    };

    editRecord = (value) => {
        const { editCont, callBack } = this.props;
        editList(editCont, value).then((res) => {
            this.setState({ loading: false, })
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
                res.data.dateOfBirth = formatDate(res.data.dateOfBirth) 
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
        const { BasicFields, BillingFields, KinFields, ManagerFields, sContact, CONTACTS, ORGS, sOrg, fileIds, loading, fileList, activeKey } = this.state;

        return (
            <Modal
            title={editCont ? "Edit Subcontractor" : "Add Subcontractor"}
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
                <Col span={!editCont? 7: 8} style={{marginLeft: 'auto', marginBottom: 10}}>
                    <Form.Item
                        name={['basic', 'username']}
                        rules={[
                            {
                            type: 'email',
                            message: 'The input is not valid e-mail!',
                            },
                            {required: true, message: 'Email is Required'
                            }
                            ]}
                    >
                        <Input
                            placeholder="Email"
                            size="small"
                            style={{width:"100%"}}
                        /> 
                    </Form.Item>
                </Col>
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
                            showUploadList={{
                                removeIcon: (file) => <Popconfirm
                                title="Are you sure you want to delete ?"
                                onConfirm={() => this.onRemove(file)}
                                okText="Yes"
                                cancelText="No"
                                placement="bottomRight"
                              >
                                <DeleteOutlined />
                              </Popconfirm>
                            }}
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
                    <TabPane tab="Contractor Manager" key="manage" forceRender className="ant-form ant-form-inline ant-form-small">
                            <FormItems FormFields={ManagerFields} />
                        </TabPane>
                </Tabs>
            </Form>
        </Modal>
        );
    }
}

export default InfoModal;
