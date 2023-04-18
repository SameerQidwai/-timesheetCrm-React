import React, { useEffect, useState } from 'react'
import { Row, Button, Space, Popconfirm, Divider, Form, Table } from "antd";
import { getSettings, getVariables, upadteSettings, upadteVariables } from "../../service/global-apis"
import FormItems from "../../components/Core/Forms/FormItems";
import { getleaveRequestTypes, getStates } from '../../service/constant-Apis';
import { formatDate, STATES } from '../../service/constant';
import { localStore } from '../../../service/constant';

const columns = [
    {
        title: "Standard Skill",
        dataIndex: "label",
        key: "label",
        ...tableSorter('label', 'string')
    }, 
    {
        
    }
]

function GlobalVars(props) {
    const [form] = Form.useForm();
    const [formValues, setFormValues] = useState({settings: {}, variables: {}})

    useEffect(() => {
    }, [])

    return (
        <Row>
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
