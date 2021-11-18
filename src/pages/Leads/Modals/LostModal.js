import React, { Component } from "react";
import { Modal, Tabs, Form } from "antd";
import { LoadingOutlined } from "@ant-design/icons"; //Icons
import moment from "moment";
import FormItems from "../../../components/Core/FormItems";

import { addList, getRecord, editList, workWon } from "../../../service/opportunities";
import { getOrganizations, getStates, getOrgPersons, getPanels, getProjects } from "../../../service/constant-Apis";

const { TabPane } = Tabs;

class InfoModal extends Component {
    constructor() {
        super();
        this.formRef = React.createRef(); 

        this.state = {
            editLead: false,
            check: false,
            leadValue: 0,
            loading: false,

            Lost: [
            ],

            NotBid: [
            ],

            NotProceed: [
            ],

        };
    }
    componentDidMount = () =>{
    }


    onFinish = (vake) => { 
        // this will work after  got  Object from the skill from
    };

    workWon = (values) =>{
    }

    render() {
        const { editLead, visible, close } = this.props;
        const { BasicFields, tenderFields, DatesFields, BillingFields, ManageFields, loading } = this.state
        return (
            <Modal
                title={editLead? "Edit opportunity" : "Add New opportunity"}
                maskClosable={false}
                centered
                visible={visible}
                okButtonProps={{ disabled: loading, htmlType: 'submit', form: 'my-form' }}
                okText={loading ?<LoadingOutlined /> :"Save"}
                onCancel={close}
                width={750}
            >
                <Form
                    id={'my-form'}
                    ref={this.formRef}
                    onFinish={this.onFinish}
                    scrollToFirstError={true}
                    size="small"
                    layout="inline"
                >
                    <FormItems FormFields={BasicFields} />
                </Form>
            </Modal>
        );
    }
}

export default InfoModal;
