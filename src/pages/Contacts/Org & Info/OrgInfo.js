import React, { Component } from 'react'
import { ContactsOutlined, MailOutlined, TranslationOutlined, AliwangwangOutlined, DollarOutlined } from '@ant-design/icons'; 

import { Descriptions, Tabs } from 'antd'

import Comments from '../../../components/Core/Comments'

const { Item } = Descriptions
const { TabPane } = Tabs

class OrgInfo extends Component {
    constructor () {
        super()
        this.state={
            data:{
                EBA: "89898987",
                address: "New York",
                contact: "+923316785557",
                contactName: "Farukh",
                email: "son's@g.com",
                name: "Musab & sons ",
                phone: "+921218967889",
                website: "M&S.com.us"
            }
        }
    }
    render () {
        const { data } = this.state
        return (
            <>
                <Descriptions
                title={data.name}
                size='small'
                bordered
                layout="horizontal"
                // extra={<Button type="primary">Edit</Button>}
            >
                <Item label={ <ContactsOutlined />} >{data.contact}</Item>
                <Item label={<MailOutlined />} >{data.email}</Item>
                <Item label={<TranslationOutlined />}>{data.address}</Item>
                <Item label={<AliwangwangOutlined />} >{data.website}</Item>
                <Item label={<DollarOutlined />} >{data.EBA}</Item>
            </Descriptions>
            <Tabs type="card" style={{marginTop:'50px'}}>
                <TabPane tab="Project" key="1">

                </TabPane>
                <TabPane tab="Opportunity" key="2">

                </TabPane>
                <TabPane tab="Comments" key="3">
                    <Comments/>
                </TabPane>
                <TabPane tab="Sub-organization" key="4">

                </TabPane>
            </Tabs>
          </>
        )
    }
}

export default OrgInfo