import React, {Component} from 'react'
import {Modal, Table, Checkbox,Form } from 'antd'
import { LoadingOutlined } from "@ant-design/icons"; //Icons
import { updatePermission } from '../../../service/Roles-Apis';


const constant = {
    'ADMIN_OPTIONS': {label: 'Admin Options', len: 1, }, 
    'CONTACT_PERSONS':{label: "Contact Persons", len:1},
    'ORGANIZATIONS': {label: 'Organisations', len: 1, }, 
    'USERS':{label: "Users", len:1},
    'PROJECTS': {label: 'Projects', len: 3, }, 
    'OPPORTUNITIES':{label: "Opportunities", len:3},
    'TIMESHEETS': {label: 'Timesheets', len: 3, }, 
    'LEAVE_REQUESTS': {label: 'Leave Requests', len: 3, }, 
    'PROFILE':{label: "Profile", len:1},
} 

class Permission extends Component {
    constructor(props) {
        super(props);
        this.formRef = React.createRef()

        this.Columns = [
            {
                title: 'Category',
                dataIndex: 'category',
                key: 'category',
            },
            {
                title: 'Create',
                key: 'ADD',
                dataIndex: 'ADD',
                render: (text, record, rowIndex) => {
                    {return <Form.Item noStyle name={[record.key, 'ADD']}>{  
                        record.key === "TIMESHEETS" || record.key === "LEAVE_REQUESTS" ?
                        <Checkbox.Group  options={['ANY', 'MANAGE', 'OWN']}  />
                        : record.key === "PROFILE" ?
                            null
                        :
                        // <Checkbox checked={'CREATE'} onChange={this.handleCheckboxChangeFactory(rowIndex, "READ")} >ANY</Checkbox>
                        <Checkbox.Group  options={['ANY']}  />
                        }</Form.Item>
                    }
                },
            },
            {
                title: 'Update',
                key: 'UPDATE',
                dataIndex: 'UPDATE',
                render: (text, record, rowIndex) => {
                    {return  <Form.Item noStyle name={[record.key, 'UPDATE']}>{  
                            record.key === "PROJECTS" || record.key === "OPPORTUNITIES"?
                            <Checkbox.Group  options={['ANY', 'MANAGE']}  />
                            : record.key === "TIMESHEETS" || record.key === "LEAVE_REQUESTS"  ?
                                <Checkbox.Group  options={['ANY', 'MANAGE', 'OWN']}  />
                            : record.key === "PROFILE" ?
                                <Checkbox.Group  options={['OWN']}  />
                            :
                                <Checkbox.Group  options={['ANY']}  />
                        }</Form.Item>
                    }
                },
            },
            {
                title: 'Read',
                key: 'READ',
                dataIndex: 'READ',
                render: (text, record,  rowIndex) => {
                    {return  <Form.Item noStyle name={[record.key, 'READ']}>{
                            record.key === "PROJECTS" || record.key === "TIMESHEETS"|| record.key === "LEAVE_REQUESTS"  ?
                            <Checkbox.Group  options={['ANY', 'MANAGE', 'OWN']}  />
                            : record.key === "OPPORTUNITIES"? 
                                <Checkbox.Group  options={['ANY', 'MANAGE']}  />
                                :record.key === "PROFILE" ?
                                null
                            :
                            <Checkbox.Group  options={['ANY']}  />
                        }</Form.Item>
                    }
                },
            },
            {
                title: 'Delete',
                key: 'DELETE',
                dataIndex: 'DELETE',
                render: (text, record, rowIndex) => {
                    {return  <Form.Item noStyle name={[record.key, 'DELETE']}>{ 
                            record.key === "PROFILE" ?
                            null 
                            :
                            <Checkbox.Group  options={['ANY', 'OWN']}  />
                        }</Form.Item>
                    }
                },
            },
            {
                title: 'Approval',
                key: 'APPROVAL',
                dataIndex: 'APPROVAL',
                render: (text, record, rowIndex) => {
                    {return   <Form.Item noStyle name={[record.key, 'APPROVAL']}>{ 
                            (record.key === "TIMESHEETS" || record.key === "LEAVE_REQUESTS" ) && (
                            <Checkbox.Group  options={['ANY', 'MANAGE']}  />
                            )
                        }</Form.Item>
                    }
                },
            },
        ]

        this.state = {
            loading: false,
            newPermission: {},
            Rows: [
                {
                    key: 'ADMIN_OPTIONS',
                    category: "Admin Options",
                },
                {
                    key: 'CONTACT_PERSONS',
                    category: "Contact Persons",
                },
                {
                    key: 'ORGANIZATIONS',
                    category: "Organisations",
                },
                {
                    key: 'USERS',
                    category: "Users",
                },
                {
                    key: 'PROJECTS',
                    category: "Projects",
                },
                {
                    key: 'OPPORTUNITIES',
                    category: "Opportunities",
                },
                {
                    key: 'TIMESHEETS',
                    category: "Timesheets",
                },
                {
                    key: 'LEAVE_REQUESTS',
                    category: "Leave Requests",
                },
                {
                    key: 'PROFILE',
                    category: "Profile",
                },
            ],
        }
    }

    componentDidMount = () =>{
        this.handleRawDtata()
    }

    handleRawDtata = () => {
        const { newPermission } = this.state
        const { perData } = this.props
     
        perData.forEach(el => {
            if (newPermission[el.resource]){
                if(newPermission[el.resource][el.action]){
                    newPermission[el.resource][el.action].push(el.grant)
                }else{
                    newPermission[el.resource][el.action]= [el.grant]
                }
            }else{
                newPermission[el.resource] = { [el.action]: [el.grant]}
            }
        });

        this.formRef.current.setFieldsValue({...newPermission})
       
    };

    onFinish = (value) => {
        console.log('value', value)
        let valueObj = []
        const { eidtPer, Callback } = this.props
        for (const [resource, actions] of Object.entries(value)) {
            if(actions){
                for (const [action, grants] of Object.entries(actions)) {
                    if(grants){
                        for (const grant of grants){
                            valueObj.push({
                                resource: resource,
                                action: action,
                                grant: grant
                            })
                        }
                    }
                }
            }
        }

        updatePermission(eidtPer, valueObj).then(res=>{
            if(res.success){
                Callback(res.data)
            }
        })
    }

    render (){
        const { loading, Rows } = this.state
        const { closeModal, isSystem, isVisible } = this.props
        return (
                <Modal
                    title="Edit Permission"
                    maskClosable={false}
                    centered
                    visible={isVisible}
                    okText={loading ?<LoadingOutlined /> :"Save"}
                    okButtonProps={{ disabled: loading || isSystem, htmlType: 'submit', form: 'my-form' }}
                    onCancel={()=>{closeModal()}}
                    width={700}
                >
                    <Form
                        id={'my-form'}
                        ref={this.formRef}
                        onFinish={this.onFinish}
                        size="small"
                        layout="inline"
                    >
                        <Table
                            bordered
                            size='small' 
                            rowKey="key" 
                            columns={this.Columns} 
                            dataSource={Rows} 
                            pagination={false} 
                        />
                    </Form>
                </Modal>
            
        )
    }
}
export default Permission
