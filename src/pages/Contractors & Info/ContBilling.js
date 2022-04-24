import React, { Component } from "react";
import { Popconfirm, Typography, Dropdown, Button, Table, Menu, Descriptions } from "antd";

import { PlusSquareOutlined, SettingOutlined, DownOutlined, } from "@ant-design/icons"; //Icons

import BillModal from "./Modals/BillModal";
import { getRecord as subContRecord } from "../../service/contractors"
import { getList, delList } from "../../service/subContrators-contracts";

import moment from "moment"
import "../styles/table.css";
import { formatCurrency, localStore, DURATION, formatDate } from "../../service/constant";
import { tableSorter, tableTitleFilter } from "../../components/Core/Table/TableFilter";


const { Title } = Typography;
const { Item } = Descriptions;

class EmpBilling extends Component {
    constructor () {
        super()
        this.columns = [
            {
                title: "Code",
                dataIndex: "id",
                key: "id",
                render: (record) => `00${record}`,
                ...tableSorter('id', 'number', true),
            },
            {
                title: "Start Date",
                dataIndex: "startDate",
                key: "startDate",
                render:(record)=> record && formatDate(record),
                ...tableSorter('startDate', 'date'),
            },
            {
                title: "End Date",
                dataIndex: "endDate",
                key: "endDate",
                render:(record)=> record && formatDate(record),
                ...tableSorter('endDate', 'date'),
            },
            {
                title: "Rate",
                dataIndex: "remunerationAmount",
                key: "remunerationAmount",
                render: record =>   `${formatCurrency(record)}`,
                ...tableSorter('remunerationAmount', 'number'),
            },
            {
                title: "Rate Duration",
                dataIndex: "remunerationAmountPer",
                key: "remunerationAmountPer",
                render: (record)=> DURATION[record]
            },
            {
                title: "Action",
                key: "action",
                align: "right",
                width: 115,
                render: (record) => (
                    <Dropdown
                        overlay={
                            <Menu>
                                <Menu.Item danger>
                                    <Popconfirm
                                        title="Are you sure, you want to delete?"
                                        onConfirm={() => this.handleDelete(record.id) }
                                    >
                                        Delete
                                    </Popconfirm>
                                </Menu.Item>
                                <Menu.Item
                                    onClick={() => {
                                        this.setState({ billModal: true, editCntrct: record.id, });
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
            intro: {},
            data: [],
            billModal: false,
            editCntrct: false,
            openSearch: false,
            filterData: [],
        }
    }
    componentDidMount = ()=>{
        const { id } = this.props.match.params
        this.fetchAll(id)
    }

    fetchAll = (id) =>{
        Promise.all([ getList(id), subContRecord(id) ])
        .then(res => {
            this.setState({
                data: res[0].data,
                filterData: res[0].data,
                intro: res[1].basic,
                billModal: false,
                editCntrct: false,
            })
        })
        .catch(e => {
            console.log(e);
        })
    }
    getList = (id) =>{
        getList(id).then(res=>{
            if(res.success){
                this.setState({
                    data: res.data,
                    filterData: res.data,
                    billModal: false,
                    editCntrct: false,
                })
            }
        })
    }
    
    callBack = () => {
        const { id } = this.props.match.params
        this.getList(id)
    };

    handleDelete = (id) => {
        delList(id).then((res) => {
            const { id } = this.props.match.params
            this.getList(id)
        });
    };

    generalFilter = (value) =>{
        const { data } = this.state
        if (value){
            this.setState({
                filterData: data.filter(el => {
                    return `00${el.id}`.includes(value)||
                    el.startDate && `${formatDate(el.startDate)}`.toLowerCase().includes(value.toLowerCase()) ||
                    el.endDate && `${formatDate(el.endDate)}`.toLowerCase().includes(value.toLowerCase()) ||
                    `${formatCurrency(el.remunerationAmount) ?? ''}`.toLowerCase().includes(value.toLowerCase()) ||
                    `${DURATION[el.remunerationAmountPer] ?? ''}`.toLowerCase().includes(value.toLowerCase())                })
            })
        }else{
            this.setState({
                filterData: data
            })
        }
    }

    render () {
        const { billModal, editCntrct, data, intro, filterData  } = this.state
        const Sub = this.props.match.params.id
        return (
            <>
                <Descriptions
                    title={'Contract Information'}
                    size="small"
                    bordered
                    layout="horizontal"
                    // extra={<Button type="primary">Edit</Button>}
                >
                    <Item>Code: <b>{intro.cpCode}</b></Item>
                    <Item>First Name: <b>{intro.firstName}</b></Item>
                    <Item>Last Name: <b>{intro.lastName}</b></Item>
                    <Item style={{textAlign:"right"}}>
                        <Button
                            size="small"
                            type="primary" 
                            onClick={()=>this.setState({billModal:true})}
                        ><PlusSquareOutlined/> Contract</Button>
                    </Item>
                </Descriptions>
                <Table
                    title={()=>tableTitleFilter(5, this.generalFilter)}
                    bordered
                    pagination={{pageSize: localStore().pageSize}}
                    rowKey={(data) => data.id}
                    columns={this.columns}
                    dataSource={filterData}
                    size="small"
                />

                 {billModal && (
                    <BillModal
                        visible={billModal}
                        editCntrct={editCntrct}
                        close={()=>this.setState({billModal:false, editCntrct:false})}
                        callBack={this.callBack}
                        editEmp={Sub} //Just for time Being till we call the Api's to rernder data while add and edit
                    />
                )}
            </>
        )
    }
}

export default EmpBilling
