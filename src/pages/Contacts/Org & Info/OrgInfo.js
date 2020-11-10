import React, { Component } from 'react'
// import { ContactsOutlined, MailOutlined, TranslationOutlined, AliwangwangOutlined, DollarOutlined } from '@ant-design/icons'; 

import { Descriptions, Tabs } from 'antd'

import Comments from '../../../components/Core/Comments/Comments'
import Projects from '../../../components/Core/Projects'
import Opportunity from '../../../components/Core/Opportunities'

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
                <Item label="Contact" >{data.contact}</Item>
                <Item label="Email" >{data.email}</Item>
                <Item label="Address">{data.address}</Item>
                <Item label="Website" >{data.website}</Item>
                <Item label="EBA" >{data.EBA}</Item>
            </Descriptions>
            <Tabs type="card" style={{marginTop:'50px'}} defaultActiveKey="3">
                <TabPane tab="Project" key="1">
                    <Projects id={this.props.match.params} />
                </TabPane>
                <TabPane tab="Opportunity" key="2">
                    <Opportunity id={this.props.match.params} />
                </TabPane>
                <TabPane tab="Comments" key="3">
                    <Comments id={this.props.match.params} />
                </TabPane>
                <TabPane tab="Sub-organization" key="4">
                <span><a>Musab & sons -onelm</a></span>
                    
                </TabPane>
            </Tabs>
          </>
        )
    }
}

export default OrgInfo