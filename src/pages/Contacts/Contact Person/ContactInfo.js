import React, { Component } from 'react'
import { Button, Col, Descriptions, Dropdown, Menu, Popconfirm, Row, Tabs } from 'antd';
import { Link } from "react-router-dom";
import { SettingOutlined, DownOutlined } from "@ant-design/icons"; //Icons
import { getContactRecord } from '../../../service/conatct-person';
import { formatDate, GENDER, JOB_TYPE } from '../../../service/constant';
import AuthError from "../../../components/Core/AuthError";
import InfoModal from './InfoModal';
import Attachments from '../../../components/Core/Attachments';
import Comments from '../../../components/Core/Comments';
import Opportunities from '../../../components/Core/Opportunities';
import { generalDelete } from '../../../service/delete-Api\'s';
import Projects from '../../../components/Core/Projects';

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
                                        title="Are you sure you want to delete ?"
                                        onConfirm={() => this.handleDelete() }
                                        okText="Yes"
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
                    <Item label="Name">{data.fullname}</Item>
                    <Item label="Phone">{data.phoneNumber}</Item>
                    <Item label="Email">{data.email}</Item>
                    <Item label="Gender">{data.gender}</Item>
                    <Item label="Date Of Birth">{data.dateOfBirth}</Item>
                    <Item label="Birth Place">{data.birthPlace}</Item>
                    <Item label="Status">{data.employementStatus }</Item>
                    {/* {data.employementStatus === 'Employee' && <Item label="Employement Status">{data.employementType}</Item>} */}
                </Descriptions>
            </Col>
            <Col span={24}>
            <Tabs
                type="card"
                style={{ marginTop: "50px" }}
            >
                <TabPane tab="Opportunities" key="leads">
                    <Opportunities
                        targetId={userId}
                        customUrl={`helpers/work?type=O&contact=${userId}`}
                    />
                </TabPane>
                <TabPane tab="Opportunity Representative" key="r-leads">
                    <Opportunities
                        targetId={userId}
                        customUrl={`helpers/work?type=O&delegate=${userId}`}
                    />
                </TabPane>
                <TabPane tab="Projects" key="projects">
                    <Projects
                        targetId={userId}
                        customUrl={`helpers/work?type=P&contact=${userId}`}
                    />
                </TabPane>
                <TabPane tab="Project Representative" key="r-projects">
                    <Projects
                        targetId={userId}
                        customUrl={`helpers/work?type=P&delegate=${userId}`}
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
const dataStructure = (data) => ({
  fullname: data.firstName + ' ' + data.lastName,
  email: data.email,
  gender: GENDER[data?.gender],
  phoneNumber: data.phoneNumber,
  address: data.address,
  birthPlace: data.birthPlace,
  dateOfBirth: formatDate(formatDate(data.dateOfBirth), true, true),
  stateId: data.stateId,
  employementStatus: employementLink(
    data.employementStatus,
    data?.employee?.id
  ),
  employeeId: data?.employee?.id,
  // employementType: JOB_TYPE[data?.employmentContracts?.type],
});

function employementLink(status, employeeId){
    let endPoint =
      status === 'Employee'
        ? 'Employees'
        : status === 'Sub Contractor'
        ? 'sub-contractor'
        : 'contacts';

    return employeeId ? (
      <Link
        to={{ pathname: `/${endPoint}/${employeeId}/info` }}
        className="nav-link"
      >
        {status}
      </Link>
    ) : (
      status
    );
}