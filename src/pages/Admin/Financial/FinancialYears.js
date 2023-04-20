import React, { useEffect, useState } from 'react'
import { Button, Dropdown, Menu, Row, Table } from "antd";
import { DownOutlined, SettingOutlined, PlusSquareOutlined, LoadingOutlined } from "@ant-design/icons"; //Icons
import { formatDate } from '../../service/constant';
import { localStore } from '../../../service/constant';

const columns = [
    {
        title: "Created AT",
        dataIndex: "createdby",
        key: "label",
        ...tableSorter('label', 'string')
    }, 
    {
        title: "Created By",
        dataIndex: "createdby",
        key: "label",
        ...tableSorter('label', 'string')
    }, 
    {
        title: "Name",
        dataIndex: "label",
        key: "label",
        ...tableSorter('label', 'string')
    }, 
    {
        title: "Start Date",
        dataIndex: "label",
        key: "label",
          render: (record) => formatDate(record, true, true),
        ...tableSorter('label', 'string')
    },
    {
        title: "End Date",
        dataIndex: "label",
        key: "label",
          render: (record) => formatDate(record, true, true),
        ...tableSorter('label', 'string')
    },
    {
        title: "Lock By",
        dataIndex: "label",
        key: "label",
        ...tableSorter('label', 'string')
    },
    {
        title: "Lock At",
        dataIndex: "label",
        key: "label",
          render: (record) => formatDate(record, true, true),
        ...tableSorter('label', 'string')
    },
    {
        title: '...',
        key: 'action',
        align: 'center',
        width: '1%',
        render: (value, record, index) => (
          <Dropdown
            overlay={
              <Menu>
                <Menu.Item
                  key="edit"
                //   onClick={() => {
                //     this.openModal({ ...record, rowIndex: index });
                //   }}
                //   disabled={this.state && !this.state.permissions['UPDATE']}
                >
                  Edit
                </Menu.Item>
                <Menu.Item key="Closing">
                    Close
                </Menu.Item>
              </Menu>
            }
          >
            <Button size="small">
              <SettingOutlined />
            </Button>
          </Dropdown>
        ),
      },
]

function GlobalVars(props) {
    // const [form] = Form.useForm();
    const [data, setData] = useState([])
    const [visibleModal, setVisibleModal] = useState(false)
    const [visibleConfirm, setVisibleConfirm] = useState(false)

    useEffect(() => {
        setData([])
    }, [])

    return (
        <Row justify="end">
            <Col><Button>Create FY</Button></Col>
            <Col span={24}>
                <Table
                    // title={()=>tableTitleFilter(5, this.generalFilter)}
                    bordered
                    pagination={{pageSize: localStore().pageSize}}
                    columns={columns}
                    dataSource={data}
                    size="small"
                    className='fs-small'
                />
            </Col>
        </Row>
    )
}

export default GlobalVars
