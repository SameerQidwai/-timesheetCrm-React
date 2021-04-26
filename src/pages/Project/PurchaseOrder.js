import React, { Component } from "react";
import { Row, Col, Menu, Button, Dropdown, Descriptions, Table, Popconfirm } from "antd";
import { SettingOutlined, DownOutlined } from "@ant-design/icons"; //Icons
import { Link } from "react-router-dom"; 

import OrderModal from "./Modals/OrderModal";
import { getRecord, getOrders, delOrder } from "../../service/projects";

import moment from "moment"

const { Item } = Descriptions;

class PurchaseOrder extends Component {
    constructor(props) {
        super(props);
        const { id } = props.match.params
        this.columns = [
            {
                title: "Issue Date",
                dataIndex: "issueDate",
                key: "issueDate",
                render:(record)=> record && moment(record).format(`ddd MMM DD YYYY`)
            },
            {
                title: "Expiry Date",
                dataIndex: "expiryDate",
                key: "expiryDate",
                render:(record)=> record && moment(record).format(`ddd MMM DD YYYY`)
            },
            {
                title: "Value",
                dataIndex: "value",
                key: "value",
            },
            {
                title: "Expense",
                dataIndex: "expense",
                key: "expense",
            },
            // {
            //     title: "Action",
            //     key: "action",
            //     align: "right",
            //     render: (record) => (
            //         <Dropdown
            //             overlay={
            //                 <Menu>
            //                     <Menu.Item danger>
            //                         <Popconfirm
            //                             title="Sure to delete?"
            //                             onConfirm={() => this.handleDelete(record.id) }
            //                         >
            //                             Delete
            //                         </Popconfirm>
            //                     </Menu.Item>
            //                     <Menu.Item
            //                         onClick={() => {
            //                             this.setState({ openModal: true, editRex: record.id, });
            //                         }}
            //                     >
            //                         Edit
            //                     </Menu.Item>
            //                 </Menu>
            //             }
            //         >
            //             <Button size="small">
            //                 <SettingOutlined /> Option <DownOutlined />
            //             </Button>
            //         </Dropdown>
            //     ),
            // },
        ];

        this.state = {
            openModal: false,
            editRex: false,
            ProId: false,
            desc: {title: 'Service', organization: {name: 'PSO'}, value: '1000.00', startDate: '12 10 2020', endDate: '12 4 2021'},
        };
    }

    componentDidMount = ()=>{
        const { id } = this.props.match.params
        // console.log(this.props.match.params);
        this.fetchAll(id)
    }

    fetchAll = (id) =>{
        Promise.all([ getRecord(id), getOrders(id)])
        .then(res => {
            console.log(res[1].data);
            this.setState({
                desc: res[0].success? res[0].data : {},
                editRex: false,
                ProId: id,
                openModal: false,
                data: res[1].success? res[1].data : [],
            })
        })
        .catch(e => {
            console.log(e);
        })
    }

    getRecords = (id) =>{
        getOrders(id).then(res=>{
            if(res.success){
                this.setState({
                    data: res.success? res.data : [],
                    editRex: false,
                    openModal: false
                })
            }
        })
    }

    closeModal = () => {
        this.setState({ openModal: false, editRex: false});
    };

    handleDelete = (rId) => {
        const { id } = this.props.match.params //opputunityId
        delOrder(id,rId).then((res) => {
            if (res.success) {
                this.props.history.push('/Employees')
            }
        });
    };

    callBack = () => {
        const { ProId } = this.state
        this.getRecords(ProId)
    };

    render() {
        const { desc, data, openModal, editRex, ProId } = this.state;
        return (
            <>
                <Descriptions
                    // title={DescTitle}
                    size="small"
                    bordered
                    layout="horizontal"
                    // extra={<Button type="primary">Edit</Button>}
                >
                    <Item label="Project Name">{desc.title}</Item>
                    <Item label="Estimated Value">{desc.value}</Item>
                    <Item label="Organisation">{desc.organizationName ? desc.organization.name :' No Organisation'}</Item>
                    <Item label="Start date">{desc.startDate ? moment(desc.startDate).format('ddd DD MM YYYY'): null} </Item>
                    <Item label="End Date">{desc.endDate ? moment(desc.endDate).format('ddd DD MM YYYY'): null}</Item>
                    {/* <Item label="Gender">{data.gender}</Item> */}
                </Descriptions>
                <Row justify="end">
                    <Col> <Button type="primary" size='small'  onClick={() => {  this.setState({ openModal: true, editRex: false, }) }}>Add New</Button> </Col>
                    {/* <Col> <Button type="danger" size='small'>Delete Resource</Button></Col> */}
                </Row>
                <Table
                    rowKey={(data) => data.id}
                    columns={this.columns}
                    dataSource={data}
                    size="small"
                />
                {openModal && (
                    <OrderModal
                        visible={openModal}
                        editRex={editRex}
                        ProId = {ProId}
                        close={this.closeModal}
                        callBack={this.callBack}
                    />
                )}
            </>
        );
    }
}

export default PurchaseOrder;
