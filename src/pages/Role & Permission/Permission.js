import React, {Component} from 'react'

import {Modal, Table, Checkbox } from 'antd'

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
                render: (value, record, rowIndex) => (
                    <Checkbox
                      checked={value}
                      onChange={this.handleCheckboxChangeFactory(rowIndex, "create")}
                    />
                ),
            },
            {
                title: 'Read',
                key: 'read',
                dataIndex: 'read',
                render: (value, record,  rowIndex) => (
                    <Checkbox
                      checked={value}
                      onChange={this.handleCheckboxChangeFactory(rowIndex, "read")}
                    />
                ),
            },
            {
                title: 'Update',
                key: 'update',
                dataIndex: 'update',
                render: (value, record, rowIndex) => (
                    <Checkbox
                      checked={value}
                      onChange={this.handleCheckboxChangeFactory(rowIndex, "update")}
                    />
                ),
            },
            {
                title: 'Delete',
                key: 'delete',
                dataIndex: 'delete',
                render: (value, record, rowIndex) => (
                    <Checkbox
                      checked={value}
                      onChange={this.handleCheckboxChangeFactory(rowIndex, "delete")}
                    />
                ),
            },
        ]

        this.state = {
            perData: this.props.data
        }
    }


    handleCheckboxChangeFactory = (rowIndex, columnKey) => event => {
        const perData = [...this.state.perData];
        perData[rowIndex][columnKey] = event.target.checked;
        this.setState({perData:perData});
    };

    submit = () =>{
        console.log(this.state.perData)
        this.props.Callback();
    }

    render (){
        return (
                <Modal
                    title="Edit Permission"
                    maskClosable={false}
                    centered
                    visible={this.props.isVisible}
                    onOk={()=>{this.submit()}}
                    okText= 'Save'
                    onCancel={()=>{this.props.Callback()}}
                    width={640}
                    pagination={false}
                >
                    <Table columns={this.perColumns} dataSource={this.state.perData} size='small'/>
                </Modal>
            
        )
    }
}
export default Permission
