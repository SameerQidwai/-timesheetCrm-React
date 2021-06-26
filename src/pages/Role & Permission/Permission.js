import React, {Component} from 'react'
import {Modal, Table, Checkbox } from 'antd'
import { LoadingOutlined } from "@ant-design/icons"; //Icons
import { updatePermission } from '../../service/Roles-Apis';

const constant = {
    'ADMIN_OPTIONS': {label: 'Admin Options', len: 1, }, 
    'CONTACT_PERSONS':{label: "Contact Persons", len:1},
    'ORGANIZATIONS': {label: 'Organisations', len: 1, }, 
    'USERS':{label: "Users", len:1},
    'PROJECTS': {label: 'Projects', len: 3, }, 
    'OPPORTUNITIES':{label: "Opportunities", len:3},
    'TIMESHEETS': {label: 'Timesheets', len: 3, }, 
    'PROFILE':{label: "Profile", len:1},
} 

class Permission extends Component {
    constructor(props) {
        super(props);

        this.perColumns = [
            {
                title: 'Category',
                dataIndex: 'category',
                key: 'category',
            },
            {
                title: 'Create',
                key: 'create',
                dataIndex: 'create',
                render: (text, record, rowIndex) => {
                    {return  record.key === "TIMESHEETS" ?
                        <Checkbox.Group name={'create'} value={text} options={['Any', 'Manage', 'Own']} onChange={(values)=>this.changePermission(values, 'create', rowIndex)} />
                        : record.key === "PROFILE" ?
                            null
                        :
                        // <Checkbox checked={'create'} onChange={this.handleCheckboxChangeFactory(rowIndex, "read")} >Any</Checkbox>
                        <Checkbox.Group name={'create'} value={text} options={['Any']} onChange={(values)=>this.changePermission(values, 'create', rowIndex)} />
                    }
                },
            },
            {
                title: 'Update',
                key: 'update',
                dataIndex: 'update',
                render: (text, record, rowIndex) => {
                    {return  record.key === "PROJECTS" || record.key === "OPPORTUNITIES"?
                        <Checkbox.Group name={'update'} value={text} options={['Any', 'Manage']} onChange={(values)=>this.changePermission(values, 'update', rowIndex)} />
                        : record.key === "TIMESHEETS" ?
                            <Checkbox.Group name={'update'} value={text} options={['Any', 'Manage', 'Own']} onChange={(values)=>this.changePermission(values, 'update', rowIndex)} />
                        : record.key === "PROFILE" ?
                            <Checkbox.Group name={'update'} value={text} options={['Own']} onChange={(values)=>this.changePermission(values, 'update', rowIndex)} />
                        :
                            <Checkbox.Group name={'update'} value={text} options={['Any']} onChange={(values)=>this.changePermission(values, 'update', rowIndex)} />
                    }
                },
            },
            {
                title: 'Read',
                key: 'read',
                dataIndex: 'read',
                render: (text, record,  rowIndex) => {
                    {return  record.key === "PROJECTS" || record.key === "OPPORTUNITIES" || record.key === "TIMESHEETS" ?
                        <Checkbox.Group name={'read'} value={text} options={['Any', 'Manage', 'Own']} onChange={(values)=>this.changePermission(values, 'read', rowIndex)} />
                        : record.key === "PROFILE" ?
                            null
                        :
                        <Checkbox.Group name={'read'} value={text} options={['Any']} onChange={(values)=>this.changePermission(values, 'read', rowIndex)} />
                    }
                },
            },
            {
                title: 'Delete',
                key: 'delete',
                dataIndex: 'delete',
                render: (text, record, rowIndex) => {
                    {return  record.key === "PROFILE" ?
                        null 
                        :
                        <Checkbox.Group name={'delete'} value={text} options={['Any']} onChange={(values)=>this.changePermission(values, 'delete', rowIndex)} />
                    }
                },
            },
            {
                title: 'Approval',
                key: 'approval',
                dataIndex: 'approval',
                render: (text, record, rowIndex) => {
                    {return  record.key === "TIMESHEETS" && (
                            <Checkbox.Group name={'approval'} value={text} options={['Any', 'Manage']} onChange={(values)=>this.changePermission(values, 'approval', rowIndex)} />
                        )
                    }
                },
            },
        ]

        this.state = {
            loading: false,
            permissions: [
                {
                    key: 'ADMIN_OPTIONS',
                    category: "Admin Options",
                    // create: ['Any'],
                    // update: ['Any'],
                    // read: ['Any'],
                    // delete: ['Any'],
                },
                {
                    key: 'CONTACT_PERSONS',
                    category: "Contact Persons",
                    // create: ['Any'],
                    // update: ['Any'],
                    // read: ['Any'],
                    // delete: ['Any'],
                },
                {
                    key: 'ORGANIZATIONS',
                    category: "Organisations",
                    // create: ['Any'],
                    // update: ['Any'],
                    // read: ['Any'],
                    // delete: ['Any'],
                },
                {
                    key: 'USERS',
                    category: "Users",
                    // create: ['Any'],
                    // update: ['Any'],
                    // read: ['Any'],
                    // delete: ['Any'],
                },
                {
                    key: 'PROJECTS',
                    category: "Projects",
                    // create: ['Any'],
                    // update: ['Any', 'Manage'],
                    // read: ['Any', 'Manage', 'Own'],
                    // delete: ['Any'],
                },
                {
                    key: 'OPPORTUNITIES',
                    category: "Opportunities",
                    // create: ['Any'],
                    // update: ['Any', 'Manage'],
                    // read: ['Any', 'Manage', 'Own'],
                    // delete: ['Any'],
                },
                {
                    key: 'TIMESHEETS',
                    category: "Timesheets",
                    // create: ['Any', 'Manage', 'Own'],
                    // update: ['Any', 'Manage', 'Own'],
                    // read: ['Any', 'Manage', 'Own'],
                    // delete: ['Any'],
                    // approval: ['Any', 'Manage']
                },
                {
                    key: 'PROFILE',
                    category: "Profile",
                    // update: ['Own'],
                },
            ],
        }
    }

