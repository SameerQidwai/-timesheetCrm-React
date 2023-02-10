import React, {Component} from 'react'
import {Modal, Table, Checkbox,Form, Row, Col, Typography } from 'antd'
import { LoadingOutlined } from "@ant-design/icons"; //Icons
import { updatePermission } from '../../../service/Roles-Apis';


const permissionOptions = {
  ADMIN_OPTIONS: {
    ADD: ['ANY'],
    UPDATE: ['ANY'],
    READ: ['ANY'],
    DELETE: ['ANY'],
  },
  CONTACT_PERSONS: {
    ADD: ['ANY'],
    UPDATE: ['ANY'],
    READ: ['ANY'],
    DELETE: ['ANY'],
  },
  ORGANIZATIONS: {
    ADD: ['ANY'],
    UPDATE: ['ANY'],
    READ: ['ANY'],
    DELETE: ['ANY'],
  },
  USERS: { 
    ADD: ['ANY'], 
    UPDATE: ['ANY'], 
    READ: ['ANY'], 
    DELETE: ['ANY'] 
  },
  PROJECTS: {
    ADD: ['ANY'],
    UPDATE: ['ANY', 'MANAGE'],
    READ: ['ANY', 'MANAGE', 'OWN'],
    DELETE: ['ANY'],
  },
  OPPORTUNITIES: {
    ADD: ['ANY'],
    UPDATE: ['ANY', 'MANAGE'],
    READ: ['ANY', 'MANAGE'],
    DELETE: ['ANY'],
  },
  TIMESHEETS: {
    ADD: ['OWN'],
    UPDATE: ['OWN'],
    READ: ['ANY', 'MANAGE', 'OWN'],
    DELETE: ['OWN'],
    APPROVAL: ['ANY', 'MANAGE'],
    UNAPPROVAL: ['ANY', 'MANAGE'],
  },
  LEAVE_REQUESTS: {
    ADD: ['OWN'],
    UPDATE: ['OWN'],
    READ: ['OWN'],
    DELETE: ['OWN'],
    APPROVAL: ['ANY', 'MANAGE'],
    UNAPPROVAL: ['ANY', 'MANAGE'],
  },
  EXPENSES: {
    ADD: ['OWN'],
    UPDATE: ['OWN'],
    READ: ['OWN'],
    DELETE: ['OWN'],
    APPROVAL: ['ANY', 'MANAGE'],
    UNAPPROVAL: ['ANY', 'MANAGE'],
  },
  PROFILE: { UPDATE: ['OWN'] },
};

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
                    {
                      return (
                        <Form.Item noStyle name={[record.key, 'ADD']}>
                          {permissionOptions[record.key]['ADD'] && (
                            <Checkbox.Group
                              options={permissionOptions[record.key]['ADD']}
                            />
                          )}
                        </Form.Item>
                      );
                    }
                },
            },
            {
                title: 'Update',
                key: 'UPDATE',
                dataIndex: 'UPDATE',
                render: (text, record, rowIndex) => {
                    {
                      return (
                        <Form.Item noStyle name={[record.key, 'UPDATE']}>
                          {permissionOptions[record.key]['UPDATE'] && (
                            <Checkbox.Group
                              options={permissionOptions[record.key]['UPDATE']}
                            />
                          )}
                        </Form.Item>
                      );
                    }
                },
            },
            {
                title: 'Read',
                key: 'READ',
                dataIndex: 'READ',
                render: (text, record,  rowIndex) => {
                    {
                      return (
                        <Form.Item noStyle name={[record.key, 'READ']}>
                          {permissionOptions[record.key]['READ'] && (
                            <Checkbox.Group
                              options={permissionOptions[record.key]['READ']}
                            />
                          )}
                        </Form.Item>
                      );
                    }
                },
            },
            {
                title: 'Delete',
                key: 'DELETE',
                dataIndex: 'DELETE',
                render: (text, record, rowIndex) => {
                    {return (
                      <Form.Item noStyle name={[record.key, 'DELETE']}>
                        {permissionOptions[record.key]['DELETE'] && (
                          <Checkbox.Group
                            options={permissionOptions[record.key]['DELETE']}
                          />
                        )}
                      </Form.Item>
                    );
                    }
                },
            },
            {
                title: 'Approval',
                key: 'APPROVAL',
                dataIndex: 'APPROVAL',
                render: (text, record, rowIndex) => {
                    {
                      return (
                        <Form.Item noStyle name={[record.key, 'APPROVAL']}>
                          {permissionOptions[record.key]['APPROVAL'] && (
                            <Checkbox.Group
                              options={permissionOptions[record.key]['APPROVAL']}
                            />
                          )}
                        </Form.Item>
                      );
                    }
                },
            },
            {
                title: 'Unapproval',
                key: 'UNAPPROVAL',
                dataIndex: 'UNAPPROVAL',
                render: (text, record, rowIndex) => {
                    {return (
                      <Form.Item noStyle name={[record.key, 'UNAPPROVAL']}>
                        {permissionOptions[record.key]['UNAPPROVAL'] && (
                          <Checkbox.Group
                            options={permissionOptions[record.key]['UNAPPROVAL']}
                          />
                        )}
                      </Form.Item>
                    );
                    }
                },
            },
        ]

        this.state = {
            loading: false,
            newPermission: {},
            MODULES: [
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
                    category: "Resource",
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
                    key: 'EXPENSES',
                    category: "Expenses",
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
        const { loading, MODULES } = this.state
      const { closeModal, isSystem, isVisible, label } = this.props
      console.log("modules", label);
        return (
          <Modal
            // title={<Row>
            //   <Col flex={2}>
            //     <Typography.Title level={5} style={{marginBottom:0}}>Edit Permission Of</Typography.Title>  
            //   </Col>
            //   <Col flex={3}>
            //     <Typography.Title level={5} style={{marginBottom:0}}>{label}</Typography.Title>  
            //   </Col>
            //       </Row>}
            title={`Edit Permission Of ${label}`}
                maskClosable={false}
                centered
                visible={isVisible}
                okText={loading ?<LoadingOutlined /> :"Save"}
                okButtonProps={{ disabled: loading || isSystem, htmlType: 'submit', form: 'my-form' }}
                onCancel={()=>{closeModal()}}
                width={900}
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
                            // className='fs-small'
                            rowKey="key" 
                            columns={this.Columns} 
                            dataSource={MODULES} 
                            pagination={false} 
                            className="scroll-table fs-v-small"
                            scroll={{
                                // y: 'min-content',
                                y: '65vh',
                            }}
                        />
                    </Form>
                </Modal>
            
        )
    }
}
export default Permission
