import React, { Component } from "react";
import { Popconfirm, Typography, Dropdown, Button, Table, Menu, Row, Col, Descriptions } from "antd";

import { PlusSquareOutlined, SettingOutlined, FilterOutlined, DownOutlined, } from "@ant-design/icons"; //Icons

import BillModal from "./BillModal";
import "../styles/table.css";

const { Title } = Typography;
const { Item } = Descriptions;

class EmpBilling extends Component {
    constructor () {
        super()
        this.columns = [
            {
                title: "Code",
                dataIndex: "key",
                key: "key",
                render: (record) => `00${record}`,
            },
            {
                title: "Start Date",
                dataIndex: "s_date",
                key: "s_date",
            },
            {
                title: "End Date",
                dataIndex: "e_date",
                key: "e_date",
            },
            {
                title: "Job Type",
                dataIndex: "job_type",
                key: "job_type",
            },
            {
                title: "Rate",
                dataIndex: "rate",
                key: "rate",
            },
            {
                title: "Rate Duration",
                dataIndex: "rate_duration",
                key: "rate_duration",
            },
            {
                title: "Action",
                key: "action",
                align: "right",
                render: (record) => (
                    <Dropdown
                        overlay={
                            <Menu>
                                <Menu.Item danger>
                                    <Popconfirm
                                        title="Sure to delete?"
                                        onConfirm={() => this.handleDelete(record.key) }
                                    >
                                        Delete
                                    </Popconfirm>
                                </Menu.Item>
                                <Menu.Item
                                    onClick={() => {
                                        this.setState({ billModal: true, editEmp: record, });
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
                ),
            },
        ];

        this.state = {
            data: [
                {
                    b_ac_No: "wew",
                    b_ac_Title: "wew",
                    e_date: "Tue Jan 26 2021",
                    h_day: 231,
                    job_type: "fulltime",
                    key: 1,
                    mem_ac: "asdsad",
                    pay_email: "asdsad",
                    pay_f: "fortnightly",
                    rate: 222,
                    rate_duration: "yearly",
                    s_date: "Mon Jan 25 2021",
                }
            ],
            billModal: false,
            editEmp: false,
        }
    }
    callBack = (value, key) => {
        const { data } = this.state;
        if (key === false) {
            this.setState({
                data: [...data, value],
                billModal: false,
                editEmp: false,
            });
        } else {
            data[key-1] = value;
            this.setState({
                data: [...data],
                billModal: false,
                editEmp: false,
            });
        }
    };

    handleDelete = (code) => {
        const {data} = this.state;
        console.log(code);
        this.setState({
            data: data.filter((item) => item.key !== code),
        });
    };

    render () {
        const { billModal, editEmp, data  } = this.state
        return (
            <>
                <Descriptions
                    title={'Contract Information'}
                    size="small"
                    bordered
                    layout="horizontal"
                    // extra={<Button type="primary">Edit</Button>}
                >
                    <Item>Code: <b>001</b></Item>
                    <Item>Name: <b>Sameer</b></Item>
                    <Item style={{textAlign:"right"}}>
                        <Button
                            size="small"
                            type="primary" 
                            onClick={()=>this.setState({billModal:true})}
                        ><PlusSquareOutlined/> Contract</Button>
                    </Item>
                </Descriptions>
                <Table
                    columns={this.columns}
                    dataSource={data}
                    size="small"
                />

                 {billModal && (
                    <BillModal
                        visible={billModal}
                        editEmp={editEmp}
                        close={()=>this.setState({billModal:false})}
                        callBack={this.callBack}
                        rows={data.length+1} //Just for time Being till we call the Api's to rernder data while add and edit
                    />
                )}
            </>
        )
    }
}

export default EmpBilling
