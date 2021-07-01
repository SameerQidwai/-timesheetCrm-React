import React, {Component} from 'react'
import {Modal, Table, Checkbox } from 'antd'
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
                key: 'ADD',
                dataIndex: 'ADD',
                render: (text, record, rowIndex) => {
                    {return  record.key === "TIMESHEETS" ?
                        <Checkbox.Group name={'ADD'} value={text} options={['ANY', 'MANAGE', 'OWN']} onChange={(values)=>this.changePermission(values, 'ADD', rowIndex)} />
                        : record.key === "PROFILE" ?
                            null
                        :
                        // <Checkbox checked={'CREATE'} onChange={this.handleCheckboxChangeFactory(rowIndex, "READ")} >ANY</Checkbox>
                        <Checkbox.Group name={'ADD'} value={text} options={['ANY']} onChange={(values)=>this.changePermission(values, 'ADD', rowIndex)} />
                    }
                },
            },
            {
                title: 'Update',
                key: 'UPDATE',
                dataIndex: 'UPDATE',
                render: (text, record, rowIndex) => {
                    {return  record.key === "PROJECTS" || record.key === "OPPORTUNITIES"?
                        <Checkbox.Group name={'UPDATE'} value={text} options={['ANY', 'MANAGE']} onChange={(values)=>this.changePermission(values, 'UPDATE', rowIndex)} />
                        : record.key === "TIMESHEETS" ?
                            <Checkbox.Group name={'UPDATE'} value={text} options={['ANY', 'MANAGE', 'OWN']} onChange={(values)=>this.changePermission(values, 'UPDATE', rowIndex)} />
                        : record.key === "PROFILE" ?
                            <Checkbox.Group name={'UPDATE'} value={text} options={['OWN']} onChange={(values)=>this.changePermission(values, 'UPDATE', rowIndex)} />
                        :
                            <Checkbox.Group name={'UPDATE'} value={text} options={['ANY']} onChange={(values)=>this.changePermission(values, 'UPDATE', rowIndex)} />
                    }
                },
            },
            {
                title: 'Read',
                key: 'READ',
                dataIndex: 'READ',
                render: (text, record,  rowIndex) => {
                    {return  record.key === "PROJECTS" || record.key === "TIMESHEETS" ?
                        <Checkbox.Group name={'READ'} value={text} options={['ANY', 'MANAGE', 'OWN']} onChange={(values)=>this.changePermission(values, 'READ', rowIndex)} />
                        : record.key === "OPPORTUNITIES"? 
                            <Checkbox.Group name={'READ'} value={text} options={['ANY', 'MANAGE']} onChange={(values)=>this.changePermission(values, 'READ', rowIndex)} />
                            :record.key === "PROFILE" ?
                            null
                        :
                        <Checkbox.Group name={'READ'} value={text} options={['ANY']} onChange={(values)=>this.changePermission(values, 'READ', rowIndex)} />
                    }
                },
            },
            {
                title: 'Delete',
                key: 'DELETE',
                dataIndex: 'DELETE',
                render: (text, record, rowIndex) => {
                    {return  record.key === "PROFILE" ?
                        null 
                        :
                        <Checkbox.Group name={'DELETE'} value={text} options={['ANY']} onChange={(values)=>this.changePermission(values, 'DELETE', rowIndex)} />
                    }
                },
            },
            {
                title: 'Approval',
                key: 'APPROVAL',
                dataIndex: 'APPROVAL',
                render: (text, record, rowIndex) => {
                    {return  record.key === "TIMESHEETS" && (
                            <Checkbox.Group name={'APPROVAL'} value={text} options={['ANY', 'MANAGE']} onChange={(values)=>this.changePermission(values, 'APPROVAL', rowIndex)} />
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
                    key: 'PROFILE',
                    category: "Profile",
                },
            ],
        }
    }

    componentDidMount = () =>{
        this.handleRawDtata()
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
                if (el['ADD']&&el['ADD'][i]){
                    perObjs.push({
                        resource: el.key,
                        action: 'ADD',
                        grant: el['ADD'][i]
                    })
                }
                if (el['DELETE']&&el['DELETE'][i]){
                    perObjs.push({
                        resource: el.key,
                        action: 'DELETE',
                        grant: el['DELETE'][i]
                    })
                }
                if (el['UPDATE']&&el['UPDATE'][i]){
                    perObjs.push({
                        resource: el.key,
                        action: 'UPDATE',
                        grant: el['UPDATE'][i]
                    })
                }
                if (el['READ']&&el['READ'][i]){
                    perObjs.push({
                        resource: el.key,
                        action: 'READ',
                        grant: el['READ'][i]
                    })
                }
                if (el['APPROVAL']&& el['APPROVAL'][i]){
                    perObjs.push({
                        resource: el.key,
                        action: 'APPROVAL',
                        grant: el['APPROVAL'][i]
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
