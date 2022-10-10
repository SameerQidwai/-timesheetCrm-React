import React, { Component } from 'react'
import { Button, Col, Descriptions, Dropdown, Menu, Popconfirm, Row, Tabs } from 'antd';
import { SettingOutlined, DownOutlined } from "@ant-design/icons"; //Icons
import { getContactRecord } from '../../../service/conatct-person';
import { formatDate, GENDER } from '../../../service/constant';
import AuthError from "../../../components/Core/AuthError";
import InfoModal from './InfoModal';
import Attachments from '../../../components/Core/Attachments';
import Comments from '../../../components/Core/Comments';
import Opportunities from '../../../components/Core/Opportunities';
import { generalDelete } from '../../../service/delete-Api\'s';

const {Item} = Descriptions 
const {TabPane} = Tabs

export class ContactInfo extends Component {

    constructor(props){
        super(props)
        this.state = {
            data: {},
            infoModal: false,
            userId: props?.match?.params?.id,
            notAuth: false
        }
    }

    componentDidMount=()=>{
        const {userId} = this.state
        getContactRecord(userId).then(res=>{
            if (res.success){
                let {data} = res 
                this.setState({
                    data: dataStructure(data)
                })
            }else if(res.authError){
                this.setState({ notAuth: true })
            }
        })
    }

    handleDelete = () => {
        const url = '/contactpersons';
        const { userId } = this.state;
        const { history } = this.props;
        generalDelete(history, url, userId).then((res) => {
            if (res.success) {
                // will not run
              }
        });
      };

    toggelModal = () =>{
        this.setState({
            infoModal: false,
        });
    }

    Callback = (data)=>{
        console.log(data)
        if(data){
            this.setState({
                data: dataStructure(data),
                infoModal: false,
            })
        }
    }
    
    render() {
        let {data, infoModal, userId, notAuth,} = this.state
        const DescTitle = (
            <Row justify="space-between">
                <Col>Contact Information</Col>
                <Col>
                    <Dropdown
                        overlay={
                            <Menu>
                                <Menu.Item
                                    key="delete"
                                    danger
                                    className="pop-confirm-menu"
                                >
                                    <Popconfirm
                                        title="Are you sure you want to delete"
                                        onConfirm={() => this.handleDelete() }
                                    >
                                    <div> Delete </div> 
                                    </Popconfirm>
                                </Menu.Item>
                                <Menu.Item
                                    key="Edit"
                                    onClick={() => {
                                        this.setState({
                                            infoModal: true,
                                        });
                                    }}
                                >
                                    Edit
                                </Menu.Item>
                            </Menu>
                        }
                    >
                        <Button size="small">
                            <SettingOutlined /> Option <DownOutlined />
                        </Button>
                    </Dropdown>
                </Col>
            </Row>
        );
    return (
        <Row>
            <Col span={24}>
                <Descriptions
                    title={DescTitle}
                    size="small"
                    bordered
                    layout="horizontal"
                >
                    <Item label="Name">{data.firstName + ' '+ data.lastName}</Item>
                    <Item label="Phone">{data.phoneNumber}</Item>
                    <Item label="Email">{data.email}</Item>
                    <Item label="Gender">{GENDER[data?.gender]}</Item>
                    <Item label="Date Of Birth">{data.dateOfBirth}</Item>
                    <Item label="Birth Place">{data.birthPlace}</Item>
                </Descriptions>
            </Col>
            <Col span={24}>
            <Tabs
                type="card"
                style={{ marginTop: "50px" }}
                // defaultActiveKey="comments"
            >
                <TabPane tab="Opportunities" key="leads">
                <Opportunities
                    targetId={userId}
                    customUrl={`helpers/work?type=O&employee=${userId}`}
                />
                </TabPane>
                <TabPane tab="Comments" key="comments">
                    <Comments targetType="COP" targetId={userId} />
                </TabPane>
                <TabPane tab="Attachments" key="attachments">
                    <Attachments targetType="COP" targetId={userId} />
                </TabPane>
            </Tabs>
            </Col>
            {infoModal && (
            <InfoModal
                visible={infoModal}
                editCP={userId}
                close={this.toggelModal}
                callBack={this.Callback}
            />
            )}
            {notAuth && <AuthError {...this.props}/>}
        </Row>
    )
  }
}

export default ContactInfo

//------------HELPER------------
const dataStructure = (data) =>({
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    gender: data.gender,
    phoneNumber: data.phoneNumber,
    address: data.address,
    birthPlace: data.birthPlace,
    dateOfBirth: formatDate(data.dateOfBirth),
    stateId: data.stateId,
})