    componentDidMount = () =>{
        this.handleRawDtata()
        console.log(this.props.isSystem);
    }

    changePermission = (grant, action, index) =>{
        const {permissions} = this.state
        permissions[index][action] = grant
        this.setState({
            permissions: [...permissions]
        })
    }

    setPermissions = () =>{
        const { permissions } = this.state
        const { eidtPer, Callback } = this.props
        let perObjs = []
        this.setState({loading: true})
        permissions.forEach((el,index)=>{
            for(let i=0; i<= constant[el.key].len; i++){
                if (el['create']&&el['create'][i]){
                    perObjs.push({
                        resource: el.key,
                        action: 'create',
                        grant: el['create'][i]
                    })
                }
                if (el['delete']&&el['delete'][i]){
                    perObjs.push({
                        resource: el.key,
                        action: 'delete',
                        grant: el['delete'][i]
                    })
                }
                if (el['update']&&el['update'][i]){
                    perObjs.push({
                        resource: el.key,
                        action: 'update',
                        grant: el['update'][i]
                    })
                }
                if (el['read']&&el['read'][i]){
                    perObjs.push({
                        resource: el.key,
                        action: 'read',
                        grant: el['read'][i]
                    })
                }
                if (el['approval']&& el['approval'][i]){
                    perObjs.push({
                        resource: el.key,
                        action: 'approval',
                        grant: el['approval'][i]
                    })
                }
            }
        })
        
        updatePermission(eidtPer, perObjs).then(res=>{
            if(res.success){
                Callback(res.data)
            }
        })
    }

    handleRawDtata = () => {
        const { permissions } = this.state
        const { perData } = this.props
        permissions.forEach((sEl, sIndex) => {
            perData.forEach((pEl, pIndex)=>{
                if (sEl.key === pEl.resource){
                    if (sEl[pEl.action]){
                        sEl[pEl.action].push(pEl.grant)
                    }else{
                        sEl[pEl.action] = [pEl.grant]
                    }
                }
            })
        });
        this.setState({permissions:[...permissions]})
    };
    

    render (){
        const { loading, permissions } = this.state
        const { closeModal, isSysytem } = this.props
        return (
                <Modal
                    title="Edit Permission"
                    maskClosable={false}
                    centered
                    visible={this.props.isVisible}
                    onOk={this.setPermissions}
                    okButtonProps={{ disabled: loading || isSysytem }}
                    okText={loading ?<LoadingOutlined /> :"Save"}
                    onCancel={()=>{closeModal()}}
                    width={700}
                >
                    <Table rowKey="key" columns={this.perColumns} dataSource={permissions} size='small' pagination={false} />
                </Modal>
            
        )
    }
}
export default Permission
