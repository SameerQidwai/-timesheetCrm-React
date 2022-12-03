import React, { Component } from "react";
import { Row, Col, Menu, Button, Dropdown, Descriptions, Table, Popconfirm } from "antd";
import { SettingOutlined, DownOutlined } from "@ant-design/icons"; //Icons
import { Link } from "react-router-dom"; 

import HistModal from "./Modals/HistModal";
import { getRecord, getLeadSkills, delLeadSkill } from "../../service/opportunities";

import { localStore } from "../../service/constant";

const { Item } = Descriptions;

class ResourceHistory extends Component {
    constructor(props) {
        super(props);
        console.log(this.props);
        this.columns = [
            {
                title: "Billable Hours",
                dataIndex: "billableHours",
                key: "billableHours",
            },
            {
                title: "Buy Rate",
                dataIndex: "buyingRate",
                key: "buyingRate",
            },
            {
                title: "Sell Rate",
                dataIndex: "sellingRate",
                key: "sellingRate",
            },
            {
                title: "Start Date",
                dataIndex: "startDate",
                key: "startDate",
            },
            {
                title: "End Date",
                dataIndex: "endDate",
                key: "endDate",
            },
            {
                title: "...",
                key: "action",
                align: "center",
                width: '1%',
                render: (record) => (
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
                                        onConfirm={() => this.handleDelete(record.id) }
                                        okText="Yes"
                                    >
                                        <div> Delete </div>
                                    </Popconfirm>
                                </Menu.Item>
                                <Menu.Item
                                    key="edit"
                                    onClick={() => {
                                        console.log(record.id);
                                        this.setState({ infoModal: true, editRex: record.id, });
                                    }}
                                >
                                    Edit
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
        ];

        this.state = {
            infoModal: false,
            editRex: false,
            ProId: false,
            data: [
                {billableHours: 6, buyingRate: 20,sellingRate: 21, startDate: 'Mon Nov 20 2020', endDate: 'Fri Dec 20 2020'},
                {billableHours: 6, buyingRate: 20,sellingRate: 22, startDate: 'Mon Dec 22 2020' , endDate: 'Mon Jan 20 2021'},
                {billableHours: 6, buyingRate: 21,sellingRate: 25, startDate: 'Tue Jan 21 2021', endDate: 'Tue Fri 10 2021'}
            ],
            desc: {},
        };
    }

    componentDidMount = ()=>{
        const { proId, id } = this.props.match.params
        this.fetchAll(proId, id)
    }

    fetchAll = (proId, id) =>{
        Promise.all([ getRecord(id), getLeadSkills(id)])
        .then(res => {
            this.setState({
                desc: res[0].success? res[0].data : {},
                editRex: false,
                ProId: proId,
                resId: id,
                data: res[1].success? res[1].data : [],
            })
        })
        .catch(e => {
            console.log(e);
        })
    }

    getLeadSkills = (id) =>{
        getLeadSkills(id).then(res=>{
            if(res.success){
                this.setState({
                    desc: res.data,
                    editRex: false
                })
            }
        })
    }

    closeModal = () => {
        this.setState({ infoModal: false, editRex: false});
    };

    handleDelete = (rId) => {
        const { id } = this.props.match.params //opputunityId
        delLeadSkill(id,rId).then((res) => {
            if (res.success) {
                // this.props.history.push('/Employees')
            }
        });
    };

    callBack = () => {
        const { ProId } = this.state
        this.getLeadSkills(ProId)
    };

    render() {
        const { desc, data, infoModal, editRex, ProId } = this.state;
        return (
            <>
                <Descriptions
                    // title={DescTitle}
                    size="small"
                    bordered
                    layout="horizontal"
                    // extra={<Button type="primary">Edit</Button>}
                >
                    <Item label="First Name">Talha</Item>
                    <Item label="Last Name">Ahmed</Item>
                    <Item label="Skill">Andriod Developer</Item>
                    <Item label="Level">Senior</Item>
                    {/* <Item label="Gender">{data.gender}</Item> */}
                </Descriptions>
                <Row justify="end">
                    <Col> <Button type="primary" size='small'  onClick={() => {  this.setState({ infoModal: true, editRex: false, }) }}>Add New</Button> </Col>
                </Row>
                <Table
                    bordered
                    pagination={{pageSize: localStore().pageSize}}
                    rowKey={(data) => data.id}
                    columns={this.columns}
                    dataSource={data}
                    size="small"
                    className='fs-small'
                />
                {infoModal && (
                    <HistModal
                        visible={infoModal}
                        editRex={editRex}
                        ProId = {ProId}
                        panelId = {desc.panelId}
                        close={this.closeModal}
                        callBack={this.callBack}
                    />
                )}
            </>
        );
    }
}

export default ResourceHistory;
