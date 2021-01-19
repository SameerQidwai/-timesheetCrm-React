import React, { Component } from "react";
import { Modal, Tabs, Row, Col, Button, Input } from "antd";
import { UploadOutlined, PlusSquareFilled, CloseOutlined, } from "@ant-design/icons"; //Icons

import Form from "../../../components/Core/Form";
import { addList, getOrgs, getOrgRecord, editList } from "../../../service/conatct-person";
import { getStates, getStandardLevels } from "../../../service/constant-Apis";

import moment from "moment";

const { TabPane } = Tabs;

class InfoModal extends Component {
    constructor() {
        super();
        this.basicRef = React.createRef();
        this.associateRef = React.createRef();
        this.skillRef = React.createRef();

        this.priority_data = [
            {
                value: 1,
                label: "Superstar",
            },
            {
                value: 2,
                label: "Senior",
            },
            {
                value: 3,
                label: "Middle",
            },
            {
                value: 4,
                label: "Junior",
            },
            {
                value: 5,
                label: "Trainee",
            },
            {
                value: 6,
                label: "Internee",
            },
        ];

        // this.skill_data = [
        //     {
        //         value: 1,
        //         label: "Superstar",
        //     },
        //     {
        //         value: 2,
        //         label: "Senior",
        //     },
        //     {
        //         value: 3,
        //         label: "Middle",
        //     },
        //     {
        //         value: 4,
        //         label: "Junior",
        //     },
        //     {
        //         value: 5,
        //         label: "Trainee",
        //     },
        // ];

        this.state = {
            editCP: false,
            basicSubmitted: false,
            associateSubmitted: false,
            detailSubmitted: false,
            kinSubmitted: false,
            skillSubmitted: false,
            exitSubmitted: false,
            skill_data: [],
            orgs_data: [],
            BasicFields: {
                //creating Component
                formId: "basic_form",
                FormCol: 24,
                // FieldSpace:24,
                justifyField: "center",
                FormLayout: "inline",
                layout: { labelCol: { span: 10 }, wrapperCol: { span: 0 } },
                size: "small",
                fields: [
                    {
                        Placeholder: "First Name",
                        fieldCol: 12,
                        size: "small",
                        type: "Text",
                        labelAlign: "right",
                        // itemStyle:{marginBottom:'10px'},
                    },
                    {
                        Placeholder: "Last Name",
                        fieldCol: 12,
                        size: "small",
                        type: "Text",
                        labelAlign: "right",
                        // itemStyle:{marginBottom:'10px'},
                    },
                    
                    {
                        object: "basic",
                        fieldCol: 12,
                        key: "firstName",
                        size: "small",
                        // rules:[{ required: true }],
                        type: "input",
                        labelAlign: "right",
                        itemStyle: { marginBottom: 10 },
                    },
                    {
                        object: "basic",
                        fieldCol: 12,
                        key: "lastName",
                        size: "small",
                        // rules:[{ required: true }],
                        type: "input",
                        labelAlign: "right",
                        itemStyle: { marginBottom: 10 },
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
                        Placeholder: "Gender",
                        fieldCol: 12,
                        size: "small",
                        type: "Text",
                        labelAlign: "right",
                        // itemStyle:{marginBottom:'10px'},
                    },
                    {
                        object: "basic",
                        fieldCol: 12,
                        key: "phoneNumber",
                        size: "small",
                        // rules:[{ required: true }],
                        type: "input",
                        labelAlign: "right",
                        itemStyle: { marginBottom: 10 },
                    },
                    {
                        object: "basic",
                        fieldCol: 12,
                        key: "gender",
                        size: "small",
                        data: [
                            { label: "Male", value: "M" },
                            { label: "Female", value: "F" },
                        ],
                        // rules: [ { required: true, message: "Gender is Obviously required", }, ],
                        type: "Radio",
                        mode: "button",
                        shape: "solid",
                        itemStyle: { marginBottom: 10 },
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
                        Placeholder: "Email",
                        fieldCol: 12,
                        size: "small",
                        type: "Text",
                        labelAlign: "right",
                        // itemStyle:{marginBottom:'10px'},
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
                        object: "basic",
                        fieldCol: 12,
                        key: "email",
                        size: "small",
                        type: "input",
                        labelAlign: "right",
                        itemStyle: { marginBottom: 10 },
                    },
                    {
                        Placeholder: "Address",
                        fieldCol: 12,
                        size: "small",
                        type: "Text",
                        labelAlign: "right",
                        // itemStyle: { marginBottom: "10px" },
                    },
                    {
                        object: "basic",
                        fieldCol: 24,
                        key: "address",
                        size: "small",
                        type: "Input",
                        itemStyle: { marginBottom: 20 },
                    },
                    // {
                    //     object: "basic",
                    //     fieldCol: 12,
                    //     key: "cv",
                    //     size: "small",
                    //     valuePropName: "fileList",
                    //     getValue: true,
                    //     Placeholder: (
                    //         <>
                    //             Click or drag CV <UploadOutlined />
                    //         </>
                    //     ),
                    //     type: "Dragger",
                    //     labelAlign: "right",
                    //     itemStyle: { marginBottom: "10px" },
                    //     rangMax: false,
                    //     mode: "",
                    // },
                    // {
                    //     object: "basic",
                    //     fieldCol: 12,
                    //     key: "resume",
                    //     size: "small",
                    //     labelCol: { span: 12 },
                    //     rangMax: true,
                    //     Placeholder: (
                    //         <>
                    //             Click or drag Cover Letter <UploadOutlined />
                    //         </>
                    //     ),
                    //     type: "Dragger",
                    //     labelAlign: "right",
                    //     valuePropName: "fileList",
                    //     getValue: true,
                    //     mode: "",
                    // },
                    // {
                    //     object: "basic",
                    //     fieldCol: 12,
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
            associateFields: {
                formId: "associate_form",
                FormCol: 24,
                FieldSpace: 24,
                justifyField: "center",
                FormLayout: "inline",
                size: "middle",
                // fields: this.newAssociateField(0),
                fields: [],
            },
            SkillFields: {
                formId: "skill_form",
                FormCol: 24,
                FieldSpace: 24,
                justifyField: "center",
                FormLayout: "inline",
                layout: { labelCol: { span: 9 }, wrapperCol: { span: 0 } },
                size: "middle",
                // fields: this.newSkillField(0),
                fields: [],
            },
        };
    }

    componentDidMount = () => {
        // const {editCP}= this.props
        this.fetchAll()
        
    };
    fetchAll = () =>{
        const {editCP}= this.props;
        Promise.all([ getStates(), getStandardLevels(), getOrgs() ])
        .then(res => {
                const { BasicFields } = this.state;
                BasicFields.fields[10].data = res[0].data;
                this.setState({
                    BasicFields,
                    skill_data: res[1].data,
                    orgs_data: res[2].data
                },()=>{
                    if (editCP){
                        this.getRecord(editCP)
                    }else{
                        this.setState({
                            associateFields: {
                                ...this.state.associateFields,
                                fields: this.newAssociateField(0),
                            },
                            SkillFields: {
                                ...this.state.SkillFields,
                                fields: this.newSkillField(0)
                            }
                        });
                    }
                });
        })
        .catch(e => {
            console.log(e);
        })
    }
   
    // getStates = () => {
    //     getStates().then((res) => {
    //         if (res.success) {
    //             const { BasicFields } = this.state;
    //             BasicFields.fields[10].data = res.data;
    //             this.setState({ BasicFields });
    //         }
    //     });
    // };

    // getStandardLevels = () =>{
    //     getStandardLevels().then(res =>{
    //         if (res.success) {
    //             this.setState({ skill_data: res.data });
    //         }
    //     })
    // }

    insertSkill = () => {
        const { SkillFields } = this.state;
        let obj = SkillFields.fields[SkillFields.fields.length - 1]; // get the inster number for keys
        const item_no = obj ? parseInt(obj.key) + 1 : 0;
        SkillFields.fields = SkillFields.fields.concat( ...this.newSkillField(item_no) );
        this.setState({ SkillFields, });
    };

    newSkillField = (item_no, level_data) => {
        //inserting new fields in modals
        const {skill_data} = this.state
        console.log(level_data);
        const splice_key = [`skill${item_no}`, `level${item_no}`, item_no];
        return [
            {
                object: "skill",
                fieldCol: 11,
                layout: { wrapperCol: { span: 23 } },
                key: splice_key[0],
                size: "small",
                // rules:[{ required: true }],
                data: skill_data? skill_data:[],
                type: "Select",
                labelAlign: "left",
                // rules: [
                //     {
                //         required: true,
                //         message: "skill is required",
                //     },
                // ],
                onChange: function func(e, value) {
                   const { SkillFields } = this.state
                    SkillFields.fields.map(el=>{
                        if (el.key ===splice_key[1]){
                            el.data = value? value.levels: []
                            return el
                       }else{
                           return el
                       }
                   })
                    const {skill} = this.skillRef.current.refs.skill_form.getFieldValue() // const
                    delete skill[splice_key[1]];
                    this.skillRef.current.refs.skill_form.setFieldsValue({ skill, })
                   this.setState({SkillFields})
                }.bind(this),
            },
            {
                object: "skill",
                fieldCol: 11,
                layout: { wrapperCol: { span: 20 } },
                key: splice_key[1],
                size: "small",
                // rules:[{ required: true }],
                data: level_data? level_data: [],
                type: "Select",
                labelAlign: "left",
                itemStyle: { marginBottom: "5px" },
                // rules: [
                //     {
                //         required: true,
                //         message: "skill is required",
                //     },
                // ],
            },
            {
                fieldCol: 2,
                size: "small",
                Placeholder: <CloseOutlined />,
                key: item_no,
                // rules:[{ required: true }],
                type: "Text",
                style: {
                    textAlign: "right",
                },
                fieldStyle: {
                    cursor: "pointer",
                },
                onClick: function func(value, e) {
                    const { SkillFields } = this.state;
                    SkillFields.fields = SkillFields.fields.filter((obj) => {
                        return (
                            obj.key !== splice_key[0] &&
                            obj.key !== splice_key[1] &&
                            obj.key !== splice_key[2]
                        );
                    });
                    const {skill} = this.skillRef.current.refs.skill_form.getFieldValue() // const
                    delete skill[splice_key[0]];
                    delete skill[splice_key[1]];
                    delete skill[splice_key[2]];
                    this.skillRef.current.refs.skill_form.setFieldsValue({ skill, })
                    this.setState({ SkillFields, });
                }.bind(this),
            },
        ];
    };

    insertAssociate = () =>{
        const { associateFields } = this.state
        let obj = associateFields.fields[associateFields.fields.length -1 ]; //get the insert number for keys
        const item_no = obj ? parseInt(obj.key) + 1 : 0
        associateFields.fields = associateFields.fields.concat(...this.newAssociateField(item_no))
        this.setState({associateFields,})
    }

    newAssociateField = (item_no) =>{
        const { orgs_data } = this.state
        const splice_key = [`designation${item_no}`, `organizationId${item_no}`,`startDate${item_no}`,`endDate${item_no}`, item_no];
        return [
            {
                object: "asso",
                fieldCol: 6,
                layout: { wrapperCol: { span: 23 } },
                key: splice_key[0],
                size: "small",
                // rules:[{ required: true }],
                type: "Input",
            },
            {
                object: "asso",
                fieldCol: 6,
                layout: { wrapperCol: { span: 23 } },
                key: splice_key[1],
                size: "small",
                data: orgs_data,
                // rules:[{ required: true }],
                type: "Select",
            },
            {
                object: "asso",
                fieldCol: 5,
                layout: { wrapperCol: { span: 23 } },
                key: splice_key[2],
                size: "small",
                // rules:[{ required: true }],
                type: "DatePicker",
            },
            {
                object: "asso",
                fieldCol: 5,
                layout: { wrapperCol: { span: 23 } },
                key: splice_key[3],
                size: "small",
                // rules:[{ required: true }],
                type: "DatePicker",
            },
            {
                fieldCol: 2,
                size: "small",
                Placeholder: <CloseOutlined />,
                key: item_no,
                // rules:[{ required: true }],
                type: "Text",
                style: { textAlign: "right", },
                fieldStyle: { cursor: "pointer", },
                onClick: function func(value, e) {
                    const { associateFields } = this.state;
                    associateFields.fields = associateFields.fields.filter((obj) => {
                        return (
                            obj.key !== splice_key[0] &&
                            obj.key !== splice_key[1] &&
                            obj.key !== splice_key[2] &&
                            obj.key !== splice_key[3] &&
                            obj.key !== splice_key[4] 
                        );
                    });
                    const {asso} = this.associateRef.current.refs.associate_form.getFieldValue() // const
                    delete asso[splice_key[0]];
                    delete asso[splice_key[1]];
                    delete asso[splice_key[2]];
                    delete asso[splice_key[3]];
                    delete asso[splice_key[4]];
                    this.associateRef.current.refs.associate_form.setFieldsValue({ asso, })
                    this.setState({ associateFields, });
                }.bind(this),
            },
        ]
    }

    submit = () => {
        //submit button click
        this.basicRef.current && this.basicRef.current.refs.basic_form.submit();
        this.associateRef.current &&
            this.associateRef.current.refs.associate_form.submit();
        this.skillRef.current && this.skillRef.current.refs.skill_form.submit();
    };

    BasicCall = (vake) => {
        // this will work after  got  Object from the skill from
        vake.basic.stateId = null
        this.setState(
            {
                mergeObj: {
                    ...this.state.mergeObj,
                    ...vake.basic,
                },
                basicSubmitted: true, // skill form submitted
            },
            () => {
                if (
                    this.state.basicSubmitted &&
                    this.state.associateSubmitted &&
                    this.state.skillSubmitted
                ) {
                    //check if both form is submittef
                    if (!this.props.editCP) {
                        this.addPerson(this.state.mergeObj); //add skill
                    } else {
                        console.log("edit");
                        this.editRecord(this.state.mergeObj); //edit skill
                    }
                }
            }
        );
    };

    AssociateCall = (vake) => {
        // this will work after  getting the Object from level form
        const { asso } = vake;
        const vars = [];
        let result = Object.keys(asso).length / 5;
        for (let i = 0; i < result; i++) {
            vars.push({
                designation: asso[`designation${i}`],
                organizationId: asso[`organizationId${i}`],
                startDate: asso[`startDate${i}`],
                endDate: asso[`endDate${i}`],
            });
        }
        this.setState(
            {
                mergeObj: { ...this.state.mergeObj, contactPersonOrganizations: vars, },
                associateSubmitted: true, // level form submitted
            },
            () => {
                if (
                    this.state.basicSubmitted &&
                    this.state.associateSubmitted &&
                    this.state.skillSubmitted 
                ) {
                    //check if both form is submittef
                    if (!this.props.editCP) {
                        this.addPerson(this.state.mergeObj); //add skill
                    } else {
                        console.log("edit");
                        this.editRecord(this.state.mergeObj); //edit skill
                    }
                }
            }
        );
    };

    SkillCall = (vake) => {
        // this will work after I get the Object from the form
        const { skill } = vake;
        const vars = [];
        let result = Object.keys(skill).length / 2;
        for (let i = 0; i < result; i++) {
            vars.push(skill[`level${i}`]);
        }
        this.setState(
            {
                mergeObj: {
                    ...this.state.mergeObj,
                    standardSkillStandardLevelIds: vars,
                },
                skillSubmitted: true, // level form submitted
            },
            () => {
                if (
                    this.state.basicSubmitted &&
                    this.state.associateSubmitted &&
                    this.state.skillSubmitted 
                ) {
                    //check if both form is submittef
                    if (!this.props.editCP) {
                        this.addPerson(this.state.mergeObj); //add skill
                    } else {
                        console.log("edit");
                        this.editRecord(this.state.mergeObj); //edit skill
                    }
                }
            }
        );
    };

    addPerson = (value) => {
        const { callBack } = this.props;
        addList(value).then((res) => {
            if(res.success){
                callBack()
            }
        });
    };

    getRecord = (id) => {
        getOrgRecord(id).then((res) => {
            if (res.success){
                const {data} = res
                const { SkillFields, associateFields, skill_data } = this.state
                let skill = {};
                let asso = {};
                const skillArray = data.standardSkillStandardLevels;
                const assoArray = data.contactPersonOrganizations
                console.log(assoArray);
                let result = skillArray.length < assoArray.length? assoArray.length :skillArray.length;
                for (let i = 0; i < result; i++) {
                    let skillEl = skillArray[i];
                    let assoEl = assoArray[i]
                    if(skillEl){
                        console.log(skillEl);
                        skill_data.map(El=>{
                            El.levels.map(lEl=>{
                                if (lEl.value === skillEl.id){
                                    SkillFields.fields = SkillFields.fields.concat( this.newSkillField(i, El.levels) );
                                    skill[`level${i}`] = lEl.value;
                                    skill[`skill${i}`] = El.value;
                                }
                            })
                        })                        
                    }
                    if(assoEl){
                        associateFields.fields = associateFields.fields.concat( this.newAssociateField(i) );
                        asso[`designation${i}`] = assoEl.designation
                        asso[`startDate${i}`] = assoEl.startDate && moment(assoEl.startDate)
                        asso[`endDate${i}`] = assoEl.endDate && moment (assoEl.endDate)
                    }
                }
                let basic = {
                    // exist: true,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    email: data.email,
                    gender: data.gender,
                    phoneNumber: data.phoneNumber,
                    address: data.address,
                };
                this.basicRef.current.refs.basic_form.setFieldsValue({ basic: basic, });
                this.associateRef.current.refs.associate_form.setFieldsValue({ asso: asso, });
                this.skillRef.current.refs.skill_form.setFieldsValue({ skill: skill, });
                this.setState({ associateFields, SkillFields })
            }
        })
    };

    editRecord = (value) => {
        const { editCP, callBack } = this.props;
        value.id = editCP
        editList(value).then((res) => {
            console.log(res);
            if(res.success){
                console.log('hereh');
                callBack()
            }
        });
    };

    onCancel = () => {
        const { BasicFields, associateFields, SkillFields, } = this.state;

        delete BasicFields.initialValues; // delete initialValues of fields on close
        delete associateFields.initialValues;
        delete SkillFields.initialValues;
        this.setState(
            {
                basicSubmitted: false,
                associateSubmitted: false,
                skillSubmitted: false,
                BasicFields: { ...BasicFields }, //delete Formfields on Close
                associateFields: { ...associateFields },
                SkillFields: { ...SkillFields },
                mergeObj: {},
            },
            () => {
                this.props.close();
            }
        );
    };

    render() {
        const { editCP, visible } = this.props;
        const { BasicFields, associateFields, SkillFields } = this.state;

        return (
            <Modal
                title={editCP ? "Edit Contact Person" : "Add Contact Person"}
                centered
                visible={visible}
                onOk={() => { this.submit(); }}
                okText={"Save"}
                onCancel={this.onCancel}
                width={700}
            >
                <Tabs type="card">
                    <TabPane tab="Basic" key="1" forceRender>
                        <Form
                            ref={this.basicRef}
                            Callback={this.BasicCall}
                            FormFields={BasicFields}
                        />
                    </TabPane>
                    <TabPane tab="Association" key="2" forceRender>
                    <Row justify="end">
                            <Col>
                                <Button
                                    type="primary"
                                    size="small"
                                    onClick={this.insertAssociate}
                                >
                                    <PlusSquareFilled /> Insert Association
                                </Button>
                            </Col>
                            <Col span="24">
                                <Row>
                                    <Col span="6">Designation</Col>
                                    <Col span="6">Organization</Col>
                                    <Col span="5">Start Date</Col>
                                    <Col span="5">End Date</Col>
                                </Row>
                            </Col>
                        </Row>
                        <Row>
                            <Form
                                ref={this.associateRef}
                                Callback={this.AssociateCall}
                                FormFields={associateFields}
                            />
                        </Row>
                    </TabPane>
                    <TabPane tab="Skill" key="3" forceRender>
                        <Row justify="end">
                            <Col>
                                <Button
                                    type="primary"
                                    size="small"
                                    onClick={this.insertSkill}
                                >
                                    <PlusSquareFilled /> Insert Skill
                                </Button>
                            </Col>
                            <Col span="24">
                                <Row>
                                    <Col span="11">Skill</Col>
                                    <Col span="11">Level</Col>
                                </Row>
                            </Col>
                        </Row>
                        <Row>
                            <Form
                                ref={this.skillRef}
                                Callback={this.SkillCall}
                                FormFields={SkillFields}
                            />
                        </Row>
                    </TabPane>
                </Tabs>
            </Modal>
        );
    }
}

export default InfoModal;
