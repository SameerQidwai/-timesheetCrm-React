import React, {Component} from 'react'
import {Modal, Table, Checkbox,Form, Row, Col, Typography } from 'antd'
import { LoadingOutlined } from "@ant-design/icons"; //Icons
import { updatePermission } from '../../../service/Roles-Apis';


const permissionOptions = {
    BENCH_RESOURCES: {
    READ: ['ANY'],
  },
  CLIENT_REVENUE: {
    READ: ['ANY'],
  },
  LEAVE_SUMMARY: {
    READ: ['ANY'],
  },
  POSITIONS: { 
    READ: ['ANY'], 
  },
  PROJECT_REVENUE: {
    READ: ['ANY'],
  },
  TIMESHEET_SUMMARY: {
    READ: ['ANY'],
  },
  WORK_ALLOCATION: {
    READ: ['ANY'],
  },
  WORK_FORCE_SKILLS: {
    READ: ['ANY'],
  },
  FORECASTING: {
    READ: ['ANY'],
  },
};

class ReportPermissions extends Component {
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
                title: 'Read',
                key: 'READ',
                dataIndex: 'READ',
                render: (text, record,  rowIndex) => {
                    {
                      return (
                        <Form.Item noStyle name={[record.key, 'READ']}>
                          {permissionOptions[record.key]['READ'] && (
                            <Checkbox.Group
                                // disabled={record.key === 'FORECASTING'} // to be removed when we want to show forecasting
                                options={permissionOptions[record.key]['READ']}
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
                    key: 'BENCH_RESOURCES',
                    category: "Unallocated Resources",
                },
                {
                    key: 'CLIENT_REVENUE',
                    category: "FY Client Revenue Analysis",
                },
                {
                    key: 'LEAVE_SUMMARY',
                    category: "Leave Request Summary",
                },
                {
                    key: 'POSITIONS',
                    category: "Position Allocations",
                },
                {
                    key: 'PROJECT_REVENUE',
                    category: "FY Project Revenue Analysis",
                },
                {
                    key: 'TIMESHEET_SUMMARY',
                    category: "Timesheets Summary",
                },
                {
                    key: 'WORK_ALLOCATION',
                    category: "Workforce Allocations",
                },
                {
                    key: 'WORK_FORCE_SKILLS',
                    category: "Workforce Skill",
                },
                {
                    key: 'FORECASTING',
                    category: "Forecasting",
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
        return (
          <Modal
            title={`Edit Report Permission Of ${label}`}
            maskClosable={false}
            centered
            visible={isVisible}
            okText={loading ?<LoadingOutlined /> :"Save"}
            okButtonProps={{ disabled: loading || isSystem, htmlType: 'submit', form: 'my-form' }}
            onCancel={()=>{closeModal()}}
            // width={"min-content"}
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
                    className='fs-small full-width'
                    // style={{width:'100%'}}
                    rowKey="key" 
                    columns={this.Columns} 
                    dataSource={MODULES} 
                    pagination={false} 
                />
            </Form>
        </Modal>
            
        )
    }
}
export default ReportPermissions
