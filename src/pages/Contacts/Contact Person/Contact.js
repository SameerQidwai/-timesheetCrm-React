import React, { Component } from "react";
import { Row, Col, Menu, Table, Modal, Button, Dropdown, Popconfirm, Typography, Input, Space, Switch, InputNumber, } from "antd";
import { DownOutlined, SettingOutlined, PlusSquareOutlined, FilterOutlined, UploadOutlined,  SearchOutlined} from "@ant-design/icons"; //Icons
// import { Link } from 'react-router-dom'

import InfoModal from "./InfoModal";
import { getList, delList } from "../../../service/conatct-person";
import { localStore } from "../../../service/constant";
import "../../styles/table.css";
import { tableFilter, tableSorter, tableSummaryFilter, tableTitleFilter } from "../../../components/Core/Table/TableFilter";

const { Title } = Typography;

class Contact extends Component {
    constructor(props) {
        super(props);
        this.contactForm = React.createRef();
        
        this.columns = [
            {
                title: "Code",
                dataIndex: "id",
                key: "id",
                width: 115,
                render: (record) => `00${record}`,
                // sorter: (a, b) => a.id - b.id,
                ...tableSorter('id', 'number', true),
                // ...tableFilter('id', 'startsWith')
            },
            {
                title: "First Name",
                dataIndex: "firstName",
                key: "firstName",
                ...tableSorter('firstName', 'string'),
                // ...tableFilter('firstName', 'includes')
            },
            {
                title: "Last Name",
                dataIndex: "lastName",
                key: "lastName",
                ...tableSorter('lastName', 'string'),
                // ...tableFilter('firstName', 'includes')
            },
            {
                title: "Email",
                dataIndex: "email",
                key: "email",
                // ...tableFilter('firstName', 'includes')
            },
            {
                title: "Contact",
                dataIndex: "phoneNumber",
                key: "phoneNumber",
                width: 150,
                // ...tableFilter('firstName', 'startsWith')
            },
            {
                title: "Action",
                key: "action",
                align: "right",
                width: 115,
                render: (record, index) => (
                    <Dropdown
                        overlay={
                            <Menu key={index}>
                                {/* <Menu.Item danger>
                                    <Popconfirm
                                        title="Sure to delete?"
                                        onConfirm={() =>
                                            this.handleDelete(record.id)
                                        }
                                    >
                                        Delete
                                    </Popconfirm>
                                </Menu.Item> */}
                                <Menu.Item
                                    onClick={() => { this.setState({ openModal: true, editCP: record.id }); }}
                                    disabled={this.state&& !this.state.permissions['UPDATE']}
                                >Edit</Menu.Item>
                                {/* <Menu.Item> */}
                                    {/* <Link to={{ pathname: '/admin/calender/holidays' ,query: record.key}} className="nav-link"> */}
                                    {/* View */}
                                    {/* </Link> */}
                                {/* </Menu.Item> */}
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
            filterData:[],
            data: [],
            openModal: false,
            editCP: false,
            permissions: {},
            searchText: '',
            searchedColumn: {
                'id': {type: 'Input', value: '', showInColumn: true},
                'firstName': {type: 'Input', value: '', showInColumn: true},
                'lastName': { type: 'Input', value: '', showInColumn: true},
                'email': {type: 'Input', value: '', showInColumn: true},
                'phoneNumber': {type: 'Input', value: '', showInColumn: true},
                'Action': {type: 'none', value: '', showInColumn: true, disabled:true},
            }
        };
    }
    
    componentDidMount = () =>{
        this.getData()
    }

    getData = () => {
        const { CONTACT_PERSONS }= JSON.parse(localStore().permissions)
        getList().then((res) => {
            console.log(res);
            if (res.success) {
                this.setState({
                    data: res.data,
                    filterData: res.data,
                    openModal: false,
                    editCP: false,
                    permissions: CONTACT_PERSONS
                });
            }
        });
    };

    handleDelete = (id) => {
        delList(id).then((res) => {
            if (res.success) {
                this.getData();
            }
        });
    };

    toggelModal = (status) => {
        this.setState({ openModal: status, editCP: false, });
    };

    Callback = () => {
        this.getData()
    };

    submit = () => {
        this.contactForm.current.refs.contact_form.submit();
    };

    generalFilter = (value) =>{
        const { data } = this.state
        if (value){
            this.setState({
                filterData: data.filter(el => {
                    return `00${el.id.toString()}`.includes(value) ||
                    el.firstName && el.firstName.toLowerCase().includes(value.toLowerCase()) || 
                    el.lastName && el.lastName.toLowerCase().includes(value.toLowerCase()) ||
                    el.email && el.email.toLowerCase().includes(value.toLowerCase()) ||
                    el.phoneNumber && el.phoneNumber.startsWith(value) 
                })
            })
        }else{
            this.setState({
                filterData: data
            })
        }
    }

    advancefilter = (e, column) =>{
        const { data, searchedColumn: search }= this.state
        const { value } = e.target
        search[column]['value'] = value

        if (search['id']['value'] || search['firstName']['value'] ||
        search['lastName']['value'] || search['email']['value'] ||
        search['phoneNumber']['value'] ){
            this.setState({
                filterData: data.filter(el => {
                    return `00${el.id.toString()}`.includes(search['id']['value']) &&
                    el.firstName && el.firstName.toLowerCase().includes(search['firstName']['value'].toLowerCase()) &&
                    el.lastName && el.lastName.toLowerCase().includes(search['lastName']['value'].toLowerCase()) &&
                    el.email && el.email.toLowerCase().includes(search['email']['value'].toLowerCase()) &&
                    el.phoneNumber && el.phoneNumber.toLowerCase().includes(search['phoneNumber']['value'].toLowerCase())
                }),
                searchedColumn: search,
            })
        }else{
            this.setState({
                filterData: data
            })
        }
    }

    render() {
        const {filterData, openModal, editCP, permissions, searchedColumn} = this.state;
        const columns = this.columns;
        return (
            <>
                <Row justify="space-between">
                    <Col>
                        <Title level={4}>Contact Persons</Title>
                    </Col>
                    <Col style={{ textAlign: "end" }} span={12}>
                        <Row justify="end">
                            <Col>
                                <Button type="default" size="small">
                                    <FilterOutlined />
                                    Filter
                                </Button>
                            </Col>
                            <Col offset={1}>
                                <Button
                                    type="primary"
                                    size="small"
                                    onClick={() => { this.setState({ openModal: true, }); }}
                                    disabled={!permissions['ADD']}
                                >
                                    <PlusSquareOutlined />
                                    Contact Person
                                </Button>
                            </Col>
                        </Row>
                    </Col>
                    <Col span={24}>
                        <Table
                            title={()=>tableTitleFilter(5, this.generalFilter)}
                            bordered
                            className="fixed-top"
                            pagination={{pageSize: localStore().pageSize}}
                            rowKey={(data) => data.id}
                            columns={columns}
                            dataSource={filterData}
                            size="small"
                            sticky
                            summary={()=>tableSummaryFilter(searchedColumn, this.advancefilter)}
                        />
                    </Col>
                </Row>
                {openModal && (
                    <InfoModal
                        visible={openModal}
                        editCP={editCP}
                        close={this.toggelModal}
                        callBack={this.Callback}
                    />
                )}

            </>
        );
    }
}

export default Contact;
