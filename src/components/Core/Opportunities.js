import React, { Component } from 'react'
import { Button, Table, Dropdown, Menu} from 'antd'
import { SettingOutlined, DownOutlined} from '@ant-design/icons'; //Icons
import moment from 'moment'

class Skills extends Component {
    constructor (){
        super()
        this.columns = [
            {
                title: 'Name',
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: 'Estimated Value',
                dataIndex: 'eValue',
                key: 'eValue',
            },
            {
                title: 'Entry Date',
                dataIndex: 'eDate',
                key: 'eDate',
            },
            {
                title: 'Start Date',
                dataIndex: 'sDate',
                key: 'sDate',
            },
            {
                title: 'Finish Date',
                dataIndex: 'fDate',
                key: 'fDate',
            },
            {
                title: 'Project Manager',
                dataIndex: 'pMan',
                key: 'pMan',
            },
            {
            title: 'Action',
            key: 'action',
            align: 'right',
            render: (record, text) => (
                    <Dropdown overlay={
                        <Menu>
                            <Menu.Item >View</Menu.Item>
                        </Menu>
                    }>
                        <Button size='small' >
                            <SettingOutlined/> Option <DownOutlined/>
                        </Button>
                    </Dropdown>  
                ),
            },
        ]

        this.state = {
            mergeObj: {}, // merge submit results into object
            formSubmitted: false, //check if got data from skill submit
            levelSubmitted: false, //check if got data from level submit
            data_skill:[
                {
                    key:1,
                    name: 'Website Maintainance',
                    eValue: 50000,
                    eDate: moment().format('ddd MMM DD YYYY'),
                    sDate: moment('12-9-2020').format('ddd MMM DD YYYY'),
                    fDate: moment('11-1-2021').format('ddd MMM DD YYYY'),
                    pMan: 'Munashir'
                },
                {
                    key:2,
                    name: 'HR for Accountant Position',
                    eValue: 50000,
                    eDate: moment('11-11-2020').format('ddd MMM DD YYYY'),
                    sDate: moment('11-14-2020').format('ddd MMM DD YYYY'),
                    fDate: moment('12-1-2020').format('ddd MMM DD YYYY'),
                    pMan: 'Mustaqeem'
                },
                {
                    key:3,
                    name: 'Carpenter',
                    eValue: 50000,
                    eDate: moment('10-9-2020').format('ddd MMM DD YYYY'),
                    sDate: moment('12-9-2020').format('ddd MMM DD YYYY'),
                    fDate: moment('11-1-2021').format('ddd MMM DD YYYY'),
                    pMan: 'Noor'
                },
            ]
        }
    }

    render(){
        const { data_skill } = this.state
        return (
            <>
                <Table columns={this.columns} dataSource={data_skill} size="small"/>
            </>
        )
    }
}

export default Skills